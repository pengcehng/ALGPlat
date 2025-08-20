<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AlgorithmSidebar from './AlgorithmSidebar.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';
import { fetchVideosByCategory, type VideoInfo, AlgorithmCategory } from '../../api/playback';

// 定义视频对象接口
interface Video {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

// 数据结构类型配置
const dataStructureTypes = ref([
  { key: 'array', label: '数组', icon: '📊', description: '线性数据结构，支持随机访问' },
  { key: 'linkedList', label: '链表', icon: '🔗', description: '动态数据结构，支持高效插入删除' },
  { key: 'stack', label: '栈', icon: '📚', description: '后进先出(LIFO)的数据结构' },
  { key: 'queue', label: '队列', icon: '🚶‍♂️', description: '先进先出(FIFO)的数据结构' },
  { key: 'tree', label: '树', icon: '🌳', description: '层次化的非线性数据结构' },
  { key: 'graph', label: '图', icon: '🕸️', description: '由节点和边组成的复杂数据结构' },
  { key: 'hashTable', label: '哈希表', icon: '🔍', description: '基于哈希函数的快速查找结构' }
]);

// 算法类型配置
const algorithmTypes = ref([
  { key: AlgorithmCategory.SORT, label: '排序算法', icon: '🔢', description: '对数据进行排序的算法' },
  { key: AlgorithmCategory.SEARCH, label: '查找算法', icon: '🔍', description: '在数据中查找特定元素的算法' },
  { key: AlgorithmCategory.GRAPH, label: '图算法', icon: '🕸️', description: '处理图结构的专门算法' },
  { key: AlgorithmCategory.DYNAMIC_PROGRAMMING, label: '动态规划', icon: '📊', description: '通过分解子问题求解最优解' },
  { key: AlgorithmCategory.DATA_STRUCTURE, label: '数据结构算法', icon: '🏗️', description: '数据结构相关的操作算法' },
  { key: AlgorithmCategory.MACHINE_LEARNING, label: '机器学习', icon: '🤖', description: '机器学习相关算法' }
]);

// 当前选中的类型和分类
const selectedType = ref<'dataStructure' | 'algorithm' | null>(null);
const selectedCategory = ref<string | null>(null);
const selectedItem = ref<string | null>(null);

// 视频数据和状态
const apiVideos = ref<VideoInfo[]>([]);
const isLoadingApiVideos = ref(false);
const apiVideoError = ref('');

// 是否显示视频列表
const showVideoList = ref(false);

// 当前播放的视频
const currentVideo = ref<Video | null>(null);
const isPlaying = ref(false);

// 筛选后的视频
const filteredVideos = ref<Video[]>([]);

// 更新筛选视频
const updateFilteredVideos = () => {
  // 这里可以根据需要实现筛选逻辑
};

// 处理头部导航栏的分类变化事件
const handleCategoryChange = async (data: { category: string; subCategory?: string; item?: string }) => {
  console.log('Category change:', data);

  const { category, subCategory, item } = data;

  // 如果有具体的项目选择，则获取视频
  if (item) {
    selectedItem.value = item;
    showVideoList.value = true;

    // 根据主分类决定调用哪个API
    if (category === 'dataStructure') {
      selectedType.value = 'dataStructure';
      selectedCategory.value = item;
      isLoadingApiVideos.value = true;
      apiVideoError.value = '';
      apiVideos.value = [];

      try {
        const videoList = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
        apiVideos.value = videoList;
      } catch (err) {
        apiVideoError.value = err instanceof Error ? err.message : '获取数据结构视频失败，请稍后重试';
        console.error('Failed to fetch data structure videos:', err);
      } finally {
        isLoadingApiVideos.value = false;
      }
    } else if (category === 'algorithm') {
      selectedType.value = 'algorithm';
      // 根据子分类获取对应的算法视频
      if (subCategory) {
        const algorithmType = algorithmTypes.value.find(type => type.key === subCategory);
        if (algorithmType) {
          await handleAlgorithmClick(algorithmType);
        }
      }
    }
  } else {
    // 如果没有具体项目，隐藏视频列表
    showVideoList.value = false;
    selectedItem.value = null;
  }
};

// 处理数据结构类型点击（保留作为备用）
const handleDataStructureClick = async (type: any) => {
  selectedType.value = 'dataStructure';
  selectedCategory.value = type.key;
  isLoadingApiVideos.value = true;
  apiVideoError.value = '';
  apiVideos.value = [];

  try {
    const videoList = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
    apiVideos.value = videoList.filter(video =>
      video.title.toLowerCase().includes(type.key.toLowerCase()) ||
      video.description.toLowerCase().includes(type.key.toLowerCase())
    );
  } catch (err) {
    apiVideoError.value = err instanceof Error ? err.message : '获取数据结构视频失败，请稍后重试';
    console.error('Failed to fetch data structure videos:', err);
  } finally {
    isLoadingApiVideos.value = false;
  }
};

// 处理算法类型点击（保留作为备用）
const handleAlgorithmClick = async (type: any) => {
  selectedType.value = 'algorithm';
  selectedCategory.value = type.key;
  isLoadingApiVideos.value = true;
  apiVideoError.value = '';
  apiVideos.value = [];

  try {
    const videoList = await fetchVideosByCategory(type.key);
    apiVideos.value = videoList;
  } catch (err) {
    apiVideoError.value = err instanceof Error ? err.message : '获取算法视频失败，请稍后重试';
    console.error('Failed to fetch algorithm videos:', err);
  } finally {
    isLoadingApiVideos.value = false;
  }
};

// 处理API视频点击
const handleApiVideoClick = (video: VideoInfo) => {
  // 将API视频转换为本地Video格式
  const localVideo: Video = {
    id: video.id,
    categoryId: 1,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail || '/default-thumbnail.jpg',
    videoUrl: video.videoUrl
  };
  playVideo(localVideo);
};

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

// 返回主页面
const goBack = () => {
  selectedType.value = null;
  selectedCategory.value = null;
  apiVideos.value = [];
  apiVideoError.value = '';
};

// 获取选中项的名称
const getSelectedItemName = () => {
  if (!selectedItem.value) return '';

  if (selectedType.value === 'dataStructure') {
    const item = dataStructureTypes.value.find(type => type.key === selectedItem.value);
    return item ? item.label : '';
  } else if (selectedType.value === 'algorithm') {
    const item = algorithmTypes.value.find(type => type.key === selectedItem.value);
    return item ? item.label : '';
  }

  return '';
};

// 获取选中项的描述
const getSelectedItemDescription = () => {
  if (!selectedItem.value) return '';

  if (selectedType.value === 'dataStructure') {
    const item = dataStructureTypes.value.find(type => type.key === selectedItem.value);
    return item ? item.description : '';
  } else if (selectedType.value === 'algorithm') {
    const item = algorithmTypes.value.find(type => type.key === selectedItem.value);
    return item ? item.description : '';
  }

  return '';
};

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
        @category-change="(category: string, subCategory?: string, item?: string) => handleCategoryChange({ category, subCategory, item })"
      />

