<template>
  <div v-if="isVisible && video" class="video-player-modal" @click="$emit('close')">
    <div class="video-player-container" @click.stop>
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="video-player">
        <iframe
          :src="video.videoUrl"
          frameborder="0"
          allowfullscreen
          class="video-iframe"
        ></iframe>
      </div>
      <div class="video-details">
        <h3>{{ video.title }}</h3>
        <p>{{ video.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from './scripts/AlgorithmTutorialLogic';

// 定义组件属性
interface Props {
  isVisible: boolean;
  video: Video | null;
}

// 定义组件事件
interface Emits {
  close: [];
}

// 接收属性
defineProps<Props>();

// 定义事件
defineEmits<Emits>();
</script>

<style scoped>
/* 视频播放器模态框 */
.video-player-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.video-player-container {
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 90%;
  background: var(--dark-card, #2a2a2a);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.video-player {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-details {
  padding: 20px;
  background: var(--dark-surface, #1e1e1e);
}

.video-details h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--dark-text, #ffffff);
}

.video-details p {
  color: var(--dark-text-secondary, #cccccc);
  line-height: 1.6;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container {
    width: 95%;
    margin: 20px;
  }
}
</style>