<template>
  <div class="ml-4" v-if="area == 'prePageContent'">
    <h2>Kitchen Sink Above</h2>
  </div>
  <div v-else class="border-red">
    <h2>Kitchen Sink Below</h2>
    {{ message }}
    <NestedComponent nested-message="Hello World!" />
    <img :src="imageUrl" alt="CloudBolt logo" />
    <p>Page: {{ page }}</p>
    <p>Area: {{ area }}</p>
    <p>Time: {{ time }}</p>
    <p>User: {{ username }}</p>
    <p>Context keys passed in {{ Object.keys(context) }}</p>
    <p>API passed in?: {{ Object.keys(api).length > 0 }}</p>
    <VuetifyComponent />
    <SyncFusionComponent :api="api" />
  </div>
</template>

<script setup>
// Import any 3rd party libraries you'd like to use
import camelCase from "camelCase";
import {
  computed,
  defineProps,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
} from "vue";

// Import any assets you'd like to reference
import imageUrl from "./assets/cb_logo_255x60.png";

// Import other components to use in the template
import NestedComponent from "./NestedComponent.vue";
import SyncFusionComponent from "./SyncFusionComponent.vue";
import VuetifyComponent from "./VuetifyComponent.vue";

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

// Some lifecycle hooks
// See https://vuejs.org/guide/essentials/lifecycle.html#registering-lifecycle-hooks
console.log("I run on setup");
onBeforeMount(() => console.log("I run before the component is mounted"));
onMounted(() => console.log("I run after the component is mounted"));
onBeforeUpdate(() => console.log("I run before the component is updated"));
onUpdated(() => console.log("I run after the component is updated"));
onBeforeUnmount(() => console.log("I run before the component is unmounted"));
onUnmounted(() => console.log("I run after the component is unmounted"));

// Using a third-party library
const greeting = camelCase("hello-world");
const message = `The string "${greeting}" is processed by an external library`;

// Using a computed property, reactive to changes in props and data
const username = computed(() => props.user.username);

const currentDateTime = ref(new Date());
setInterval(() => (currentDateTime.value = new Date()), 1000);
const time = computed(() => currentDateTime.value.toLocaleTimeString());
</script>

<style scoped lang="scss">
.border-red {
  border: 1px solid red;
}
</style>
