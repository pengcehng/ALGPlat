<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchPlaybackRecords, updatePlaybackRecordStatus, playVideo, type PlaybackRecord } from '../../api/playback';

const router = useRouter();

// 菜单项
const menuItems = ref([
  { icon: '🏠', text: '返回首页', route: '/', highlighted: false },
  { icon: '🔍', text: '搜索', highlighted: false }
]);

// 处理菜单项点击事件
const handleMenuItemClick = (item: { text: string, route?: string, highlighted?: boolean }) => {
  if (item.route) {
    // 路由跳转，使用replace替代push以替换历史记录而不是添加新记录
    router.replace(item.route);
  }
};

// 点播记录数据和状态
const playbackRecords = ref<PlaybackRecord[]>([]);
const isLoading = ref(false);
const error = ref('');

// 获取点播记录数据
const loadPlaybackRecords = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const records = await fetchPlaybackRecords();
    playbackRecords.value = records;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取点播记录失败，请稍后重试';
    console.error('Failed to fetch playback records:', err);
  } finally {
    isLoading.value = false;
  }
};

// 处理点播记录点击事件
const handlePlaybackClick = async (record: PlaybackRecord) => {
  try {
    // 清除其他记录的激活状态
    playbackRecords.value.forEach(item => item.active = false);
    // 设置当前记录为激活状态
    record.active = true;
    
    // 更新记录状态
    await updatePlaybackRecordStatus(record.id, true);
    
    // 播放视频
    await playVideo(record);
  } catch (err) {
    console.error('处理点播记录点击失败:', err);
    // 如果失败，恢复状态
    record.active = false;
  }
};

// 重新获取数据
const refreshData = () => {
  loadPlaybackRecords();
};

// 组件挂载时获取数据
onMounted(() => {
  loadPlaybackRecords();
});


</script>

<template>
  <div class="sidebar">
    <div class="menu-section">
      <div v-for="(item, index) in menuItems" :key="index" 
           class="menu-item" :class="{ 'highlighted': item.highlighted }"
           @click="handleMenuItemClick(item)">
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>
    
    <div class="playback-section">
      <div class="section-header">
        <div class="section-title">点播记录</div>
        <button v-if="error" @click="refreshData" class="refresh-btn" title="重新加载">
          🔄
        </button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button @click="refreshData" class="retry-btn">重试</button>
      </div>
      
      <!-- 点播记录列表 -->
      <div v-else-if="playbackRecords.length > 0" class="playback-list">
        <div v-for="item in playbackRecords" :key="item.id" 
             class="playback-item" 
             :class="{ 'active': item.active }"
             @click="handlePlaybackClick(item)">
          <div class="playback-main">
            <span class="playback-text">{{ item.text }}</span>
            <div class="playback-meta">
              <span class="playback-date">{{ item.timestamp }}</span>
              <span v-if="item.duration" class="playback-duration">{{ item.duration }}</span>
            </div>
          </div>
          <div v-if="item.category" class="playback-category">{{ item.category }}</div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📺</div>
        <div class="empty-message">暂无点播记录</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background: var(--dark-surface, #1e1e1e);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--dark-border, #333);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 10;
  flex-shrink: 0; /* 防止侧边栏被压缩 */
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  z-index: 1;
}



.menu-section {
  padding: 15px 0;
  border-bottom: 1px solid var(--dark-border, #333);
  animation: fadeIn 0.5s ease-out 0.1s both;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.sidebar.collapsed .menu-item {
  padding: 12px;
  justify-content: center;
  margin: 5px;
}

.menu-item:hover {
  background: linear-gradient(90deg, rgba(75, 108, 183, 0.1), transparent);
  border-left: 3px solid var(--primary-color, #4b6cb7);
  transform: translateX(5px);
}

.menu-item.highlighted {
  background: linear-gradient(90deg, rgba(75, 108, 183, 0.2), transparent);
  border-left: 3px solid var(--primary-color, #4b6cb7);
}

.menu-icon {
  margin-right: 15px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease, margin 0.3s ease;
}

.sidebar.collapsed .menu-icon {
  margin-right: 0;
  font-size: 1.4em;
}

.menu-item:hover .menu-icon {
  transform: scale(1.2);
}

.menu-text {
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.playback-section {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px 0;
  animation: fadeIn 0.5s ease-out 0.2s both;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 0.9em;
  color: var(--text-secondary, #aaa);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.refresh-btn {
  background: none;
  border: none;
  color: var(--text-secondary, #aaa);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.refresh-btn:hover {
  color: var(--primary-color, #4b6cb7);
  background: rgba(75, 108, 183, 0.1);
  transform: rotate(180deg);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  color: var(--text-secondary, #aaa);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(75, 108, 183, 0.2);
  border-top: 2px solid var(--primary-color, #4b6cb7);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 0.9em;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.error-icon {
  font-size: 1.5em;
  margin-bottom: 8px;
}

.error-message {
  color: var(--text-secondary, #aaa);
  font-size: 0.85em;
  margin-bottom: 12px;
  line-height: 1.4;
}

.retry-btn {
  background: var(--primary-color, #4b6cb7);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--primary-hover, #5a7bc8);
  transform: translateY(-1px);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 2em;
  margin-bottom: 10px;
  opacity: 0.6;
}

.empty-message {
  color: var(--text-secondary, #aaa);
  font-size: 0.9em;
}

/* 点播记录列表 */
.playback-list {
  flex: 1;
  overflow-y: auto;
}

.playback-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  margin: 2px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.playback-item:hover {
  background: linear-gradient(90deg, rgba(75, 108, 183, 0.1), transparent);
  border-left: 3px solid var(--primary-color, #4b6cb7);
  transform: translateX(5px);
}

.playback-item.active {
  background: linear-gradient(90deg, rgba(75, 108, 183, 0.2), transparent);
  border-left: 3px solid var(--primary-color, #4b6cb7);
}

.playback-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.playback-text {
  font-weight: 500;
  font-size: 0.9em;
  line-height: 1.3;
  color: var(--text-primary, #fff);
}

.playback-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.playback-date {
  font-size: 0.75em;
  color: var(--text-secondary, #aaa);
  flex: 1;
}

.playback-duration {
  font-size: 0.75em;
  color: var(--primary-color, #4b6cb7);
  background: rgba(75, 108, 183, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.playback-category {
  font-size: 0.7em;
  color: var(--text-secondary, #aaa);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
  align-self: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
</style>