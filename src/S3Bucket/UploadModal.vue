<template>
  <VDialog v-model="uploadDialog" width="1024">
    <template #activator="{ props: uploadProps }" >
      <VBtn v-bind="uploadProps" icon="mdi-file-upload" title="Upload New File" size="x-large"/>
    </template>
    <VCard class="py-3">
      <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
        <div>
          Upload File or Folder to <span class="font-italic">{{ state.full_path ? state.full_path : 'Root folder'}}</span>
        </div>
        <VBtn icon="mdi-close" title="Close this dialog" data-dismiss="modal" variant="text" @click="uploadDialog = false"/>
      </VCardTitle>
      <VCardActions class="d-flex justify-center ma-2">
        <FileUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="refreshResource" />
        <FolderUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="refreshResource"/>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./FileUpload.vue";
import FolderUpload from "./FolderUpload.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {function} Props.refreshResource - Function to fetch the selected S3 Bucket
 */
/** @type {Props} */
defineProps({
  api: {
    type: Object,
    required: true,
  },
  state: {
    type: Object,
    default: () => {}
  },
  resource: {
    type: Object,
    default: () => {}
  },
  refreshResource: {
    type: Function,
    default: () => {},
  },
});

const uploadDialog = ref(false)
</script>
<style scoped></style>