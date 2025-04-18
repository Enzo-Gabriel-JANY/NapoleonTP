<template>
  <!-- Fond sombre cliquable pour fermer la modale -->
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <h2>Ajouter une bataille</h2>

      <form @submit.prevent="submit" @keydown.enter="handleEnter">

        <!-- Ligne : titre + année -->
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titre :</label>
            <input id="title" v-model="newCard.title" type="text" />
          </div>
          <div class="form-group">
            <label for="year">Année :</label>
            <input id="year" v-model.number="newCard.year" type="number" />
          </div>
        </div>

        <!-- Ligne : lieu + forces -->
        <div class="form-row">
          <div class="form-group">
            <label for="lieu">Lieu :</label>
            <textarea id="lieu" v-model="newCard.lieu" rows="2" />
          </div>
          <div class="form-group">
            <label for="forces">Forces :</label>
            <textarea id="forces" v-model="newCard.forces" rows="4" />
          </div>
        </div>

        <!-- Champ : pertes -->
        <label for="pertes">Pertes :</label>
        <textarea id="pertes" v-model="newCard.pertes" rows="4" />

        <!-- Champ : situation -->
        <label for="situation">Situation :</label>
        <textarea id="situation" v-model="newCard.situation" rows="5" />

        <!-- Champ image -->
        <label for="image">Image :</label>
        <input
            id="image"
            type="text"
            readonly
            v-model="fileName"
            @click="openFileDialog"
        />
        <input
            ref="hiddenFileInput"
            type="file"
            accept="image/*"
            @change="updateFile"
            style="display: none"
        />

        <!-- Boutons -->
        <div class="actions">
          <button type="submit">Ajouter</button>
          <button type="button" @click="close">Annuler</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['close', 'add']);

const newCard = reactive({
  title: '',
  year: '',
  lieu: '',
  forces: '',
  pertes: '',
  situation: '',
  image: ''
});

const fileName = ref('');
const hiddenFileInput = ref(null);

// Bloque Enter sauf dans textarea
function handleEnter(event) {
  const tag = event.target.tagName.toLowerCase();
  if (tag !== 'textarea') event.preventDefault();
}

// Clic sur champ texte → ouvre le champ file caché
function openFileDialog() {
  if (hiddenFileInput.value) hiddenFileInput.value.click();
}

// Quand une image est sélectionnée
function updateFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    newCard.image = reader.result;
  };
  reader.readAsDataURL(file);
}

// Soumission du formulaire
function submit() {
  const payload = { ...newCard };

  // Nettoie l’image (enlève le préfixe base64)
  if (typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
    payload.image = payload.image.split(',')[1];
  }

  emit('add', payload);
}

// Ferme la modale
function close() {
  emit('close');
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
  z-index: 999;
  padding: 1rem;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
  resize: none;
  box-sizing: border-box;
}

#image {
  max-width: 200px;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Boutons insérés via les slots */
.actions ::v-deep(button) {
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
.actions ::v-deep(button:hover) {
  background: #e0e0e0; /* Couleur légèrement plus sombre au survol */
  transform: translateY(-2px); /* Soulève légèrement le bouton */
}

/* Effet lorsque le bouton est cliqué */
.actions ::v-deep(button:active) {
  background: #d6d6d6; /* Couleur encore plus sombre lorsqu'il est cliqué */
  transform: translateY(1px); /* Réduit légèrement le bouton */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Ajoute un effet d'enfoncement */
}
</style>
