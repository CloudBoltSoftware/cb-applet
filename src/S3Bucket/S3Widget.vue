<template>
  <VSheet class="px-3 py-4" rounded>
    <div class="d-inline-flex w-100">
      <div class="w-25 d-inline-flex mt-1">
        <VAvatar :image="avatarUrl" />
        <span class="ml-3 text-h5">S3 Bucket Manager</span>
      </div>
      <VSelect 
        v-if="!preLoadedResource"
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
      :is-flat="isFlat"
      :location="bucketDetails?.location"
      :resource="bucketDetails?.resource"
      :state="bucketDetails?.state"
      :update-resource-selection="updateResourceSelection"
      :refresh-resource="refreshResource"
      @update:updateFlatten="() => isFlat = !isFlat" />
  </VSheet>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import avatarUrl from '../assets/Icons_Storage_S3.png';
import BucketDisplay from './BucketDisplay.vue';
/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {Object} Props.context - The applet context, on Resource Tab view contains current resource info
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  context: {
    type: Object,
    required: true,
  },
});

const buckets = ref()
const bucketDetails = ref()
const isFlat = ref()
const preLoadedResource = computed(() => buckets.value && props.context.resource && buckets.value.find((bucket) => bucket.name === props.context.resource.name))

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

const getBuckets = async () => {
  try {
    const response = await props.api.base.instance.get('http://localhost:8001/ajax/s3-list-buckets/')
    buckets.value = response.data.bucket_info
    console.log('getBuckets', buckets.value)
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const getResourceSelection = async (resource) => {
  try {
    const response = await props.api.base.instance.get(`http://localhost:8001/ajax/s3-browser-info/${resource.id}/`)
    console.log('getResourceSelection', {response})
    bucketDetails.value = response.data
    isFlat.value = response.data.state.flat
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
watch(
  () => preLoadedResource.value,
  (currentResource) => {
    getResourceSelection(currentResource)
  }
)
</script>
<style scoped></style>
