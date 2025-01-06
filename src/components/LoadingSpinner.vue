<template>
  <div v-if="visible" class="spinner"></div>
</template>

<script setup>
import { defineProps } from 'vue';

// Déclare une prop `visible` pour afficher ou masquer le spinner
defineProps({
  visible: {
    type: Boolean,
    default: true, // Le spinner est visible par défaut
  },
});
</script>

<style scoped>
/* Style pour le spinner de chargement */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1); /* Bordure grise claire */
  border-radius: 50%; /* Forme circulaire */
  border-left-color: #007bff; /* Accent bleu sur la bordure */
  width: 50px; /* Largeur du spinner */
  height: 50px; /* Hauteur du spinner */
  animation: spin 1s infinite linear; /* Animation de rotation continue */
}

/* Animation de rotation */
@keyframes spin {
  to {
    transform: rotate(360deg); /* Rotation complète */
  }
}
</style>
