<template>
  <!-- Fond sombre cliquable (fermeture en cliquant en dehors de la modale) -->
  <div class="modal-backdrop" @click.self="close">

    <!-- Contenu principal de la modale -->
    <div class="modal">
      <h2>Ajouter une bataille</h2>

      <!-- Formulaire pour ajouter une bataille -->
      <!-- .prevent : empêche l'envoi classique -->
      <!-- .enter : empêche "Entrée" sauf dans un textarea -->
      <form @submit.prevent="submit" @keydown.enter="handleEnter">

        <!-- Ligne avec les champs Titre et Année -->
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titre :</label>
            <!-- Champ texte lié au titre de la bataille -->
            <!-- Affiche une classe 'invalid' si vide et erreur activée -->
            <input id="title" v-model="newCard.title" type="text"
                   :class="{ 'invalid': showError && !newCard.title.trim() }"/>
          </div>
          <div class="form-group">
            <label for="year">Année :</label>
            <!-- Champ numérique lié à l’année -->
            <!-- Classe 'invalid' si l’année est incorrecte -->
            <input id="year" v-model.number="newCard.year" type="number"
                   :class="{ 'invalid': (showError && !newCard.year) || yearError }"/>
          </div>
        </div>

        <!-- Ligne avec la checkbox "Victoire" -->
        <div class="form-row">
          <div class="checkbox-group">
            <label for="victoire">Victoire napoléonienne :</label>
            <input type="checkbox" id="victoire" v-model="newCard.victory" />
          </div>
        </div>

        <!-- Ligne avec les champs Lieu et Forces -->
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

        <!-- Champ pour les pertes -->
        <label for="pertes">Pertes :</label>
        <textarea id="pertes" v-model="newCard.pertes" rows="4" />

        <!-- Champ pour la situation -->
        <label for="situation">Situation :</label>
        <textarea id="situation" v-model="newCard.situation" rows="5" />

        <!-- Sélection d’image -->
        <label for="image">Image :</label>
        <!-- Zone texte simulant la sélection de fichier -->
        <input
            id="image"
            type="text"
            readonly
            v-model="fileName"
            @click="openFileDialog"
        />
        <!-- Input réel invisible pour l’image -->
        <input
            ref="hiddenFileInput"
            type="file"
            accept="image/*"
            @change="updateFile"
            style="display: none"
        />

        <!-- Boutons de validation -->
        <div class="actions">
          <!-- Message d’erreur si le titre est manquant -->
          <p v-if="showError" class="error-message">
            Le champ <strong>titre</strong> est obligatoire.
          </p>
          <!-- Message d’erreur si l’année est hors bornes -->
          <p v-if="yearError" class="error-message">
            L’année doit être comprise entre 1769 et 1815.<br />
            C’est compliqué de faire une bataille napoléonienne sans Napoléon !
          </p>
          <!-- Boutons d'action -->
          <button type="button" class="cancel-button" @click="close">Annuler</button>
          <button type="submit" class="save-button">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Déclaration des événements envoyés vers le parent (fermeture et ajout)
const emit = defineEmits(['close', 'add'])

// Données du formulaire, regroupées dans un objet réactif
const newCard = reactive({
  title: '',
  year: '',
  victory: true,      // Par défaut cochée
  lieu: '',
  forces: '',
  pertes: '',
  situation: '',
  image: ''
})

// Nom du fichier image sélectionné
const fileName = ref('')

// Référence vers l’input file caché
const hiddenFileInput = ref(null)

// Flags d’erreurs pour la validation des champs
const showError = ref(false)
const yearError = ref(false)

// Empêche "Entrée" sauf dans un textarea
function handleEnter(event) {
  const tag = event.target.tagName.toLowerCase()
  if (tag !== 'textarea') event.preventDefault()
}

// Ouvre le champ file invisible quand on clique sur le champ texte image
function openFileDialog() {
  if (hiddenFileInput.value) hiddenFileInput.value.click()
}

// Gère le chargement d’une image sélectionnée par l’utilisateur
function updateFile(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    newCard.image = reader.result
  }
  reader.readAsDataURL(file)
}

// Envoie les données au parent si validation OK
function submit() {
  showError.value = false
  yearError.value = false

  // Vérifie que le titre n'est pas vide
  if (!newCard.title.trim()) {
    showError.value = true
    return
  }

  // Vérifie que l’année est comprise dans la période napoléonienne
  if (!newCard.year || newCard.year < 1769 || newCard.year > 1815) {
    yearError.value = true
    return
  }

  // Prépare l'objet à envoyer
  const payload = { ...newCard }

  // Nettoie le base64 de l’image (enlève le préfixe data:image)
  if (typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
    payload.image = payload.image.split(',')[1]
  }

  // Envoie l'événement add avec la nouvelle bataille
  emit('add', payload)
}

// Ferme la modale (émission de l’événement close)
function close() {
  emit('close')
}
</script>

<style scoped>
/* Fond sombre de la modale (arrière-plan) */
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

/* Boîte centrale de la modale */
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

/* Ligne de champs à deux colonnes */
.form-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* Groupe de champ avec largeur minimum */
.form-group {
  flex: 1;
  min-width: 200px;
}

/* Styles des labels */
label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

/* Champs input et textarea */
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

/* Limite la largeur de l’input image simulé */
#image {
  max-width: 200px;
}

/* Boutons de bas de formulaire */
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

/* Bouton Ajouter */
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

/* Champ invalide (bordure rouge) */
.invalid {
  border: 2px solid #d32f2f;
  background-color: #fff4f4;
}

/* Messages d'erreur */
.error-message {
  color: #d32f2f;
  font-size: 0.95rem;
  margin-top: 1rem;
  margin-right: auto;
}

/* Hauteur standardisée des boutons */
button {
  height: 42px;
}

/* Groupe de la checkbox "victoire" */
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
