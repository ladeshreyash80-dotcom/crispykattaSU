// Minimal static server for production-build verification.
// Serves ./dist with SPA fallback to index.html (no keep-alive, so the
// in-app WebView does not stall on a pooled connection).
// Usage: node scripts/serve-dist.mjs 4401,4402,...
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = new URL('../dist/', import.meta.url).pathname
const PORTS = (process.argv[2] || '4321')
  .split(',')
  .map((p) => Number(p.trim()))
  .filter(Boolean)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

function createStaticServer() {
  return createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
    let filePath = join(ROOT, safe)

    try {
      const info = await stat(filePath)
      if (info.isDirectory()) filePath = join(filePath, 'index.html')
    } catch {
      // SPA fallback
      filePath = join(ROOT, 'index.html')
    }

    try {
      const body = await readFile(filePath)
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'Connection': 'close',
      })
      res.end(body)
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain', Connection: 'close' })
      res.end('not found')
    }
  })
}

for (const PORT of PORTS) {
  const server = createStaticServer()
  server.on('error', (err) => console.error(`port ${PORT} error:`, err.message))
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`)
  })
}
