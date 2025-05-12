<script setup>
import { ref } from 'vue'
import { mdiDeleteOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const path = ref(mdiDeleteOutline)
const colors = ref('')

// Prop idBataille pour récupérer l'ID de la bataille
const props = defineProps({
  idBataille: Number
})


const emit = defineEmits(['batailleSupprimee'])

function supprimerBataille(id) {
  console.log('Suppression déclenchée pour l\'ID :', id);
  const idString = String(id);
  const url = `http://localhost:3000/bataille/${idString}`;
  console.log('URL de suppression :', url);

  fetch(url, {
    method: 'DELETE'
  })
      .then(async response => {
        console.log('Réponse du serveur :', response);
        if (response.ok) {
          console.log('Suppression réussie');
          emit('batailleSupprimee', id);
        } else {
          const errorText = await response.text();
          console.error('Erreur lors de la suppression :', errorText);
        }
      })
      .catch(error => {
        console.error('Erreur réseau :', error);
      });
}

// Fonction pour changer la couleur de fond lors du survol
const changeBackgroundColor = (isMouseOver) => {
  colors.value = isMouseOver ? 'lightgrey' : ''
}
</script>

<template>
  <svg-icon
      class="icon"
      type="mdi"
      :path="path"
      :style="{ backgroundColor: colors }"
      @mouseover="changeBackgroundColor(true)"
      @mouseout="changeBackgroundColor(false)"
      @click="supprimerBataille(props.idBataille)"


  />
</template>

<style scoped>
.icon {
  border-radius: 50%;
  margin-left: 3%;
  border: 1.5px solid #222222;
  margin-top: 7%;
  cursor: pointer;
}
</style>
