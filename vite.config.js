import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { exec } from "child_process";

/**
 * When building the vue library and keeping vue as an external dependency,
 * the import statements in the vue files are not resolved correctly. Specifically,
 * we attempt to import 'createElementVNode' from 'vue' but it is not found.
 * In the CUI build, vite seems to strip off this export, or else not rename it
 * correctly from createBaseVNode.
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
        return src.replace(/createElementVNode/g, "createBaseVNode");
      }
    },
  };
}

/**
 * Run a script after each build. This also works for changes with build --watch.
 * @param {object} options
 * @param {string} options.script terminal script to run after each build
 */
function postBuildPlugin(options) {
  return {
    name: "post-build-plugin",
    apply: "build",
    async writeBundle() {
      exec(options.script, (error, stdout, stderr) => {
        if (error) console.error(error.message);
        if (stderr) console.error(stderr);
        console.log(stdout);
      });
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

    // Corrects the import statements in the vue files with a dirty hack.
    // TODO: Diagnosis and fix the root cause of the issue.
    // vueImportCorrector(),

    // Run a script after each build. This triggers the xui bundler.
    postBuildPlugin({ script: "npm run post-build" }),
  ],

  build: {
    minify: false,

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
      external: [
        "vue",
        "@syncfusion/ej2-vue-base",
        "@syncfusion/ej2-vue-grids",
        "@syncfusion/ej2-layouts",
      ],
    },
  },
});
