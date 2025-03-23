<template>
  <!-- Conteneur principal de toutes les cartes -->
  <div class="card-container">

    <!-- Composant de chargement visible pendant le fetch -->
    <LoadingSpinner v-bind:visible="loading" />

    <!-- Boucle sur chaque carte issue de l'API -->
    <GenericCard
        v-for="card in cardsNapoleon"
        v-bind:key="card.id"
        v-bind:title="card.title"
        v-bind:year="card.year"
        v-bind:image="card.image"
        v-on:action="handleAction"
    >
      <!-- Slot principal de contenu -->
      <template v-slot:default>
        <!-- Description dynamique avec scroll si showSituation est actif -->
        <div class="card-description" v-bind:class="{ scrollable: card.showSituation }">

          <!-- Affiche les sections tronquées ou complètes selon l'état -->
          <div v-for="section in getTruncatedSections(card)" v-bind:key="section.title">
            <h4>{{ section.title }}</h4>
            <p>{{ section.content }}</p>
          </div>

          <!-- Affiche la "Situation" uniquement si showSituation est true -->
          <h4 v-if="card.showSituation">Situation</h4>
          <p v-if="card.showSituation">{{ card.situation }}</p>
        </div>
      </template>

      <!-- Slot pour les actions personnalisées -->
      <template v-slot:actions>
        <!-- Bouton pour afficher ou masquer la situation -->
        <button v-on:click="toggleSituation(card)">
          <i v-bind:class="card.showSituation ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
        </button>
      </template>
    </GenericCard>
  </div>
</template>

<script setup>
// Importations des outils Vue
import { ref, onMounted } from 'vue';

// Composants utilisés
import GenericCard from '@/components/GenericCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

// Import des icônes Material Design (pour les yeux)
import '@mdi/font/css/materialdesignicons.min.css';

// État local contenant les cartes de l'API
const cardsNapoleon = ref([]);

// État de chargement (pour afficher le spinner)
const loading = ref(true);

// Hook monté pour lancer la récupération des données au chargement du composant
onMounted(fetchCards);

// Appelle l'API pour récupérer les cartes (batailles fictives)
async function fetchCards() {
  try {
    const response = await fetch('http://localhost:5000/bataille');
    const data = await response.json();

    // Formate les données reçues pour les rendre compatibles avec GenericCard
    cardsNapoleon.value = data.map((item) => ({
      id: item.id,
      title: item.nom,
      year: item.annee,
      image: `data:image/jpeg;base64,${item.image}`,
      lieu: item.lieu,
      forces: item.forces,
      pertes: item.pertes,
      situation: item.situation,
      showSituation: false, // état local pour l'affichage de la situation
    }));
  } catch (err) {
    console.error('Erreur de chargement :', err);
  } finally {
    loading.value = false; // fin du chargement
  }
}

// Récupération de l'id d'une card
function handleActionNapoleon(id) {
  alert(`Action déclenchée pour la carte ID : ${id}`);
}

// Affiche ou masque la section "situation" (et ferme les autres cartes)
function toggleSituation(card) {
  cardsNapoleon.value.forEach((c) => {
    if (c.id !== card.id) c.showSituation = false; // désactive les autres
  });
  card.showSituation = !card.showSituation; // toggle la carte actuelle
}

// Fonction qui retourne les sections à afficher, tronquées ou non
function getTruncatedSections(card) {
  const sections = [
    { title: 'Date et lieu', content: card.lieu || '' },
    { title: 'Forces en présence', content: card.forces || '' },
    { title: 'Pertes', content: card.pertes || '' },
  ];

  // Si la situation est visible, on retourne tout
  if (card.showSituation) return sections;

  // Sinon, on tronque à 300 caractères cumulés
  let totalLength = 0;
  const truncatedSections = [];

  for (const section of sections) {
    const remaining = 300 - totalLength;
    if (remaining <= 0) break;

    const content = section.content.slice(0, remaining);
    totalLength += content.length;
    truncatedSections.push({
      title: section.title,
      content: content + (content.length < section.content.length ? '...' : ''),
    });
  }

  return truncatedSections;
}

// Gestion d'un événement d'action (depuis GenericCard)
function handleAction(payload) {
  console.log('Action principale :', payload);
}
</script>

<style scoped>
/* Conteneur principal */
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
}

/* Description textuelle des cartes */
.card-description {
  font-size: 1rem; /* 16px */
  font-family: Arial, sans-serif;
  line-height: 1.6;
  text-align: justify;
}

/* Titres dans la description (sections) */
.card-description h4 {
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
  color: #333;
}

/* Paragraphes de texte dans la description */
.card-description p {
  margin-bottom: 1rem;
  color: #555;
}

/* Classe appliquée quand showSituation est actif : permet le scroll */
.scrollable {
  max-height: 420px; /* limite la hauteur visible */
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin; /* Firefox */
}

/* Scrollbar stylisée pour Webkit (Chrome, Safari) */
.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 8px;
}
</style>
