<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from '@/components/Card.vue';

const data = ref(null); // Liste des batailles
const expandedItems = ref([]);

// Chargement des données au montage
onMounted(async () => {
  const res = await fetch('http://localhost:5000/bataille');
  data.value = await res.json();
});

// Filtrage des batailles avec victoire
const dataVictoire = computed(() => {
  return data.value ? data.value.filter(item => item.victoire) : [];
});

// Gérer l'affichage des descriptions
const toggleDescription = (itemId) => {
  const index = expandedItems.value.indexOf(itemId);
  if (index === -1) {
    expandedItems.value.splice(0, expandedItems.value.length);
    expandedItems.value.push(itemId);
  } else {
    expandedItems.value.splice(index, 1);
  }
};

// Vérifier si un élément est expandu
const isExpanded = (itemId) => {
  return expandedItems.value.includes(itemId);
};

// Supprimer une bataille de la liste
function handleSuppression(idSupprime) {
  data.value = data.value.filter(b => b.id !== idSupprime); // Modifier data.value
}
</script>

<template>
  <div class="deck">
    <Card
        class="card"
        v-for="item in dataVictoire"
        :key="item.id"
        :item="item"
        :is-expanded="isExpanded"
        :toggle-description="toggleDescription"
        @batailleSupprimee="handleSuppression"
    />
  </div>

</template>

<style>
.card {
  margin-bottom: 1%;
}
.deck {
  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 5%;
}
body {
  background-color: #4A5568;
}
</style>
