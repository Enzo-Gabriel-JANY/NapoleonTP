<script setup lang="ts">
// Importation des types et modules nécessaires
import type { JojoInterface } from "~/types/jojo";
import {jojoFormDefaultValueConst} from '~/domains/jojo/jojoFormDefaultValue.const'

import { onMounted,ref } from "vue";





// Récupération des données des batailles depuis l'API
const { data : dataJojo , refresh } = useFetch<Array<JojoInterface>>('/api/jjba/', {
  default: () => [] as Array<JojoInterface>,

});



 // Créez un tableau pour stocker tous les likes qu'il soit personnage ou stand
//   let allLikes = ref([] as Array<JojoInterface>);

//  dataJojo.value.forEach(jojo => {
//    if ( ((jojo.liked == true) || (jojo.stand.liked == true)) && !allLikes.value.includes(jojo)) {
//      allLikes.value.push(jojo);
//    }
//  console.log(allLikes.value)
//  });

//hook computed
const color = computed(() => {
  switch (categorie.value) {
    case 'Personnage': return 'brown'
    case 'Stand' : return 'indigo'
    case 'Like' : return 'teal'
    default:  return 'blue-grey'
    
  }
})
  
  let categorie = ref("Personnage");
  let jojoConcerne = ref(null as JojoInterface | null);

// Fonction pour basculer l'état d'expansion des détails d'une bataille
const toggleDescription = (id: number) => {
// Vérifier si le jojo est déjà en mode plus d'info
if (jojoConcerne.value && jojoConcerne.value.id === id) {
    // Si oui, remettre le jojo dans la liste des autres jojos
    jojoConcerne.value = null;
  } else {
    // Sinon, trouver le jojo correspondant à l'ID et le mettre en mode plus d'info
    jojoConcerne.value = dataJojo.value.find(jojo => jojo.id === id) || null;
  }
}

const toggleMoinsInfo = () => {
  jojoConcerne.value= null;
}




  const deleteJojo = async (jojo: JojoInterface) => {
    await useFetch(`/api/jjba/${jojo.id}`, {
      method: 'DELETE',
      onResponse: ({response}) => {
        if (response.ok) {
          refresh()
        }
      },
    })
  }
  function deleteStand (jojo: JojoInterface) {
    jojo.hasStand = false;
    jojo.stand = jojoFormDefaultValueConst.stand;
    console.log(jojoFormDefaultValueConst)

    console.log(jojoFormDefaultValueConst.stand)
    console.log(jojo.stand)
    //async
    // = useFetch(`/api/jjba/${id}`, {
    // method: Methods.PUT,
    // immediate: false,
    // watch: false,
    // body: data,
    // onResponse({response}) {
    //   if (response.ok) {
    //     useRouter().back()
    //   }
    // },
  }

 

  
  
// Fonction pour changer l'icône lorsqu'on survole
const handleChangeLike = (id: number) => {
  const jojo = dataJojo.value.find(jojo => jojo.id === id);
  if(jojo){
  switch(categorie.value) {
    case 'Personnage':
      jojo.liked = !jojo.liked;
      break;
    case 'Stand':
      jojo.stand.liked = !jojo.stand.liked;
      break;

      //TODO like le stand ou le perso
    case 'Like':
      if (jojo.liked) {
        jojo.liked = !jojo.liked;
      
      }else if(jojo.stand.liked) {
        jojo.stand.liked = !jojo.stand.liked;
      }
      break;
  }
}
}

  
  // Fonction pour changer l'icône lorsqu'on survole
  

  let search = ref("");
  let parties=ref<number[]>([]);

  let allParties = [{title:"Phantom Blood", value: 1}, {title:"Battle tendency", value: 2},
              {title:"Stardust Crusaders", value: 3}, {title:"Diamond is unbreakable", value: 4},
              {title:"Golden Wind", value: 5}, {title:"Stone Ocean", value: 6},
              {title:"Steel ball run", value: 7}, {title:"Jojolion", value: 8},
              {title:"Jojoland", value: 9}];

