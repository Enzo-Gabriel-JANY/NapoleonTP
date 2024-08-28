<template>

  <v-container>

    <h1>Modifier la Bataille</h1>
    <v-form @submit.prevent="saveBataille">
      <transition-group name="fade" tag="v-row">
      <v-text-field
          v-model="bataille.nom"
          label="Nom de la bataille"
          :rules="[v => !!v || 'Le nom est requis']"
          required
      ></v-text-field>

      <v-text-field
          v-model="bataille.dateNb"
          label="Date en nombre"
          :rules="[v => !!v || 'La date est requise']"
          required
      ></v-text-field>

      <div>
        <label for="imageUpload">Télécharger une image :</label>
        <input type="file" @change="onFileChange" id="imageUpload" accept="image/*">
        <v-img
            :src="bataille.image"
            v-if="bataille.image"
            alt="Aperçu de l'image"
            max-width="200px"
        ></v-img>
      </div>
      <p><strong>Description</strong></p>
      <v-textarea
          v-model="bataille.desc[0].lieu"
          label="Lieu"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].date"
          label="Date"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].pertes"
          label="Pertes"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].forces"
          label="Forces"
      ></v-textarea>
      <v-textarea
          v-model="bataille.desc[0].situation"
          label="Situation Générale"
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
          <span>{{ bataille.victoire ? 'Oui' : 'Non' }}</span>
        </v-col>
      </v-row>

      <v-btn type="submit" class="mt-4">Enregistrer</v-btn>
      </transition-group>
    </v-form>

  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BatailleInterface } from '@/BatailleInterface';

const router = useRouter();
const route = useRoute();

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

let batailles = ref<BatailleInterface[]>([]);

const loadBataille = async () => {
  const id = Number(route.params.id);
  const batailleTrouvee = batailles.value.find(b => b.id === id);
  console.log(batailleTrouvee)

  if (batailleTrouvee) {
    bataille.value = batailleTrouvee;
  } else {
    try {
      const response = await fetch(`http://localhost:5000/bataille/${id}`);
      if (response.ok) {
        const data = await response.json();
        bataille.value = data;
        // Ajouter la bataille à la liste locale
        batailles.value.push(data);
      } else {
        console.error('Erreur lors de la récupération de la bataille:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la bataille:', error);
    }
  }
};

onMounted(loadBataille);

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
    const response = await fetch(`http://localhost:5000/bataille/${bataille.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bataille.value)
    });

    if (response.ok) {
      // Mettre à jour la bataille dans la liste locale
      const index = batailles.value.findIndex(b => b.id === bataille.value.id);
      if (index !== -1) {
        batailles.value[index] = bataille.value;
      } else {
        batailles.value.push(bataille.value);
      }
      // Mettre à jour localStorage
      localStorage.setItem('batailles', JSON.stringify(batailles.value));
      router.push({ name: 'Home' });
    } else {
      console.error('Erreur lors de la mise à jour de la bataille:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la bataille:', error);
  }
};
</script>

<style scoped>
/* Effet de fondu pour les batailles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
