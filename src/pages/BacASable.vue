<template>
  <div>
    <h1>Test avec prop personnalisée</h1>
    <TestModel v-model:customProp="parentValue" />
    <p>Valeur dans le parent : {{ parentValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TestModel from "@/components/TestModel.vue";

// Définit la valeur initiale dans le parent
const parentValue = ref('Texte initial');
</script>
