import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { exec } from "child_process";

/**
 * Run a script after each build. This works on all changes with build --watch too.
 * @param {object} options
 * @param {string} options.script terminal script to run after each build
 */
function postBuildScriptRunner(options) {
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
    // The base Vue plugin for the dev server
    // TODO: Create an index.html file that's good for developing with.
    vue(),

    // Resolves installed node modules. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),

    // Triggers the xui bundler.
    postBuildScriptRunner({ script: "npm run post-build" }),
  ],

  build: {
    minify: false,

    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      // ES Modules are the browser's native module format.
      // It's what the CUI uses to load the component
      formats: ["es"],

      // The root component the CUI should load.
      entry: "src/TheApplet.vue",

      // The name of the js bundle the CUI will use to load the component.
      fileName: (format) => `main.${format}.js`,
    },

    rollupOptions: {
      // Externalized dependencies that shouldn't be bundled into your component.
      // These are provided by the CUI, routing the bare imports like 'vue' to the
      // URLs for the CUI's own dependencies via an import map.
      external: [
        "vue",
        "vuetify",
        "@syncfusion/ej2-vue-base",
        "@syncfusion/ej2-vue-grids",
        "@syncfusion/ej2-layouts",
      ],
    },
  },
});
