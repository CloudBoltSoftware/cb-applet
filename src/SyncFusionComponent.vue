<template>
  <h2>Syncfusion Data Grid instance inside a CbApplet</h2>
  <EGrid
    :data-source="data"
    :allow-paging="true"
    :allow-sorting="true"
    :page-settings="pageSettings"
  >
    <EColumns>
      <EColumn field="id" header-text="Order ID" width="90"></EColumn>
      <EColumn field="name" header-text="Order Name" width="120"></EColumn>
      <EColumn field="status" header-text="Order Status" width="120"></EColumn>
    </EColumns>
  </EGrid>
</template>

<script setup>
import {
  ColumnDirective as EColumn,
  ColumnsDirective as EColumns,
  GridComponent as EGrid,
  Page,
  Sort,
} from "@syncfusion/ej2-vue-grids";
import { onBeforeMount, provide, ref } from "vue";

// Define props that this component will receive.
const props = defineProps({ api: { type: Object, required: true } });

// Add pagination and sorting to the grid through the provide function
provide("grid", [Page, Sort]);

// Define some data structures for this component
const pageSettings = ref({ pageSize: 5 });
const data = ref([]);

// Fetch data from the API
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

<style scoped></style>
