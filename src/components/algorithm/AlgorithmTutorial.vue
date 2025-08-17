<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AlgorithmSidebar from './AlgorithmSidebar.vue';

// 定义视频对象接口
interface Video {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

// 视频分类数据
const categories = ref([
  { id: 1, name: '排序算法' },
  { id: 2, name: '搜索算法' },
  { id: 3, name: '图论算法' },
  { id: 4, name: '动态规划' },
  { id: 5, name: '机器学习算法' }
]);

// 当前选中的分类
const currentCategory = ref(categories.value[0]);

// 视频列表数据
const videos = ref<Video[]>([
  { 
    id: 1, 
    categoryId: 1, 
    title: '快速排序详解', 
    description: '深入讲解快速排序的原理和实现', 
    thumbnail: 'https://picsum.photos/300/200?random=1',
    videoUrl: 'https://www.example.com/videos/quicksort.mp4'
  },
  { 
    id: 2, 
    categoryId: 1, 
    title: '归并排序教程', 
    description: '归并排序的基本概念和代码实现', 
    thumbnail: 'https://picsum.photos/300/200?random=2',
    videoUrl: 'https://www.example.com/videos/mergesort.mp4'
  },
  { 
    id: 3, 
    categoryId: 2, 
    title: '二分查找算法', 
    description: '二分查找的原理与应用场景', 
    thumbnail: 'https://picsum.photos/300/200?random=3',
    videoUrl: 'https://www.example.com/videos/binarysearch.mp4'
  },
  { 
    id: 4, 
    categoryId: 3, 
    title: '最短路径算法', 
    description: 'Dijkstra算法详解', 
    thumbnail: 'https://picsum.photos/300/200?random=4',
    videoUrl: 'https://www.example.com/videos/dijkstra.mp4'
  },
  { 
    id: 5, 
    categoryId: 4, 
    title: '背包问题讲解', 
    description: '动态规划解决背包问题', 
    thumbnail: 'https://picsum.photos/300/200?random=5',
    videoUrl: 'https://www.example.com/videos/knapsack.mp4'
  },
  { 
    id: 6, 
    categoryId: 5, 
    title: '决策树算法', 
    description: '机器学习中的决策树原理', 
    thumbnail: 'https://picsum.photos/300/200?random=6',
    videoUrl: 'https://www.example.com/videos/decisiontree.mp4'
  }
]);

// 根据当前分类筛选视频
const filteredVideos = ref<Video[]>([]);

// 当前播放的视频
const currentVideo = ref<Video | null>(null);
const isPlaying = ref(false);

// 切换分类
function changeCategory(category: { id: number, name: string }) {
  currentCategory.value = category;
  updateFilteredVideos();
}

// 更新筛选后的视频列表
function updateFilteredVideos() {
  filteredVideos.value = videos.value.filter(video => video.categoryId === currentCategory.value.id);
}

// 播放视频
function playVideo(video: Video) {
  currentVideo.value = video;
  isPlaying.value = true;
}

// 关闭视频播放器
function closePlayer() {
  isPlaying.value = false;
  currentVideo.value = null;
}

// 组件挂载时初始化筛选视频
onMounted(() => {
  updateFilteredVideos();
});
</script>

<template>
  <div class="algorithm-tutorial-container">
    <AlgorithmSidebar />
    <div class="algorithm-tutorial">
    <!-- 视频分类导航栏 -->
    <div class="category-nav">
      <div 
        v-for="category in categories" 
        :key="category.id"
        :class="['category-item', { active: currentCategory.id === category.id }]"
        @click="changeCategory(category)"
      >
        {{ category.name }}
      </div>
    </div>

    <!-- 主体内容：视频目录 -->
    <div class="main-content">
      <h1>{{ currentCategory.name }}教程</h1>
      
      <div class="video-grid">
        <div 
          v-for="video in filteredVideos" 
          :key="video.id"
          class="video-card"
          @click="playVideo(video)"
        >
          <div class="thumbnail">
            <img :src="video.thumbnail" :alt="video.title">
            <div class="play-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5.14v14l11-7l-11-7z"/>
              </svg>
            </div>
          </div>
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>{{ video.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放器 -->
    <div v-if="isPlaying" class="video-player-overlay">
      <div class="video-player">
        <div class="player-header">
          <h2>{{ currentVideo?.title }}</h2>
          <button class="close-btn" @click="closePlayer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
            </svg>
          </button>
        </div>
        <div class="player-content">
          <video controls autoplay>
            <source :src="currentVideo?.videoUrl" type="video/mp4">
            您的浏览器不支持视频播放。
          </video>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2023 算法讲解平台 | 版权所有</p>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
        </div>
      </div>
    </footer>
  </div>
  </div>
</template>

<style scoped>
.algorithm-tutorial-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--dark-bg, #121212);
  color: var(--text-primary, #ffffff);
  width: 100%;
}

.algorithm-tutorial {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  background-color: var(--dark-bg, #121212);
  color: var(--text-primary, #ffffff);
  width: calc(100% - 280px);
  animation: fadeIn 0.5s ease-in-out;
  overflow-x: hidden;
}

/* 分类导航栏样式 */
.category-nav {
  display: flex;
  padding: 20px 30px;
  background-color: var(--dark-card-bg, #1e1e1e);
  border-bottom: 1px solid var(--dark-border, #333);
  overflow-x: auto;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.category-item {
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  background-color: rgba(75, 108, 183, 0.1);
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category-item:hover {
  background-color: rgba(75, 108, 183, 0.2);
}

.category-item.active {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(75, 108, 183, 0.3);
  transform: translateY(-2px);
}

/* 主体内容样式 */
.main-content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: slideUp 0.6s ease-out;
}

.main-content h1 {
  margin-bottom: 30px;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 15px;
}

.main-content h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  border-radius: 3px;
}

/* 视频网格样式 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.video-card {
  border-radius: 15px;
  overflow: hidden;
  background-color: var(--dark-card-bg, #1e1e1e);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  border-color: rgba(75, 108, 183, 0.3);
}

.thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.video-card:hover .thumbnail img {
  transform: scale(1.05);
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.video-card:hover .play-icon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1);
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  margin-bottom: 8px;
  font-size: 1.2rem;
  color: var(--text-primary, #ffffff);
}

.video-info p {
  color: var(--text-secondary, #aaaaaa);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 视频播放器样式 */
.video-player-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-player {
  width: 90%;
  max-width: 1000px;
  background-color: var(--dark-card-bg, #1e1e1e);
  border-radius: 10px;
  overflow: hidden;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(75, 108, 183, 0.1);
}

.player-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #ffffff);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-primary, #ffffff);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.player-content {
  padding: 0;
}

.player-content video {
  width: 100%;
  display: block;
}

/* 页脚样式 */
.footer {
  background-color: var(--dark-card-bg, #1e1e1e);
  padding: 30px 40px;
  border-top: 1px solid var(--dark-border, #333);
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.footer p {
  margin: 0;
  color: var(--text-secondary, #aaaaaa);
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: var(--text-secondary, #aaaaaa);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--primary-color, #4b6cb7);
}

/* 添加动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .category-nav {
    padding: 15px;
    justify-content: center;
  }
  
  .category-item {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 30px 20px;
  }
  
  .main-content h1 {
    font-size: 2rem;
  }
  
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .player-header h2 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .category-nav {
    padding: 10px;
  }
  
  .category-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>