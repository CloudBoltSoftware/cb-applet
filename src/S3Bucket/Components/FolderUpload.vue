<template>
  <VDialog v-model="folderDialog" width="1024" @update:model-value="(val) => !val && onCancel()">
    <template #activator="{ props: folderProps }" >
      <VBtn prepend-icon="mdi-folder-upload" v-bind="folderProps" variant="flat" color="primary" size="x-large" title="Upload New Folder" class="px-4 flex-grow-1" >Upload a Folder</VBtn>
    </template>
    <VCard class="pa-3">
      <VForm @submit.prevent="folderUploadModal"  @update:model-value="(val) => formIsValid = val">
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          <div>Upload folder to <span class="font-italic">{{path ? path : 'Root folder'}}</span></div>
          <VBtn icon="mdi-close" title="Close" variant="text" data-dismiss="modal" @click="onCancel" />
        </VCardTitle>
        <VCardText>
          <VFileInput v-model="uploadFolder" :rules="requiredRule" clearable multiple webkitdirectory label="Upload Folder" />
        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <VTooltip location="start" :text="formError" >
            <template #activator="{ props: activatorProps }">
              <VIcon v-if="formError" v-bind="activatorProps" color="error" size="large" icon="mdi-alert-circle" class="mt-1"/>
            </template>
          </VTooltip>
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="onCancel" >Cancel</VBtn>
          <VBtn :loading="isUploading" prepend-icon="mdi-folder-upload" :disabled="!formIsValid" type=submit variant="flat" color="primary" size="large" class="px-4" >Upload to S3
            <template #loader>Uploading...</template>
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import { convertObjectToMultiFormData } from '../../helpers/axiosHelper';
/**
 * @typedef {Object} resource
 * @property {String} name
 * @property {String} id
 */
/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.path - The S3 Bucket item's full path
 * @property {Object} Props.resource - The S3 Bucket resource
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  path: {
    type: String,
    default: ''
  },
  resource: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(["update:closeDialog", "update:submitted"]);
const isUploading = ref(false)
const uploadFolder = ref()
const uploadFolderForm = ref({
  bucket_name: props.resource.name,
  folder_path: props.path
})
const formIsValid = ref(false)
const formError = ref()
const folderDialog = ref(false)
const requiredRule = [(value) => value.length > 0 || 'This field is required']

const onCancel = () => {
  emit("update:closeDialog");
  folderDialog.value = false
  formError.value = ''
  uploadFolder.value = []
}

async function folderUploadModal() {
  try {
    isUploading.value = true
    const  formData = convertObjectToMultiFormData(uploadFolderForm.value, uploadFolder.value, 'folder')
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-upload-new-folder/${props.resource.id}/`,  formData)
    emit("update:submitted")
    isUploading.value = false
    console.log('Upload Folder ', {response})
    emit("update:closeDialog");
    folderDialog.value = false
    uploadFolder.value = []
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    console.error(error);
    formError.value = `(${error.code}) ${error.name}: ${error.message}`
    formIsValid.value = false
    isUploading.value = false
  }
}
</script>
<style scoped></style>
