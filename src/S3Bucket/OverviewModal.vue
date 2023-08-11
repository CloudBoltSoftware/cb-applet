<template>
  <VDialog v-model="overviewDialog" width="1024">
    <template #activator="{ props: overviewProps }" >
      <VBtn v-bind="overviewProps" icon="mdi-information" title="Details" />
    </template>
    <VCard class="py-3">
      <VCardTitle class="d-inline-flex justify-space-between pb-0">
        <VTabs v-model="tab" slider-color="black" height="50px" selected-class="bg-primary text-white" >
          <VTab class="active tab-btn" value="overview" size="x-large">Overview</VTab>
          <VTab class="tab-btn" value="versions" size="x-large" >Versions</VTab>
        </VTabs>
        <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="overviewDialog = false" />
      </VCardTitle>
      <VCardText class="pt-0">
        <VWindow v-model="tab">
          <VWindowItem value="overview">
            <OverviewTab :source-item="sourceItem" :location="location" />
          </VWindowItem>
          <VWindowItem value="versions">
            <VersionTab :api="api" :source-item="sourceItem" :location="location" :resource="resource" :refresh-resource="refreshResource"/>
          </VWindowItem>
        </VWindow>
      </VCardText>
      <VCardActions class="d-flex justify-end px-3">
        <VBtn color="primary" variant="flat" size="large" class="px-4" @click="overviewDialog = false">OK</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
    
<script setup>
import { ref } from "vue";
import OverviewTab from './OverviewTab.vue';
import VersionTab from './VersionTab.vue';

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.sourceItem - The selected S3 Bucket item
 * @property {string} Props.location - The selected S3 Bucket location
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {function} Props.refreshResource - Function to fetch the selected S3 Bucket
 */
/** @type {Props} */

defineProps({
  api: {
    type: Object,
    required: true,
  },
  sourceItem: {
    type: Object,
    default: () => {}
  },
  location: {
    type: String,
    default: '',
  },
  resource: {
    type: Object,
    default: () => {},
  },
  refreshResource: {
    type: Function,
    default: () => {},
  },
});

const tab = ref(null)
const overviewDialog = ref(false)
</script>
<style scoped></style>
