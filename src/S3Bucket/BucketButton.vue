<template>
  <VForm 
    @submit.prevent="submitSelection">
    <!-- <VTextField 
      v-model="bucketForm.name"
      name="name"
      class="d-none"
      />
    <VTextField 
      v-model="selectedPath"
      name="path"
      class="d-none"
      /> -->
    <VBtn
      variant="text"
      :title="item.name"
      type="submit"
      class="text-none"
    >{{ item.name }}</VBtn>
  </VForm>
</template>

<script setup>
import { computed, onUpdated, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The current S3 Bucket item
 * @property {string} Props.id - The current S3 Bucket id
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  item: {
    type: Object,
    default: () => {},
  },
  id: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["update:updateResourceSelection"]);

const selectedPath = ref('')
const selectedName = ref('')
const bucketForm = computed(() => ({
  path: selectedPath.value,  // Encoding path early leads to double encoding '/'
  name: encodeURIComponent(selectedName.value)
  })
)
onUpdated(() => {
  selectedPath.value = encodeURIComponent(props.item.url)
  selectedName.value = encodeURIComponent(props.item.name)

});

const submitSelection = async () => {
  try {
    const formData = convertObjectToFormData(bucketForm.value)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.id}/`, formData)
    // TODO path=2022-03-14T235035Z%2F&name=2022-03-14T235035Z
    // TODO path=2022-03-14T235035Z%2F9.4.6.1%2F&name=9.4.6.1
    emit("update:updateResourceSelection", response.data);
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

</script>
<style scoped></style>