<script setup lang="ts">
    import { Methods } from "~/constants/httpMethod.const";
    import type { BatailleInterface } from "~/types/bataille";


    //recuperation des batailles
    const {data, pending, error, refresh } = useFetch<Array<BatailleInterface>>('/api/bataille', {
        default : () => [] as Array<BatailleInterface>,
    })


    // pour changer l'icone
    type ListIcon = 'mdi-eye-arrow-left-outline' | 'mdi-eye-arrow-left'
    
    const icons = defineModel<ListIcon>({required: true})

    //modifier l'icone en fonction de l'id de la bataille
    const passage = (batailleId: number) => {
        icons.value = icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline'
    }


    //fonction permettant de changer l'icone
    const icon = computed(() =>
        icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline',
    )


    // Référence pour stocker les descriptions étendues des batailles
    const expandedDescriptions = ref([] as { id: number; elements: string[] }[]);

    // Fonction pour vérifier si une description spécifique est étendue pour une bataille donnée
    const isDescriptionExpanded = (batailleId: number, element: string) => {
    const expanded = expandedDescriptions.value.find((item) => item.id === batailleId);
    return expanded ? expanded.elements.includes(element) : false;
    };

    const handleClick = (batailleId: number) => {
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

    //fonction redirection vers la page de modification d'une bataille
    const update = (batailleId: number) => {
        useRouter().push(`/batailles/update/${batailleId}`)
    }

    //fonction pour la suppression d'une bataille
    const deleteBataille = (batailleId: number) => {
        useFetch(`/api/bataille/${batailleId}`, {
            method: Methods.DELETE,
            onResponse: ({response}) => {
            if (response.ok) {
            refresh()
                }
            },
        })
    }

    //fonction pour la barre de recherche
    let input = ref("");
    function filtreBataille() {
    return data.value.filter((bataille) =>
        bataille.nom.toLowerCase().includes(input.value.toLowerCase()) || bataille.annee.toString().includes(input.value)
    );
    }

</script>

<template>
    <!-- Barre de recherche en fonction du nom ou de l'annee -->
    
    <!-- bouton creer -->
    <VBtn  class="create"><RouterLink :to="`/batailles/create`"> New battle </RouterLink> </VBtn>
    <input type="text" v-model="input" placeholder="Recherche bataille..."  class="input"/>
    <v-container class="container" v-for="bataille in filtreBataille()" :key="bataille.id" >

        <VRow cols="12" sm="4" class="mainContainer" v-if="bataille.victoire"  >
            <VSheet class="entete" >
                <VLabel class="titre" :text="bataille.nom + ' - ' + bataille.annee"></VLabel>
                <VImg :src="'data:image/png;base64,'+ bataille.image" class="img" />
            </VSheet>

            <VSheet class="contenu" id="sheet" >
                <label>Date et lieu</label>
                <label class="text">{{bataille.lieu}}</label>
                <label>Forces en présence</label>
                <label class="text">{{bataille.force}}</label>
                <label>Pertes</label>
                <label class="text"> {{ bataille.pertes }}</label>

                <p v-if="isDescriptionExpanded(bataille.id, 'situation')" >Situation générale</p>
                <p class="text" v-if="isDescriptionExpanded(bataille.id, 'situation')" >{{bataille.situation}}</p>
            </VSheet>
        
            
            <VSheet class="button" >
                <VBtn  @click="handleClick(bataille.id)" @mouseover="passage(bataille.id)" @mouseout="passage(bataille.id)" :icon="icon" />
                <VBtn @click="update(bataille.id)" icon="mdi-pencil"/> 
                <VBtn @click="deleteBataille(bataille.id)" icon="mdi-delete"/>
            </VSheet>

            
        </VRow>
        <!-- TODO -->
        <!-- bouton pour afficher les defaite -->



  </v-container>
  
</template>

<style scoped>

.img {
    height: 200px;
    width: 300px;
    margin-bottom: 3%;
}

.container{
    width: 120%;
   
}

.mainContainer {
    display: flex;
    flex-direction: row;
    border: 1px solid #000;
    width: 100%;
    margin-bottom: 0.1%;
    padding: 1px;
}

.entete {
    display: flex;
    flex-direction: column;
    width: 20%;
    justify-content: center;
    align-items: center;
}

.contenu {
    display: flex;
    width: 73%;
    flex-direction: column;
    border: 1px solid #000;
    padding-top: 20px;
    font-family:Arial, Helvetica, sans-serif;
    font-size:12;
    
}

.button{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 3%;
}



.text{
    margin-left: 30px;
}

.titre{
    margin-top: 2%;
    font-weight: bold;
    color: black;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 150%;
    
}

.create{
    display: flex;
   /* mettre a gauche de la page */
    margin-left: 93%;
    background-color: lightgrey;
}

.input{
    border: #000 solid 1px;
    width: 20%;
    margin-left: 3%;
}

</style>