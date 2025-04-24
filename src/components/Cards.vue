<script setup>
import {ref, onMounted, computed, reactive} from 'vue'

const data = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/bataille')
    if (!res.ok) throw new Error('Erreur réseau')
    data.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
})
const dataVictoire = computed(() => {
  return data.value ? data.value.filter(item => item.victoire) : []
})

function cutDesc(description) {
  let counter = 0;
  let res = { dateLieu: "", forcesPersentes: "", pertes: "", situationGenerale: "" };
  const values = Object.values(description);

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (counter + val.length > 300) {
      res[Object.keys(description)[i]] = val.substring(0, 300 - counter);
      return res;
    }
    res[Object.keys(description)[i]] = val;
    counter += val.length;
  }

  // Retourne l'objet avec les valeurs coupées (si nécessaire)
  return res;
}
</script>

<template>

<div class="deck">
  <div class="card" v-for="item in dataVictoire"  :key="item.id">
    <div class="head">
      <h2> {{ item.nom }} - {{ item.date.split(' ')[2] }}</h2>
      <img :src="item.img" />
    </div>
    <div class="main">
        <h4 v-if="cutDesc(item.description)?.dateLieu?.length !== 0">Dates et lieux</h4>
        <p> {{ cutDesc(item.description)?.dateLieu }}</p>
      <h4 v-if="cutDesc(item.description)?.forcePresentes?.length !== 0">Forces en présences</h4>
      <p>{{ cutDesc(item.description)?.forcePresentes }}</p>
      <h4 v-if="cutDesc(item.description)?.pertes?.length !== 0">Pertes</h4>
      <p>{{ cutDesc(item.description)?.pertes }}</p>
    </div>
    <div class="actions">
      <button></button>
      <button></button>
      <button></button>
    </div>

  </div>
</div>


</template>

<style scoped>

</style>