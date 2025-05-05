<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Card from '@/components/Card.vue'
import Modale from '@/components/Modale.vue'
import AddBatailleButton from '@/components/Button/AddBatailleButton.vue'

const props = defineProps({
  voidItem: Object
})

const newID = ref(-1)
const itemEdited = ref({})
const data = ref(null)
const expandedItems = ref([])
const modalForm = ref(false)
const searchTerm = ref('')
const searchTriggered = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/bataille')
    data.value = await res.json()
    getLastId()

    // Initialisation sécurisée de itemEdited
    itemEdited.value = JSON.parse(JSON.stringify(
        props.voidItem ?? {
          id: "-1",
          nom: '',
          date: new Date(),
          lieu: '',
          img: '',
          description: {
            dateLieu: '',
            forcePresentes: '',
            pertes: '',
            situationGenerale: ''
          },
          victoire: true
        }
    ))
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

const dataVictoire = computed(() => {
  return data.value ? data.value.filter(item => item.victoire) : []
})

const toggleDescription = (itemId) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index === -1) {
    expandedItems.value.splice(0, expandedItems.value.length)
    expandedItems.value.push(itemId)
  } else {
    expandedItems.value.splice(index, 1)
  }
}

const isExpanded = (itemId) => {
  return expandedItems.value.includes(itemId)
}

function handleSuppression(idSupprime) {
  data.value = data.value.filter(b => b.id !== idSupprime)
}

const filteredData = computed(() => {
  if (!searchTriggered.value || searchTerm.value.trim() === '') {
    return dataVictoire.value
  }

  const query = searchTerm.value.toLowerCase().trim()
  return dataVictoire.value.filter(item => {
    const nom = item.nom?.toLowerCase() || ''
    const annee = item.date?.split(' ')[2] || ''
    return nom.includes(query) || annee.includes(query)
  })
})
watch(data.value , newVal =>{
  data.value.length = newVal.value.length
})
function triggerSearch() {
  searchTriggered.value = true
}

function getLastId() {
  newID.value = data.value ? data.value.length  : 0
}

watch(modalForm, (newVal) => {
  if (newVal) {
    itemEdited.value = JSON.parse(JSON.stringify(props.voidItem ?? {
      id: -1,
      nom: '',
      date: new Date(),
      lieu: '',
      img: '',
      description: {
        dateLieu: '',
        forcePresentes: '',
        pertes: '',
        situationGenerale: ''
      },
      victoire: true
    }))
  }
})
</script>

<template>
  <AddBatailleButton @click="modalForm = true" />
  <v-container class="mb-4">
    <v-row>
      <v-col cols="10">
        <v-text-field
            v-model="searchTerm"
            label="Rechercher une bataille (titre ou année)"
            clearable
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="triggerSearch"
        />
      </v-col>
      <v-col cols="2">
        <v-btn color="#B8AFA2" class="mt-2" @click="triggerSearch" block>
          Rechercher
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <div class="deck">
    <Card
        class="card"
        v-for="item in filteredData"
        :key="item.id"
        :item="item"
        :is-expanded="isExpanded"
        :toggle-description="toggleDescription"
        @batailleSupprimee="handleSuppression"
    />
  </div>

  <Modale v-model="modalForm" :item="itemEdited" :newId="newID" />
</template>

<style>
.card {
  margin-bottom: 1%;
}
.deck {
  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 5%;
}
body {
  background-color: #4A5568;
}
</style>
