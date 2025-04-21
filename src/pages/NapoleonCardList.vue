<template>
  <!-- Conteneur principal qui englobe toutes les cartes -->
  <div class="card-container">

    <!-- Composant de chargement, affiché tant que les données sont en cours de récupération -->
    <LoadingSpinner v-bind:visible="loading" />

    <!-- Ligne du haut : recherche à gauche, ajout à droite -->
    <div class="top-bar">
      <SearchBar @search="searchCards" />
      <button @click="showAddModal = true">➕ Ajouter une bataille</button>
    </div>


    <!-- Liste des cartes de batailles napoléoniennes -->
    <GenericCard
        v-for="card in cardsNapoleon"
    v-bind:key="card.id"
    v-bind:title="card.title"
    v-bind:year="card.year"
    v-bind:image="getCardImage(card)"
    v-on:action="handleAction"
    >

    <!-- Contenu principal de chaque carte (slot par défaut) -->
    <template v-slot:default>
      <!-- Contenu textuel, avec scroll si showSituation est activé -->
      <div class="card-description" v-bind:class="{ scrollable: card.showSituation }">

        <!-- Sections résumées : lieu, pertes, forces -->
        <div v-for="section in getTruncatedSections(card)" v-bind:key="section.title">
          <h4>{{ section.title }}</h4>
          <p>{{ section.content }}</p>
        </div>

        <!-- Affiche la situation complète uniquement si activée -->
        <h4 v-if="card.showSituation">Situation</h4>
        <p v-if="card.showSituation">{{ card.situation }}</p>
      </div>
    </template>

    <!-- Actions affichées en bas de la carte -->
    <template v-slot:actions>
      <!-- Bouton pour afficher/masquer la situation -->
      <button v-on:click="toggleSituation(card)"
              :title="card.showSituation ? 'Masquer la situation' : 'Afficher la situation'">
        <i :class="card.showSituation ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
      </button>

      <!-- Bouton pour ouvrir la modale de modification -->
      <button @click="selectedCardForEdit = card"
              title="Modifier la bataille">
        <i class="mdi mdi-pencil"></i>
      </button>

      <!-- Bouton pour demander la suppression (ouvre une confirmation) -->
      <button @click="deleteCard(card)"
              title="Supprimer la bataille">
        <i class="mdi mdi-delete"></i>
      </button>
    </template>
    </GenericCard>
  </div>

  <!-- Modale pour ajouter une nouvelle bataille -->
  <AddBattleModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @add="addCard"
  />

  <!-- Modale pour modifier une bataille existante -->
  <EditBattleModal
      v-if="selectedCardForEdit"
      v-bind:card="selectedCardForEdit"
      v-on:close="selectedCardForEdit = null"
      v-on:save="updateCard"
  />

  <!-- Modale de confirmation pour supprimer une carte -->
  <ConfirmModal
      v-if="cardToDelete"
      v-bind:bataille-selectionne="cardToDelete"
      @cancel="cardToDelete = null"
      @confirm="confirmDelete"
  />
</template>

<script setup>
// Import des fonctions de base de Vue
import { ref, onMounted, computed } from 'vue'

// Import des composants utilisés dans la page
import GenericCard from '@/components/GenericCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EditBattleModal from '@/components/EditBattleModal.vue'
import AddBattleModal from "@/components/AddBattleModal.vue"
import ConfirmModal from "@/components/ConfirmModal.vue"
import SearchBar from "@/components/SearchBar.vue";

// Import de la feuille d’icônes MDI (Material Design Icons)
import '@mdi/font/css/materialdesignicons.min.css'

// État contenant les cartes chargées depuis l'API
const cardsNapoleon = ref([])

// Indique si les données sont en cours de chargement
const loading = ref(true)

// Valeur du champ de recherche
const searchTerm = ref('');

// Liste d'origine (copie complète, pour pouvoir réinitialiser)
let fullCardList = [];


// Appelé automatiquement au montage du composant
onMounted(fetchCards)

// Récupère toutes les batailles depuis l'API, les filtre et les trie
async function fetchCards() {
  try {
    const response = await fetch('http://localhost:5000/bataille')
    const data = await response.json()

    // Filtre les batailles victorieuses et trie par année croissante
    cardsNapoleon.value = data
        .filter(item => item.victoire === true)
        .sort((a, b) => a.annee - b.annee)
        .map((item) => ({
          id: item.id,
          title: item.nom,
          year: item.annee,
          victory: item.victoire,
          image: `data:image/jpeg;base64,${item.image}`,
          lieu: item.lieu,
          forces: item.forces,
          pertes: item.pertes,
          situation: item.situation,
          showSituation: false, // Contrôle local pour chaque carte
        }))

    fullCardList = [...cardsNapoleon.value]; // Garde une copie de la liste complète

  } catch (err) {
    console.error('Erreur de chargement :', err)
  } finally {
    loading.value = false
  }
}

// Filtrage à la demande
async function searchCards(term) {
  loading.value = true; // Affiche le spinner

  await new Promise(resolve => setTimeout(resolve, 300)); // Simule un délai

  const searchTerm = term.trim().toLowerCase();

  if (!searchTerm) {
    cardsNapoleon.value = [...fullCardList];
  } else {
    cardsNapoleon.value = fullCardList.filter(card => {
      const title = card.title.toLowerCase();
      const year = String(card.year);
      return title.includes(searchTerm) || year.includes(searchTerm);
    });
  }

  loading.value = false; // Cache le spinner
}



