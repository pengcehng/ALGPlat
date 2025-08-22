<template>
  <div class="api-video-grid">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载视频...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">
        重试
      </button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="videos.length === 0" class="empty-state">
      <div class="empty-icon">📹</div>
      <p>暂无相关视频</p>
      <p class="empty-hint">请尝试选择其他类型或稍后再试</p>
    </div>

    <!-- 视频列表 -->
    <div v-else class="video-content">
      <div class="video-grid">
        <div
          v-for="video in videos"
          :key="video.id"
          class="video-card"
          @click="$emit('video-click', video)"
        >
          <div class="thumbnail">
            <img :src="video.thumbnail || '/default-thumbnail.jpg'" :alt="video.title" />
            <div class="play-icon">▶️</div>
          </div>
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>{{ video.description }}</p>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">

import type { VideoInfo } from '../../api/playback';

// 定义组件属性
interface Props {
  videos: VideoInfo[];
  isLoading: boolean;
  error: string;
}

// 定义组件事件
interface Emits {
  'video-click': [video: VideoInfo];
  retry: [];
}

// 接收属性
const props = defineProps<Props>();

// 定义事件
defineEmits<Emits>();


</script>

<style scoped>
/* API视频网格 */
.api-video-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px 0;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* 视频卡片 */
.video-card {
  background: var(--dark-card, #2a2a2a);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border, #333);
  height: fit-content;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color, #667eea);
}

.thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: var(--dark-bg, #1a1a1a);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .thumbnail img {
  transform: scale(1.05);
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .play-icon {
  opacity: 1;
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: var(--dark-text, #ffffff);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-info p {
  font-size: 0.9rem;
  color: var(--dark-text-secondary, #cccccc);
  opacity: 0.7;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--dark-text, #ffffff);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--dark-border, #333);
  border-top: 4px solid var(--primary-color, #667eea);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: var(--primary-color-hover, #5a6fd8);
}

.empty-hint {
  opacity: 0.6;
  margin-top: 10px;
}



/* 响应式设计 */
@media (max-width: 1400px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
  
  .page-info {
    margin-left: 0;
    order: -1;
  }
}
</style>