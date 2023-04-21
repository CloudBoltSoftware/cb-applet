import vue from "@vitejs/plugin-vue";
import camelCase from "camelcase";
import { resolve } from "path";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";

// The name of the applet from package.json in PascalCase.
const PACKAGE_NAME = process.env.npm_package_name;
const pascalPackageName = camelCase(PACKAGE_NAME, {
  pascalCase: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // The base Vue plugin
    vue(),

    // Resolves node modules. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),
  ],

  build: {
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      // ES Modules are the browser's native module format.
      // This lets us use the native import() function to load this module.
      formats: ["es"],
      // name: pascalPackageName,
      entry: resolve(__dirname, "src/TheApplet.vue"),
      fileName: "main",
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your component.
      external: ["vue"],
      // output: {
      //   // Provide global variables to use in the UMD build for externalized deps
      //   globals: {
      //     vue: "Vue",
      //   },
      // },
    },
  },
});