function filteredList() {
  switch(categorie.value) {
    case 'Personnage':
  
        if (parties.value.length === 0) {
          return dataJojo.value.filter((jojo) =>
            jojo.nom.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.familyName.toLowerCase().includes(search.value.toLowerCase())
          );
        }else {
          return dataJojo.value.filter((jojo) =>
            (jojo.nom.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.familyName.toLowerCase().includes(search.value.toLowerCase())) &&
            parties.value.includes(jojo.partie) 
          );
        }
    case 'Stand':
      if (parties.value.length === 0) {
          return dataJojo.value.filter((jojo) =>
            jojo.stand.nom.toLowerCase().includes(search.value.toLowerCase())
          );
        }else {
          return dataJojo.value.filter((jojo) =>
            jojo.stand.nom.toLowerCase().includes(search.value.toLowerCase()) &&
            parties.value.includes(jojo.partie) 
          );
        }
    case 'Like':
        if (parties.value.length === 0) {
          return dataJojo.value.filter((jojo) =>
            jojo.nom.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.familyName.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.stand.nom.toLowerCase().includes(search.value.toLowerCase())
          );
        }else {
          return dataJojo.value.filter((jojo) =>
            (jojo.nom.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.familyName.toLowerCase().includes(search.value.toLowerCase()) ||
            jojo.stand.nom.toLowerCase().includes(search.value.toLowerCase())) &&
            parties.value.includes(jojo.partie) 
          );
        }
        default:
        return dataJojo.value.filter((jojo) =>
          jojo.nom.toLowerCase().includes(search.value.toLowerCase()) ||
          jojo.familyName.toLowerCase().includes(search.value.toLowerCase()) ||
          jojo.stand.nom.toLowerCase().includes(search.value.toLowerCase())
        );
  }
}


//TRI ALPHABETIQUE

let sortOrder = ref<'asc' | 'desc'>('asc');


// Méthode pour effectuer le tri alphabétique
const sortAlphabetically = () => {

  switch (categorie.value) {
    // Tri alphabétique basé sur la catégorie sélectionnée
    case "Personnage":
      dataJojo.value.sort((a, b) => (sortOrder.value === 'asc' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)));
      break;
    case "Stand":
      dataJojo.value.sort((a, b) => (sortOrder.value === 'asc' ? a.stand.nom.localeCompare(b.stand.nom) : b.stand.nom.localeCompare(a.stand.nom)));
      break;
    case "Like":
      dataJojo.value.sort((a, b) => (sortOrder.value === 'asc' ? (a.stand.nom + a.nom).localeCompare(b.stand.nom + b.nom) : (b.stand.nom + b.nom).localeCompare(a.stand.nom + a.nom)));
      break;
  }
};

</script>
<template>
  <div class="divParent">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Rechercher..." class="searchInput" />
      <v-btn-toggle @click="sortAlphabetically" v-model="sortOrder" divided>
        <v-btn value="asc"><v-icon>mdi-sort-alphabetical-ascending</v-icon></v-btn>
        <v-btn value="desc"><v-icon>mdi-sort-alphabetical-descending</v-icon></v-btn>
      </v-btn-toggle>
      <VSelect clearable multiple label="Partie(s)" class="selectBox"
        :items="allParties" v-model="parties">
        <template v-slot:selection="{ item, index }">
      <v-chip v-if="index < 2">
        <span>{{ item.title }}</span>
      </v-chip>
      <span
        v-if="index === 2"
        class="text-grey text-caption align-self-center"
      >
        (+{{ parties.length - 2 }} others)
      </span>
    </template>
      </VSelect>
      <v-bottom-navigation v-model="categorie"  mode="shift" :bg-color="color" class="vBottom" >
        <v-btn value="Personnage" ><v-icon>mdi-account-group</v-icon><span>Personnages</span></v-btn>
        <v-btn value="Stand"><v-icon>mdi-star-shooting</v-icon><span>Stand</span></v-btn>
        <v-btn value="Like"><v-icon>mdi-heart-multiple</v-icon><span>Like</span></v-btn>
        <v-btn id="btnAjout" :href="'/jojo/create'" class="btnAjout" ><v-icon>mdi-creation-outline</v-icon><span>Création</span></v-btn>
      </v-bottom-navigation>
    
    </div>
   

