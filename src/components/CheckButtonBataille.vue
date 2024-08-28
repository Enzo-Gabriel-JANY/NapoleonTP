<!--<template>-->
<!--  <v-btn @click="checkAndRedirect">Ajouter une nouvelle bataille</v-btn>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, computed } from 'vue';-->
<!--import { useRouter } from 'vue-router';-->

<!--const router = useRouter();-->

<!--// ID des batailles existantes (peut être récupéré d'une API ou d'un store Vuex par exemple)-->
<!--const existingBatailleIds = ref<number[]>([1, 2, 3, 4]); // Exemple d'IDs existants-->

<!--// ID à vérifier (cet ID pourrait être passé en prop ou récupéré autrement)-->
<!--const newBatailleId = ref<number>(5); // Exemple d'ID à vérifier-->

<!--// Fonction pour vérifier si la bataille existe-->
<!--const batailleExists = computed(() => existingBatailleIds.value.includes(newBatailleId.value));-->

<!--const checkAndRedirect = () => {-->
<!--  if (!batailleExists.value) {-->
<!--    router.push({ name: 'BatailleForm' }); // Remplacez 'BatailleForm' par le nom de la route de votre formulaire-->
<!--  } else {-->
<!--    alert('La bataille existe déjà !'); // Remplacez ceci par une gestion d'erreur appropriée-->
<!--  }-->
<!--};-->
<!--</script>-->