      <!-- 主体内容：视频目录 -->
      <div class="main-content">
        <!-- 欢迎界面 -->
        <div v-if="!showVideoList" class="welcome-area">
          <div class="welcome-content">
            <h2>🎓 算法学习平台</h2>
            <p>请在上方导航栏选择您想要学习的数据结构或算法类型</p>
            <div class="welcome-features">
              <div class="feature-item">
                <span class="feature-icon">🏗️</span>
                <h3>数据结构</h3>
                <p>学习线性结构和非线性结构的原理与应用</p>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⚙️</span>
                <h3>算法设计</h3>
                <p>掌握各种算法设计思想和实现技巧</p>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📹</span>
                <h3>视频教学</h3>
                <p>通过高质量视频深入理解算法原理</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 视频展示区域 -->
        <div v-else class="video-display-area">
          <!-- API视频网格 -->
          <div class="api-video-grid">
            <!-- 加载状态 -->
            <div v-if="isLoadingApiVideos" class="loading-state">
              <div class="loading-spinner"></div>
              <p>正在加载视频...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="apiVideoError" class="error-state">
              <div class="error-icon">⚠️</div>
              <p>{{ apiVideoError }}</p>
              <button @click="handleCategoryChange({ category: selectedType || '', item: selectedItem || '' })" class="retry-btn">
                重试
              </button>
            </div>

            <!-- 空状态 -->
            <div v-else-if="apiVideos.length === 0" class="empty-state">
              <div class="empty-icon">📹</div>
              <p>暂无相关视频</p>
              <p class="empty-hint">请尝试选择其他类型或稍后再试</p>
            </div>

            <!-- 视频列表 -->
            <div v-else class="video-grid">
              <div
                v-for="video in apiVideos"
                :key="video.id"
                class="video-card"
                @click="handleApiVideoClick(video)"
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
      </div>

      <!-- 视频播放器模态框 -->
      <div v-if="isPlaying && currentVideo" class="video-player-modal" @click="closePlayer">
        <div class="video-player-container" @click.stop>
          <button class="close-btn" @click="closePlayer">✕</button>
          <div class="video-player">
            <iframe
              :src="currentVideo.videoUrl"
              frameborder="0"
              allowfullscreen
              class="video-iframe"
            ></iframe>
          </div>
          <div class="video-details">
            <h3>{{ currentVideo.title }}</h3>
            <p>{{ currentVideo.description }}</p>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
/* 引入拆分的样式文件 */
@import './styles/index.css';
</style>
