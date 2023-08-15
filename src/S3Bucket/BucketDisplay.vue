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
        <DownloadButton :api="api" :resource-id="resource.id" :selected-items="selectedItems" />
        <DeleteModal :api="api" :state="state" :resource-id="resource.id" :selected-items="selectedItems" @update:refreshResource="refreshResource" />
        <UploadModal :api="api" :resource="resource" :path="state.full_path" :refresh-resource="refreshResource"/>
        <CreateModal :api="api" :resource="resource" :state="state" @update:refreshResource="refreshResource"/>
        <VBtn v-if="isFlat" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="fetchFlattenedView"/>
        <VBtn v-else icon="mdi-view-headline"  title="Toggle List View" size="x-large" @click="fetchFlattenedView" />
      </VBtnGroup>
      <VTooltip location="top" text="Toggle Version Mode" >
        <template #activator="{ props: activatorProps }">
          <VSwitch v-model="isVersionMode" v-bind="activatorProps" inset color="primary" label="Version" density="compact" hide-details class="flex-grow-0 mr-2"/>
        </template>
      </VTooltip>
    </div>
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
      :update-resource-selection="updateResourceSelection"
      :refresh-resource="refreshResource"
      @update:items="(val) => selectedItems = val"
      />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
import BucketBreadcrumbs from "./Components/BucketBreadcrumbs.vue";
import DownloadButton from "./Components/DownloadButton.vue";
import NestedTable from "./Components/NestedTable.vue";
import CreateModal from "./Modals/CreateModal.vue";
import DeleteModal from "./Modals/DeleteModal.vue";
import UploadModal from "./Modals/UploadModal.vue";
/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.location - The selected S3 Bucket location
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {Object} Props.state - The selected S3 Bucket state
 * @property {Function} Props.updateResourceSelection - Function to replace The S3 Bucket resource
 * @property {Function} Props.refreshResource - Function to fetch the selected S3 Bucket
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
  refreshResource: {
    type: Function,
    default: () => {},
  },
  isFlat: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(["update:updateFlatten"]);
const isVersionMode = ref(false)
// TODO - Better check Version mode
// const hasVersionMode = computed(() => props?.state?.dir_list[0].versions.length > 0)
const isLoading = ref(false)
const selectedItems = ref()
const dataTableItems = computed(() => {
  let list = props?.state?.dir_list
  if (isVersionMode.value) {
    return list
  } 
  return list.filter((item) => !item.is_file ? item : item.is_delete_marker ? false : item )
})

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
    const flattenResponse = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, formData)
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
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, formData)
    props.updateResourceSelection(response.data)
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

</script>
<style scoped></style>
