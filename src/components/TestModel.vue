<template>
  <div class="test-model">
    <!-- Liaison avec la prop customProp -->
    <input
        type="text"
        v-model="customText"
        placeholder="Tapez quelque chose..."
    />
    <p>Valeur interne : {{ customText }}</p>
  </div>
</template>

<script setup>
// Déclare le modèle pour `customProp`
const customText = defineModel('customProp', {
  type: String, // Type attendu
});
</script>

<style scoped>
.test-model {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 400px;
  margin: 1rem auto;
  text-align: center;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
</style>
