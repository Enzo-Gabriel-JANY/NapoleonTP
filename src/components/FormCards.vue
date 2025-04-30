<script setup>
const formProps = defineProps({
  id : Number ,
  titre : String ,
  date : Date ,
  lieu : String ,
  img : String ,
  desc_forces_presentes : String ,
  desc_date_lieu : String ,
  desc_pertes : String
})
const save = defineEmits(['save'])

const handleClick = () => {
  save('save', formProps)
}
</script>

<template>
<form @submit.prevent="sendCards">
  <input v-model="formProps.titre"  type="text" placeholder="Nom de la bataille " >
  <input v-model="formProps.lieu" type="text" placeholder="Lieu de la bataille">
  <input v-model="formProps.img" type="text" placeholder="Lien de l'image">
  <textarea v-model="formProps.desc_forces_presentes" placeholder="Forces présentes"/>
  <textarea v-model="formProps.desc_date_lieu" placeholder="Date et lieu"/>
  <textarea v-model="formProps.desc_pertes" placeholder="Pertes"/>
  <input type="submit" value="Enregistrer" @click="save">
</form>
</template>

<style scoped>
form{display: flex ;
flex-direction: column ;
  width: 100%;
  margin-top: 2%;
  margin-bottom: 2%;


}
form :is(input, textarea) {
  border-radius: 6px;
  margin-top: 1%;
}


</style>