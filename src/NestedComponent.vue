<template>
  <p>Nested: {{ nestedMessage }}</p>
</template>

<script setup>
defineProps({
  nestedMessage: {
    type: String,
    required: true,
  },
});
</script>
