<template>
  <!-- Fond sombre qui couvre tout l'écran et qui sert à fermer la modale si on clique autour -->
  <div class="modal-backdrop" v-on:click.self="close">

    <!-- Boîte blanche au centre de l'écran : la modale elle-même -->
    <div class="modal">
      <h2>Éditer la bataille</h2>

      <!-- Formulaire d'édition -->
      <!-- v-on:submit.prevent empêche le rechargement de la page lors de la validation -->
      <!-- v-on:keydown.enter.prevent empêche d'envoyer le formulaire par erreur en appuyant sur Entrée -->
      <form v-on:submit.prevent="submit" v-on:keydown.enter.prevent>

        <!-- Ligne avec 2 champs : Titre et Année -->
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titre :</label>
            <!-- v-model permet de lier la valeur du champ à une propriété locale -->
            <input id="title" v-model="localCard.title" type="text" />
          </div>
          <div class="form-group">
            <label for="year">Année :</label>
            <!-- .number permet de convertir automatiquement en nombre -->
            <input id="year" v-model.number="localCard.year" type="number" />
          </div>
        </div>

        <!-- Ligne avec 2 champs : Lieu et Forces -->
        <div class="form-row">
          <div class="form-group">
            <label for="lieu">Lieu :</label>
            <!-- zone de texte multilignes -->
            <textarea id="lieu" v-model="localCard.lieu" rows="2" />
          </div>
          <div class="form-group">
            <label for="forces">Forces :</label>
            <textarea id="forces" v-model="localCard.forces" rows="4" />
          </div>
        </div>

        <!-- Champ seul : Pertes -->
        <label for="pertes">Pertes :</label>
        <textarea id="pertes" v-model="localCard.pertes" rows="4" />

        <!-- Champ seul : Situation -->
        <label for="situation">Situation :</label>
        <textarea id="situation" v-model="localCard.situation" rows="5" />

        <!-- Boutons du bas : Enregistrer et Annuler -->
        <div class="actions">
          <!-- Le bouton de type "submit" déclenche la fonction submit -->
          <button type="submit">Enregistrer</button>

          <!-- Ce bouton ferme la modale sans enregistrer -->
          <button type="button" v-on:click="close">Annuler</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// On déclare que ce composant attend une "prop" appelée "card"
// Cette prop est un objet représentant la bataille à modifier
const props = defineProps({
  card: Object
});

// On déclare les événements que ce composant peut émettre vers le parent
const emit = defineEmits(['close', 'save']);

// On crée une copie réactive de la carte à modifier
// Cela évite de modifier la carte d'origine directement tant que l'utilisateur n'a pas cliqué sur "Enregistrer"
const localCard = reactive({ ...props.card });

// Si le parent change de carte pendant que la modale est ouverte,
// on met à jour la copie locale pour rester synchronisé
watch(() => props.card, (nouvelleCarte) => {
  Object.assign(localCard, nouvelleCarte);
});

// Fonction appelée quand on clique sur "Annuler" ou en dehors de la modale
// Elle informe le parent qu'on souhaite fermer
function close() {
  emit('close');
}

// Fonction appelée quand l'utilisateur clique sur "Enregistrer"
// Elle envoie la version modifiée de la carte au parent
function submit() {
  emit('save', { ...localCard });
}
</script>

<style scoped>

/* Fond sombre flouté derrière la modale */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* noir semi-transparent */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* superposé à tout le reste */
  padding: 1rem;
}

/* Conteneur de la modale (la boîte blanche) */
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh; /* ne dépasse pas la hauteur de l'écran */
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Ligne de formulaire qui contient deux champs côte à côte */
.form-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap; /* Permet de passer en colonne si trop étroit */
}

/* Chaque champ prend 50% de la largeur minimum */
.form-group {
  flex: 1;
  min-width: 200px;
}

/* Label des champs */
label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

/* Styles pour les champs texte */
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
  resize: none; /* empêche l'utilisateur d'étirer les champs */
  box-sizing: border-box;
}

/* Zone des boutons en bas de la modale */
.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
