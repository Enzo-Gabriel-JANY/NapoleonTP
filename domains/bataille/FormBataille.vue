<script setup lang="ts">
  import type {BatailleInterface} from '~/types/bataille'
  import {FORM_VALIDATIONS_RULES} from '~/constants/formValidationRules.const'

  const bataille = defineModel<BatailleInterface | Omit<BatailleInterface, 'id'>>({
    required: true,
  })

  let imageUrl: string | null = null;
  let file : File | undefined = undefined;
  const reader = new FileReader();

  const handleFileUpload = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
      file = inputElement.files?.[0];
      if (file) {
        reader.onload = () => {
          imageUrl = reader.result as string;
          bataille.value.image = imageUrl.split(',')[1]
        };
        reader.readAsDataURL(file); // Convertit le fichier en base64
      
      }
      return file;
  };
 
</script>

<template>
  <v-text-field
    v-model="bataille.nom"
    label="Nom"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model.number="bataille.annee"
    label="Annee"
    type="number"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.lieu"
    label="Lieu"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.force"
    label="Force en presence"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.pertes"
    label="Pertes"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model.number="bataille.situation"
    label="Situation"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />

  <!-- uploader une image -->
  <v-file-input type="file"  @change="handleFileUpload" />

  <v-checkbox
    v-model="bataille.victoire"
    label="Victoire ?"
  />

</template>

<style scoped></style>
