<template>
  <VProgressCircular v-if="isLoading" indeterminate />
  <div v-else>
    <VBanner v-if="versionInfo && !versionInfo.status">
      <template #prepend>
        <VIcon
          color="error"
          icon="mdi-alert"
          class="text-h3"
        />
      </template>
      <VBannerText class="d-inline-flex justify-space-between pa-0">
        <div class="mr-6">
          <p class="text-h5 mb-2">Bucket <span class="font-weight-medium">{{ resource.name }}</span> doesn't have Bucket Versioning enabled</p>
          <p class="text-body-1">We recommend that you enable Bucket Versioning to help protect against unintentionally overwriting or deleting objects. 
            <VBtn append-icon="mdi-information" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html" target="_blank" variant="text" class="text-capitalize font-weight-regular text-body-1">Learn more</VBtn>
          </p>
        </div>
        <VBtn title="Enable Bucket Versioning" color="primary" variant="flat" size="large" @click="enableVersioning">Enable Bucket Versioning</VBtn>
      </VBannerText>
    </VBanner>
    <VBanner v-if="versionMessage">
      <template #prepend>
        <VIcon
          color="success"
          icon="mdi-check-circle"
          class="text-h3"
        />
      </template>
      <VBannerText class="text-h5 mt-1">
        {{ versionMessage }}
      </VBannerText>
    </VBanner>
    <VDataTable 
      :headers="versionHeaders"
      :items="sourceItem?.versions"
      :show-expand="false" >
      <template #[`item.name`]>
        {{ sourceItem.name }}
      </template>
      <template #[`item.item_type`]>
        {{ sourceItem.item_type }}
      </template>
      <template #[`item.last_modified`]="{ item }">
        {{ new Date(item.raw.last_modified).toLocaleTimeString('en-US') }}   {{ new Date(item.raw.last_modified).toDateString() }}
      </template> 
      <template #[`item.actions`]="{ item }">
        <VBtnGroup>
          <VBtn icon="mdi-file-download" title="Download" @click="() => downloadFile(item.raw.download_url)"/>
          <RestoreButton :id="resource.id" :api="api" :item="item.raw" @update:refreshResource="refreshResource"/>
        </VBtnGroup>
      </template> 
    </VDataTable>
  </div>
</template>
    
<script setup>
import { computed, onMounted, ref } from "vue";
import { convertObjectToFormData } from '../../helpers/axiosHelper';
import RestoreButton from "./RestoreButton.vue";

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {Object} Props.sourceItem - The selected S3 Bucket item
 * @property {String} Props.location - The selected S3 Bucket location
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {Function} Props.refreshResource - Function to replace The S3 Bucket resource
 */
/** @type {Props} */

const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  sourceItem: {
    type: Object,
    default: () => {}
  },
  location: {
    type: String,
    default: '',
  },
  resource: {
    type: Object,
    default: () => {},
  },
  refreshResource: {
    type: Function,
    default: () => {},
  },
});
// TODO Properly handle versioning
const isLoading = ref(false)
const versionInfo = ref()
const versionMessage = ref('')
// const versioningEnabled = ref(false)

const eTag = computed(() => props.sourceItem?.e_tag ? props.sourceItem.e_tag.replace(/&quot;/g, '"') : '')
const versionForm = computed(() => ({
  e_tag: encodeURIComponent(eTag.value),  // TODO: No use for e_tag ?
  key: encodeURIComponent(props.sourceItem.key),
  location: encodeURIComponent(props.location)
}))
const versionEnableForm = computed(() => ({
  bucket_name: encodeURIComponent(props.resource.name)
}))

const versionHeaders = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Version ID', align: 'start', key: 'version_id' },
  { title: 'Type', align: 'start', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'start', key: 'size' },
  { title: 'Storage Class', align: 'start', key: 'storage_class' },
  { title: 'Actions', align: 'start', key: 'actions' }
]

const fetchVersionInfo = async () => {
  // TODO - Backend issue
  try {
    const formData = convertObjectToFormData(versionForm.value)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-get-versions/${props.resource.id}/`, formData)
    console.log('Fetch Version Info ',{response})
    isLoading.value = false
    versionInfo.value = response.data
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }

}

const enableVersioning = async () => {
  try {
    const formData = convertObjectToFormData(versionEnableForm.value)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-enable-versioning/${props.resource.id}/`, formData)
    console.log('Enable Versioning ', {response})
    versionMessage.value = response.data.message
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

onMounted(fetchVersionInfo)
</script>
<style scoped></style>
