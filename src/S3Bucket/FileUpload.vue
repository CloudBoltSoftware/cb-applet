<template>
  <VDialog v-model="fileDialog" width="1024" @update:model-value="(val) => !val && onCancel()" >
    <template #activator="{ props: fileProps }" >
      <VBtn prepend-icon="mdi-file-upload" v-bind="fileProps" variant="flat" color="primary" size="x-large" title="Upload New File" class="px-4 flex-grow-1" >Upload a File</VBtn>
    </template>
    <VCard class="py-3">
      <VForm @submit.prevent="fileUploadModal" @update:model-value="(val) => formIsValid = val">
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          <div>Upload File to <span class="font-italic">{{state.full_path ? state.full_path : 'Root folder'}}</span></div>
          <VBtn icon="mdi-close" title="Close" data-dismiss="modal" variant="text" @click="onCancel" />
        </VCardTitle>
        <VCardText>
          <VFileInput v-model="uploadFile" :rules="requiredRule" clearable label="Upload File" />
        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <VTooltip location="start" :text="formError" >
            <template #activator="{ props: activatorProps }">
              <VIcon v-if="formError" v-bind="activatorProps" color="error" size="large" icon="mdi-alert-circle" class="mt-1"/>
            </template>
          </VTooltip>
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="onCancel" >Cancel</VBtn>
          <VBtn prepend-icon="mdi-file-upload" :disabled="!formIsValid" variant="flat" color="primary" size="large" class="px-4" type=submit >Upload to S3</VBtn>
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
const uploadFile = ref([])
const uploadFileForm = ref({
  bucket_name: props.resource.name,
  path: props.state.full_path
}) 
const formIsValid = ref(false)
const formError = ref()
const fileDialog = ref(false)
const requiredRule = [(value) => value.length > 0 || 'This field is required']

const onCancel = () => {
  emit("update:closeDialog");
  fileDialog.value = false
  formError.value = ''
  uploadFile.value = []
}

async function fileUploadModal() {
  try {
    const  formData = convertObjectToMultiFormData(uploadFileForm.value, uploadFile.value, 'file')
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-upload-new-object/${props.resource.id}/`,  formData)
    emit("update:submitted")
    console.log('Upload File ', {response})
    emit("update:closeDialog");
    fileDialog.value = false
    uploadFile.value = []
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    console.error(error);
    formError.value = `(${error.code}) ${error.name}: ${error.message}`
    formIsValid.value = false
  }
}
</script>
<style scoped></style>