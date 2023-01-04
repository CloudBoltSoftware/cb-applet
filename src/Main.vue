<template>
  <div>
    <h1>{{ message }}</h1>
    <p>Page: {{ page }}</p>
    <p>Area: {{ area }}</p>
    <p>User: {{ JSON.stringify(user) }}</p>
    <p>Context: {{ JSON.stringify(context) }}</p>
    <p>API: {{ JSON.stringify(api) }}</p>
  </div>
</template>

<script>
import camelCase from "camelcase";

export default {
  // The name should be skipped when it is the same as the file name.
  // However, this component needs one so the component name isn't just "Main".
  name: "HelloWorld",

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
    };
  },
};
</script>
