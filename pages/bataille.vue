<script setup lang="ts">
// Importation des types et modules nécessaires
import type { BatailleInterface } from "~/types/bataille";

// Récupération des données des batailles depuis l'API
const { data } = useFetch<Array<BatailleInterface>>('/api/bataille', {
  default: () => [] as Array<BatailleInterface>,
});

// Initialisation de l'icône pour l'affichage des détails
let icon = defineModel<'mdi-eye-minus-outline' | 'mdi-eye-plus'>({ required: true });
icon.value = 'mdi-eye-minus-outline';

// Fonction pour changer l'icône lorsqu'on survole
const changeIconOver = () => {
  if (icon.value === 'mdi-eye-minus-outline') {
    icon.value = 'mdi-eye-plus';
  }
};

// Fonction pour changer l'icône lorsqu'on quitte le survol
const changeIconOut = () => {
  if (icon.value === 'mdi-eye-plus') {
    icon.value = 'mdi-eye-minus-outline';
  }
};

// Référence pour stocker les descriptions étendues des batailles
const expandedDescriptions = ref([] as { id: number; elements: string[] }[]);

// Fonction pour vérifier si une description spécifique est étendue pour une bataille donnée
const isDescriptionExpanded = (batailleId: number, element: string) => {
  const expanded = expandedDescriptions.value.find((item) => item.id === batailleId);
  return expanded ? expanded.elements.includes(element) : false;
};

// Fonction pour basculer l'état d'expansion des détails d'une bataille
const toggleDescription = (batailleId: number) => {
  const index = expandedDescriptions.value.findIndex((item) => item.id === batailleId);

  if (index !== -1) {
    // La bataille a déjà des détails étendus, donc les supprimer
    expandedDescriptions.value.splice(index, 1);
  } else {
    // La bataille n'a pas de détails étendus, réinitialiser les autres à leur état initial
    expandedDescriptions.value = [];
    // Ajouter les nouveaux détails
    expandedDescriptions.value.push({ id: batailleId, elements: ['lieu', 'force', 'pertes', 'situation'] });
  }
};
</script>

<template>
  <div class="divParent">
    <div v-for="bataille in data" :key="bataille.id" class="divBataille">
      <span v-if="bataille.victoire" class="spanVictoire">
        <!-- Carte affichant le nom et l'année de la bataille -->
        <VCard class="card" :title="(bataille.nom + ' - ' + bataille.annee)">
          <!-- Image de la bataille encodée en base64 -->
          <img class="image" :src="`data:image/png;base64,${bataille.image}`" alt="decodedImage" width="100%" />
        </VCard>
        <!-- Contenu des détails de la bataille -->
        <div :id="'divInformation' + bataille.id" class="divInformation" ref="divInformation">
          <!-- Informations de base : Date et lieu -->
          <p class="pTitle">Date et lieu</p>
          <p class="pInfo">{{ bataille.lieu }}</p>
          <!-- Informations de base : Forces en présence -->
          <p class="pTitle">Forces en présence</p>
          <p class="pInfo">{{ bataille.force }}</p>
          <!-- Informations de base : Pertes -->
          <p class="pTitle">Pertes</p>
          <p class="pInfo">{{ bataille.pertes }}</p>
          <!-- Affichage conditionnel de la situation en fonction de l'expansion -->
          <p class="pTitle" v-if="isDescriptionExpanded(bataille.id, 'situation')">Situation</p>
          <p class="pInfo" v-if="isDescriptionExpanded(bataille.id, 'situation')">{{ bataille.situation }}</p>
        </div>
        <!-- Bouton pour basculer l'état d'expansion des détails -->
        <VBtn id="btnHidden" @mouseover="changeIconOver" @mouseout="changeIconOut"
        @click="toggleDescription(bataille.id)" :icon="icon"></VBtn>
      </span>
    </div>
  </div>
</template>

<style scoped>
.divParent {
  width: 90%;
  margin: 3% 5%;
  border: 0.2rem solid red;
  background-color: grey;
}

.spanVictoire {
  display: flex;
  width: 95%;
  margin: 2% 2%;
  padding: 2%;
  flex-direction: row;
  border: 0.2rem solid rgb(75, 73, 73);
}

.card {
  width: 35%;
  text-align: center;
  font-size: small;
  padding: 5px;
  background-color: none;
}

.divInformation {
  border: 0.2rem solid aquamarine;
  width: 60%;
  height: auto;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12;
  overflow: hidden; /* Ajout de la propriété overflow pour masquer le texte */
}

.pTitle {
  font-weight: bold;
  margin: 10px 0 10px 10px;
}

.pInfo {
  margin: 0 0 10px 40px;
}

.image {
  height: 60%;
}
</style>