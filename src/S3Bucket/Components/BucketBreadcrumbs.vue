<template>
  <VBreadcrumbs
    v-if="name"
    class="pl-0 my-1"
  >
    <VBreadcrumbsItem v-for="(entry, idx) in breadcrumbs" :key="entry.title">
      <div v-if="entry.disabled" class="text-grey-darken-3 text-none text-h6">{{ entry.title }}</div>
      <VBtn v-else class="text-blue-darken-3 text-none text-h6 px-0" variant="plain" @click="fetchSelection(entry.path)" >{{ entry.title }}</VBtn>
      <VBreadcrumbsDivider v-if="breadcrumbs.length - 1 > idx && breadcrumbs.length > 1" class="pr-0">
        <VIcon icon="mdi-slash-forward" />
      </VBreadcrumbsDivider>
    </VBreadcrumbsItem>
  </VBreadcrumbs>
</template>

<script setup>
import { computed } from "vue";
import { VBreadcrumbsItem } from "vuetify/lib/components/index.mjs";
/**
 * @typedef {Object} Props
 * @property {Object} Props.name - The S3 Bucket name
 * @property {Object} Props.state - The S3 Bucket state
 * @property {Function} Props.fetchSelection - Function to fetch the selected S3 Bucket path
 */
/** @type {Props} */
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  state: {
    type: Object,
    default: () => {},
  },
  fetchSelection: {
    type: Function,
    default: () => {},
  }
});

const breadcrumbs = computed(() => {
  let crumbsArray = [{
    title: props.name,
    disabled: false,
    path: { 
      name: props.name,
      path: ''
    }
  }] 
  if (props.state.path_dirs.length > 0) {
    for (let entry of props.state.path_dirs) {
      if (entry.name) {
        crumbsArray.push({
          title: entry.name,
          disabled: false,
          path: { 
            name: entry.name, 
            path: entry.path
          }
        })
      }
    }
  }
  // Disable the last link
  const lastLink = crumbsArray[crumbsArray.length-1]
  lastLink.disabled = true
  return crumbsArray
})

</script>
<style scoped></style>
