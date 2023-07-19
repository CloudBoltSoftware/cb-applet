<template>
  <NestedExamples :api="api" :resource="context.resource"/>
</template>

<script setup>
import { defineProps } from "vue";
import NestedExamples from "./NestedExamples.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.context - Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
 */

/** @type {Props} */
defineProps({
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
