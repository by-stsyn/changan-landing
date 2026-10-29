import { defineConfig, Plugin, Connect } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function xmlFeedProxyPlugin(): Plugin {
  const localFallbackPath = path.resolve(__dirname, 'public/changan-feed.xml');

  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url?.split('?')[0];
    if (url === '/proxy.php') {
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
