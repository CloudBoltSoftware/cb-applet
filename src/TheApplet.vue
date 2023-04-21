<template>
  <div class="ml-4" v-if="area === 'preNavItems'">HelloWorld nav</div>
  <div v-else>
    <h1>{{ message }}</h1>
    <img :src="imageUrl" alt="Vue logo" />
    <p>Page: {{ page }}</p>
    <p>Area: {{ area }}</p>
    <NestedComponent nested-message="Hello World!" />
    <p>User: {{ username }}</p>
    <p>Context passed in? {{ Object.keys(context).length > 0 }}</p>
    <p>API passed in?: {{ Object.keys(api).length > 0 }}</p>
    <p>Resource id: {{ (context.resource || {}).id }}</p>
  </div>
</template>

<script>
export default {
  // The name should be skipped when it is the same as the file name.
  // However, this component needs one so the component name isn't just "Main".
  // So we'll use a PascalCase version of the package name.
  // Also the <script setup> syntax doesn't support the name property, so it's added here.
  // If you prefer using the vue options api, you can delete the <script setup> block and
  // use this object instead. Read more at https://vuejs.org/guide/introduction.html#api-styles.
  // TODO: Generate this name from the npm package name
  // name: "MyApplet",
};
</script>

<script setup>
// Import any 3rd party libraries you'd like to use
import camelCase from "camelcase";
import { computed, defineProps } from "vue";

// Import any assets you'd like to reference
import imageUrl from "./assets/cb_logo_255x60.png";

// Import other components to use in the template
import NestedComponent from "./NestedComponent.vue";

/**
 * Props values are provided by the CUI when loading this component.
 * They should not be edited by Applet authors.
 */
const props = defineProps({
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

  /** Could contain a variety of info depending on where the component is being rendered */
  context: {
    type: Object,
    default: () => ({}),
  },
});

// Demonstrating using a third-party library
const message = camelCase("hello-world");
console.log(message);

// Demonstrating using a computed property, reactive to changes in props
const username = computed(() => props.user.username);
</script>
