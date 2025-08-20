<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AlgorithmSidebar from './AlgorithmSidebar.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';

// 定义视频对象接口
interface Video {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

// 视频分类数据（精简版）
const categories = ref([
  { id: 1, name: '数据结构基础' },
  { id: 2, name: '算法设计思想' },
  { id: 3, name: '编程实践' }
]);

// 当前选中的分类
const currentCategory = ref(categories.value[0]);

// 视频列表数据（精简版）
const videos = ref<Video[]>([
  { 
    id: 1, 
    categoryId: 1, 
    title: '数组与链表基础', 
    description: '深入理解线性数据结构的原理和应用', 
    thumbnail: 'https://picsum.photos/300/200?random=1',
    videoUrl: 'https://www.example.com/videos/array-linkedlist.mp4'
  },
  { 
    id: 2, 
    categoryId: 1, 
    title: '栈与队列详解', 
    description: '栈和队列的基本操作和实际应用场景', 
    thumbnail: 'https://picsum.photos/300/200?random=2',
    videoUrl: 'https://www.example.com/videos/stack-queue.mp4'
  },
  { 
    id: 3, 
    categoryId: 1, 
    title: '树与图结构', 
    description: '非线性数据结构的基本概念和遍历方法', 
    thumbnail: 'https://picsum.photos/300/200?random=3',
    videoUrl: 'https://www.example.com/videos/tree-graph.mp4'
  },
  { 
    id: 4, 
    categoryId: 2, 
    title: '分治法思想', 
    description: '分而治之的算法设计策略', 
    thumbnail: 'https://picsum.photos/300/200?random=4',
    videoUrl: 'https://www.example.com/videos/divide-conquer.mp4'
  },
  { 
    id: 5, 
    categoryId: 2, 
    title: '贪心算法原理', 
    description: '贪心策略在算法设计中的应用', 
    thumbnail: 'https://picsum.photos/300/200?random=5',
    videoUrl: 'https://www.example.com/videos/greedy.mp4'
  },
  { 
    id: 6, 
    categoryId: 3, 
    title: '代码优化技巧', 
    description: '提高代码效率和可读性的实用方法', 
    thumbnail: 'https://picsum.photos/300/200?random=6',
    videoUrl: 'https://www.example.com/videos/optimization.mp4'
  },
  { 
    id: 7, 
    categoryId: 3, 
    title: '调试与测试', 
    description: '程序调试和单元测试的最佳实践', 
    thumbnail: 'https://picsum.photos/300/200?random=7',
    videoUrl: 'https://www.example.com/videos/debug-test.mp4'
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
    <!-- 头部导航栏 -->
    <AlgorithmHeaderNav 
      page-mode="tutorial"
      @return-home="() => $router.push('/')"
    />
    


    <!-- 主体内容：视频目录 -->
    <div class="main-content">
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
  justify-content: center;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  border-bottom: 1px solid var(--dark-border, #333);
  gap: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 80px;
}

.category-item {
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  background: rgba(75, 108, 183, 0.15);
  font-weight: 600;
  letter-spacing: 0.8px;
  font-size: 1.1rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;
  min-width: 160px;
  text-align: center;
}

.category-item:hover {
  background: rgba(75, 108, 183, 0.25);
  border-color: rgba(75, 108, 183, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
}

.category-item.active {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  border-color: #4b6cb7;
  box-shadow: 0 6px 15px rgba(75, 108, 183, 0.4);
  transform: translateY(-3px);
}

/* 主体内容样式 */
.main-content {
  flex: 1;
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: slideUp 0.6s ease-out;
  background: linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(30, 30, 30, 0.9) 50%, rgba(18, 18, 18, 0.95) 100%);
  border-radius: 20px 20px 0 0;
  position: relative;
  min-height: calc(100vh - 200px);
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center top, rgba(75, 108, 183, 0.08) 0%, transparent 50%);
  pointer-events: none;
  border-radius: 20px 20px 0 0;
}

/* 视频网格样式 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 35px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.video-card {
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.8) 100%);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  position: relative;
}

.video-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(75, 108, 183, 0.1), transparent);
  transition: left 0.6s ease;
  z-index: 1;
}

.video-card:hover::before {
  left: 100%;
}

.video-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(75, 108, 183, 0.15), 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(75, 108, 183, 0.4);
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
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.9) 50%, rgba(20, 20, 20, 0.95) 100%);
  border-top: 2px solid rgba(75, 108, 183, 0.2);
  padding: 40px 0;
  margin-top: auto;
  backdrop-filter: blur(15px);
  position: relative;
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.2);
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(75, 108, 183, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  gap: 20px;
}

.footer p {
  margin: 0;
  color: var(--text-secondary, #cccccc);
  font-weight: 500;
  font-size: 1.1em;
  background: linear-gradient(135deg, #ffffff 0%, #aaaaaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-links a {
  color: var(--text-secondary, #aaaaaa);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.footer-links a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(75, 108, 183, 0.2), transparent);
  transition: left 0.4s ease;
}

.footer-links a:hover::before {
  left: 100%;
}

.footer-links a:hover {
  color: var(--primary-color, #6c5ce7);
  background: rgba(75, 108, 183, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 108, 183, 0.2);
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
@media (max-width: 1024px) {
  .main-content {
    padding: 50px 30px;
    max-width: 100%;
  }
  
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 40px 20px;
    border-radius: 15px 15px 0 0;
  }
  
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .video-card {
    border-radius: 15px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 25px;
  }
  
  .footer-links {
    gap: 20px;
  }
  
  .player-header h2 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 30px 15px;
    border-radius: 10px 10px 0 0;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .video-card {
    border-radius: 12px;
  }
  
  .footer {
    padding: 30px 0;
  }
  
  .footer-content {
    padding: 0 20px;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .footer-links a {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}
</style>