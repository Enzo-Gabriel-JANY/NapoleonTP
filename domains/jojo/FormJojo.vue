<script setup lang="ts">
  import type {JojoInterface} from '~/types/jojo'
  import {FORM_VALIDATIONS_RULES} from '~/constantes/formValidationsRules.const'

  const jojo = defineModel<JojoInterface | Omit<JojoInterface, 'id'>>({
    required: true,
  })

  let base64String : string ;
  let file : File ;
  const espece = ["Humain", "Animal", "Alien", "Mystique", "Machine", "Inconnu"];


function encodeImage(event : Event) { {
  const imageInput = event.target as HTMLInputElement;
  file = imageInput.files![0];
  console.log(1); 

    // Get the input element for the image
    
    if(file){
      // Read the selected image as a data URL
      const reader = new FileReader();
      reader.onload = () => {

        base64String = reader.result as string;
        //return base64String without the starting 'data:image/jpeg;base64,'
        switch(imageInput.name){
          case 'imageAnime':
            jojo.value.imageAnime=base64String.split(',')[1];
            break;
          case 'imageManga':
            jojo.value.imageManga=base64String.split(',')[1];
            break;
          case 'imageReference':
            jojo.value.imageReference=base64String.split(',')[1];
            break;
          case 'imageTechnique':
            if(jojo.value.imageTechnique[0].length<=1){
              jojo.value.imageTechnique[0]=base64String.split(',')[1];
            }
            else{
            jojo.value.imageTechnique.push(base64String.split(',')[1]);
            }
            break;
          case 'imageStandAnime':
            jojo.value.stand.imageAnime=base64String.split(',')[1];
            break;
          case 'imageStandManga':
            jojo.value.stand.imageManga=base64String.split(',')[1];
            break;
          case 'imageStandReference':
            jojo.value.stand.imageReference=base64String.split(',')[1];
            break;
          case 'imageStandCapacite':
          if(jojo.value.stand.imageCapacite[0].length<=1){
              jojo.value.stand.imageCapacite[0]=base64String.split(',')[1];
            }
            else{
            jojo.value.stand.imageCapacite.push(base64String.split(',')[1]);
            }
            break;
        }
      }
      reader.readAsDataURL(file);
    }

      return file;
    }   
}
let imageUrl : null;

function  previewPicture() {
      
    }
  

let createdDivsCapa = ref([] as number[]);

let createdDivsTech = ref([] as number[]);
let techniques = ref([]) as Ref<{ technique: string }[]>

let capacites = ref([]) as Ref<{ capacite: string }[]>


function addTechnique(){
  /** Ajoute une div technique avec un textfield et un fileinput */

  createdDivsTech.value.push(createdDivsTech.value.length);
  techniques.value.push({technique: ''});
  
}
function deleteDivTech(index : number){
  createdDivsTech.value.splice(index, 1);
  techniques.value.splice(index, 1);
  jojo.value.technique.splice(index, 1);

}


function addCapacite(){
  /** Ajoute une div capacite avec un textfield et un fileinput */
  createdDivsCapa.value.push(createdDivsCapa.value.length);
  capacites.value.push({capacite: ''});
}

function deleteDivCapa(index : number){
  createdDivsCapa.value.splice(index, 1);
  capacites.value.splice(index, 1);
  jojo.value.stand.capacite.splice(index, 1); // Remove corresponding element from capacite array
  jojo.value.stand.descriptionCapacite.splice(index, 1);

}
   
  
</script>

