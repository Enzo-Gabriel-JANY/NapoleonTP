<template>
  <!-- Barre de recherche avec input et bouton loupe -->
  <div class="search-bar">

    <!-- Champ de recherche contrôlé + déclenche sur Entrée -->
    <input
        type="text"
        v-model="searchTerm"
        placeholder="Rechercher une bataille"
        v-on:keyup.enter="emitSearch"
    />

    <!-- Bouton pour déclencher la recherche -->
    <button @click="emitSearch"
            title="Rechercher une bataille">
      <i class="mdi mdi-magnify"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Déclaration de l'événement personnalisé émis vers le parent
const emit = defineEmits(['search'])

// Champ de recherche local (lié à l'input)
const searchTerm = ref('')

// Fonction déclenchée au clic sur le bouton de recherche
function emitSearch() {
  emit('search', searchTerm.value)
}
</script>

<style scoped>
/* Conteneur de la barre de recherche */
.search-bar {
  display: flex;
  align-items: center; /* Centre verticalement input + bouton */
  gap: 0.75rem; /* Espace entre les éléments */
  width: 100%; /* Prend toute la largeur dispo */
  justify-content: left; /* Aligne les éléments à gauche */
}

/* Champ input avec style moderne arrondi */
.search-bar input {
  padding: 0.8rem 1rem; /* Hauteur + padding horizontal */
  border-radius: 999px; /* Bord arrondi complet (pill) */
  border: 1px solid #ccc;
  width: 300px; /* Largeur fixe */
  font-size: 1.1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Effet focus sur le champ de recherche */
.search-bar input:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 0 2px rgba(100, 100, 100, 0.2);
}

/* Bouton rond avec icône de loupe */
.search-bar button {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 50%; /* Bouton circulaire */
  background: #f8f8f8;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Effet au survol */
.search-bar button:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

/* Effet lors du clic */
.search-bar button:active {
  background: #d6d6d6;
  transform: scale(0.97);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
