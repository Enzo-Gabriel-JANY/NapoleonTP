<template>
  <!-- Conteneur principal pour toutes les cartes -->
  <div class="card-container">

    <!-- Exemple d'utilisation par défaut d'une GenericCard -->
    <GenericCard
        title="Carte Explicite"
        year=2020
        image="https://via.placeholder.com/1200x300"
        v-on:action="handleAction"
    >
      <template v-slot:default>
        <!-- Contenu principal de la carte -->
        <p>Cette carte est configurée avec une syntaxe explicite pour tous les slots.</p>
      </template>

      <template v-slot:actions>
        <!-- Boutons d'action spécifiques à cette carte -->
        <button v-on:click="learnVue">En savoir plus</button>
        <button v-on:click="moreInfo">Plus d'infos</button>
      </template>
    </GenericCard>

    <!-- Liste des cartes générées à partir d'un tableau local -->
    <GenericCard
        v-for="card in cards"
        :key="card.id"
        :title="'Test'"
        :year="card.year"
        :image="card.image"
        v-on:action="handleAction"
    >
      <template v-slot:default>
        <!-- Description dynamique pour chaque carte -->
        <p>{{ card.description }}</p>
      </template>

      <template v-slot:actions>
        <!-- Bouton pour sélectionner la carte -->
        <button @click="selectCard(card)">Sélectionner</button>
      </template>
    </GenericCard>

    <!-- Affichage du composant de chargement -->
    <LoadingSpinner v-bind:visible="loading" />

    <!-- Liste des cartes générées à partir des données d'un back fictif -->
    <GenericCard
        v-for="card in cardsNapoleon"
        :key="card.id"
        :title="card.title"
        :year="card.year"
        :image="card.image"
        v-on:action="handleAction"
    >
      <template v-slot:default>
        <!-- Description dynamique des cartes avec contenu conditionnel -->
        <div class="card-description" :class="{ 'scrollable': card.showSituation }">
        <div v-for="section in getTruncatedSections(card)" :key="section.title">
              <h4>{{ section.title }}</h4>
              <p>{{ section.content }}</p>
            </div>

            <!-- Section affichée uniquement si showSituation est vrai -->
          <h4 v-if="card.showSituation">Situation</h4>
          <p v-if="card.showSituation">{{ card.situation }}</p>
        </div>
      </template>

      <template v-slot:actions>
        <!-- Bouton d'action principale -->
        <button @click="handleActionNapoleon(card.id)">Voir Plus</button>

        <!-- Bouton pour basculer l'affichage de la situation -->
        <button @click="toggleSituation(card)">
          <i :class="card.showSituation ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
        </button>
      </template>
    </GenericCard>

  </div>
</template>


<script setup>
import GenericCard from "@/components/GenericCard.vue"; // Importation du composant générique de carte
import LoadingSpinner from "@/components/LoadingSpinner.vue"; // Importation du composant de chargement

import '@mdi/font/css/materialdesignicons.min.css'; // Importation des icônes Material Design

import { ref, onMounted } from "vue"; // Importation des fonctionnalités de Vue.js (ref pour les états, onMounted pour les hooks)

// *** ÉTATS ET DONNÉES ***
const cardsNapoleon = ref([]); // Stocke les données des cartes provenant d'une API
const loading = ref(true); // Indique si les données sont en cours de chargement

