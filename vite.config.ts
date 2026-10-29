import { defineConfig, Plugin, Connect } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function xmlFeedProxyPlugin(): Plugin {
  let cachedXml: string | null = null;
  let cacheTime = 0;
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  // Pre-seed cache from local fallback if exists
  const localFallbackPath = path.resolve(__dirname, 'public/changan-feed.xml');
  if (fs.existsSync(localFallbackPath)) {
    try {
      cachedXml = fs.readFileSync(localFallbackPath, 'utf-8');
      cacheTime = Date.now();
    } catch (e) {
      void e;
    }
  }

  const fetchAndFilterFeed = async (): Promise<string> => {
    const feedUrl = 'https://export.maxposter.ru/dealer-export/1983-38233.xml';
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream feed HTTP ${response.status}`);
    }

    const fullText = await response.text();

    // Fast string/regex filtering for Changan vehicles only to reduce 12MB+ to ~500KB
    const vehicleRegex = /<vehicle>[\s\S]*?<\/vehicle>/gi;
    const matches = fullText.match(vehicleRegex) || [];
    const changanVehicles = matches.filter((v) =>
      /<brand[^>]*>[\s\S]*?(changan|чанган)[\s\S]*?<\/brand>/i.test(v)
    );

    const filteredXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<vehicles>\n${changanVehicles.join('\n')}\n</vehicles>`;
    return filteredXml;
  };

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url?.split('?')[0];
    if (url === '/proxy.php') {
      try {
        const now = Date.now();
        if (cachedXml && now - cacheTime < CACHE_TTL_MS) {
          res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(cachedXml);
          return;
        }

        const filtered = await fetchAndFilterFeed();
        cachedXml = filtered;
        cacheTime = now;

        res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(filtered);
      } catch (err) {
        console.error('Feed proxy error:', err);
        if (cachedXml) {
          res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(cachedXml);
          return;
        }
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/xml; charset=UTF-8');
        res.end("<?xml version='1.0' encoding='UTF-8'?><vehicles></vehicles>");
      }
      return;
    }
    next();
  };

  return {
    name: 'xml-feed-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
      // Warm up cache in background
      fetchAndFilterFeed()
        .then((xml) => {
          cachedXml = xml;
          cacheTime = Date.now();
        })
        .catch(() => {});
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
