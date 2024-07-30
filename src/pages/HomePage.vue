<template>
  <v-container>
    <h1>Voici les Batailles de Napoléon</h1>
    <v-row>
      <v-col
          v-for="bataille in filteredBatailles"
          :key="bataille.id"
          cols="12"
      >
        <v-card class="landscape-card">
          <v-card-title class="title">
            {{ bataille.nom }} - {{ bataille.dateNb }}
          </v-card-title>
          <div class="card-content">
            <v-img
                :src="bataille.image"
                alt="Image de la bataille"
                class="card-image"
            ></v-img>
            <v-card-text class="card-text">
              <Buttoned
                  :description="bataille.desc[0]"
                  :detailed="bataille.detailed"
                  :updateDetailedState="newState => updateDetailedState(bataille.id, newState)"
              ></Buttoned>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Buttoned from '@/components/ButtonComponent.vue'
import { BatailleInterface } from '@/BatailleInterface'

const batailles = ref<BatailleInterface[]>([])

const fetchBataille = async () => {
  try {
    const response = await fetch('http://localhost:5000/bataille')
    const data = await response.json()
    // Assurez-vous que chaque image est au bon format
    batailles.value = data.map(bataille => {
      if (!bataille.image.startsWith('data:image/')) {
        // Si l'image n'est pas encore formatée correctement, ajoutez le préfixe approprié
        bataille.image = `data:image/png;base64,${bataille.image}`
      }
      return bataille
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des batailles:', error)
  }
}

onMounted(fetchBataille)

const updateDetailedState = (id: string, newState: boolean) => {
  batailles.value.forEach(b => {
    b.detailed = (b.id === id) ? newState : false
  })
}

const filteredBatailles = computed(() =>
    batailles.value.filter(b => b.victoire)
)
</script>


<style scoped>
.landscape-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin-bottom: 16px;
}

.title {
  font-weight: bold;
}

.card-content {
  display: flex;
  align-items: flex-start;
}

.card-image {
  width: 150px;
  height: auto;
  margin-right: 16px;
}

.card-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: calc(100% - 150px);
}


</style>
