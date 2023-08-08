<template>
  <VDialog v-model="folderDialog" width="1024" @update:model-value="(val) => !val && onCancel()">
<!-- <div class="modal fade" id="uploadFolderModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm"> -->
    <template #activator="{ props: folderProps }" >
      <!-- <VBtn  v-bind="folderProps" prepend-icon="mdi-folder-upload" id="folder_btn" class="btn btn-primary" title="Upload New Folder">Upload a Folder</VBtn> -->
      <VBtn v-bind="folderProps" prepend-icon="mdi-folder-upload" variant="flat" color="primary" size="x-large" title="Upload New Folder" class="px-4">Upload a Folder</VBtn>
    </template>
    <VCard class="py-3">
      <!-- id="uploadFolderForm" action="#" method="post" enctype="multipart/form-data" -->
      <VForm @submit.prevent="folderUploadModal">
        <VCardTitle class="d-flex justify-space-between text-h5">
          <!-- {{  `Upload Folder to ${state.full_path}` }} -->
          Upload Folder to -path-
          <VBtn icon="mdi-close" title="Close" variant="text" data-dismiss="modal" @click="onCancel" />
          <!-- <span aria-hidden="true">&times;</span> -->
        </VCardTitle>
        <VCardText>
          <!--  name="object_folder" id="object_folder" -->
          <VFileInput v-model="uploadFolder" :rules="requiredRule" clearable multiple webkitdirectory label="Upload Folder" />
          <!-- webkitdirectory mozdirectory on file input above -->
          <!-- <p class="error-message" id="object_folder_message">This field is required</p> -->

        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <!--  data-dismiss="modal"  -->
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="onCancel" >Cancel</VBtn>
          <!-- id="submit-folder" -->
          <VBtn prepend-icon="mdi-folder-upload" type=submit variant="flat" color="primary" size="large" class="px-4" >Upload to S3</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  <!-- </div>
</div> -->
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import { convertObjectToMultiFormData } from '../helpers/axiosHelper';
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {object} Props.resource - The selected S3 Bucket resource
 */
/** @type {Props} */
const props = defineProps({
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
  }
});

const emit = defineEmits(["update:closeDialog"]);
const uploadFolder = ref()
const uploadFolderForm = ref({
  bucket_name: props.resource.name,
  folder_path: props.state.full_path
}) 
const folderDialog = ref(false)
const requiredRule = [(value) => !!value || 'This field is required']

const onCancel = () => {
  emit("update:closeDialog");
  folderDialog.value = false
}

async function folderUploadModal() {
  try {
    const  formData = convertObjectToMultiFormData(uploadFolderForm.value, uploadFolder.value, 'folder')
    console.log('Lets submit! FolderUpload go!', formData)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-upload-new-folder/${props.resource.id}/`,  formData)
    console.log('folderUploadModal', {response})
    emit("update:closeDialog", props.resource);
    folderDialog.value = false
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}
</script>
<style scoped></style>