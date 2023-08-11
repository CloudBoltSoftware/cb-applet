<template>
  <VProgressCircular v-if="isLoading" indeterminate class="ma-3" />
  <div v-else class="d-flex flex-column">
    <BucketBreadcrumbs 
      :state="state"
      :resource="resource"
      :fetch-selection="fetchSelection"
      class="justify-start"
      />
    <div class="d-flex justify-space-between">
      <VBtnGroup>
        <DownloadButton :api="api" :resource="resource" :location="location" :selected-items="selectedItems" />
        <DeleteModal :api="api" :resource="resource" :selected-items="selectedItems" @update:handleResourceSelection="handleResourceSelection" />
        <UploadModal :api="api" :resource="resource" :state="state" :handle-resource-selection="handleResourceSelection"/>
        <CreateModal :api="api" :resource="resource" :state="state" @update:handleResourceSelection="handleResourceSelection"/>
        <VBtn v-if="flattenView" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="fetchFlattenedView"/>
        <VBtn v-else icon="mdi-view-headline"  title="Toggle List View" size="x-large" @click="fetchFlattenedView" />
      </VBtnGroup>
      <VTooltip location="top" text="Toggle Version Mode" >
        <template #activator="{ props: activatorProps }">
          <VSwitch v-model="isVersionMode" v-bind="activatorProps" inset color="primary" label="Version" density="compact" hide-details class="flex-grow-0 mr-2"/>
        </template>
      </VTooltip>
    </div>

    <!-- <div id="s3-files-table"> -->
    <VDataTable
      :headers="isVersionMode ? versionHeaders : headers"
      :items="dataTableItems"
      :item-value="item => item"
      show-select
      @update:model-value="(val) => selectedItems = val"
      >
      <template #[`item.name`]="{ item }">
        <td class="d-inline-flex">
          <VIcon 
            v-if="item.raw.nested_version"
            icon="mdi-arrow-up-left-bold"
            class="ml-4"
            />
          <VIcon
            v-else
            :icon="item.raw.is_file ? 'mdi-file' :  'mdi-folder' "
            color="blue-darken-3"
            class="align-self-center"
          />
          <BucketButton 
          v-if="!item.raw.is_file"
          :id="resource.id"
          :item="item.raw"
          :api="api"
          :fetch-selection="fetchSelection"
          />
          <div v-else class="ml-2">{{ item.raw.name }}</div>
          <div> </div>
        </td>
      </template> 
      <template #[`item.last_modified`]="{ item }">
        {{ item.raw.is_file ? `${new Date(item.raw.last_modified).toDateString()}  ${ new Date(item.raw.last_modified).toLocaleTimeString('en-US')}` : '' }}
      </template> 
      <template #[`item.actions`]="{ item }">
        <td v-if="item.raw.is_file" class="d-inline-flex">
          <VBtnGroup>
            <VBtn icon="mdi-file-download" title="Download" @click="downloadFile(item.raw.download_url)"/>
            <RenameModal :api="api" :item="item.raw" :resource="resource" :state="state" @update:handleResourceSelection="handleResourceSelection"/>
            <OverviewModal :api="api" :source-item="item.raw" :location="location" :resource="resource" :headers="versionHeaders" />
            <VBtn v-if="isVersionMode" icon="mdi-file-undo" title="Restore File" />
          </VBtnGroup>
        </td>
      </template> 
    </VDataTable>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
import BucketBreadcrumbs from "./BucketBreadcrumbs.vue";
import BucketButton from "./BucketButton.vue";
import CreateModal from "./CreateModal.vue";
import DeleteModal from "./DeleteModal.vue";
import DownloadButton from "./DownloadButton.vue";
import OverviewModal from "./OverviewModal.vue";
import RenameModal from "./RenameModal.vue";
import UploadModal from "./UploadModal.vue";
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.location - The selected S3 Bucket location
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {function} Props.updateResourceSelection - Function to replace the selected S3 Bucket resource
 * @property {function} Props.handleResourceSelection - Function to fetch the selected S3 Bucket
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
  handleResourceSelection: {
    type: Function,
    default: () => {},
  },
});

const isVersionMode = ref(false)
// TODO - Better check Version mode
// const hasVersionMode = computed(() => props?.state?.dir_list[0].versions.length > 0)
const isLoading = ref(false)
const selectedItems = ref()
const flattenView = ref(false)
const flattenForm = computed(() => ({
  path: '',
  flat: flattenView.value ? 'True' : 'False'
}))
const dataTableItems = computed(() => {
  let list = props?.state?.dir_list
  if (isVersionMode.value) {
    list = flattenNestedItems(list)
  } else {
    list = list.filter((item) => !item.is_file ? item : item.is_delete_marker ? false : item )
  }
  console.log({list})
  return list
})

const flattenNestedItems = (array) => {
  console.log('flattenNested')
  const itemArray = []
  array.forEach((item) => {
    if (!item.is_file) {
      itemArray.push(item)
    } else {
      itemArray.push(item)
      item?.versions.forEach((versionItem) => {
        itemArray.push({
          name: '',
          is_file: item.is_file,
          item_type: item.item_type,
          ...versionItem,
          nested_version: true,
        })
      })
    }
  })
  console.log({itemArray})
  return itemArray
}


const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Type', align: 'end', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'end', key: 'size' },
  { title: 'Storage Class', align: 'end', key: 'storage_class' },
  { title: 'Actions', align: 'center', key: 'actions' },
]
const versionHeaders = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Version ID', align: 'start', key: 'version_id' },
  { title: 'Type', align: 'end', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'end', key: 'size' },
  { title: 'Storage Class', align: 'end', key: 'storage_class' },
  { title: 'Actions', align: 'center', key: 'actions' },
]

const fetchFlattenedView = async () => {
  flattenView.value = !flattenView.value
  try {
    const formData = convertObjectToFormData(flattenForm.value)
    const flattenResponse = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, formData)
    props.updateResourceSelection(flattenResponse.data);
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

const downloadFile = (url) => {
  // TODO Better Decoding needed
  const adjustedUrl = url.replace(/&amp;/g,'&')
  window.open(adjustedUrl, '_blank')
}
</script>
<style scoped></style>
