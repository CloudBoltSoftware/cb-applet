import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { spawn } from "child_process";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

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
    // By default, run on the closeBundle hook. This is after each build has written
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
    // Transform .vue files into .js files.
    vue({
      template: {
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#image-loading
        transformAssetUrls,
      },
    }),

    // Add Vuetify Components, directives, etc.
    vuetify(),

    // Resolves installed node modules into the bundler. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),

    // Triggers the custom xui bundler.
    postBuildScriptRunner({ script: "npm run post-build" }),
  ],

  build: {
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      // ES Modules are the browser's native module format.
      // It's what the CUI uses to load the component
      formats: ["es"],

      // The root component the CUI should load.
      entry: "src/TheApplet.vue",

      // The name of the js bundle the CUI will use to load the component.
      // This should match package.json's "module" field and "xuiConfig.met_entry_point"
      fileName: (format) => `main.${format}.js`,
    },

    rollupOptions: {
      // Externalized dependencies that shouldn't be bundled into your component.
      // These are provided by the CUI, and this configuration shouldn't change unless
      // the CUI begins providing more dependencies.
      // This is used for routing the bare imports like 'vue' to the URLs for the CUI's
      // own dependencies via an import map.
      // This regex test will match any package in the @syncfusion scope, as well as
      // vue and vuetify.
      external: (id) => /^(@syncfusion\/.+|vue|vuetify)$/.test(id),
    },
  },
});
