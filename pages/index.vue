<template>
    <div>
      <div ref="captureElement" class="capture-content">
        <!-- Contenu à capturer -->
        <h1>Capture HTML avec html2canvas</h1>
        <p>Ce contenu sera capturé en image.</p>
      </div>
  
      <!-- Bouton pour déclencher la capture -->
      <v-btn @click="captureImage">Capturer et Afficher l'Image</v-btn>
  
      <!-- Image capturée sera affichée ici -->
      <div v-if="capturedImage" class="captured-image">
        <h2>Image Capturée :</h2>
        <img :src="capturedImage" alt="Capture d'écran">
      </div>
    </div>
  </template>
  
  <script>
  import html2canvas from 'html2canvas';
  
  export default {
    data() {
      return {
        capturedImage: null, // Stocke l'image capturée
      };
    },
    methods: {
      async captureImage() {
        const element = this.$refs.captureElement;
        try {
          // Capture l'élément en image
          const canvas = await html2canvas(element);
          // Convertit l'image en base64
          this.capturedImage = canvas.toDataURL('image/png');
          // Optionnel : pour télécharger l'image
          const link = document.createElement('a');
          link.href = this.capturedImage;
          link.download = 'capture.png';
          link.click();
        } catch (error) {
          console.error('Erreur lors de la capture:', error);
        }
      },
    },
  };
  </script>
  
  <style>
  .capture-content {
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .captured-image img {
    margin-top: 20px;
    border: 1px solid #000;
  }
  </style>