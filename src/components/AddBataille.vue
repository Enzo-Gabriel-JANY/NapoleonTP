<template>
  <v-container>
    <h1>Ajouter une Bataille</h1>
    <v-form @submit.prevent="saveBataille" v-model="formIsValid">
      <v-text-field
          v-model="bataille.nom"
          label="Nom de la bataille"
          :rules="[v => !!v || 'Nom est requis']"
      ></v-text-field>

      <v-text-field
          v-model="bataille.dateNb"
          label="Date"
          :rules="[v => !!v || 'Date est requise']"
      ></v-text-field>

      <!-- Uploader d'image -->
      <div>
        <label for="imageUpload">Télécharger une image :</label>
        <input type="file" @change="onFileChange" id="imageUpload" accept="image/*">
        <v-img :src="bataille.image" v-if="bataille.image" alt="Aperçu de l'image" max-width="200px"></v-img>
      </div>

      <p><strong>Description</strong></p>
      <v-textarea
          v-model="bataille.desc[0].lieu"
          label="Lieu"
          :rules="[v => !!v || 'Lieu est requis']"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].date"
          label="Date"
          :rules="[v => !!v || 'Date est requise']"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].pertes"
          label="Pertes"
          :rules="[v => !!v || 'Pertes sont requises']"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].forces"
          label="Forces"
          :rules="[v => !!v || 'Forces sont requises']"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].situation"
          label="Situation Générale"
          :rules="[v => !!v || 'Situation est requise']"
      ></v-textarea>

      <v-row align="center" class="mt-4">
        <v-col cols="auto">
          <v-switch
              v-model="bataille.victoire"
              label="Victoire ?"
              :true-value="true"
              :false-value="false"
          ></v-switch>
        </v-col>
        <v-col>
          <span>{{ bataille.victoire ? 'Victoire' : 'Défaite' }}</span>
        </v-col>
      </v-row>

      <!-- Boutons Ajouter et Annuler côte à côte -->
      <v-row class="mt-4" justify="end">
        <v-col cols="auto">
          <v-btn type="submit" class="mr-2">Ajouter</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn type="button" @click="cancel">Annuler</v-btn>
        </v-col>
      </v-row>

    </v-form>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BatailleInterface } from '@/BatailleInterface';

const router = useRouter();
const bataille = ref<BatailleInterface>({
  id: 0,
  nom: '',
  dateNb: '',
  image: '',
  lieu: '',
  desc: [{
    forces: '',
    pertes: '',
    date: '',
    lieu: '',
    situation: ''
  }],
  detailed: false,
  victoire: false
});

let lastId = ref(0);
let batailles = ref<BatailleInterface[]>([]);

// Variable pour la validation du formulaire
const formIsValid = ref(false);

const loadBatailles = async () => {
  try {
    const response = await fetch('http://localhost:5000/bataille');
    const data = await response.json();
    batailles.value = data;
    if (data.length > 0) {
      lastId.value = Math.max(...data.map((b: BatailleInterface) => b.id));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des batailles:', error);
  }
};

onMounted(loadBatailles);

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      bataille.value.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const cancel = async () =>{
  await router.push({ name: 'Home' });
}

const saveBataille = async () => {
  if (formIsValid.value) {
    try {
      bataille.value.id = lastId.value + 1;

      const response = await fetch('http://localhost:5000/bataille', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bataille.value)
      });

      if (response.ok) {
        batailles.value.push(bataille.value);
        localStorage.setItem('batailles', JSON.stringify(batailles.value));
        router.push({ name: 'Home' });
      } else {
        console.error('Erreur lors de l\'ajout de la bataille:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la bataille:', error);
    }
  } else {
    console.log('Formulaire invalide');
  }
};
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
</style>
