<template>
  <VDialog v-model="deleteDialog" width="1024">
    <template #activator="{ props: deleteProps }" >
      <VBtn v-bind="deleteProps" :disabled="isDisabled" icon="mdi-delete" title="Delete" size="x-large"/>
    </template>
    <VForm @submit.prevent="deleteModal">
      <VCard class="pa-3" density="compact">
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          <span>Delete Confirmation</span>
          <VBtn icon="mdi-close" title="Close this dialog" data-dismiss="modal" variant="text" @click="deleteDialog = false"/>
        </VCardTitle>
        <VCardText class="py-0 ml-3">
          <p class="text-h6">
            <VIcon
              color="error"
              icon="mdi-alert"
              class="text-h5"
            />
            Are you sure you want to delete?</p>
          <p class="text-body-1">Note: If you have selected a folder, all objects in that folder will also be deleted.</p>    
        </VCardText>
        <VCardAction class="d-flex justify-end px-3">
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn :loading="isDeleting" :width="isDeleting ? '150' : '100'" prepend-icon="mdi-delete" variant="flat" color="primary" size="large" class="px-4" type=submit >Delete
            <template #loader>Deleting...</template>
          </VBtn>
        </VCardAction>
      </VCard>
    </VForm>
  </VDialog>
</template>
    
<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../../helpers/axiosHelper';

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.resourceId - The S3 Bucket resource id
 * @property {Array} Props.selectedItems - The selected S3 Bucket items
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  resourceId: {
    type: String,
    required: true,
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  state: {
    type: Object,
    default: () => {},
  }
});

const emit = defineEmits(["update:refreshResource"]);
const deleteDialog = ref(false)
const isDeleting = ref(false)
const isDisabled = computed(() => {
  if (props.selectedItems.length === 0 || props.selectedItems.find((entry) => entry.is_delete_marker)) {
    return true
  }
return false
})

const filePath = computed(() => {
  const allFiles = []
  props.selectedItems.forEach((item) => {
    allFiles.push({
      file_path: item.url,
      object_type: item.item_type
    })
  })

  return allFiles
})
const deleteForm = computed(() => ({
  all_files_path: JSON.stringify(filePath.value)
}))

async function deleteModal() {
  try {
    isDeleting.value = true
    const formData = convertObjectToFormData(deleteForm.value)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-delete-file/${props.resourceId}/`,  formData)
    console.log("Delete Files/Folders ", {response})
    isDeleting.value = false
    deleteDialog.value = false
    emit("update:refreshResource");
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    isDeleting.value = false
    deleteDialog.value = false
  }
}
</script>
<style scoped></style>
