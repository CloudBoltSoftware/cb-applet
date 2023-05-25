<template>
  <H2>Hello World!</H2>
</template>

<script setup>
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
</script>

<style scoped lang="scss"></style>
