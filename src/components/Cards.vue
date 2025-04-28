<script setup>
import { ref, onMounted, computed } from 'vue'
import HideShowDescButton from "@/components/HideShowDescButton.vue";
import FormCards from "@/components/FormCards.vue";
const data = ref(null)
const error = ref(null)
const expandedItems = ref([])
const scroll = ref('')
const showForm = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/bataille')
    if (!res.ok) throw new Error('Erreur réseau')
    data.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
})

const dataVictoire = computed(() => {
  return data.value ? data.value.filter(item => item.victoire) : []
})
/*
Cut la description si elle fait plus de 300 caractères
 */
function cutDesc(description) {
  let counter = 0;
  let res = { dateLieu: "", forcePresentes: "", pertes: "", situationGenerale: "" };
  const values = Object.values(description);

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (counter + val.length > 300) {
      res[Object.keys(description)[i]] = val.substring(0, 300 - counter).concat(" \n...");

      return res;
    }
    res[Object.keys(description)[i]] = val;
    counter += val.length;
  }

  return res;
}

/**
 * Récuperer la taille totale d'une description
 * @param description
 */
const getTotalLength = (description) => {

 const val= Object.values(description)
  let total = 0 ;
  for (let i = 0; i < val.length; i++) {
    total += val[i].length
  }

}
const toggleDescription = (itemId) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index === -1) {
    expandedItems.value.splice(0 , expandedItems.value.length)
    expandedItems.value.push(itemId)
  } else {
    expandedItems.value.splice(index, 1)
  }
}

const isExpanded = (itemId) => {
  return expandedItems.value.includes(itemId)
}

const getDesc = (item) => {
  return isExpanded(item.id) ? item.description : cutDesc(item.description)
}

const isScrollable = (item) => {
  if(getTotalLength(item.description) > 100){
  scroll.value = 'scroll' ;
  }
}
function toDate(date){

  return new Date(date).getDate();

}
</script>



  <template>
    <div class="deck" >
      <div class="card" v-for="item in dataVictoire" :key="item.id">
        <div class="head">
          <h2>{{ item.nom }} - {{ item.date.split(' ')[2] }}</h2>
          <img :src="item.img" />
        </div>

        <div class="main" :style="{ overflowY: isScrollable(item)}" v-if="!showForm" >
          <h4 v-if="getDesc(item).dateLieu">Dates et lieux</h4>
          <p>{{ getDesc(item).dateLieu }}</p>

          <h4 v-if="getDesc(item).forcePresentes">Forces en présence</h4>
          <p>{{ getDesc(item).forcePresentes }}</p>

          <h4 v-if="getDesc(item).pertes">Pertes</h4>
          <p>{{ getDesc(item).pertes }}</p>

          <h4 v-if="getDesc(item).situationGenerale">Situation générale</h4>
          <p>{{ getDesc(item).situationGenerale }}</p>

        </div>
        <FormCards v-else :titre="item.nom"
                   :lieu="item.lieu" :img="item.img"
                   :desc_forces_presentes ="item.description.forcePresentes"
                   :desc_pertes="item.description.pertes"
                   :desc_date_lieu="item.description.dateLieu"
                   :date="toDate(item.dateLieu)"
        >

        </FormCards>
        <div class="actions">
          <template>
            <svg-icon type="mdi" :path="path" ></svg-icon>
          </template>
          <HideShowDescButton :bataille-id="item.id" @toggle="toggleDescription" :is-expanded="isExpanded(item.id)"/>
        </div>
      </div>
    </div>

  </template>




<style scoped>
img{
  width: 100%;
  height: 200px;
  object-fit: cover;
}
div{

  margin: 0.2%;
}
.card{
  display: flex;
  width: 100%;

  background-color: darkgray;
 border-radius:10px ;

}
.head{
  width: 18%;
  align-content: center;
  justify-content: center;
  text-align: center;
  margin: 1%;
}
.main{
  width: 75%;
  background-color: lightgrey ;
margin-top: 1%;
  max-height: 275px;
  overflow-y: auto;
}
body{
  width: 70%;
  margin: auto;

}
.actions{
  display: flex;
  flex-direction: column;
}

</style>