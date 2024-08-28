// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import AddBataille from '@/components/AddBataille.vue'
import EditBataille from '@/components/EditBataille.vue'
import BatailleList from "@/pages/BatailleList.vue";

const routes = [
    { path: '/', name: 'Home', component: BatailleList },
    { path: '/add', name: 'AddBataille', component: AddBataille },
    { path: '/edit/:id', name: 'EditBataille', component: EditBataille, props: true }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
