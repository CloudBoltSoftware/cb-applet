<template>
  <!-- 
    VCard comes from Vuetify: https://vuetifyjs.com/en/components/cards/
    and provide a great way to wrap related content together.
    The "tonal" variant is a built-in customization to change the overall card appearance
  -->
  <VCard
    :title="info.label"
    class="mb-2"
    variant="tonal"
  >
  <!-- 
  VCardText slot sits below the header and can be considered the main body of the card
  -->
    <VCardText>
    <!-- Double brackets to simply render the `info.value` -->
    {{ info.value}}
    </VCardText>
  </VCard>
</template>


<script setup>
/**
 * Unlike some of the other example components which focus on specific use cases, 
 * sometimes you will want to create generic components with reusability
 * As long as this component recieves an `info` object that has a `label` and `value` properties
 * it will render a consistent VCard result that can be used anywhere
 */

/**
 * @typedef {object} Props
 * @property {object} Props.info - The simple info object provided to the component
/** @type {Props} */

defineProps({
  info: {
    type: Object,
    required: true,
  },
});

</script>

<!-- These styles won't affect anything outside this component, but will impact every iteration of this component -->
<style scoped></style>
