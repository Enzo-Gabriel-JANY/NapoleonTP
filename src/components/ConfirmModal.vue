<template>
  <!-- Fond sombre cliquable -->
  <div class="modal-backdrop" @click.self="cancel">
    <div class="modal">
      <!-- Titre -->
      <h2>Supression de bataille</h2>

      <!-- Message principal -->
      <p class="message" v-html="message"></p>

      <!-- Boutons -->
      <div class="actions">
        <button @click="cancel" class="cancel">Annuler</button>
        <button @click="confirm" class="confirm">Confirmer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: 'Êtes-vous sûr de vouloir continuer ?' }
});

const emit = defineEmits(['cancel', 'confirm']);

function cancel() {
  emit('cancel');
}

function confirm() {
  emit('confirm');
}
</script>

<style scoped>
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

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333;
}

.message {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #555;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.actions .cancel {
  background: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.actions .confirm {
  background: #c62828;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.actions .confirm:hover {
  background: #b71c1c;
}

.actions .cancel:hover {
  background: #e0e0e0;
}

.message strong::v-deep {
  font-weight: bold !important;
  color: #000;
}

</style>
