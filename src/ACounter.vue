<template>
  <!-- 
    VBtn comes from Vuetify: https://vuetifyjs.com/en/components/buttons/ 
  
    The `@click`s are a examples of how you bind js functions to events on elements.
    See more: https://vuejs.org/guide/essentials/event-handling.html
  -->
  <VBtn @click="increment">Increment</VBtn>
  <VBtn @click="decrement">Decrement</VBtn>
  <p>The count is {{ count }}</p>
</template>

<script setup>
import { ref } from "vue";

/**
 * Each Vue component has its own state. If you put two copies of this component on
 * the same page, they will have independent counts.
 */
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>
