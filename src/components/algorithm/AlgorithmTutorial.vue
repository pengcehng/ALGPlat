<script setup lang="ts">
import AlgorithmSidebar from './AlgorithmSidebar.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';
import VideoPlayer from './VideoPlayer.vue';
import VideoGrid from './VideoGrid.vue';
import WelcomeArea from './WelcomeArea.vue';
import { useAlgorithmTutorial, type Video } from './scripts/AlgorithmTutorialLogic';
import type { VideoInfo } from '../../api/playback';

// 使用算法教程逻辑
const {
  // 状态
  selectedType,
  selectedCategory,
  selectedItem,
  apiVideos,
  isLoadingApiVideos,
  apiVideoError,
  showVideoList,
  currentVideo,
  isPlaying,
  filteredVideos,
  
  // 方法
  handleCategoryChange,
  handleDataStructureClick,
  handleAlgorithmClick,
  handleApiVideoClick,
  playVideo,
  closePlayer,
  goBack,
  getSelectedItemName,
  getSelectedItemDescription,
  updateFilteredVideos
} = useAlgorithmTutorial();

// 处理重试事件
const handleRetry = () => {
  handleCategoryChange({ category: selectedType.value || '' });
};
</script>

<template>
  <div class="algorithm-tutorial-container">
    <AlgorithmSidebar />
    <div class="algorithm-tutorial">
      <!-- 头部导航栏 -->
      <AlgorithmHeaderNav
        page-mode="tutorial"
        @return-home="() => $router.push('/')"
        @category-change="(category: string, subCategory?: string, item?: string) => handleCategoryChange({ category, subCategory, item })"
      />

      <!-- 主体内容：视频目录 -->
      <div class="main-content">
        <!-- 欢迎界面 -->
        <WelcomeArea v-if="!showVideoList" />

        <!-- 视频展示区域 -->
        <div v-else class="video-display-area">
          <VideoGrid
            :videos="apiVideos"
            :is-loading="isLoadingApiVideos"
            :error="apiVideoError"
            @video-click="handleApiVideoClick"
            @retry="handleRetry"
          />
        </div>
      </div>

      <!-- 视频播放器模态框 -->
      <VideoPlayer
        :is-visible="isPlaying"
        :video="currentVideo"
        @close="closePlayer"
      />


    </div>
  </div>
</template>

<style scoped>
/* 引入算法教程专用样式文件 */
@import './styles/AlgorithmTutorial.css';

/* 主体内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: var(--dark-surface, #1e1e1e);
}

/* 视频展示区域 */
.video-display-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  background: var(--dark-surface, #1e1e1e);
}
</style>
