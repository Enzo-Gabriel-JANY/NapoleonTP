<!--<template>-->
<!--  <v-container>-->
<!--    <v-form ref="form" v-model="valid" lazy-validation>-->
<!--      <v-text-field-->
<!--          v-model="bataille.nom"-->
<!--          :rules="[rules.required]"-->
<!--          label="Nom"-->
<!--          required-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="bataille.dateNb"-->
<!--          :rules="[rules.required]"-->
<!--          label="Date"-->
<!--          required-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="bataille.lieu"-->
<!--          :rules="[rules.required]"-->
<!--          label="Lieu"-->
<!--          required-->
<!--      />-->
<!--      <v-checkbox-->
<!--          v-model="bataille.victoire"-->
<!--          label="Victoire"-->
<!--      />-->
<!--      <v-switch-->
<!--          v-model="bataille.detailed"-->
<!--          label="Détaillé"-->
<!--      />-->
<!--      <v-file-input-->
<!--          v-model="imageFile"-->
<!--          label="Image"-->
<!--          accept="image/*"-->
<!--          @change="handleImageUpload"-->
<!--      />-->
<!--      <v-textarea-->
<!--          v-model="bataille.image"-->
<!--          label="Image en base64"-->
<!--          :rules="[rules.required]"-->
<!--          readonly-->
<!--      />-->

<!--      <v-text-field-->
<!--          v-model="description.forces"-->
<!--          label="Forces"-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="description.pertes"-->
<!--          label="Pertes"-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="description.date"-->
<!--          label="Date"-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="description.lieu"-->
<!--          label="Lieu"-->
<!--      />-->
<!--      <v-text-field-->
<!--          v-model="description.situation"-->
<!--          label="Situation"-->
<!--      />-->

<!--      <v-btn @click="saveBataille" :disabled="!valid">Sauvegarder</v-btn>-->
<!--      <v-btn @click="updateBataille" :disabled="!bataille.id">Modifier</v-btn>-->
<!--      <v-btn @click="deleteBataille" :disabled="!bataille.id" color="red">Supprimer</v-btn>-->
<!--    </v-form>-->
<!--  </v-container>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref } from 'vue';-->
<!--import { useRouter } from 'vue-router';-->
<!--import { useSnackbar } from 'vuetify';-->

<!--const router = useRouter();-->
<!--const snackbar = useSnackbar();-->

<!--const valid = ref(false);-->
<!--const imageFile = ref(null);-->
<!--const bataille = ref({-->
<!--  id: null,-->
<!--  nom: '',-->
<!--  dateNb: '',-->
<!--  image: '',-->
<!--  lieu: '',-->
<!--  desc: [],-->
<!--  detailed: false,-->
<!--  victoire: false,-->
<!--});-->
<!--const description = ref({-->
<!--  forces: '',-->
<!--  pertes: '',-->
<!--  date: '',-->
<!--  lieu: '',-->
<!--  situation: '',-->
<!--});-->

<!--const rules = {-->
<!--  required: value => !!value || 'Champ requis',-->
<!--};-->

<!--const handleImageUpload = (event) => {-->
<!--  const file = event.target.files[0];-->
<!--  const reader = new FileReader();-->
<!--  reader.onloadend = () => {-->
<!--    bataille.value.image = reader.result.split(',')[1]; // Encodage en base64-->
<!--  };-->
<!--  if (file) {-->
<!--    reader.readAsDataURL(file);-->
<!--  }-->
<!--};-->

<!--const saveBataille = () => {-->
<!--  // Code pour sauvegarder la bataille dans la base de données-->
<!--  snackbar.open('Bataille sauvegardée');-->
<!--};-->

<!--const updateBataille = () => {-->
<!--  // Code pour mettre à jour la bataille dans la base de données-->
<!--  snackbar.open('Bataille mise à jour');-->
<!--};-->

<!--const deleteBataille = () => {-->
<!--  // Code pour supprimer la bataille de la base de données-->
<!--  snackbar.open('Bataille supprimée');-->
<!--};-->

<!--// Méthode pour charger les données de la bataille si nécessaire-->
<!--const loadBataille = (id) => {-->
<!--  // Code pour charger les données de la bataille depuis la base de données-->
<!--  // Remplir `bataille` et `description` avec les données chargées-->
<!--};-->

<!--</script>-->

<!--<style scoped>-->
<!--/* Ajouter des styles si nécessaire */-->
<!--</style>-->
