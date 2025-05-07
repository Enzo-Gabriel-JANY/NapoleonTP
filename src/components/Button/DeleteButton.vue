<script setup>
import { ref } from "vue";
import { mdiDeleteOutline } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

const path = ref(mdiDeleteOutline);
const colors = ref('');

const props = defineProps({
  idBataille: Number
});
const emit = defineEmits(['batailleSupprimee']);

function supprimerBataille(id) {
  fetch(`http://localhost:3000/bataille/${id}`, {
    method: 'DELETE'
  })
      .then(response => {
        if (response.ok) {
          console.log(`Bataille ${id} supprimée.`);
          console.log(`http://localhost:5000/bataille/${id}`)
          emit('batailleSupprimee', id);
        } else {
          console.error('Erreur lors de la suppression.');

        }
      })
      .catch(error => {
        console.error('Erreur réseau :', error);
      });
}

const changeBackgroundColor = () => {
  colors.value = colors.value === "" ? "lightgrey" : "";
};
</script>

<template>
  <svg-icon
      class="icon"
      type="mdi"
      :path="path"
      :style="{ backgroundColor: colors }"
      @mouseover="changeBackgroundColor"
      @mouseout="changeBackgroundColor"
      @click="() => supprimerBataille(props.idBataille)"
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
