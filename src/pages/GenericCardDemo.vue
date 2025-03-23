<template>
  <div class="card-container">
    <GenericCard
        title="Carte Explicite"
        :year="2020"
        image="https://placehold.co/300x300"
        @action="handleAction"
    >
      <template #default>
        <p>Cette carte est configurée avec une syntaxe explicite pour tous les slots.</p>
      </template>
      <template #actions>
        <button @click="moreInfo">Plus d'infos</button>
      </template>
    </GenericCard>
  </div>
</template>

<script setup>
import GenericCard from '@/components/GenericCard.vue';

function handleAction(payload) {
  console.log('Action principale émise :', payload);
  alert(`Action principale : ${payload.type}`);
}

function learnVue() {
  alert('Apprenez Vue.js dès aujourd’hui !');
}

function moreInfo() {
  alert('Voici plus d’informations.');
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
</style>
