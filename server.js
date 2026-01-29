#!/usr/bin/env node
/*
  Minimal server shim so hosting providers (Hostinger) can detect a JS entrypoint
  It simply requires the compiled NestJS app at ./dist/main.js which is produced by `npm run build`.
*/
try {
  require('./dist/main.js');
} catch (err) {
  console.error('Failed to start application. Ensure you ran `npm run build` so dist/main.js exists.');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}
