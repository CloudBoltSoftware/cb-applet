import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";

/**
 * When building the vue library and keeping vue as an external dependency,
 * the import statements in the vue files are not resolved correctly. Specifically,
 * we attempt to import 'createElementVNode' from 'vue' but it is not found.
 * In vue3, that function is simply called 'h'.
 *
 * This is an absolutely terrible hack to fix the issue for now. There is some
 * subtle version mismatch, bug, or interplay between vite, vue, and rollup that
 * does this. It's only a problem when vue is external. 🤷
 */
function vueImportCorrector() {
  return {
    name: "vue-import-corrector",
    transform(src, id) {
      if (id.endsWith(".vue")) {
        console.log("TRANSFORMING");
        return src.replace(/createElementVNode/g, "h");
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // The base Vue plugin
    vue(),

    // Resolves node modules. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),

    vueImportCorrector(),
  ],

  build: {
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      // ES Modules are the browser's native module format.
      // This lets us use the native import() function to load this module.
      formats: ["es"],
      entry: "src/TheApplet.vue",
      fileName: (format) => `main.${format}.js`,
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your component.
      external: ["vue"],
    },
  },
});
