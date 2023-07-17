<template>
  <NestedExamples :api="api" />
</template>

<script setup>
import {
defineProps,
} from "vue";
import NestedExamples from "./NestedExamples.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.context - Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
 */

/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  /**
   * Additional contextual information for an applet in a Resource panel
   * console.log(props.context) to see what's available for your applet.
   **/
   context: {
    type: Object,
    default: () => ({}),
  },
});

</script>

<!-- 
  The `style` is where you write your CSS. "scoped" styles only apply to this component - not even 
  child components will be affected. This is a great way to make sure your styles don't leak out.
-->
<style scoped>
</style>
