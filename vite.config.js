import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { spawn } from "child_process";

/**
 * Run a script after each build. This works on all changes with build --watch too.
 * @param {object} options
 * @param {string} options.script terminal script to run after each build
 * @param {string} [options.apply='build'] vite plugin apply option
 * @param {string} [options.enforce='post'] vite plugin enforce option
 * @param {string} [options.hook='closeBundle'] vite plugin hook option
 */
function postBuildScriptRunner(options) {
  return {
    name: "post-build-plugin",
    apply: options.apply || "build",
    enforce: options.enforce || "post",
    // By default, run on the closeBundle hook, which is after each build has written
    // its files to disk. This ensures all the `dist` files are available to the script.
    async [options.hook || "closeBundle"]() {
      console.log(`Running post build script: "${options.script}"`);
      const [command, ...args] = options.script.split(" ");
      const child = spawn(command, args, { stdio: "inherit" });
      child.on("error", (error) => console.error(error));
      child.on("close", (code) =>
        console.log(
          `post build script "${options.script}" exited with code ${code}`
        )
      );
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
        "@syncfusion/ej2-base",
        "@syncfusion/ej2-buttons",
        "@syncfusion/ej2-calendars",
        "@syncfusion/ej2-compression",
        "@syncfusion/ej2-data",
        "@syncfusion/ej2-dropdowns",
        "@syncfusion/ej2-excel-export",
        "@syncfusion/ej2-file-utils",
        "@syncfusion/ej2-grids",
        "@syncfusion/ej2-icons",
        "@syncfusion/ej2-inputs",
        "@syncfusion/ej2-lists",
        "@syncfusion/ej2-navigations",
        "@syncfusion/ej2-notifications",
        "@syncfusion/ej2-pdf-export",
        "@syncfusion/ej2-popups",
        "@syncfusion/ej2-splitbuttons",
        "@syncfusion/ej2-vue-base",
        "@syncfusion/ej2-vue-grids",
      ],
    },
  },
});
