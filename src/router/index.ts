import { createRouter, createWebHistory } from 'vue-router'
import MainContent from '../components/MainContent.vue'
import AlgorithmTutorial from '../components/algorithm/AlgorithmTutorial.vue'
import AlgorithmComparison from '../components/algorithm/AlgorithmComparison.vue'
import CommunityForum from '../components/community/CommunityForum.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainContent
  },
  {
    path: '/algorithm',
    name: 'AlgorithmTutorial',
    component: AlgorithmTutorial
  },
  {
    path: '/algorithm/comparison',
    name: 'AlgorithmComparison',
    component: AlgorithmComparison
  },
  {
    path: '/community',
    name: 'CommunityForum',
    component: CommunityForum
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router