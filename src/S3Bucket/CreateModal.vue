<template>
  <VDialog v-model="createDialog" width="1024" @update:model-value="(val) => !val && onCancel()">
    <template #activator="{ props: createProps }" >
      <VBtn v-bind="createProps" icon="mdi-folder-plus" title="Add New Folder" size="x-large"/>
    </template>
    <VCard class="py-3">
      <VForm @submit.prevent="submitCreateModal" @update:model-value="(val) => formIsValid = val">
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          <div>Create Folder at <span class="font-italic">{{ state.full_path ? state.full_path : 'Root folder'}}</span></div>
          <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="onCancel"/>
        </VCardTitle>
        <VCardText>
          <VCol cols="12" >
            <VTextField 
              v-model="newFolder"
              label="Folder Name"
              placeholder="Enter folder name"
              prepend-icon="mdi-folder-plus"
              type="text"
              :rules="requiredRule"
              required
            ></VTextField>
            <span class="pl-8">
              <VBtn prepend-icon="mdi-information" href="https://docs.aws.amazon.com/console/s3/object-keys" target="_blank" variant="text" class="text-capitalize font-weight-regular text-body-1">See rules for naming</VBtn>
            </span> 
          </VCol>
        </VCardText>
        <VCardAction class="d-flex justify-end px-3">
          <VTooltip location="start" :text="formError" >
            <template #activator="{ props: activatorProps }">
              <VIcon v-if="formError" v-bind="activatorProps" color="error" size="large" icon="mdi-alert-circle" class="mt-1"/>
            </template>
          </VTooltip>
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="onCancel">Cancel</VBtn>
          <VBtn :loading="isSubmitting"  :disabled="!formIsValid"  prepend-icon="mdi-folder-plus" type=submit variant="flat" color="primary" size="large" class="px-4">Create
            <template #loader>Submitting…</template>
          </VBtn>
        </VCardAction>
      </VForm>
    </VCard>
  </VDialog>
</template>
    
<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
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

const emit = defineEmits(["update:handleResourceSelection"]);
const newFolder = ref('')
const createFolderForm = computed(() => ({
  folder_name: newFolder.value,
  path: props.state.full_path,
  bucket_name: props.resource.name
  })
) 

const formIsValid = ref(false)
const formError = ref()
const isSubmitting = ref(false)
const createDialog = ref(false)
const requiredRule = [
  (value) => !!value || 'This field is required',
  (value) => !value.includes('/') || "Folder names can't contain '/''"]

const onCancel = () => {
  createDialog.value = false
  newFolder.value = ''
  formError.value = ''
}

async function submitCreateModal() {
  try {
    const formData = convertObjectToFormData(createFolderForm.value)
    isSubmitting.value = true
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-create-folder/${props.resource.id}/`,  formData)
    console.log("Create New Folder ", {response})
    isSubmitting.value = false
    createDialog.value = false
    newFolder.value = ''
    emit("update:handleResourceSelection");
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    console.error(error);
    formError.value = `(${error.code}) ${error.name}: ${error.message}`
    formIsValid.value = false
    isSubmitting.value = false
  }
}
</script>
<style scoped></style>
