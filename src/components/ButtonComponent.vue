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
        <!-- Affichage en mode détaillé -->
        <div v-if="detailed" class="detailed-text">
          <div>
            <strong>Date :</strong>
            <p>{{ truncatedDate }}</p>
          </div>
          <div>
            <strong>Lieu :</strong>
            <p>{{ truncatedLieu }}</p>
          </div>
          <div>
            <strong>Forces en présence :</strong>
            <p>{{ truncatedForces }}</p>
          </div>
          <div>
            <strong>Pertes :</strong>
            <p>{{ truncatedPertes }}</p>
          </div>
          <div>
            <strong>Situation Générale :</strong>
            <p>{{ truncatedSituation }}</p>
          </div>
        </div>
        <!-- Affichage en mode non détaillé -->
        <div v-else v-html="truncatedHtmlDescription"></div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Définir les props
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

// Détecter la largeur de l'écran
const screenWidth = ref(window.innerWidth);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Définir les limites de caractères basées sur la largeur de l'écran
const dynamicMaxChars = computed(() => {
  if (screenWidth.value < 600) {
    return 800; // Petit écran
  } else if (screenWidth.value >= 600 && screenWidth.value < 1200) {
    return 850; // Taille moyenne
  } else {
    return 900; // Grand écran
  }
});

const maxCharsNonDetailed = 300; // Limite de caractères pour le mode non détaillé

// Fonction utilitaire pour tronquer le texte
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

// Tronquer chaque champ séparément en mode détaillé
const truncatedDate = computed(() => truncateText(props.description.date, dynamicMaxChars.value));
const truncatedLieu = computed(() => truncateText(props.description.lieu, dynamicMaxChars.value));
const truncatedForces = computed(() => truncateText(props.description.forces, dynamicMaxChars.value));
const truncatedPertes = computed(() => truncateText(props.description.pertes, dynamicMaxChars.value));
const truncatedSituation = computed(() => truncateText(props.description.situation, dynamicMaxChars.value));

// Calculer la description tronquée pour le mode non détaillé
const truncatedHtmlDescription = computed(() => {
  const maxChars = dynamicMaxChars.value;

  let fullDescription = `
    <strong>Date :</strong> ${props.description.date}<br>
    <strong>Lieu :</strong> ${props.description.lieu}<br>
    <strong>Forces en présence :</strong> ${props.description.forces}<br>
    <strong>Pertes :</strong> ${props.description.pertes}<br>
  `;

  // Tronquer si dépasse la limite de 300 caractères en mode non détaillé
  if (fullDescription.length > maxCharsNonDetailed) {
    return fullDescription.slice(0, maxCharsNonDetailed) + '...';
  }

  return fullDescription;
});

// Styles réactifs pour la description
const descriptionStyle = computed(() => {
  return {
    maxHeight: props.detailed ? '320px' : 'none', // Hauteur max fixée en pixels
    overflowY: props.detailed ? 'auto' : 'hidden', // Ascenseur uniquement en mode détaillé
    overflowX: 'hidden', // Pas d'ascenseur horizontal
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
