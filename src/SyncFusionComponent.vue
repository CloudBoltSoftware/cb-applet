<template>
  <h2>Syncfusion Data Grid instance inside a CbApplet</h2>
  <EGrid :data-source="data">
    <EColumns>
      <EColumn field="id" header-text="Order ID" width="90" />
      <EColumn field="name" header-text="Order Name" width="120" />
      <EColumn field="status" header-text="Order Status" width="120" />
    </EColumns>
  </EGrid>
</template>

<script setup>
import {
  ColumnDirective as EColumn,
  ColumnsDirective as EColumns,
  GridComponent as EGrid,
} from "@syncfusion/ej2-vue-grids";
import { onBeforeMount, ref } from "vue";

const props = defineProps({ api: { type: Object, required: true } });

const data = ref([]);

const fetchData = async () => {
  try {
    const response = await props.api.v3.cmp.orders.list();
    console.log(response.items);
    data.value = response.items;
  } catch (error) {
    console.error(error);
  }
};
onBeforeMount(fetchData);
</script>

<style></style>
