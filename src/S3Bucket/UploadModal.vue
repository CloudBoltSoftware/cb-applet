<template>
  <VDialog v-model="uploadDialog" width="1024">
  <!-- <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm">
  <div class="modal-content"> -->
    <template #activator="{ props: uploadProps }" >
      <!-- id="upload_btn" -->
      <VBtn v-bind="uploadProps" icon="mdi-file-upload" title="Upload New File" size="x-large"/>
    </template>
    <VCard class="py-2">
      <VCardActions class="d-flex justify-center ma-2">
        <!-- <VBtn prepend-icon="mdi-file-upload" id="file_btn" class="btn btn-primary" title="Upload New File">Upload a File</VBtn> -->
        <FileUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="() => handleResourceSelection(resource)" />
        <!-- <VBtn prepend-icon="mdi-folder-upload" id="folder_btn" class="btn btn-primary" title="Upload New Folder">Upload a Folder</VBtn> -->
        <FolderUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="() => handleResourceSelection(resource)"/>
      </VCardActions>
    </VCard>
  <!-- </div>
  </div>
  </div> -->
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./FileUpload.vue";
import FolderUpload from "./FolderUpload.vue";
// TODO Update post upload not working
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {function} Props.handleResourceSelection - Function to fetch the selected S3 Bucket
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
  handleResourceSelection: {
    type: Function,
    default: () => {},
  },
});

const uploadDialog=ref(false)
</script>
<style scoped></style>