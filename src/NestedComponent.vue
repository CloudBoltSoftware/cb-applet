<template>
  <p>Nested: {{info}}</p>
</template>

<script>

export default {
  props: {
    info: {
      type: String,
      required: true,
    },
  },
};