// Convertit une image en base64 si besoin
function getCardImage(card) {
  if (card.image?.startsWith('data:image')) return card.image
  return `data:image/png;base64,${card.image}`
}

// État de la modale d'ajout
const showAddModal = ref(false)

// Ajoute une nouvelle bataille (appel API + rechargement)
async function addCard(newCard) {
  loading.value = true; //  démarrage du spinner
  try {
    const apiCard = {
      nom: newCard.title,
      annee: newCard.year,
      victoire: newCard.victory,
      lieu: newCard.lieu,
      forces: newCard.forces,
      pertes: newCard.pertes,
      situation: newCard.situation,
      image: newCard.image
    }

    const response = await fetch('http://localhost:5000/bataille', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiCard),
    })

    if (!response.ok) throw new Error('Erreur lors de l’ajout')

    // Recharge les cartes depuis le serveur
    await fetchCards()
  } catch (e) {
    console.error('Erreur ajout carte:', e)
  } finally {
    showAddModal.value = false
  }
}

// État : carte actuellement en édition
const selectedCardForEdit = ref(null)

// Met à jour une carte après édition (PUT + actualisation locale)
async function updateCard(updatedCard) {
  try {
    const apiCard = {
      id: updatedCard.id,
      nom: updatedCard.title,
      annee: updatedCard.year,
      victoire: updatedCard.victory,
      lieu: updatedCard.lieu,
      forces: updatedCard.forces,
      pertes: updatedCard.pertes,
      situation: updatedCard.situation,
      image: updatedCard.image
    }

    const response = await fetch(`http://localhost:5000/bataille/${apiCard.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiCard),
    })

    if (!response.ok) throw new Error('Erreur API lors de la sauvegarde')

    // Met à jour localement la carte modifiée
    const index = cardsNapoleon.value.findIndex(c => c.id === updatedCard.id)
    if (index !== -1) {
      Object.assign(cardsNapoleon.value[index], updatedCard)
      cardsNapoleon.value[index].showSituation = false
    }

    selectedCardForEdit.value = null
  } catch (error) {
    console.error('Erreur mise à jour serveur :', error)
    alert('Une erreur est survenue lors de la sauvegarde.')
  }
}

// État : carte en attente de suppression
const cardToDelete = ref(null)

// Prépare la suppression d'une carte (ouvre la modale)
function deleteCard(card) {
  cardToDelete.value = card
}

// Confirme la suppression d’une carte (DELETE + retrait local)
async function confirmDelete() {
  if (!cardToDelete.value) return

  try {
    const response = await fetch(`http://localhost:5000/bataille/${cardToDelete.value.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Suppression échouée')

    cardsNapoleon.value = cardsNapoleon.value.filter(c => c.id !== cardToDelete.value.id)
  } catch (e) {
    alert('Erreur lors de la suppression.')
    console.error(e)
  } finally {
    cardToDelete.value = null
  }
}

// Active ou désactive l’affichage de la situation pour une carte
function toggleSituation(card) {
  cardsNapoleon.value.forEach((c) => {
    if (c.id !== card.id) c.showSituation = false
  })
  card.showSituation = !card.showSituation
}

// Retourne les sections tronquées si nécessaire (300 caractères max)
function getTruncatedSections(card) {
  const sections = [
    { title: 'Date et lieu', content: card.lieu || '' },
    { title: 'Forces en présence', content: card.forces || '' },
    { title: 'Pertes', content: card.pertes || '' },
  ]

  if (card.showSituation) return sections

  let totalLength = 0
  const truncatedSections = []

  for (const section of sections) {
    const remaining = 300 - totalLength
    if (remaining <= 0) break

    const content = section.content.slice(0, remaining)
    totalLength += content.length
    truncatedSections.push({
      title: section.title,
      content: content + (content.length < section.content.length ? '...' : ''),
    })
  }

  return truncatedSections
}

// Action personnalisée déclenchée depuis GenericCard (non utilisée ici)
function handleAction(payload) {
  console.log('Action principale :', payload)
}
</script>

<style scoped>
/* Conteneur des cartes */
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
}

/* Style du texte des descriptions */
.card-description {
  font-size: 1rem;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  text-align: justify;
}

/* Titre des sections */
.card-description h4 {
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
  color: #333;
}

/* Paragraphe de chaque section */
.card-description p {
  margin-bottom: 1rem;
  color: #555;
}

/* Scroll activé si showSituation est actif */
.scrollable {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
}

/* Scrollbar pour Webkit (Chrome/Safari) */
.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 8px;
}

/* Style commun pour tous les boutons */
button {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 100px;
  background: #f8f8f8;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  white-space: nowrap;
  width: auto;
  min-width: fit-content;
  text-align: center;
}

/* Effets au survol des boutons */
button:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

/* Effets lors du clic sur les boutons */
button:active {
  background: #d6d6d6;
  transform: translateY(1px);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Barre supérieure contenant la recherche à gauche et le bouton à droite */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1500px;         /* même largeur que les cards */
  margin: 1rem auto;        /* centré horizontalement */
}
</style>
