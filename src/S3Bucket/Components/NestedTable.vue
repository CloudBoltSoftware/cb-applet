<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <VDataTable
    v-model:expanded="expanded"
    :headers="isVersionMode ? versionHeaders : headers"
    :items="dataTableItems"
    :item-value="item => item"
    :loading=isLoading
    show-select
    :show-expand="isVersionMode ? true : false"
    @update:model-value="(val) => emit('update:items', val)"
    >
    <template #[`item.name`]="{ item }">
      <td class="d-inline-flex">
        <VIcon 
          v-if="item.raw.nested_version"
          icon="mdi-arrow-up-left"
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
        :item="item.raw"
        :fetch-selection="fetchSelection"
        />
        <div v-else class="ml-4">{{ item.raw.name }}</div>
      </td>
    </template> 
    <template #[`item.last_modified`]="{ item }">
      {{ item.raw.is_file ? parseDate(item.raw) : '' }}
    </template> 
    <template #[`item.actions`]="{ item }">
      <td v-if="item.raw.is_file" class="d-inline-flex">
        <VBtnGroup>
          <VBtn v-if="isVersionMode" icon="mdi-file-download" title="Download" :disabled="item.raw.is_delete_marker" @click="downloadFile(item.raw.download_url)"/>
          <RestoreButton v-if="isVersionMode" :resource-id="resource.id" :api="api" :item="item.raw" @update:refreshResource="refreshResource"/>
          <RenameModal :api="api" :name="item.raw.name" :resource="resource" :path="state.full_path" @update:refreshResource="refreshResource"/>
          <OverviewModal :api="api" :source-item="item.raw" :location="location" :resource="resource" :refresh-resource="refreshResource"/>
        </VBtnGroup>
      </td>
    </template>
    <template #[`item.data-table-expand`]="{ item, isExpanded, toggleExpand }">
      <VIcon
        v-if="item.raw.is_file"
        :icon="isExpanded ? 'mdi-menu-down' : 'mdi-menu-up'"
        @click="toggleExpand(item)"
      />
    </template>
    <template #expanded-row="{ item }">
      <tr v-for="(entry, idx) in item.raw?.versions" :key="idx">
        <td></td>
        <td>       
          <VIcon 
            icon="mdi-arrow-up-left"
            class="ml-4 mt-n1"
            />
            <span class="mx-2">{{ entry.version_id }}</span><span class="ml-2 text-disabled">Version Id</span>
        </td>
        <td>{{ item.raw.item_type }}</td>  
        <td>{{ parseDate(entry) }}</td>
        <td>{{ entry.size }}</td>
        <td>{{ entry.storage_class }}</td>
        <td>        
          <VBtnGroup>
            <VBtn icon="mdi-file-download" title="Download" :disabled="entry.is_delete_marker"  @click="downloadFile(entry.download_url)"/>
            <RestoreButton :id="resource.id" :api="api" :item="entry" @update:refreshResource="refreshResource"/>
          </VBtnGroup>
        </td>
        <td></td>
      </tr>
    </template> 
  </VDataTable>
</template>

<script setup>
import { ref } from "vue";
import OverviewModal from "../Modals/OverviewModal.vue";
import RenameModal from "../Modals/RenameModal.vue";
import BucketButton from "./BucketButton.vue";
import RestoreButton from "./RestoreButton.vue";
/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.location - The S3 Bucket location
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {Boolean} Props.isLoading - Loading data response
 * @property {Object} Props.state - The S3 Bucket state data
 * @property {Boolean} Props.isVersionMode - Boolean if Bucket Version mode is on
 * @property {Array} Props.dataTableItems - The array of the items for the dataTable
 * @property {Array} Props.selectedItems - The array of the selected dataTable items
 * @property {Function} Props.updatedSelectedItems - Function to update the array of the selected table items
 * @property {Function} Props.updateResourceSelection - Function to replace the S3 Bucket resource
 * @property {Function} Props.refreshResource - Function to refresh the selected S3 Bucket
 * @property {Function} Props.fetchSelection - Function to fetch the selection
 */
/** @type {Props} */
defineProps({
  api: {
    type: Object,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  resource: {
    type: Object,
    default: () => {},
  },
  isVersionMode: {
    type: Boolean,
    default: false,
  },
  state: {
    type: Object,
    default: () => {},
  },
  dataTableItems: {
    type: Array,
    default: () => [],
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  fetchSelection: {
    type: Function,
    default: () => {},
  },
  updatedSelectedItems: {
    type: Function,
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
});

const expanded = ref([])
const emit = defineEmits(["update:items"]);

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
  { title: 'Type', align: 'start', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'start', key: 'size' },
  { title: 'Storage Class', align: 'start', key: 'storage_class' },
  { title: 'Actions', align: 'start', key: 'actions' },
  { title: '', align: 'center', key: 'data-table-expand', sortable: false },
]

const parseDate = (entry) => {
  // Converting from database UTC values to local string
  const modifiedDate = new Date(`${entry.last_modified} UTC`).toDateString()
  const modifiedTime = new Date(`${entry.last_modified} UTC`).toLocaleTimeString('en-US')
  
  return `${modifiedDate}  ${modifiedTime}`
}

// TODO - Re-enable once Version updates are fixed. Requires download_url
const downloadFile = (url) => {
  // TODO Better Decoding needed
  const adjustedUrl = url.replace(/&amp;/g,'&')
  window.open(adjustedUrl, '_blank')
}
</script>
<style scoped></style>