// *** FONCTION POUR RÉCUPÉRER LES DONNÉES ***
const fetchCards = async () => {
  try {
    const response = await fetch('http://localhost:5000/bataille'); // Requête vers une API fictive
    const data = await response.json(); // Conversion de la réponse en JSON

    // Mise en forme des données pour les rendre compatibles avec le composant GenericCard
    cardsNapoleon.value = data.map((item) => ({
      id: item.id, // ID unique de la carte
      title: item.nom, // Titre de la carte
      year: item.annee, // Année associée à la carte
      image: `data:image/jpeg;base64,${item.image}`, // Image en base64
      lieu: item.lieu, // Lieu de la carte
      forces: item.forces, // Forces présentes
      pertes: item.pertes, // Pertes signalées
      situation: item.situation, // Situation décrite
      showSituation: false, // Ajout d'un état local pour gérer l'affichage de la situation
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error); // Gestion des erreurs
  } finally {
    loading.value = false; // Désactive le spinner de chargement une fois les données récupérées
  }
};

// *** FONCTION POUR BASCULER L'AFFICHAGE DE LA SITUATION ***
const toggleSituation = (card) => {
  // Parcourt toutes les cartes et désactive l'affichage de la situation pour les autres cartes
  cardsNapoleon.value.forEach((c) => {
    if (c.id !== card.id) {
      c.showSituation = false; // Réinitialise showSituation à false
    }
  });

  // Inverse l'état de la carte sélectionnée
  card.showSituation = !card.showSituation;
};

// *** HOOK POUR EXÉCUTER LA FONCTION fetchCards LORSQUE LE COMPOSANT EST MONTÉ ***
onMounted(fetchCards);

// *** GESTION DES ACTIONS PRINCIPALES DES CARTES ***
const handleActionNapoleon = (id) => {
  // Action déclenchée lorsque le bouton "Voir Plus" est cliqué
  alert(`Action déclenchée pour la carte ID : ${id}`);
};

// *** DONNÉES LOCALES POUR LES CARTES DE TEST ***
const cards = ref([
  {
    id: 1, // ID unique de la carte
    title: 'Carte 1', // Titre de la carte
    year: 2024, // Année affichée sur la carte
    image: 'https://via.placeholder.com/300', // Image de la carte
    description: 'Ceci est la première carte.', // Description de la carte
    selected: false, // État pour indiquer si la carte est sélectionnée
  },
  {
    id: 2, // ID unique de la carte
    title: 'Carte 2', // Titre de la carte
    year: 2023, // Année affichée sur la carte
    image: 'https://via.placeholder.com/300', // Image de la carte
    description: 'Ceci est la deuxième carte.', // Description de la carte
    selected: false, // État pour indiquer si la carte est sélectionnée
  },
]);

// *** FONCTION POUR BASCULER L'ÉTAT DE SÉLECTION D'UNE CARTE ***
function selectCard(card) {
  card.selected = !card.selected; // Inverse l'état de sélection
  console.log(`Carte ${card.id} sélectionnée : ${card.selected}`); // Affiche dans la console l'état actuel
}

// *** GESTION DES ACTIONS PERSONNALISÉES ***
function handleAction(payload) {
  console.log('Action principale émise :', payload); // Log l'action dans la console
  alert(`Action principale : ${payload.type}`); // Affiche une alerte avec le type d'action
}

function learnVue() {
  // Affiche un message informatif
  alert('Apprenez Vue.js dès aujourd’hui !');
}

function moreInfo() {
  // Affiche des informations supplémentaires
  alert('Voici plus d’informations.');
}

// Fonction pour tronquer la description tout en conservant les titres
const getTruncatedSections = (card) => {
  // Sections de la description
  const sections = [
    { title: 'Date et lieu', content: card.lieu || '' },
    { title: 'Forces en présence', content: card.forces || '' },
    { title: 'Pertes', content: card.pertes || '' },
  ];

  // Si la situation générale est affichée, on retourne toutes les sections complètes
  if (card.showSituation) return sections;

  // Sinon, on tronque la description combinée à 300 caractères
  let totalLength = 0;
  const truncatedSections = [];

  for (const section of sections) {
    const remainingSpace = 300 - totalLength;
    if (remainingSpace <= 0) break;

    const content = section.content.slice(0, remainingSpace);
    totalLength += content.length;
    truncatedSections.push({
      title: section.title,
      content: content + (content.length < section.content.length ? '...' : ''),
    });
  }

  return truncatedSections;
};



</script>


<style scoped>

/* *** CONTENEUR PRINCIPAL DES CARTES *** */

/* Conteneur principal qui englobe toutes les cartes de la page */
.card-container {
  display: flex; /* Active le modèle flexbox */
  flex-direction: column; /* Aligne les cartes verticalement */
  align-items: center; /* Centre les cartes horizontalement */
  justify-content: center; /* Centre les cartes verticalement dans la vue */
  min-height: 100vh; /* S'assure que le conteneur prend toute la hauteur de l'écran */
  padding: 1rem; /* Ajoute de l'espace autour du contenu */
  gap: 1rem; /* Ajoute un espacement vertical uniforme entre les cartes */
  background-color: #f5f5f5; /* Fond gris clair pour contraster avec les cartes */
}

/* *** DESCRIPTION DES CARTES *** */

/* Contenu textuel dynamique dans les cartes (provenant des slots) */
.card-description {
  text-align: justify; /* Justifie le texte pour une meilleure lisibilité */
  font-size: 1rem;
  line-height: 1.6; /* Ajoute un espace vertical entre les lignes */
  font-family: Arial, sans-serif;
}

/* Titres spécifiques à chaque section de description */
.card-description h4 {
  font-weight: bold; /* Rendre les titres plus visibles en gras */
  margin: 1rem 0 0.5rem; /* Ajoute un espace avant et après le titre */
  font-size: 1rem; /* Taille légèrement augmentée pour différencier les titres du texte */
  color: #333; /* Couleur sombre pour les titres */
}

/* Paragraphes dans la description (texte détaillé des cartes) */
.card-description p {
  margin-bottom: 1rem; /* Ajoute un espace après chaque paragraphe */
  color: #555; /* Couleur légèrement grisée pour un meilleur contraste */
}

/* Description scrollable quand showSituation est actif */
.scrollable {
  max-height: 430px; /* hauteur fixe visible (~900 caractères selon mise en page) */
  overflow-y: auto; /* active l'ascenseur vertical */
  padding-right: 0.5rem; /* évite que le scroll cache du texte */
  scrollbar-width: thin; /* Firefox */
}

/* Pour Webkit (Chrome, Edge, Safari...) */
.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 8px;
}


</style>