<template>
  <section class="sectionPres">
  <v-text-field
    v-model="jojo.nom"
    label="Prénom"
    class="prenom"
    clearable
  />
  <v-text-field
    v-model="jojo.familyName"
    label="Nom *"
    class="nom"
    :rules="[FORM_VALIDATIONS_RULES.required]"
    clearable
  />
  <v-text-field
    v-model.number="jojo.age"
    label="Age"
    type="number"
    class="age"
    :rules="[FORM_VALIDATIONS_RULES.onlyNumberPositif]"
    clearable
    
  />
  </section>
  <div class="divImage">
    <v-file-input
    @change="encodeImage"
    accept="image/*"
    counter
    show-size
    name="imageAnime"
    label="Image du personnage anime"
  />
  <v-file-input
    @change="encodeImage"
    accept="image/*"
    counter
    show-size
    name="imageManga"
    label="Image du personnage manga *"
  />
  <v-img v-if="imageUrl" :src="imageUrl" alt="Image du personnage" />
    </div>
    <section class="sectionDetail">
        <div class="divFirstDetail">
      <VSelect
        v-model="jojo.espece"
        label="Espece"
        :rules="[FORM_VALIDATIONS_RULES.required]"
        :items="espece"
        class="espece"
      />

      <VTextField
        v-model="jojo.description"
        label="Description"
        counter
        single-line
        maxlength="35"
        clearable
        class="description"/>
      </div>
      <div class="divSecondDetail">
      <v-text-field
        v-model.number="jojo.partie"
        label="Partie"
        type="number"
        hint="Entre 1 et 9"
        :min="1"
        :max="9"
        :rules="[FORM_VALIDATIONS_RULES.required, FORM_VALIDATIONS_RULES.onlyNumberBetween1and9]"
        class="partie"
      />

      <v-text-field
        v-model.number="jojo.rate"
        type="number"
        suffix=" / 20"
        label="Notes"
        :min="0"
        :max="20"
        :rules="[FORM_VALIDATIONS_RULES.required, FORM_VALIDATIONS_RULES.onlyNumberBetween0and20]"
        class="rate"
      />
</div>
      </section>
      <section class="sectionRefTech">
        <div class="divReference">
          <v-text-field
            v-model="jojo.reference"
            label="Référence musicale"
            clearable
          />
          <v-file-input
            @change="encodeImage"
            accept="image/*"
            counter
            show-size
            name="imageReference"
            label="Image d'une référence musicale"
          />
        </div>
        <div class="divTechnique">
          <div class="divInterTech" v-for="(div, index) in createdDivsTech" :key="index">
            <div id="divTech" class="divTech">
              <v-text-field
                v-model="jojo.technique[index]"
                label="Technique"
                clearable
              />
              <v-file-input
                @change="encodeImage"
                accept="image/*"
                counter
                show-size
                multiple
                name="imageTechnique"
                label="Image d'une technique"
              />
              <v-text-field
                v-model="jojo.descriptionTechnique[index]"
                label="Description de la technique"
                clearable
              />
            </div>
              <VBtn class= "btnDeleteDiv" @click="deleteDivTech(index)" icon="mdi-minus-circle-outline"/>
            
          </div>
        
          <VBtn class="btnAddTech" @click="addTechnique">Ajouter une technique</VBtn>
        </div>


      </section>
  <VCheckbox 
    v-model="jojo.hasStand"
    type="boolean"
    label="A-t-il un stand?"
  />

  <section id="stand" class="sectionStand" v-if="jojo.hasStand">
    <div class="divNomRateStand">
      <v-text-field
        v-model="jojo.stand.nom"
        label="Nom du stand *"
        :rules="[FORM_VALIDATIONS_RULES.required]"
        class="nomStand"
        clearable
      />
      <v-text-field
        v-model="jojo.stand.rate"
        suffix=" / 20"
        label="Notes"
        :min="0"
        :max="20"    
        class="rateStand"
        :rules="[FORM_VALIDATIONS_RULES.required, FORM_VALIDATIONS_RULES.onlyNumberPositif]"
        clearable
      />
      </div>
      <div class="divImageStand">
        <v-file-input
        @change="encodeImage"
        accept="image/*"
        counter
        show-size
        name="imageStandAnime"
        label="Image du stand anime"
      />
      <v-file-input
        @change="encodeImage"
        accept="image/*"
        counter
        show-size
        name="imageStandManga"
        label="Image du stand manga *"
      />
    </div>
      <VTextField
        v-model="jojo.stand.description"
        label="Description"
        counter
        single-line
        maxlength="30"
        clearable
        class="descriptionStand"/>
      
      <div class="divReferenceStand">
        <v-text-field
            v-model="jojo.stand.reference"
            label="Référence musicale"
            clearable
          />
          <v-file-input
            @change="encodeImage"
            accept="image/*"
            counter
            show-size
            name="imageStandReference"
            label="Image d'une référence musicale"
          />
      </div>
      <div class="divCapaciteStand">
        <div id="divCapa" class="divCapa" v-for="(div, index) in createdDivsCapa" :key="index">
        <v-text-field
            v-model="jojo.stand.capacite[index]"
            label="Nom d'une capacité"
            clearable
          />
          <v-file-input
            @change="encodeImage"
            accept="image/*"
            counter
            show-size
            multiple
            name="imageStandCapacite"
            label="Image de la capacité"
          />
          <v-text-field
            v-model="jojo.stand.descriptionCapacite[index]"
            label="Description de la capacité"
            clearable
            class="descriptionCapacite"
          />
          <VBtn class= "btnDeleteDivCapa" @click="deleteDivCapa(index)" icon="mdi-minus-circle-outline"/>
          </div>
          <VBtn class="btnAddCapa" @click="addCapacite">Ajouter une capacité</VBtn>

      </div>
      
    
    </section>

  
  


  
