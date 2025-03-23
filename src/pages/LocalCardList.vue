<template>
  <div class="card-container">
    <GenericCard
        v-for="card in cards"
        :key="card.id"
        :title="card.title"
        :year="card.year"
        :image="card.image"
        @action="handleAction"
    >
      <template #default>
        <p>{{ card.description }}</p>
      </template>
      <template #actions>
        <button @click="selectCard(card)">
          {{ card.selected ? 'Désélectionner' : 'Sélectionner' }}
        </button>
      </template>
    </GenericCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GenericCard from '@/components/GenericCard.vue';

const cards = ref([
  {
    id: 1,
    title: 'Carte 1',
    year: 2024,
    image: 'https://placehold.co/300x300',
    description: 'Ceci est la première carte.',
    selected: false,
  },
  {
    id: 2,
    title: 'Carte 2',
    year: 2023,
    image: 'https://placehold.co/300x300',
    description: 'Ceci est la deuxième carte.',
    selected: false,
  },
]);

function selectCard(card) {
  card.selected = !card.selected;
  alert(`Carte ${card.id} sélectionnée : ${card.selected}`);
}

// *** GESTION DES ACTIONS PERSONNALISÉES ***
function handleAction(payload) {
  alert(`Action principale : ${payload.type}`); // Affiche une alerte avec le type d'action
}

</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
</style>
