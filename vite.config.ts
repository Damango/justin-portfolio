import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function vercelHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    headers: { headers: { key: string; value: string }[] }[];
  };
  return Object.fromEntries(config.headers.flatMap((h) => h.headers.map((x) => [x.key, x.value])));
}

// Cloudflare's public test secret: always passes. Only used by the dev server.
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

// Serves api/contact.ts during `npm run dev`, so the form works locally
// without the Vercel CLI. In production Vercel runs that file itself.
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    apply: 'serve',
    configureServer(server) {
      process.env.TURNSTILE_SECRET_KEY ??= TURNSTILE_TEST_SECRET;
      // No Resend key locally → log messages to this terminal instead of sending.
      if (!process.env.RESEND_API_KEY) process.env.CONTACT_DRY_RUN ??= '1';

      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('allow', 'POST');
          res.end();
          return;
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);

        const request = new Request(`http://${req.headers.host}/api/contact`, {
          method: 'POST',
          headers,
          body: Buffer.concat(chunks),
        });
        const { handleContact } = await server.ssrLoadModule('/api/contact.ts');
        const response: Response = await handleContact(request, req.socket.remoteAddress ?? 'unknown');

        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose non-VITE_ variables from .env files to the dev API, without
  // overriding anything already set in the shell.
  for (const [k, v] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[k] ??= v;

  return {
    plugins: [react(), contactApi()],
    // `npm run preview` sends the same security headers Vercel does, so a
    // CSP problem shows up locally before it reaches production.
    preview: { headers: vercelHeaders() },
  };
});
