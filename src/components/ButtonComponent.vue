<template>
  <div>
    <v-btn
        :class="detailed ? 'button-expanded' : 'button-collapsed'"
        @click="toggleDetail"
    >
      {{ detailed ? 'Réduire' : 'Agrandir' }}
    </v-btn>
    <v-expand-transition>
      <div v-if="showDescription" :style="descriptionStyle" class="description-container">
        <div v-if="detailed" class="detailed-text">
          <div>
            <strong>Date :</strong>
            <p>{{ description.date }}</p>
          </div>
          <div>
            <strong>Lieu :</strong>
            <p>{{ description.lieu }}</p>
          </div>
          <div>
            <strong>Forces en présence :</strong>
            <p>{{ description.forces }}</p>
          </div>
          <div>
            <strong>Pertes :</strong>
            <p>{{ description.pertes }}</p>
          </div>
          <div>
            <strong>Situation Générale :</strong>
            <p>{{ description.situation }}</p>
          </div>
        </div>
        <div v-else v-html="truncatedHtmlDescription"></div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  description: {
    forces: string,
    pertes: string,
    date: string,
    lieu: string,
    situation: string
  },
  detailed: boolean,
  updateDetailedState: (newState: boolean) => void
}>();

const toggleDetail = () => {
  props.updateDetailedState(!props.detailed);
};

const showDescription = ref(true);

// Concaténer toutes les sections de la description avec les titres inclus
const fullDescription = computed(() => {
  return `Date : ${props.description.date}\nLieu : ${props.description.lieu}\nForces en présence : ${props.description.forces}\nPertes : ${props.description.pertes}\nSituation Générale : ${props.description.situation}`;
});

// Tronquer le texte complet pour le mode non détaillé avec HTML pour les titres en gras
const truncatedHtmlDescription = computed(() => {
  const maxLength = 300; // Limite pour le mode non détaillé
  const description = `
    <strong>Date :</strong> ${props.description.date}<br>
    <strong>Lieu :</strong> ${props.description.lieu}<br>
    <strong>Forces en présence :</strong> ${props.description.forces}<br>
    <strong>Pertes :</strong> ${props.description.pertes}<br>
    <strong>Situation Générale :</strong> ${props.description.situation}
  `;
  return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
});

// Style dynamique pour la description
const descriptionStyle = computed(() => {
  return {
    maxHeight: props.detailed ? '300px' : 'auto', // Limite la hauteur pour le mode détaillé seulement
    overflowY: props.detailed ? 'auto' : 'hidden', // Activer l'ascenseur seulement en mode détaillé
    overflowX: 'hidden',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    margin: '0',
    position: 'relative'
  };
});
</script>

<style scoped>
.description-container {
  box-sizing: border-box;
  margin: 0;
}

.v-btn {
  transition: background-color 0.3s, color 0.3s, border 0.3s;
}

.button-expanded {
  background-color: #000000;
  color: white;
  border: 1px solid #5a6268;
}

.button-expanded:hover {
  background-color: #5a6268;
  border-color: #4e555b;
}

.button-collapsed {
  background-color: #000;
  color: white;
  border: 1px solid #5a6268;
}

.button-collapsed:hover {
  background-color: #5a6268;
  border-color: #4e555b;
}

strong {
  font-weight: bold;
}

p {
  white-space: pre-line;
  font-family: Arial, sans-serif;
  font-size: 12px;
  margin: 0;
}

.detailed-text {
  white-space: pre-wrap;
}
</style>
