<main class="mainJojo">

  















  <!-------------------------------------SECTION PERSONNAGE ---------------------------------->
  <span class="all" v-if="categorie.valueOf() == 'Personnage'">

  
<section class="sectionDetail" v-if="jojoConcerne!= null">
  <!--VERSION PLUS D'INFO-->
  <VCard :title="(jojoConcerne.nom + ' ' + jojoConcerne.familyName )" :subtitle="jojoConcerne.description"  class="cardPlusInfo"> 
    <div class="divImagePlusInfo">
      <figure class="figureImage" v-if="jojoConcerne.imageAnime">
        <img :src="`data:image/png;base64,${jojoConcerne.imageAnime}`" class="imageAnimePlusInfo" height="250"/>
        <legend>Anime</legend>
      </figure>
      <figure class="figureImage" v-if="jojoConcerne.imageManga">
        <img :src="`data:image/png;base64,${jojoConcerne.imageManga}`" class="imageMangaPlusInfo" height="250"/>
        <legend>Manga</legend>
      </figure>
    </div> 
    <VList class="listInfo">
      <div class="listInfoPersonnel">
        <VListItem>
          <VListItemTitle>Age : {{jojoConcerne.age}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Espece : {{jojoConcerne.espece}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Partie : {{jojoConcerne.partie}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Note : {{jojoConcerne.rate}}  /20</VListItemTitle>
        </VListItem>
      </div>
    </VList>

    <section class="sectionRefTech">
      <section class="sectionRef" v-if="jojoConcerne.reference.length > 0">
        <VCard title="Références" class="card">
          <img :src="`data:image/png;base64,${jojoConcerne.imageReference}`" width="250" height="250"/>
          <VCardText>{{ jojoConcerne.reference }}</VCardText>
        </VCard>
      </section>

      <section class="sectionTech" v-if="jojoConcerne.technique[0].length > 0">
        <VCard title="Techniques" class="card" max-height="500">
          <VCarousel show-arrows="hover" hide-delimiters height="300" >
            <VCarouselItem v-for="(technique, i) in jojoConcerne.technique" :key="i">
              <VCardText>{{technique}}</VCardText>
              <VSheet ><img :src="`data:image/png;base64,${jojoConcerne.imageTechnique[i]}`" class="image"></VSheet>
              <VCardText>{{jojoConcerne.descriptionTechnique[i]}}</VCardText>
            </VCarouselItem>
          </VCarousel> 
        </VCard>
      </section>
    </section>

    <div class="divActions">
      <VBtn class="btnStand" v-if="jojoConcerne.hasStand" @click="categorie='Stand'">Voir le stand</VBtn>
      <VBtn id="btnLike" :icon="jojoConcerne.liked ? 'mdi-heart-remove' : 'mdi-heart-plus-outline'" @click="handleChangeLike(jojoConcerne.id)"></VBtn>
      <VBtn id="btnModif" :href="`/jojo/update/${jojoConcerne.id}`" icon="mdi-pencil-plus"></VBtn>
      <VBtn id="btnDelete" icon="mdi-delete-empty" @click="deleteJojo(jojoConcerne)"></VBtn>
    </div>
    <VBtn class="btnDetail" @click="toggleMoinsInfo()">Moins d'info</VBtn> 
  </VCard> 
  </section>


  
  <section v-for="(jojo, index) in filteredList()" :key="index" class="sectionBoucle">
  



  <!--VERSION RESUME-->
  <VCard :title="(jojo.nom + ' ' + jojo.familyName )" :subtitle="jojo.description" class="cardMoinsInfo"> 
    <div v-if="jojo.imageAnime">
      <img :src="`data:image/png;base64,${jojo.imageAnime}`" width=100% height=150 />
    </div>
    <div v-else>
      <img :src="`data:image/png;base64,${jojo.imageManga}`"/>
    </div> 
    <VBtn class="btnDetail" @click="toggleDescription(jojo.id)">Plus d'info</VBtn> 
  </VCard> 
  </section>
</span>













        <!-------------------------------------SECTION STAND ---------------------------------->
      <span class="all" v-if="categorie.valueOf() == 'Stand'">

        <section class="sectionDetail" v-if="jojoConcerne!= null">
            <!--VERSION PLUS D'INFO-->
          <VCard :title="(jojoConcerne.stand.nom)" :subtitle="jojoConcerne.stand.description" v-if="jojoConcerne.hasStand" class="cardPlusInfo"> 
            <div class="divImagePlusInfo">
              <figure class="figureImage" v-if="jojoConcerne.stand.imageAnime">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageAnime}`" class="imageAnimePlusInfo" height="250"/>
                <legend>Anime</legend>
              </figure>
              <figure class="figureImage" v-if="jojoConcerne.stand.imageManga">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageManga}`" class="imageMangaPlusInfo" height="250"/>
                <legend>Manga</legend>
              </figure>
            </div> 
          <VList class="listInfo">
            <div class="listInfoPersonnel">
              <VListItem>
                <VListItemTitle>Manieur : {{jojoConcerne.nom }} {{jojoConcerne.familyName}}</VListItemTitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Partie : {{jojoConcerne.partie}}</VListItemTitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Note : {{jojoConcerne.stand.rate}}  /20</VListItemTitle>
              </VListItem>
            </div>
          </VList>

          <section class="sectionRefTech">
            <section class="sectionRef" v-if="jojoConcerne.stand.reference.length > 0">
              <VCard title="Références" class="card">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageReference}`" width="250" height="250"/>
                <VCardText>{{ jojoConcerne.stand.reference }}</VCardText>
              </VCard>
            </section>

            <section class="sectionTech" v-if="jojoConcerne.stand.capacite[0].length > 0">
              <VCard title="Techniques" class="card" max-height="500">
                <VCarousel show-arrows="hover" hide-delimiters height="auto" >
                  <VCarouselItem v-for="(capacite, i) in jojoConcerne.stand.capacite" :key="i">
                    <VCardText>{{capacite}}</VCardText>
                    <VSheet ><img :src="`data:image/png;base64,${jojoConcerne.stand.imageCapacite[i]}`" width="250" height="200" ></VSheet>
                    <VCardText>{{jojoConcerne.stand.descriptionCapacite[i]}}</VCardText>
                  </VCarouselItem>
                </VCarousel> 
              </VCard>
            </section>
          </section>

        <div class="divActions">
          <VBtn class="btnStand" @click="categorie='Personnage'">Voir le manieur</VBtn>
          <!--TODO like le stand -->

          <VBtn id="btnLike" :icon="jojoConcerne.stand.liked ? 'mdi-heart-remove' : 'mdi-heart-plus-outline'" @click="handleChangeLike(jojoConcerne.id)"></VBtn>
          <VBtn id="btnModif" :href="`/jojo/update/${jojoConcerne.id}#stand`" icon="mdi-pencil-plus"></VBtn>
          <!--TODO suppr le stand -->
          <VBtn id="btnDelete" icon="mdi-delete-empty" @click="deleteStand(jojoConcerne)"></VBtn>
        </div>
        <VBtn class="btnDetail" @click="toggleMoinsInfo()">Moins d'info</VBtn> 
      </VCard> 
    </section>



        
        <section v-for="(jojo, index) in filteredList()" :key="index" class="sectionBoucle">
          <span v-if="jojo.hasStand" >
  <!--VERSION RESUME-->
  <VCard :title="(jojo.stand.nom )" :subtitle="jojo.stand.description" class="cardMoinsInfo"> 
    <div v-if="jojo.stand.imageAnime" >
      <img :src="`data:image/png;base64,${jojo.stand.imageAnime}`" width="250" height=150 />
    </div>
    <div v-else>
      <img :src="`data:image/png;base64,${jojo.stand.imageManga}`" width=250 height=150/>
    </div> 
    <VBtn class="btnDetail" @click="toggleDescription(jojo.id)">Plus d'info</VBtn> 
  </VCard> 
  </span>
</section>
</span>























    <!-----------------------------------------------------SECTION LIKE ------------------------------------------------>
        <span class="all" v-if="categorie.valueOf() == 'Like'">

  
<section class="sectionDetail" v-if="jojoConcerne!= null ">

  <!--------------------------VERSION STAND------------------------>

  <VCard :title="(jojoConcerne.stand.nom)" :subtitle="jojoConcerne.stand.description"
   v-if="jojoConcerne.stand.liked" class="cardPlusInfo"> 
            <div class="divImagePlusInfo">
              <figure class="figureImage" v-if="jojoConcerne.stand.imageAnime">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageAnime}`" class="imageAnimePlusInfo" height="250"/>
                <legend>Anime</legend>
              </figure>
              <figure class="figureImage" v-if="jojoConcerne.stand.imageManga">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageManga}`" class="imageMangaPlusInfo" height="250"/>
                <legend>Manga</legend>
              </figure>
            </div> 
          <VList class="listInfo">
            <div class="listInfoPersonnel">
              <VListItem>
                <VListItemTitle>Manieur : {{jojoConcerne.nom }} {{jojoConcerne.familyName}}</VListItemTitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Partie : {{jojoConcerne.partie}}</VListItemTitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Note : {{jojoConcerne.stand.rate}}  /20</VListItemTitle>
              </VListItem>
            </div>
          </VList>

          <section class="sectionRefTech">
            <section class="sectionRef" v-if="jojoConcerne.stand.reference.length > 0">
              <VCard title="Références" class="card">
                <img :src="`data:image/png;base64,${jojoConcerne.stand.imageReference}`" width="250" height="250"/>
                <VCardText>{{ jojoConcerne.stand.reference }}</VCardText>
              </VCard>
            </section>

            <section class="sectionTech" v-if="jojoConcerne.stand.capacite[0].length > 0">
              <VCard title="Techniques" class="card" max-height="500">
                <VCarousel show-arrows="hover" hide-delimiters height="auto" >
                  <VCarouselItem v-for="(capacite, i) in jojoConcerne.stand.capacite" :key="i">
                    <VCardText>{{capacite}}</VCardText>
                    <VSheet ><img :src="`data:image/png;base64,${jojoConcerne.stand.imageCapacite[i]}`" width="250" height="200" ></VSheet>
                    <VCardText>{{jojoConcerne.stand.descriptionCapacite[i]}}</VCardText>
                  </VCarouselItem>
                </VCarousel> 
              </VCard>
            </section>
          </section>

        <div class="divActions">
          <VBtn class="btnStand" @click="categorie='Personnage'">Voir le manieur</VBtn>
          <!--TODO like le stand -->

          <VBtn id="btnLike" :icon="jojoConcerne.stand.liked ? 'mdi-heart-remove' : 'mdi-heart-plus-outline'" @click="handleChangeLike(jojoConcerne.id)"></VBtn>
          <VBtn id="btnModif" :href="`/jojo/update/${jojoConcerne.id}`" icon="mdi-pencil-plus"></VBtn>
          <!--TODO suppr le stand -->
          <VBtn id="btnDelete" icon="mdi-delete-empty" @click="deleteStand(jojoConcerne)"></VBtn>
        </div>
        <VBtn class="btnDetail" @click="toggleMoinsInfo()">Moins d'info</VBtn> 
      </VCard>




  <!--------------------------VERSION PERSONNAGE------------------------>
  <VCard :title="(jojoConcerne.nom + ' ' + jojoConcerne.familyName )" :subtitle="jojoConcerne.description"  
  v-if="jojoConcerne.liked" class="cardPlusInfo"> 
    <div class="divImagePlusInfo">
      <figure class="figureImage" v-if="jojoConcerne.imageAnime">
        <img :src="`data:image/png;base64,${jojoConcerne.imageAnime}`" class="imageAnimePlusInfo" height="250"/>
        <legend>Anime</legend>
      </figure>
      <figure class="figureImage" v-if="jojoConcerne.imageManga">
        <img :src="`data:image/png;base64,${jojoConcerne.imageManga}`" class="imageMangaPlusInfo" height="250"/>
        <legend>Manga</legend>
      </figure>
    </div> 
    <VList class="listInfo">
      <div class="listInfoPersonnel">
        <VListItem>
          <VListItemTitle>Age : {{jojoConcerne.age}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Espece : {{jojoConcerne.espece}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Partie : {{jojoConcerne.partie}}</VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Note : {{jojoConcerne.rate}}  /20</VListItemTitle>
        </VListItem>
      </div>
    </VList>

    <section class="sectionRefTech">
      <section class="sectionRef" v-if="jojoConcerne.reference.length > 0">
        <VCard title="Références" class="card">
          <img :src="`data:image/png;base64,${jojoConcerne.imageReference}`" width="250" height="250"/>
          <VCardText>{{ jojoConcerne.reference }}</VCardText>
        </VCard>
      </section>

      <section class="sectionTech" v-if="jojoConcerne.technique[0].length > 0">
        <VCard title="Techniques" class="card" max-height="500">
          <VCarousel show-arrows="hover" hide-delimiters height="300" >
            <VCarouselItem v-for="(technique, i) in jojoConcerne.technique" :key="i">
              <VCardText>{{technique}}</VCardText>
              <VSheet ><img :src="`data:image/png;base64,${jojoConcerne.imageTechnique[i]}`" class="image"></VSheet>
              <VCardText>{{jojoConcerne.descriptionTechnique[i]}}</VCardText>
            </VCarouselItem>
          </VCarousel> 
        </VCard>
      </section>
    </section>

    <div class="divActions">
      <VBtn class="btnStand" v-if="jojoConcerne.hasStand" @click="categorie='Stand'">Voir le stand</VBtn>
      <VBtn id="btnLike" :icon="jojoConcerne.liked ? 'mdi-heart-remove' : 'mdi-heart-plus-outline'" @click="handleChangeLike(jojoConcerne.id)"></VBtn>
      <VBtn id="btnModif" :href="`/jojo/update/${jojoConcerne.id}`" icon="mdi-pencil-plus"></VBtn>
      <VBtn id="btnDelete" icon="mdi-delete-empty" @click="deleteJojo(jojoConcerne)"></VBtn>
    </div>
    <VBtn class="btnDetail" @click="toggleMoinsInfo()">Moins d'info</VBtn> 
  </VCard> 
  </section>





<!-----------------------VERSION MOINS D'INFO---------------------------->

  
  <section v-for="(jojo, index) in filteredList()" :key="index" class="sectionBoucle">

  <!--VERSION PERSONNAGE-->
  <VCard :title="(jojo.nom + ' ' + jojo.familyName )" :subtitle="jojo.description" 
  v-if="jojo.liked" class="cardMoinsInfo"> 
    <div v-if="jojo.imageAnime">
      <img :src="`data:image/png;base64,${jojo.imageAnime}`" width=100% height=150 />
    </div>
    <div v-else>
      <img :src="`data:image/png;base64,${jojo.imageManga}`"/>
    </div> 
    <VBtn class="btnDetail" @click="toggleDescription(jojo.id)">Plus d'info</VBtn> 
  </VCard>
  </section>


<!--VERSION Stand-->
<section v-for="(jojo, index) in filteredList()" :key="index" class="sectionBoucle">
         
  <VCard :title="(jojo.stand.nom )" :subtitle="jojo.stand.description"
   class="cardMoinsInfo" v-if="jojo.stand.liked"> 
    <div v-if="jojo.stand.imageAnime" >
      <img :src="`data:image/png;base64,${jojo.stand.imageAnime}`" max-width=100 height=150 />
    </div>
    <div v-else>
      <img :src="`data:image/png;base64,${jojo.stand.imageManga}`" max-width=100 height=150/>
    </div> 
    <VBtn class="btnDetail" @click="toggleDescription(jojo.id)">Plus d'info</VBtn> 
  </VCard> 

</section>
</span>












      
  </main>
  <div class="itemError" v-if="search&&!filteredList().length">
      <img src="../../img/chat.png" width="500"/>
    </div>
  </div>
 
</template>


<style scoped>

/**********************SECTION GRANDE FORME JOJO***********************/

.sectionDetail{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin:5%;
  width: 70%;
  height: auto;
  background-color: aqua;
}

.cardMoinsInfo{
  width: 97%;
  border: 1rem solid rgb(143, 139, 139);
  text-align: center;
  height:19rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.cardPlusInfo{
  border: 1rem solid rgb(143, 139, 139);
  text-align: center;
  width: 100%;
}


.divParent{
  background-color: lightgray;
  border: 1rem solid rgb(86, 79, 79);
  border-radius: 5rem;
  width: 85%;

}
.mainJojo{

  margin: 2rem 5rem;
}
.all{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.sectionBoucle{
  margin-bottom: 25px;
  
}
/**********************SECTION INTERIEUR JOJO***********************/

.card{
  width: 80%;
  border: 1rem solid lightgray;
}
.sectionTech{
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sectionRef{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
 

}
.sectionRefTech{
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;  
}
legend{
  margin-top: 5%;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: bolder;
  text-decoration: underline;
}
.figureImage{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40%;
}
.divImagePlusInfo{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 2rem;
}

.listInfo{
  display: flex;
  flex-direction: column;
  
}
.listInfoPersonnel{
  margin: 3rem 2rem 0 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1rem solid lightgray;
  border-radius: 5rem;
}
.divActions{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 5%;
}

.imageAnimePlusInfo{
  border: 1rem solid rgb(129, 76, 76);
}
.imageMangaPlusInfo{
  border: 1rem solid rgb(119, 194, 113);
}

/**********************SECTION LES INPUTS**********************/

.vBottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000; /* Assurez-vous que la navigation est au-dessus du contenu */
  /* Ajoutez d'autres styles personnalisés selon vos besoins */
}
.actions{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 2rem 3rem;
}
.searchInput{
  background-color: black;
  border: 0.5rem solid rgb(143, 139, 139);
  border-radius: 2rem;
  color: white;
  height: 3rem;
  padding: 1rem;
  letter-spacing: 0.05rem;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  margin-right: 15%
}

.itemError{
  display: flex;
  justify-content: center;
  width: 50%;
  margin: 3rem 25%;
  background-color: darkgrey;
  border-radius: 10%;
}

.selectBox{
  margin-left: 25%;
  color: gray;
  background-color: black;
  border: 0.5rem solid rgb(143, 139, 139);
  font-weight: bold;
  border-radius: 3rem;
}
/**********************SECTION DETAIL***********************/

.image{
  height: 10%;
  width: 100%;
}

.imageMangaPlusInfo{
  height: auto;
  max-height:20rem;
}

.btnDetail{
  width: 100%;
}
.btnAjout{
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: lightgreen;
}

</style>