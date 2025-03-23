<template>
  <div class="card">
    <!-- Titre -->
    <div class="card-header">
      <h3 class="card-title">{{ title }} - {{ year }}</h3>
    </div>

    <!-- Contenu principal -->
    <div class="card-content">
      <!-- Image avec taille fixe -->
      <img v-if="image" :src="image" alt="Card image" class="card-image" />

      <!-- Description prenant de l'espace -->
      <div class="card-description">
        <slot></slot>
      </div>

      <!-- Actions à droite de la description -->
      <div class="card-actions">
        <!-- Bouton intégré -->
<!--        <button @click="emitAction" class="primary-action">Information</button>-->

        <!-- Slot pour d'autres actions -->
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Props pour configurer la carte
defineProps({
  title: String,
  year: Number,
  image: String,
});

// Déclare l'événement `action` que ce composant peut émettre
const emit = defineEmits(['action']);

// Fonction pour émettre l'événement
function emitAction() {
  emit('action', { type: 'primary', timestamp: new Date() });
}


</script>

<style scoped>
/* Conteneur global de la carte */
.card {
  display: flex; /* Active le modèle de boîte flexible */
  flex-direction: column; /* Organise les enfants (contenu) en colonne */
  width: 100%; /* La carte s'adapte à 100% de la largeur disponible */
  max-width: 1500px; /* Largeur maximale pour limiter l'étirement sur les grands écrans */
  background: white; /* Fond blanc pour la carte */
  border-radius: 8px; /* Coins arrondis */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre subtile pour donner un effet de profondeur */
  overflow: hidden; /* Empêche le dépassement des éléments hors de la carte */
  margin-bottom: 1rem; /* Espacement entre cette carte et d'autres éléments */
  font-family: Arial, sans-serif; /* Police utilisée pour le texte de la carte */
}

/* Section de l'en-tête (titre de la carte) */
.card-header {
  padding: 1rem; /* Ajoute de l'espace à l'intérieur de l'en-tête */
  background: #f8f9fa; /* Couleur de fond claire pour l'en-tête */
}

.card-title {
  margin: 0; /* Supprime l'espacement par défaut autour du titre */
  font-size: 1.2rem; /* Taille du texte légèrement agrandie */
  color: #333; /* Couleur sombre pour le titre */
  font-weight: bold; /* Rend le texte du titre plus épais */
  text-align: left; /* Aligne le texte à gauche */
}

/* Conteneur principal pour le contenu de la carte */
.card-content {
  display: flex; /* Active la mise en page flexible */
  flex-direction: row; /* Organise les enfants (image, description, actions) en ligne */
  gap: 1rem; /* Espacement entre les éléments enfants */
  align-items: flex-start; /* Aligne les éléments au début verticalement */
  padding: 1rem; /* Ajoute de l'espace interne au conteneur */
  flex-wrap: wrap; /* Permet aux éléments de passer en colonne si l'espace horizontal est insuffisant */
}

/* Image de la carte */
.card-image {
  width: 100%; /* L'image s'étire à 100% de son conteneur parent */
  max-width: 250px; /* Limite la largeur maximale de l'image */
  height: auto; /* Ajuste automatiquement la hauteur en conservant le ratio */
  object-fit: contain; /* Affiche l'image entière sans la recadrer */
  border-radius: 8px; /* Coins arrondis pour correspondre au style de la carte */
}

/* Description de la carte */
.card-description {
  flex: 1; /* Occupe tout l'espace restant disponible */
  color: #555; /* Couleur légèrement grisée pour le texte */
  font-size: 1rem; /* Taille standard du texte */
  line-height: 1.5; /* Ajoute un espace entre les lignes pour améliorer la lisibilité */
  overflow-wrap: break-word; /* Permet de couper les mots longs pour éviter les débordements */

  /* Styles pour l'encadré */
  border: 1px solid #ccc; /* Bordure grise autour de la description */
  border-radius: 8px; /* Coins arrondis */
  padding: 1rem; /* Ajoute de l'espace interne à l'encadré */
  background-color: #f9f9f9; /* Couleur de fond légèrement grisée */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre subtile pour un effet de profondeur */
}

/* Conteneur des actions (boutons) */
.card-actions {
  display: flex; /* Active le modèle de boîte flexible */
  flex-direction: column; /* Aligne les boutons verticalement */
  gap: 0.5rem; /* Ajoute un espacement vertical entre les boutons */
  justify-content: flex-start; /* Aligne les boutons en haut du conteneur */
  align-items: flex-start; /* Les boutons s'ajustent à leur contenu */
}

/* Boutons insérés via les slots */
.card-actions ::v-deep(button) {
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
.card-actions ::v-deep(button:hover) {
  background: #e0e0e0; /* Couleur légèrement plus sombre au survol */
  transform: translateY(-2px); /* Soulève légèrement le bouton */
}

/* Effet lorsque le bouton est cliqué */
.card-actions ::v-deep(button:active) {
  background: #d6d6d6; /* Couleur encore plus sombre lorsqu'il est cliqué */
  transform: translateY(1px); /* Réduit légèrement le bouton */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Ajoute un effet d'enfoncement */
}


</style>
