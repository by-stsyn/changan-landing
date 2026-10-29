import { defineConfig, Plugin, Connect } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function xmlFeedProxyPlugin(): Plugin {
  const localFallbackPath = path.resolve(__dirname, 'public/changan-feed.xml');
  let cachedXml: string | null = null;
  let cacheTime = 0;
  let activeFetch: Promise<string> | null = null;
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  // Pre-seed cache from local fallback if exists
  if (fs.existsSync(localFallbackPath)) {
    try {
      cachedXml = fs.readFileSync(localFallbackPath, 'utf-8');
      cacheTime = Date.now();
    } catch {
      // ignore
    }
  }

  const fetchAndFilterFeed = async (): Promise<string> => {
    const feedUrl = 'https://export.maxposter.ru/dealer-export/1983-38233.xml';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Upstream feed HTTP ${response.status}`);
    }

    const text = await response.text();
    const changan: string[] = [];
    let pos = 0;
    while (true) {
      const start = text.indexOf('<vehicle>', pos);
      if (start === -1) break;
      const end = text.indexOf('</vehicle>', start);
      if (end === -1) break;
      const chunk = text.slice(start, end + 10);
      pos = end + 10;
      if (/<brand[^>]*>[\s\S]*?(changan|чанган)[\s\S]*?<\/brand>/i.test(chunk)) {
        changan.push(chunk);
      }
    }

    const filteredXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<vehicles>\n${changan.join('\n')}\n</vehicles>`;

    try {
      fs.writeFileSync(localFallbackPath, filteredXml, 'utf-8');
    } catch {
      // ignore
    }

    return filteredXml;
  };

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url?.split('?')[0];
    if (url === '/proxy.php') {
      const now = Date.now();
      if (cachedXml && now - cacheTime < CACHE_TTL_MS) {
        res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(cachedXml);
        return;
      }

      try {
        if (!activeFetch) {
          activeFetch = fetchAndFilterFeed().finally(() => {
            activeFetch = null;
          });
        }
        const xml = await activeFetch;
        cachedXml = xml;
        cacheTime = Date.now();
        res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(xml);
        return;
      } catch (err) {
        console.warn('Feed proxy fetch warning, using cached fallback:', err);
        if (cachedXml) {
          res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(cachedXml);
          return;
        }
        if (fs.existsSync(localFallbackPath)) {
          res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          fs.createReadStream(localFallbackPath).pipe(res);
          return;
        }
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
        res.end("<?xml version='1.0' encoding='UTF-8'?><vehicles></vehicles>");
        return;
      }
    }
    next();
  };

  return {
    name: 'xml-feed-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), xmlFeedProxyPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});
