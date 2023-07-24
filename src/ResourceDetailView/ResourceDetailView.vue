<template>
  <BasicTextCard v-if="datadogParam" :info="datadogParam"/>
  <ApiExamples :api="api" :resource="context.resource" />
</template>

<script setup>
import { computed, defineProps } from "vue";
import ApiExamples from "./ApiExamples.vue";
import BasicTextCard from "./BasicTextCard.vue";
/**
 * Recommend starting at src/MainView/MainView.vue for a more in-depth explanation of component parts
 */

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
   * Additional contextual information for an applet in a Resource panel. Contains the current resource info
   **/
  context: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * Leveraging information provided by the resource context to create a conditionals for an example.  
 * You can always console.log(props.context) to see what is available to work with.
 * This reactive value will check the resource context being passed for a custom parameter added to the resource 
 * whose name matches the desired value of "Datadog Parameter", and then displays this information in another VCard component
 * Custom Parameters can be created at `admin/customfields/` then added to the resource on the Parameters tab
 */
const datadogParam = computed(() => props.context.resource?.groupedAttributesMap?.parameters?.attributes.filter((each) => each.label === "Datadog Parameter")[0])
</script>
