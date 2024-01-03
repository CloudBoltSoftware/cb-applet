<template>
  <!-- 
    VCard comes from Vuetify: https://vuetifyjs.com/en/components/cards/
    and provide a great way to wrap related content together.
    The "tonal" variant is a built-in customization to change the overall card appearance
    The vuetify margin class "mx-2" provides a simple css margin to the left and right
  -->
  <VCard :title="title" class="mb-2 mx-2" variant="tonal">
    <!-- 
    Vue Slots provide a way to pass template fragments to components. https://vuejs.org/guide/components/slots.html
    Any reusable component can be written to take full advantage of slots. You can set and use multiple slots and templates at the same time.
    Instead of using the VCard sub components here, we can use the available Vuetify `slots` https://vuetifyjs.com/en/api/v-card/#slots
    This will render whatever is passed inside the component to the default VCard slot. 
    -->
    <slot name="default">
      <!-- Anything passed inside the default template when calling this component -->
    </slot>
  </VCard>
</template>

<script setup>
/**
 * Unlike some of the other example components which focus on specific use cases,
 * sometimes you will want to create generic components with reusability
 * This component recieves a title string and has an optional slot for content
 * and will render a consistently styled VCard result that can be used anywhere
 */

/**
 * @typedef {object} Props
 * @property {object} Props.title - The simple title string provided to the component
/** @type {Props} */

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<!-- These styles won't affect anything outside this component, but will impact every iteration of this component -->
<style scoped></style>
