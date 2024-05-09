import path from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import builtins from 'builtin-modules';
import alias from "@rollup/plugin-alias";

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import tailwindcss from 'tailwindcss';

const prod = (process.argv[2] === 'production');

export default defineConfig(() => {
  return {
    plugins: [
      svelte({
        preprocess: autoPreprocess()
      }),
      tailwindcss(),
      // cssInjectedByJsPlugin(),
      alias(),
    ],
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
        $src: path.resolve("./src")
      },
    },
    watch: !prod,
    build: {
      sourcemap: prod ? false : 'inline',
      minify: prod,
      // Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
      commonjsOptions: {
        ignoreTryCatch: false,
        transformMixedEsModules: true,
      },
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        formats: ['cjs'],
      },
      css: {},
      // Use root as the output dir
      emptyOutDir: false,
      outDir: './',

      rollupOptions: {
        output: {
          // Overwrite default Vite output fileName
          entryFileNames: 'main.js',
          assetFileNames: 'styles.css',
          manualChunks: undefined,
          compact: true,
        },

        external: ['obsidian',
          'electron',
          "codemirror",
          "@codemirror/autocomplete",
          "@codemirror/closebrackets",
          "@codemirror/collab",
          "@codemirror/commands",
          "@codemirror/comment",
          "@codemirror/fold",
          "@codemirror/gutter",
          "@codemirror/highlight",
          "@codemirror/history",
          "@codemirror/language",
          "@codemirror/lint",
          "@codemirror/matchbrackets",
          "@codemirror/panel",
          "@codemirror/rangeset",
          "@codemirror/rectangular-selection",
          "@codemirror/search",
          "@codemirror/state",
          "@codemirror/stream-parser",
          "@codemirror/text",
          "@codemirror/tooltip",
          "@codemirror/view",
          "@lezer/common",
          "@lezer/lr",
          "@lezer/highlight",
          "./src/lib",
          ...builtins,
        ],
      },
    },
  }

});
