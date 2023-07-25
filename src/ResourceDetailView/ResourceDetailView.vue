<template>
  <ConditionalExample :api="api" :resource="context.resource"/>
  <ApiExamples :api="api" :resource="context.resource" />
</template>

<script setup>
import { defineProps } from "vue";
import ApiExamples from "./ApiExamples.vue";
import ConditionalExample from "./ConditionalExample.vue";
/**
 * Recommend starting at src/MainView/MainView.vue for a more in-depth explanation of component parts
 */

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
   * Additional contextual information for an applet in a Resource panel. Contains the current resource info
   **/
  context: {
    type: Object,
    default: () => ({}),
  },
});

</script>
