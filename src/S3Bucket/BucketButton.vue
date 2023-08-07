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
    >{{ item.name }}</VBtn>
  </VForm>
</template>

<script setup>
import { onUpdated, ref } from "vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The current bucket item
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
  },
  updateResourceSelection: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["update:updateResourceSelection"]);

const selectedPath = ref('')
const selectedName = ref('')

onUpdated(() => {
  console.log('onUpdated', {props})
  selectedPath.value = encodeURIComponent(props.item.url)
  selectedName.value = encodeURIComponent(props.item.name)

});

const submitSelection = async (event) => {
  console.log('handleItemSelection', event)
  console.log(`path=${selectedPath.value}&name=${selectedName.value}`)
  try {
    const response2 = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.id}/`, 
      `path=${selectedPath.value}&name=${selectedName.value}`)
    console.log({response2})
    emit("update:updateResourceSelection", response2.data);

  } catch (error) {
    console.log({error})
  }
}

</script>
<style scoped></style>