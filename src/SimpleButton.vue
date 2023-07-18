<template>
  <!-- 
    VBtn comes from Vuetify: https://vuetifyjs.com/en/components/buttons/ 
  
    The `@click`s are a examples of how you bind js functions to events on elements.
    See more: https://vuejs.org/guide/essentials/event-handling.html
  -->
  <VBtn
    :disabled="disabled"
    :text="buttonText"
    class="d-block my-1"
    variant="outlined"
    @click="buttonAction"
  ></VBtn>
</template>

<script setup>
import { computed } from "vue";
/**
 * @typedef {object} Props
 * @property {function} Props.buttonAction - Function to run when button clicked
 * @property {string} Props.text - String for button text
 * @property {string} Props.disabledText - String for button text when disabled
 * @property {boolean} Props.disabled - Boolean to toggle button functionality
 */
/** @type {Props} */
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  buttonAction: {
    type: Function,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledText: {
    type: String,
    default: "",
  },
});

const buttonText = computed(() =>
  props.disabled && props.disabledText ? props.disabledText : props.text
);
</script>
