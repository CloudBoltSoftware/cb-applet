<template>
  <VDialog v-model="folderDialog" width="1024" @update:model-value="(val) => !val && onCancel()">>
    <template #activator="{ props: folderProps }" >
      <VBtn v-bind="folderProps" prepend-icon="mdi-folder-upload" variant="flat" color="primary" size="x-large" title="Upload New Folder" class="px-4 flex-grow-1" >Upload a Folder</VBtn>
    </template>
    <VCard class="py-3">
      <VForm @submit.prevent="folderUploadModal"  @update:model-value="(val) => formIsValid = val">
        <VCardTitle class="d-flex justify-space-between text-h5">
          <div>Upload Folder to <span class="font-italic">{{state.full_path ? state.full_path : 'Root folder'}}</span></div>
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
          <VBtn prepend-icon="mdi-folder-upload" :disabled="!formIsValid" type=submit variant="flat" color="primary" size="large" class="px-4" >Upload to S3</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
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

const emit = defineEmits(["update:closeDialog", "update:submitted"]);
const uploadFolder = ref()
const uploadFolderForm = ref({
  bucket_name: props.resource.name,
  folder_path: props.state.full_path
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
    const  formData = convertObjectToMultiFormData(uploadFolderForm.value, uploadFolder.value, 'folder')
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-upload-new-folder/${props.resource.id}/`,  formData)
    emit("update:submitted")
    console.log('Upload Folder ', {response})
    emit("update:closeDialog");
    folderDialog.value = false
    uploadFolder.value = []
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    console.error(error);
    formError.value = `(${error.code}) ${error.name}: ${error.message}`
    formIsValid.value = false
  }
}
</script>
<style scoped></style>