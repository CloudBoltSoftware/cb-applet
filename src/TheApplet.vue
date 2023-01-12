<template>
  <div class="ml-4" v-if="area === 'preNavItems'">HelloWorld nav</div>
  <div v-else>
    <h1>{{ message }}</h1>
    <img :src="imageUrl" alt="Vue logo" />
    <p>Page: {{ page }}</p>
    <p>Area: {{ area }}</p>
    <NestedComponent info="Hello World!" />
    <p>User: {{ user.username }}</p>
    <p>Context passed in? {{ Object.keys(context).length > 0 }}</p>
    <p>API passed in?: {{ Object.keys(api).length > 0 }}</p>
    <p>Resource id: {{ (context.resource || {}).id }}</p>
  </div>
</template>

<script>
import camelCase from "camelcase";
import imageUrl from "./assets/cb_logo_255x60.png";
import NestedComponent from "./NestedComponent.vue";

export default {
  // The name should be skipped when it is the same as the file name.
  // However, this component needs one so the component name isn't just "Main".
  // So we'll use a PascalCase version of the package name.
  // TODO: Generate this from the npm package name
  name: "MyApplet",

  // The components object is used to add other components to use in the template
  // Vuetify components are auto-added by a vite plugin
  // See all vuetify components at https://vuetifyjs.com/en/components/
  // WARNING: using Vuetify components causes the applet to fail to import in the cui
  // TODO: after spending a while trying to get this to work, I'm putting it off
  //   until after the Vue3 upgrade - it should be different and much easier then.
  components: {
    NestedComponent,
  },

  /** Props are provided by the CUI when loading this component. */
  props: {
    /** User details */
    user: {
      type: Object,
      default: () => ({}),
    },

    /** The authenticated API instance */
    api: {
      type: Object,
      required: true,
    },

    /** The currently loaded page */
    page: {
      type: String,
      required: true,
    },

    /** The page area where the component is being rendered */
    area: {
      type: String,
      required: true,
    },

    /** Various info depending on where the component is being rendered */
    context: {
      type: Object,
      default: () => ({}),
    },
  },

  /**
   * The setup function is called when the component is loaded.
   * While we prefer to use the setup function (called the Composition API),
   * we also support the old options API.
   * Read more at https://vuejs.org/guide/introduction.html#api-styles
   */
  setup() {
    // Demonstrating using a third-party library
    const message = camelCase("hello-world");

    console.log(message);

    // The setup function should return anything that the template needs (apart from props)
    return {
      message,
      imageUrl,
    };
  },
};
</script>
