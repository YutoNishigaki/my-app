import process from 'node:process';
import { context } from 'esbuild';
import { esbuildOptions } from './esbuild.config.mjs';

const ctx = await context(esbuildOptions);

await ctx.watch();

const shutdown = async () => {
  await ctx.dispose();
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
