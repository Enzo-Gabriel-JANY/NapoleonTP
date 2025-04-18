<template>
  <!-- Conteneur principal de toutes les cartes -->
  <div class="card-container">

    <!-- Composant de chargement visible pendant le fetch -->
    <LoadingSpinner v-bind:visible="loading" />

    <!-- Bouton pour ajouter une nouvelle bataille -->
    <button v-on:click="showAddModal = true">➕ Ajouter une bataille</button>

    <!-- Boucle sur chaque carte issue de l'API -->
    <GenericCard
        v-for="card in cardsNapoleon"
        v-bind:key="card.id"
        v-bind:title="card.title"
        v-bind:year="card.year"
        v-bind:image="getCardImage(card)"
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

        <!-- Vouton pour modifier une bataille -->
        <button @click="selectedCardForEdit = card">
          <i class="mdi mdi-pencil"></i>
        </button>

        <!-- Vouton pour supprimer une bataille -->
        <button @click="deleteCard(card)">
          <i class="mdi mdi-delete"></i>
        </button>


      </template>
    </GenericCard>
  </div>
  <AddBattleModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @add="addCard"
  />
  <EditBattleModal
      v-if="selectedCardForEdit"
      v-bind:card="selectedCardForEdit"
      v-on:close="selectedCardForEdit = null"
      v-on:save="updateCard"
  />
  <ConfirmModal
      v-if="cardToDelete"
      :message="messageHtml"
      @cancel="cardToDelete = null"
      @confirm="confirmDelete"
  />




</template>

<script setup>
// Importations des outils Vue
import { ref, onMounted, computed } from 'vue';

// Composants utilisés
import GenericCard from '@/components/GenericCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EditBattleModal from '@/components/EditBattleModal.vue';
import AddBattleModal from "@/components/AddBattleModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";


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

function getCardImage(card) {
  // Si l'image commence déjà par data:image, on la retourne telle quelle
  if (card.image?.startsWith('data:image')) return card.image;

  // Sinon, on ajoute le préfixe pour que <img> puisse l'afficher
  return `data:image/png;base64,${card.image}`;
}

const showAddModal = ref(false);

async function addCard(newCard) {
  try {

    const apiCard = {
      nom: newCard.title,
      annee: newCard.year,
      lieu: newCard.lieu,
      forces: newCard.forces,
      pertes: newCard.pertes,
      situation: newCard.situation,
      image: newCard.image
    };

    const response = await fetch('http://localhost:5000/bataille', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiCard),
    });

    if (!response.ok) throw new Error('Erreur lors de l’ajout');

    // Ajoute localement (avec le même formatage que fetchCards)
    cardsNapoleon.value.unshift({
      ...newCard,
      showSituation: false
    });
  } catch (e) {
    console.error('Erreur ajout carte:', e);
  } finally {
    showAddModal.value = false;
  }
}


const selectedCardForEdit = ref(null); // carte sélectionnée

async function updateCard(updatedCard) {
  try {
    // Prépare l'objet pour l'API (nom, annee, etc.)
    const apiCard = {
      id: updatedCard.id,
      nom: updatedCard.title,
      annee: updatedCard.year,
      lieu: updatedCard.lieu,
      forces: updatedCard.forces,
      pertes: updatedCard.pertes,
      situation: updatedCard.situation,
      image: updatedCard.image
    };

    // Envoie la mise à jour au serveur
    const response = await fetch(`http://localhost:5000/bataille/${apiCard.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiCard),
    });

    if (!response.ok) {
      throw new Error('Erreur API lors de la sauvegarde');
    }

    // Met à jour localement l’objet dans le tableau
    const index = cardsNapoleon.value.findIndex(c => c.id === updatedCard.id);
    if (index !== -1) {
      Object.assign(cardsNapoleon.value[index], updatedCard);
      cardsNapoleon.value[index].showSituation = false;
    }

    // Ferme la modale
    selectedCardForEdit.value = null;

  } catch (error) {
    console.error('Erreur mise à jour serveur :', error);
    alert('Une erreur est survenue lors de la sauvegarde.');
  }
}

const cardToDelete = ref(null);

function deleteCard(card) {
  cardToDelete.value = card;
}

const messageHtml = computed(() => {
  if (!cardToDelete.value) return '';
  const title = cardToDelete.value.title;
  const year = cardToDelete.value.year;

  return `
    Êtes-vous sûr de vouloir supprimer la bataille :<br>
    <strong>${title} - ${year}</strong> ?<br><br>
    Cette action est irréversible.
  `;
});


async function confirmDelete() {
  if (!cardToDelete.value) return;

  try {
    const response = await fetch(`http://localhost:5000/bataille/${cardToDelete.value.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Suppression échouée');

    cardsNapoleon.value = cardsNapoleon.value.filter(c => c.id !== cardToDelete.value.id);
  } catch (e) {
    alert('Erreur lors de la suppression.');
    console.error(e);
  } finally {
    cardToDelete.value = null;
  }
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

/* Boutons insérés via les slots */
button {
  padding: 0.8rem 0.8rem; /* Ajoute de l'espace interne pour une apparence homogène */
  border: 1px solid #ccc; /* Bordure grise légère */
  border-radius: 100px; /* Coins légèrement arrondis */
  background: #f8f8f8; /* Couleur de fond neutre */
  color: #333; /* Couleur du texte sombre */
  font-weight: 600; /* Texte légèrement en gras */
  font-size: 1rem; /* Taille standard du texte */
  cursor: pointer; /* Change le curseur en pointeur (main) pour indiquer une action */
  transition: background 0.3s ease, transform 0.2s ease; /* Transition douce pour les interactions */
  white-space: nowrap; /* Empêche les boutons de s'étirer ou de couper leur texte */
  width: auto; /* Ajuste la largeur au contenu */
  min-width: fit-content; /* Garde une largeur minimale suffisante pour s'adapter au contenu */
  text-align: center; /* Centre le texte dans le bouton */
}

/* Effet au survol des boutons */
button:hover{
  background: #e0e0e0; /* Couleur légèrement plus sombre au survol */
  transform: translateY(-2px); /* Soulève légèrement le bouton */
}

/* Effet lorsque le bouton est cliqué */
button:active {
  background: #d6d6d6; /* Couleur encore plus sombre lorsqu'il est cliqué */
  transform: translateY(1px); /* Réduit légèrement le bouton */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Ajoute un effet d'enfoncement */
}

</style>
