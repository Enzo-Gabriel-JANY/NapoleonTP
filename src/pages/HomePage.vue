<template>
  <v-container>
    <router-view></router-view> <!-- Affiche le contenu de la route actuelle -->
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>

</style>
