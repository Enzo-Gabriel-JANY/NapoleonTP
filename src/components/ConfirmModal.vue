<template>
  <!-- Fond semi-transparent couvrant toute la page -->
  <!-- @click.self = permet de fermer la modale uniquement si on clique à l’extérieur -->
  <div class="modal-backdrop" @click.self="cancel">

    <!-- Boîte blanche centrée contenant le contenu de la modale -->
    <div class="modal">

      <!-- Titre principal -->
      <h2>Supression de bataille</h2>

      <!-- Message de confirmation avec le nom de la bataille -->
      <p class="message">
        Êtes-vous sûr de vouloir supprimer la bataille :<br>
        <strong>{{batailleSelectionne.title}} - {{batailleSelectionne.year}}</strong> ?<br><br>
        Cette action est irréversible.
      </p>

      <!-- Boutons d’action : Annuler ou Confirmer -->
      <div class="actions">
        <!-- Annuler = ferme la modale sans effet -->
        <button @click="cancel" class="cancel">Annuler</button>

        <!-- Confirmer = déclenche la suppression -->
        <button @click="confirm" class="confirm">Confirmer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Déclaration des props : une bataille à afficher (objet attendu)
const props = defineProps({
  batailleSelectionne: {
    type: Object
  }
})

// Déclaration des événements émis vers le parent
const emit = defineEmits(['cancel', 'confirm'])

// Fonction appelée en cas d'annulation
function cancel() {
  emit('cancel')
}

// Fonction appelée en cas de confirmation
function confirm() {
  emit('confirm')
}
</script>

<style scoped>
/* Fond sombre semi-transparent couvrant toute la page */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Boîte blanche contenant le contenu de la modale */
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Titre principal */
h2 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333;
}

/* Message d’avertissement */
.message {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #555;
}

/* Mise en gras de la bataille concernée */
.message strong {
  font-weight: bold;
}

/* Conteneur des boutons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Bouton Annuler : style neutre */
.actions .cancel {
  background: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Bouton Confirmer : rouge + texte blanc */
.actions .confirm {
  background: #c62828;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Hover pour le bouton Confirmer */
.actions .confirm:hover {
  background: #b71c1c;
}

/* Hover pour le bouton Annuler */
.actions .cancel:hover {
  background: #e0e0e0;
}
</style>
