// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vuetify from 'vite-plugin-vuetify'
// import router from "./src/router";
//
// const path = require('path')
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
//     vuetify({
//       autoImport: true,
//     }),
//   ],
//   define: { 'process.env': {} },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },



import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true, // Configure Vuetify for auto-import
    }),
  ],
  define: { 'process.env': {} }, // Define process.env for compatibility
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for the src directory
    },
  },


  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
})
