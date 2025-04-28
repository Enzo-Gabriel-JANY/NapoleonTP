<!-- src/components/Card.vue -->
<script setup>
import HideShowDescButton from "@/components/HideShowDescButton.vue"
const props = defineProps({
  item: Object,
  isExpanded: Function,
  toggleDescription: Function
})

function cutDesc(description) {
  let counter = 0;
  let res = { dateLieu: "", forcePresentes: "", pertes: "", situationGenerale: "" };
  const values = Object.values(description);

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (counter + val.length > 300) {
      res[Object.keys(description)[i]] = val.substring(0, 300 - counter).concat(" \n...");
      return res;
    }
    res[Object.keys(description)[i]] = val;
    counter += val.length;
  }

  return res;
}

const getDesc = (item) => {
  return props.isExpanded(item.id) ? item.description : cutDesc(item.description)
}
</script>

<template>
  <div class="card">
    <div class="head">
      <h2>{{ item.nom }} - {{ item.date.split(' ')[2] }}</h2>
      <img :src="item.img" />
    </div>
    <div class="main">
      <h4 v-if="getDesc(item).dateLieu">Dates et lieux</h4>
      <p>{{ getDesc(item).dateLieu }}</p>

      <h4 v-if="getDesc(item).forcePresentes">Forces en présence</h4>
      <p>{{ getDesc(item).forcePresentes }}</p>

      <h4 v-if="getDesc(item).pertes">Pertes</h4>
      <p>{{ getDesc(item).pertes }}</p>

      <h4 v-if="getDesc(item).situationGenerale">Situation générale</h4>
      <p>{{ getDesc(item).situationGenerale }}</p>
    </div>
    <div class="action">
      <HideShowDescButton :bataille-id="item.id" @toggle="toggleDescription" :is-expanded="isExpanded(item.id)" />
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  width: 100%;
  background-color: darkgray;
  border-radius: 10px;
}
.head {
  width: 18%;
  align-content: center;
  justify-content: center;
  text-align: center;
  margin: 1%;
}
.main {
  width: 75%;
  background-color: lightgrey;
  margin-top: 1%;
  max-height: 275px;
  overflow-y: auto;
}
img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>