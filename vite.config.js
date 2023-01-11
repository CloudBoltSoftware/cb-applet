import vue from "@vitejs/plugin-vue2";
import camelCase from "camelcase";
import { resolve } from "path";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

// The name of the applet from package.json in PascalCase.
const pascalPackageName = camelCase(process.env.npm_package_name, {
  pascalCase: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // The base Vue plugin
    vue(),
    // Automatically import all Vuetify components into all Vue file
    Components({ resolvers: [VuetifyResolver()] }),
  ],

  build: {
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      formats: ["es"],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/TheApplet.vue"),
      name: pascalPackageName,
      // the proper extensions will be added automatically
      fileName: "main",
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "vuetify/lib"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "vuetify/lib": "Vuetify",
        },
      },
    },
  },
});
