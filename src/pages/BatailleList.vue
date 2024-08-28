<template style="display: flex">
  <h1>Voici les Batailles de Napoléon</h1>
  <v-row justify="center" class="align-center mb-4">
    <v-col cols="auto" class="d-flex align-center">
      <v-switch
          v-model="showVictories"
          :true-value="true"
          :false-value="false"
      ></v-switch>
    </v-col>
    <v-col cols="auto" class="d-flex align-center">
      <span>{{ showVictories ? 'Victoire' : 'Défaite' }}</span>
    </v-col>
  </v-row>

  <!-- Transition pour l'effet fondu -->
  <transition-group name="fade" tag="v-row">
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
            <v-row class="action-buttons">
              <v-btn color="info" icon @click="handleEdit(bataille.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" icon @click="deleteBataille(bataille.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-col>
  </transition-group>

  <v-row justify="center" class="mt-5">
    <v-btn color="success" @click="navigateToAddBataille" class="mx-auto" outlined>
      <v-icon>mdi-plus</v-icon>
      Ajouter une Bataille
    </v-btn>
  </v-row>
</template>


<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Buttoned from '@/components/ButtonComponent.vue';
import { BatailleInterface } from '@/BatailleInterface';

const batailles = ref<BatailleInterface[]>([]);
const selectedBataille = ref<BatailleInterface | null>(null);
const showVictories = ref(true); // Etat du switch, par défaut à true pour afficher les victoires
const router = useRouter();

const fetchBatailles = async () => {
  try {
    const response = await fetch('http://localhost:5000/bataille');
    const data = await response.json();
    batailles.value = data.map((bataille: BatailleInterface) => {
      if (!bataille.image.startsWith('data:image/')) {
        bataille.image = `data:image/png;base64,${bataille.image}`;
      }
      return bataille;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des batailles:', error);
  }
};

onMounted(fetchBatailles);

const updateDetailedState = (id: number, newState: boolean) => {
  batailles.value.forEach(b => {
    b.detailed = (b.id === id) ? newState : false;
  });
};

// Filtrage des batailles selon l'état du switch
const filteredBatailles = computed(() =>
    batailles.value.filter(b => b.victoire === showVictories.value)
);

const handleEdit = (id: number) => {
  router.push({ name: 'EditBataille', params: { id } });
};

const deleteBataille = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/bataille/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      batailles.value = batailles.value.filter(b => b.id !== id);
    } else {
      console.error('Erreur lors de la suppression de la bataille:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la bataille:', error);
  }
};

const navigateToAddBataille = () => {
  router.push({ name: 'AddBataille' });
};
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.mt-5 {
  margin-top: 40px;
}

/* Effet de fondu pour les batailles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

