<template>
  <v-container>
    <h1>Ajouter une Bataille</h1>
    <v-form @submit.prevent="saveBataille">
      <v-text-field v-model="bataille.nom" label="Nom de la bataille" required></v-text-field>
      <v-text-field v-model="bataille.dateNb" label="Date" required></v-text-field>

      <!-- Uploader d'image -->
      <div>
        <label for="imageUpload">Télécharger une image :</label>
        <input type="file" @change="onFileChange" id="imageUpload" accept="image/*">
        <v-img :src="bataille.image" v-if="bataille.image" alt="Aperçu de l'image" max-width="200px"></v-img>
      </div>
      <p><strong>Description</strong></p>
      <v-textarea v-model="bataille.desc[0].lieu" label="Lieu" required></v-textarea>
      <v-textarea v-model="bataille.desc[0].date" label="Date" required></v-textarea>
      <v-textarea v-model="bataille.desc[0].pertes" label="Pertes" required></v-textarea>
      <v-textarea v-model="bataille.desc[0].forces" label="Forces" required></v-textarea>
      <v-textarea v-model="bataille.desc[0].situation" label="Situation Générale" required></v-textarea>

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
          <span>{{ bataille.victoire ? 'Oui' : 'Non' }}</span>
        </v-col>
      </v-row>

      <v-btn type="submit" class="mt-4">Ajouter</v-btn>
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

// Variable pour stocker le dernier ID connu
let lastId = ref(0);
let batailles = ref<BatailleInterface[]>([]);

// Fonction pour charger les batailles existantes et déterminer le dernier ID
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

// Charger les batailles existantes lors du montage du composant
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

const saveBataille = async () => {
  try {
    // Définir l'ID de la nouvelle bataille
    bataille.value.id = lastId.value + 1;

    const response = await fetch('http://localhost:5000/bataille', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bataille.value)
    });

    if (response.ok) {
      // Ajouter la bataille à la liste locale
      batailles.value.push(bataille.value);
      // Mettre à jour localStorage
      localStorage.setItem('batailles', JSON.stringify(batailles.value));
      router.push({ name: 'Home' });
    } else {
      console.error('Erreur lors de l\'ajout de la bataille:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la bataille:', error);
  }
};
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
</style>
