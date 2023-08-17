<template>
  <div class="d-flex flex-column">
    <BucketBreadcrumbs 
      :state="state"
      :name="resource.name"
      :fetch-selection="fetchSelection"
      class="justify-start"
      />
    <div class="d-flex justify-space-between">
      <VBtnGroup>
        <DownloadButton :api="api" :resource-id="resource.id" :location="location" :selected-items="selectedItems" />
        <DeleteModal :api="api" :state="state" :resource-id="resource.id" :selected-items="selectedItems" @update:refreshResource="refreshResource" />
        <MultiFileModal v-if="dropModal" :api="api" :resource="resource" :drop-modal="dropModal" :drop-files="dropFiles" :drop-files-form="dropFilesForm" @update:submitted="refreshResource" @update:clear="() => dropModal = !dropModal"/>
        <UploadModal :api="api" :resource="resource" :path="state.full_path" :drop-files="dropFiles" :drop-files-form="dropFilesForm" :refresh-resource="refreshResource"/>
        <CreateModal :api="api" :resource="resource" :state="state" @update:refreshResource="refreshResource"/>
        <VBtn v-if="isFlat" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="fetchFlattenedView"/>
        <VBtn v-else icon="mdi-view-headline"  title="Toggle Flat List View" size="x-large" @click="fetchFlattenedView" />
      </VBtnGroup>
      <VTooltip location="top" text="Toggle Version Mode" >
        <template #activator="{ props: activatorProps }">
          <VSwitch v-if="hasVersionMode" v-model="isVersionMode" v-bind="activatorProps" inset color="primary" label="Version" density="compact" hide-details class="flex-grow-0 mr-2"/>
        </template>
      </VTooltip>
    </div>
      <VAlert v-if="dropError" closable type="warning" icon="mdi-alert-circle" text="Cannot upload Folders. Drop files only." />
      <VCard ref="dropZoneRef" flat>
        <NestedTable 
          :api="api"
          :location="location"
          :resource="resource"
          :is-loading="isLoading"
          :state="state"
          :is-version-mode="isVersionMode"
          :data-table-items="dataTableItems"
          :selected-items="selectedItems"
          :fetch-selection="fetchSelection"
          :refresh-resource="refreshResource"
          @update:items="(val) => selectedItems = val"
          />
        <VOverlay v-model="isOverDropZone" contained class="align-center justify-center text-h6 text-white">Drop Files to Upload</VOverlay>
    </VCard>
  </div>
</template>

<script setup>
import { useDropZone } from '@vueuse/core';
import { computed, onUnmounted, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
import BucketBreadcrumbs from "./Components/BucketBreadcrumbs.vue";
import DownloadButton from "./Components/DownloadButton.vue";
import NestedTable from "./Components/NestedTable.vue";
import CreateModal from "./Modals/CreateModal.vue";
import DeleteModal from "./Modals/DeleteModal.vue";
import MultiFileModal from './Modals/MultiFileModal.vue';
import UploadModal from "./Modals/UploadModal.vue";

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.location - The selected S3 Bucket location
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {Object} Props.state - The selected S3 Bucket state
 * @property {Function} Props.updateResourceSelection - Function to replace The S3 Bucket resource
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  resource: {
    type: Object,
    default: () => {},
  },
  state: {
    type: Object,
    default: () => {},
  },
  updateResourceSelection: {
    type: Function,
    default: () => {},
  },
  isFlat: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(["update:updateFlatten"]);
// TODO CMP-127 - Update when Version mode is restored
const hasVersionMode = ref(false)
const isVersionMode = ref(false)
const isLoading = ref(false)
const selectedItems = ref()
const dataTableItems = computed(() => {
  let list = props?.state?.dir_list
  if (isVersionMode.value) {
    return list
  } 
  return list.filter((item) => !item.is_file ? item : item.is_delete_marker ? false : item )
})

const currentPathForm = computed(() => {
  const currentPath = props.state.path_dirs[props.state.path_dirs.length - 1]
  if (currentPath) {
    return {
      path: currentPath.path,
      name: currentPath.name
    }
  } 
  return {
    path: '',
    name: ''
  }
})

const dropZoneRef = ref(null)
const dropError = ref()
const dropModal = ref(false)
const dropFiles = ref([])
const dropFilesForm = computed(() => ({
  bucket_name: props.resource.name,
  path: props.state.full_path
}))
const onDrop = (files) => {
  if (files) {
    dropFiles.value = files.filter(file => file.type !== '')
    dropModal.value = true
  }
  if (!files.findIndex(file => file.type === '')) {
    dropError.value = true
    clearError()
  }
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const clearError = () => setTimeout(() => dropError.value = false, 5000)

const fetchFlattenedView = async () => {
  emit("update:updateFlatten")
  // Flatten form created here to handle the props update delay from the above emit
  const flattenForm = {
    path: '',
    flat: !props.isFlat ? 'True' : 'False'
  }
  try {
    isLoading.value = true
    const formData = convertObjectToFormData(flattenForm)
    const flattenResponse = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-browser-info/${props.resource.id}/`, formData)
    props.updateResourceSelection(flattenResponse.data);
    isLoading.value = false
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const fetchSelection = async (form) => {
  try {
    const formData = convertObjectToFormData(form)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-browser-info/${props.resource.id}/`, formData)
    props.updateResourceSelection(response.data)
    dropError.value = false
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const refreshResource = async () => {
  // Time delay to give the backend time to update. Re-fetches current location
  setTimeout(fetchSelection(currentPathForm.value), 4000)
}

onUnmounted(clearTimeout(clearError))
</script>
<style scoped></style>
