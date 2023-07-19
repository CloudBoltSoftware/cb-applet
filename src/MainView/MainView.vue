<template>
  <!-- 
    If you prepend an attribute with `:` (short for `v-bind:`), vue will treat the attribute's
    value as javascript. This loads the imageUrl as imported in the below `script` section.
  -->
  <img :src="imageUrl" alt="CloudBolt logo" />
  <h2>CB Applet Hello World Example</h2>
  <p>
    This is a simple example of a CloudBolt Applet. It's a Vue component that is
    loaded into the CloudBolt UI and can be used to add functionality to
    CloudBolt.

    <!-- 
      Use double-curly-braces to render a variable from the `script` section in the template. 
      You can use any valid javascript expression in the double-curly-braces.
      -->
    {{ message + "!" }}
  </p>
  <p>Time: {{ time }}</p>

  <!-- 
    Prepend props like "api" with `:` to bind them to child components. `:` is short for `v-bind:`.
    -->
  <VersionInfo :api="api" />
  <CounterComponent />
</template>

<script setup>
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
import imageUrl from "../assets/cb_logo_255x60.png";
import CounterComponent from "./CounterComponent.vue";
import VersionInfo from "./VersionInfo.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 */

/** @type {Props} */
defineProps({
  api: {
    type: Object,
    required: true,
  },
});

/**
 * You can use any third-party library you'd like to install via npm
 * Any libraries you import and use get bundled into the applet.
 */
const greeting = camelCase("hello-world");

// Everything defined in <script setup> (like this normal variable) is available in the template above.
const message = `The string "${greeting}" is processed by an installed npm package`;

/**
 * The only problem with the above code is that it's not reactive. If the greeting were to change
 * somehow, (for example, if it was passed in as a prop instead of hard-coded), the console.log
 * wouldn't run again or understand that props.page has changed since the applet first loaded.
 *
 * Vue provides a few ways to make values reactive. The two most common are:
 *  - `ref` - a reactive value that can be changed.
 *     @see https://vuejs.org/guide/essentials/reactivity-fundamentals.html
 *  - `computed` - a reactive value that is derived from other reactive values.
 *     @see https://vuejs.org/guide/essentials/computed.html
 *
 * The vue documentation is excellent and worth reading. Let's explore this with a simple example.
 */

// Create a reactive value (a ref), initialized to the current date and time
const currentDateTime = ref(new Date());
// Create a computed value by defining a function that returns the current time as a string
const time = computed(() => currentDateTime.value.toLocaleTimeString());
// We  reference `time` in the template above. It will automatically update when currentDateTime changes.

// Let's update the time every second.
function updateCurrentDateTime() {
  currentDateTime.value = new Date();
}
const timeUpdateInternal = setInterval(updateCurrentDateTime, 1000);
// As the time changes, the template react to the changed `computed` (based on the `ref`) and update.

/**
 * Vue also provides lifecycle hooks to run code at different points in the component's lifecycle.
 * These can be used to load data, set up event listeners, clean up, etc.
 * See https://vuejs.org/guide/essentials/lifecycle.html#registering-lifecycle-hooks
 */
console.log("I run on setup");
onBeforeMount(() => console.log("I run before the component is mounted"));
onMounted(() => console.log("I run after the component is mounted"));
onBeforeUpdate(() => console.log("I run before the component is updated"));
onUpdated(() => console.log("I run after the component is updated"));
onBeforeUnmount(() => console.log("I run before the component is unmounted"));
onUnmounted(() => console.log("I run after the component is unmounted"));

// Let's use one of these to clean up the interval we created earlier when we unmount the component.
onUnmounted(() => clearInterval(timeUpdateInternal));
</script>

<!-- 
  The `style` is where you write your CSS. "scoped" styles only apply to this component - not even 
  child components will be affected. This is a great way to make sure your styles don't leak out.
-->
<style scoped>
h2 {
  color: #1e88e5;
}
</style>
