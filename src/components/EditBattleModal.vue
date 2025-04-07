<template>
  <!-- Fond sombre qui couvre toute la page -->
  <!-- v-on:click.self = ferme la modale si on clique en dehors du bloc blanc -->
  <div class="modal-backdrop" v-on:click.self="close">

    <!-- Bloc blanc centré : c’est le contenu de la modale -->
    <div class="modal">
      <h2>Éditer la bataille</h2>

      <!-- Formulaire d'édition -->
      <!-- v-on:submit.prevent : empêche l'envoi natif HTML -->
      <!-- v-on:keydown.enter.prevent : empêche la touche "Entrée" de soumettre le formulaire -->
      <form @submit.prevent="submit" @keydown.enter="handleEnter">

      <!-- Ligne 1 : Titre et Année -->
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titre :</label>
            <input id="title" v-model="localCard.title" type="text" />
          </div>
          <div class="form-group">
            <label for="year">Année :</label>
            <input id="year" v-model.number="localCard.year" type="number" />
          </div>
        </div>

        <!-- Ligne 2 : Lieu et Forces -->
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

        <!-- Ligne 3 : Pertes -->
        <label for="pertes">Pertes :</label>
        <textarea id="pertes" v-model="localCard.pertes" rows="4" />

        <!-- Ligne 4 : Situation -->
        <label for="situation">Situation :</label>
        <textarea id="situation" v-model="localCard.situation" rows="5" />

        <!-- Ligne 5 : Champ d’image personnalisé -->
        <label for="image">Image :</label>

        <!-- Champ texte simulant une sélection de fichier -->
        <!-- Quand on clique dessus, on déclenche un input file invisible -->
        <input
            id="image"
            type="text"
            readonly
            v-model="fileName"
            v-on:click="openFileDialog"
        />

        <!-- Input file masqué, utilisé pour sélectionner une image -->
        <input
            ref="hiddenFileInput"
            type="file"
            accept="image/*"
            v-on:change="updateFileName"
            style="display: none"
        />

        <!-- Boutons de validation -->
        <div class="actions">
          <button type="submit">Enregistrer</button>
          <button type="button" v-on:click="close">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
// Imports Vue
import { ref, reactive, watch } from 'vue';

// Référence à l'input file masqué (pour pouvoir déclencher son clic depuis un autre champ)
const hiddenFileInput = ref(null);

// Déclaration des props : on reçoit une carte depuis le parent
const props = defineProps({
  card: Object
});

// Affiche le nom du fichier (ou un label fixe si une image est déjà présente)
const fileName = ref(props.card.image ? 'ImageNapoleon.img' : '');

// Déclaration des événements que la modale peut envoyer au parent
const emit = defineEmits(['close', 'save']);

// Copie locale de la carte pour éviter de modifier directement la prop
const localCard = reactive({
  ...props.card, // copie toutes les propriétés
  image: props.card.image || '' // s’assure que image est initialisée
});

// Lorsqu’on clique sur le champ texte image, on déclenche l’input file caché
function openFileDialog() {
  if (hiddenFileInput.value) {
    hiddenFileInput.value.click();
  }
}

// Permettre la touche entré uniquement pour le retour à la ligne
function handleEnter(event) {
  const tag = event.target.tagName.toLowerCase();
  if (tag !== 'textarea') {
    event.preventDefault();
  }
}


// Lorsqu’un fichier est sélectionné
// → met à jour le nom affiché et lit le fichier en base64
function updateFileName(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name; // nom du fichier dans le champ texte

  const reader = new FileReader();

  // Quand la lecture est terminée → stocker le base64 complet dans localCard.image
  reader.onload = function () {
    localCard.image = reader.result;
  };

  // Lance la lecture du fichier comme DataURL (data:image/png;base64,...)
  reader.readAsDataURL(file);
}

// Si la prop `card` change pendant que la modale est ouverte
// → synchroniser la copie locale
watch(() => props.card, (nouvelleCarte) => {
  Object.assign(localCard, nouvelleCarte);
  fileName.value = nouvelleCarte.image ? 'Image Napoleon' : '';
});

// Ferme la modale (événement émis vers le parent)
function close() {
  emit('close');
}

// Lorsqu’on clique sur "Enregistrer" → nettoie l’image si nécessaire et envoie au parent
function submit() {
  const payload = { ...localCard };

  // Si image est en data:image/... base64 → on enlève le préfixe avant de l’enregistrer
  if (typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
    payload.image = payload.image.split(',')[1];
  }

  // Envoie la carte modifiée au parent (via @save)
  emit('save', payload);
}

</script>

<style scoped>
/* Fond sombre derrière la modale */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Noir semi-transparent */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
}

/* Bloc blanc de la modale */
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

/* Lignes à deux colonnes */
.form-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* Chaque champ prend la moitié de la largeur au minimum */
.form-group {
  flex: 1;
  min-width: 200px;
}

/* Labels */
label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

/* Champs texte et zone de texte */
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

/* Champ image texte : taille réduite */
#image {
  max-width: 200px;
}

/* Conteneur des boutons */
.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>