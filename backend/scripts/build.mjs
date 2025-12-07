import { build } from 'esbuild';
import { esbuildOptions } from './esbuild.config.mjs';

await build(esbuildOptions);
