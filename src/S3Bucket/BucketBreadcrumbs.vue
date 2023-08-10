<template>
  <VBreadcrumbs
    v-if="resource"
    class="pl-0 my-1"
  >
    <VBreadcrumbsItem v-for="(entry, idx) in breadcrumbs" :key="entry.title">
      <div v-if="entry.disabled" class="text-grey-darken-3 text-none text-h6">{{ entry.title }}</div>
      <VBtn v-else class="text-blue-darken-3 text-none text-h6 px-0" variant="plain" @click="fetchSelection(entry.path)" >{{ entry.title }}</VBtn>
      <VBreadcrumbsDivider v-if="breadcrumbs.length -1 > idx && breadcrumbs.length > 1" class="pr-0">
        <VIcon icon="mdi-slash-forward" />
      </VBreadcrumbsDivider>
    </VBreadcrumbsItem>
  </VBreadcrumbs>
</template>

<script setup>
import { computed } from "vue";
import { VBreadcrumbsItem } from "vuetify/lib/components/index.mjs";
/**
 * @typedef {object} Props
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {function} Props.fetchSelection - Function to fetch the selected S3 Bucket path
 */
/** @type {Props} */
const props = defineProps({
  resource: {
    type: Object,
    default: () => {},
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
    title: props.resource.name,
    disabled: false,
    path: { 
      name: props.resource.name,
      path: ''
    }
  }] 
  if (props.state.path_dirs.length > 0) {
    for (let entry of props.state.path_dirs) {
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
  // Disable the last link
  const lastLink = crumbsArray[crumbsArray.length-1]
  lastLink.disabled = true
  return crumbsArray
})

</script>
<style scoped></style>
