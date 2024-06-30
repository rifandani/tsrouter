import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import process from 'node:process';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwind from 'tailwindcss';
import { defineConfig, type PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3301,
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    tsconfigPaths({ loose: true }),
    react(),
    TanStackRouterVite(),
    visualizer({
      filename: 'html/visualizer-stats.html',
    }) as unknown as PluginOption,
  ],
});