</template>

<style scoped>

/** SECTION PRESENTATION DU PERSONNAGE */

/*Premier bloc */

.sectionPres{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2rem;
}
.age{
  width: 2%;
  margin-left: 5rem;
}
.nom{
  width: 10%;
  margin-left: 10%;
}
.prenom{
  width: 10%;
}
.divImage{
  display: flex;
  flex-direction: row;
  padding: 2%;
}

/*Deuxième bloc */

.sectionDetail{
 display: flex;
 flex-direction: column;
  padding: 15%;
}
.divFirstDetail{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5rem;
}
.divSecondDetail{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.espece{
  width: 20%;
  margin-right: 25%;
  height: 2rem;
}
.description{
  width: 20%;
}

.partie{
  width: 20%;
  margin-right: 25%;
  
}
.rate{
  width: 20%;
}

/*3eme bloc*/

.sectionRefTech{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 7rem;
}
.divReference{
  display: flex;
  flex-direction: column;
  margin-left: 10%;
  height: 10rem;
  width: 35%;
}
.divTechnique{
  display: flex;
  flex-direction: column;
  margin-right: 10%;
  width: 35%;
}
.divInterTech{
  display: flex;
  flex-direction: row;
  margin-bottom: 2rem;
}
.divTech{
  display: flex;
  flex-direction: column;
  width: 100%;

}

.btnAddTech{
  width: 100%;
  font-size: small;
  border: .2rem solid lightgray;
}

.btnDeleteDiv{
  height: 90%;
  border-radius: 0%;
  background-color: rgb(179, 124, 124);
  width: 7%;
}

/** SECTION STAND */

/*1er bloc*/

.sectionStand{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
}
.divNomRateStand{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 70%;
  padding: 5%;
  
}
.nomStand{
  width: 60%;
  margin-right: 10%;
}

.rateStand{
  width: 30%;
  
}
.divImageStand{
  display: flex;
  flex-direction: row;
  width: 70%;
  margin-bottom: 5%;
  
}
.descriptionStand{
  width: 50%;
  margin-bottom: 3rem;
}

/*2eme bloc*/

.divReferenceStand{
  display: flex;
  flex-direction: column;
  width: 70%;
  padding: 10% 10% 5% 10%;
  background-color: rebeccapurple;
  margin-bottom: 5rem;

}


/*3eme bloc*/

.divCapaciteStand{
  display: flex;
  flex-direction: column;
  width: 90%;
}
.divCapa{
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 1rem;
}
.btnAddCapa{
  width: 100%;
  border: .2rem solid lightgray;

}
.btnDeleteDivCapa{
  border-radius: 0%;
  height: 3.5rem;
  background-color: rgb(179, 124, 124);
  width: 7%;
}
.descriptionCapacite{
  width: 25%;
  margin-left: 2rem;
}
</style>
