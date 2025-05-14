<script setup>
import { defineModel } from 'vue';
import FormCards from '@/components/FormCards.vue';

// Déclaration de la liaison bidirectionnelle
const open = defineModel();
const emit = defineEmits(['update' ,'end'])
const props = defineProps({
  item : Object ,
  newId: Number
})
// Fonction pour fermer la boîte de dialogue
function closeDialog() {
  open.value = false;
}

// Fonction pour soumettre le formulaire
function update(updatedItem){
  emit("update" ,updatedItem )
}
</script>

<template>
  <v-dialog v-model="open" max-width="60%" transition="dialog-fade" hide-overlay >
    <v-card style="background-color: #B8AFA2;">
      <v-card-title class="headline text-center"> Bataille</v-card-title>
      <v-card-text style="background-color: #B8AFA2;">
        <FormCards :item="props.item" @close="open = false" @updateItem="update" :new-id="props.newId"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Annuler</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
