<template>
  <VSheet class="px-3 py-4" rounded>
    <div class="d-inline-flex w-100">
      <div class="w-25 d-inline-flex mt-1">
        <VAvatar :image="avatarUrl" />
        <span class="ml-3 text-h5">S3 Bucket Manager</span>
      </div>
      <VSelect 
        label="Buckets:" 
        :items="buckets"
        item-title="name"
        item-value="id"
        return-object
        class="w-75"
        placeholder="Select S3 Bucket"
        :hide-details="true"
        @update:modelValue="getResourceSelection"
      />
    </div>
    <BucketDisplay 
      v-if="bucketDetails"
      :api="api" 
      :location="bucketDetails?.location"
      :resource="bucketDetails?.resource"
      :state="bucketDetails?.state"
      :update-resource-selection="updateResourceSelection"
      :refresh-resource="refreshResource" />
  </VSheet>
</template>

<script setup>
import { onMounted, ref } from "vue";
import avatarUrl from '../assets/s3_bucket_200×199.png';
import BucketDisplay from './BucketDisplay.vue';
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
});

const buckets = ref()
const bucketDetails = ref()

//  TODO Handle CSRF Token
let token = sessionStorage.getItem("csrfToken");
if (token) {
  console.log({token})
  // eslint-disable-next-line vue/no-mutating-props
  props.api.base.instance.defaults.headers.common['X-CSRFTOKEN'] = token
}

const refreshResource = async (resource = bucketDetails.value.resource) => {
  setTimeout(getResourceSelection(resource), 4000)
}

const getResourceSelection = async (resource) => {
  console.log('getResourceSelection', {resource})
  try {
    const response = await props.api.base.instance.get(`http://localhost:8001/ajax/s3_browser_info/${resource.id}/`)
    bucketDetails.value = response.data
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const getBuckets = async () => {
  try {
    const response = await props.api.base.instance.get('http://localhost:8001/ajax/s3-list-buckets/')
    buckets.value = response.data.bucket_info
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const updateResourceSelection = async (newResource) => {
  console.log('updateResourceSelection', {newResource})
  bucketDetails.value = newResource
}

onMounted(getBuckets)
</script>
<style scoped></style>
