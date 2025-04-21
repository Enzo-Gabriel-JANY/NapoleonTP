<template>
  <!-- Fond sombre cliquable : ferme la modale si on clique en dehors -->
  <div class="modal-backdrop" @click.self="close">

    <!-- Bloc principal de la modale -->
    <div class="modal">
      <h2>Éditer la bataille</h2>

      <!-- Formulaire d'édition -->
      <!-- .prevent : empêche l'envoi HTML classique -->
      <!-- .enter : empêche la touche "Entrée" sauf dans un textarea -->
      <form @submit.prevent="submit" @keydown.enter="handleEnter">

        <!-- Ligne 1 : Titre et Année -->
        <div class="form-row">
          <!-- Champ Titre -->
          <div class="form-group">
            <label for="title">Titre :</label>
            <input
                id="title"
                v-model="localCard.title"
                type="text"
                :class="{ 'invalid': showError && !localCard.title.trim() }"
            />
          </div>

          <!-- Champ Année -->
          <div class="form-group">
            <label for="year">Année :</label>
            <input
                id="year"
                v-model.number="localCard.year"
                type="number"
                :class="{ 'invalid': (showError && !localCard.year) || yearError }"
            />
          </div>
        </div>

        <!-- Ligne 2 : Checkbox victoire -->
        <div class="form-row">
          <div class="checkbox-group">
            <label for="victoire">Victoire napoléonienne :</label>
            <input type="checkbox" id="victoire" v-model="localCard.victory" />
          </div>
        </div>

        <!-- Ligne 3 : Lieu et Forces -->
        <div class="form-row">
          <div class="form-group">
            <label for="lieu">Lieu :</label>
            <textarea id="lieu" v-model="localCard.lieu" rows="4" />
          </div>
          <div class="form-group">
            <label for="forces">Forces :</label>
            <textarea id="forces" v-model="localCard.forces" rows="4" />
          </div>
        </div>

        <!-- Ligne 4 : Pertes -->
        <label for="pertes">Pertes :</label>
        <textarea id="pertes" v-model="localCard.pertes" rows="4" />

        <!-- Ligne 5 : Situation -->
        <label for="situation">Situation :</label>
        <textarea id="situation" v-model="localCard.situation" rows="5" />

        <!-- Ligne 6 : Image (champ simulé + input caché) -->
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
            @change="updateFileName"
            style="display: none"
        />

        <!-- Zone des boutons d'action -->
        <div class="actions">
          <!-- Message si titre vide -->
          <p v-if="showError" class="error-message">
            Le champ <strong>titre</strong> est obligatoire.
          </p>

          <!-- Message si année hors limites -->
          <p v-if="yearError" class="error-message">
            L’année doit être comprise entre 1769 et 1815.<br />
            C’est compliqué de faire une bataille napoléonienne sans Napoléon !
          </p>

          <!-- Boutons Annuler et Enregistrer -->
          <button type="button" class="cancel-button" @click="close">Annuler</button>
          <button type="submit" class="save-button">Enregistrer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

// Référence à l'input file caché (pour déclencher le dialogue fichier)
const hiddenFileInput = ref(null)

// Flags pour afficher les erreurs si titre ou année invalides
const showError = ref(false)
const yearError = ref(false)

// Props reçue du parent : la carte à éditer
const props = defineProps({
  card: Object
})

// Événements envoyés au parent : fermeture et sauvegarde
const emit = defineEmits(['close', 'save'])

// Nom du fichier image à afficher dans le champ texte
const fileName = ref(props.card.image ? 'ImageNapoleon.img' : '')

// Copie locale de la carte (on ne modifie pas directement la prop)
const localCard = reactive({
  ...props.card,
  image: props.card.image || ''
})

// Déclenche l'ouverture de l'input file invisible
function openFileDialog() {
  if (hiddenFileInput.value) {
    hiddenFileInput.value.click()
  }
}

// Bloque la touche Entrée sauf dans les textarea
function handleEnter(event) {
  const tag = event.target.tagName.toLowerCase()
  if (tag !== 'textarea') {
    event.preventDefault()
  }
}

// Lorsque l’utilisateur choisit une image
function updateFileName(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name // met à jour le champ texte

  const reader = new FileReader()
  reader.onload = function () {
    localCard.image = reader.result // base64 complet
  }
  reader.readAsDataURL(file)
}

// Si les props changent (ex: rechargement de données en live), on synchronise localCard
watch(() => props.card, (nouvelleCarte) => {
  Object.assign(localCard, nouvelleCarte)
  fileName.value = nouvelleCarte.image ? 'Image Napoleon' : ''
})

// Ferme la modale en émettant l’événement "close"
function close() {
  emit('close')
}

// Envoie les données éditées au parent après validation
function submit() {
  showError.value = false
  yearError.value = false

  // Vérifie que le titre n’est pas vide
  if (!localCard.title.trim()) {
    showError.value = true
    return
  }

  // Vérifie que l’année est dans la période napoléonienne
  if (!localCard.year || localCard.year < 1769 || localCard.year > 1815) {
    yearError.value = true
    return
  }

  const payload = { ...localCard }

  // Nettoie l'image : retire le préfixe base64
  if (typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
    payload.image = payload.image.split(',')[1]
  }

  // Envoie les données éditées
  emit('save', payload)
}
</script>

<style scoped>
/* Fond sombre semi-transparent */
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

/* Boîte blanche de la modale */
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

/* Ligne contenant plusieurs champs */
.form-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* Container d’un champ avec min-width */
.form-group {
  flex: 1;
  min-width: 200px;
}

/* Style des labels */
label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

/* Inputs texte et textareas */
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

/* Limite de largeur pour le champ image (simulé) */
#image {
  max-width: 200px;
}

/* Boutons en bas du formulaire */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Bouton Annuler */
button.cancel-button {
  background: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button.cancel-button:hover {
  background: #e0e0e0;
}

/* Bouton Enregistrer */
button.save-button {
  background: #4CAF50;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button.save-button:hover {
  background: #43a047;
}

/* Bordure rouge et fond clair si champ invalide */
.invalid {
  border: 2px solid #d32f2f;
  background-color: #fff4f4;
}

/* Message d'erreur */
.error-message {
  color: #d32f2f;
  font-size: 0.95rem;
  margin-top: 1rem;
  margin-right: auto;
}

/* Hauteur standard pour les boutons */
button {
  height: 42px;
}

/* Alignement de la checkbox */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  white-space: nowrap;
}
.checkbox-group label {
  margin: 0;
  font-weight: bold;
  flex-shrink: 0;
}
</style>
