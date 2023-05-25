<script setup>
// Vue components (and thus CB Applets) don't actually need to display anything. They can just
// perform some action. This example will report the page, area, and context where the component
// is being rendered to the console. Since we set it up to render everywhere in package.json's
// xuiConfig.met_targets, then this applet will report to the console the page, area, and context
// of every target in the CUI.

import { watchEffect } from "vue";

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

const reportTarget = () => {
  const { page, area, context } = props;
  console.log(`Target: page "${page}", area "${area}", context:`, context);
};
watchEffect(reportTarget);
</script>

<style scoped lang="scss"></style>
