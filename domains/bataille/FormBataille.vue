<script setup lang="ts">
  import type {BatailleInterface} from '~/types/bataille'
  import {FORM_VALIDATIONS_RULES} from '~/constantes/formValidationsRules.const'

  const bataille = defineModel<BatailleInterface | Omit<BatailleInterface, 'id'>>({
    required: true,
  })

  let base64String : string ;
  let file : File ;


function encodeImage(event : Event) { {
  const imageInput = event.target as HTMLInputElement;
  file = imageInput.files![0];
  console.log(1); 

    // Get the input element for the image
    
    if(file){
      // Read the selected image as a data URL
      const reader = new FileReader();
      reader.onload = () => {

        base64String = reader.result as string;
        //return base64String without the starting 'data:image/jpeg;base64,'
        bataille.value.image=base64String.split(',')[1];
        console.log(base64String);
        console.log(2);
      }
      reader.readAsDataURL(file);
    }

      return file;
    }
    // Make sure an image is selected
    
    
    
  
    
    
}



   
  
</script>

<template>
  <v-text-field
    v-model="bataille.nom"
    label="Nom"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.annee"
    label="Annee"
    type="number"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <VCheckbox 
    v-model="bataille.victoire"
    type="boolean"
    label="Victoire"
  />
  <v-text-field
    v-model="bataille.lieu"
    label="Lieu"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.force"
    label="Force"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.pertes"
    label="Pertes"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-text-field
    v-model="bataille.situation"
    label="Situation"
    :rules="[FORM_VALIDATIONS_RULES.required]"
  />
  <v-file-input
    @change="encodeImage"
    accept="image/png, image/jpeg"
    counter
    show-size
    label="Image"
  />
  <!--:value="bataille.image"-->
  


  
</template>

<style scoped></style>
