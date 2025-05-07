<script setup>
import moment from 'moment'
import 'moment/locale/fr'
import { VDateInput } from 'vuetify/labs/VDateInput'
import '@mdi/font/css/materialdesignicons.css'
import { ref } from 'vue'
const minDate = '1769-08-15'
const maxDate = '1821-05-05'
const props = defineProps({
  item: Object,
  newId: Number
})
function handleFileUpload(event) {
  const file = event.target?.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {

    props.item.img = reader.result
  }
  reader.readAsDataURL(file)
}
const closeEmit = defineEmits(['close', 'updateItem'])

const formattedDate = ref(new Date(props.item.date)) // Par défaut, tu convertis en Date


if (props.item.id == -1) {

  if (moment(props.item.date, 'D MMMM YYYY', true).isValid()) {
    formattedDate.value = moment(props.item.date, 'D MMMM YYYY').toDate();
  } else {
    formattedDate.value = new Date(props.item.date);
  }
}

const form = ref(null)

const rules = {
  required: v => !!v || 'Ce champ est requis',
  validDateRange: v => {

    const date = new Date(v)
    if (isNaN(date.getTime())) return 'Date invalide'

    const min = new Date(1769, 7, 15).getTime()
    const max = new Date(1821, 4, 5).getTime()
    const val = date.getTime()
    return (val >= min && val <= max) || 'Date invalide : entre 15 août 1769 et 5 mai 1821'
  }
}
/*
Besoin de clear bataille sinon stocker car reactive ici je créer une copie pas reactive qui est send
 */
async function createBataille() {
  try {
    props.item.date = moment(formattedDate.value).locale('fr').format('D MMMM YYYY')
    props.item.id = props.newId.toString()
    const response = await fetch('http://localhost:3000/bataille', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props.item)
    })



    if (response.ok) {
      const text = await response.text(); // essaie d'abord de lire comme texte

      if (text) {
        const data = JSON.parse(text); // ou utiliser response.json() si tu es sûr
        // suite du traitement
      } else {
        console.warn("Réponse vide");
      }
    } else {
      console.error("Erreur HTTP :", response.status);
    }
  } catch (error) {
    console.error('Erreur lors de la création :', error)
    throw error
  }
}


console.log(props.newId)
async function updateBataille(id, updatedData) {
  try {
    props.item.date = moment(formattedDate.value).locale('fr').format('D MMMM YYYY')

    const response = await fetch(`http://localhost:5000/bataille/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    throw error
  }
}

async function close(id, updatedData) {
  const isValid = await form.value.validate()
  if (!isValid.valid) return

  if (id === -1) {
    await createBataille()
  } else {
    await updateBataille(id, updatedData)
  }

  closeEmit('updateItem', props.item)
  closeEmit('close')
}
</script>
<template>
  <v-form ref="form">
    <v-text-field
        v-model="props.item.nom"
        label="Nom de la bataille"
        :rules="[rules.required]"
        required
    ></v-text-field>

    <v-date-input
        v-model="formattedDate"
        label="Date de la bataille"
        locale="fr"
        color="primary"
        variant="outlined"
        class="date-input"
        :min="minDate"
        :max="maxDate"
        :rules="[rules.required, rules.validDateRange]"
    ></v-date-input>

    <v-text-field
        v-model="props.item.lieu"
        label="Lieu de la bataille"
        :rules="[rules.required]"
        required
    ></v-text-field>

      <v-file-input
          label="Image de la bataille"
          accept="image/*"
          @change="handleFileUpload"
          prepend-icon="mdi-image"
      ></v-file-input>


    <v-textarea
        v-model="props.item.description.dateLieu"
        label="Date et lieu"
        auto-grow
        :rules="[rules.required]"
    ></v-textarea>

    <v-textarea
        v-model="props.item.description.forcePresentes"
        label="Forces présentes"
        auto-grow
        :rules="[rules.required]"
    ></v-textarea>

    <v-textarea
        v-model="props.item.description.pertes"
        label="Pertes"
        auto-grow
        :rules="[rules.required]"
    ></v-textarea>

    <v-textarea
        v-model="props.item.description.situationGenerale"
        label="Situation générale"
        auto-grow
    ></v-textarea>

    <v-checkbox
        v-model="props.item.victoire"
        label="Victoire"
    ></v-checkbox>

    <v-btn color="primary" @click="close(props.item.id, props.item)">
      Enregistrer
    </v-btn>
  </v-form>
</template>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2%;
  margin-bottom: 2%;
}

form :is(input, textarea) {
  border-radius: 6px;
  margin-top: 1%;
}

.date-input {
  --v-theme-on-surface: #000;
}
</style>
