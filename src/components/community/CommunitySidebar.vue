<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CommunityApiService, type HistoryPost } from '../../api/community';

const router = useRouter();

// 返回主页
const backToHome = () => {
  router.push('/');
};

// 搜索关键词
const searchKeyword = ref('');

// 定义事件
const emit = defineEmits<{
  search: [keyword: string, results: any[]],
  viewHistoryPost: [postId: number]
}>();

// 执行搜索
const performSearch = async () => {
  if (!searchKeyword.value.trim()) return;
  
  try {
    const results = await CommunityApiService.searchPosts(searchKeyword.value.trim());
    emit('search', searchKeyword.value, results);
    console.log('搜索结果:', results);
  } catch (err) {
    console.error('搜索失败:', err);
    emit('search', searchKeyword.value, []);
  }
};

// 用户发布历史（通过API加载）
const publishHistory = ref<HistoryPost[]>([]);

// 加载状态
const isLoading = ref(false);
const error = ref<string | null>(null);



// 加载用户历史记录
const loadUserHistory = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await CommunityApiService.getUserHistory();
    publishHistory.value = response;
  } catch (err) {
    error.value = '加载历史记录失败';
    console.error('Failed to load user history:', err);
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadUserHistory();
});

// 查看历史帖子
const viewHistoryPost = (postId: number) => {
  // 触发事件让父组件处理帖子查看
  emit('viewHistoryPost', postId);
  console.log('查看历史帖子:', postId);
};
</script>

<template>
  <div class="community-sidebar">
    <!-- 返回主页 -->
    <div class="sidebar-header">
      <button class="return-home-btn" @click="backToHome">
        <i class="fas fa-home"></i> 返回主页
      </button>
    </div>
    
    <!-- 搜索框 -->
    <div class="sidebar-search">
      <div class="search-box">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索发布帖子..." 
          @keyup.enter="performSearch"
        />
        <button @click="performSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    
    <!-- 发布历史 -->
    <div class="history-section">
      <div class="section-title">我的发布历史</div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> 正在加载历史记录...
      </div>
      
      <!-- 错误提示 -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadUserHistory()" class="retry-btn">重试</button>
      </div>
      
      <!-- 历史记录列表 -->
      <div v-else>
        <div v-if="publishHistory.length === 0" class="no-history">
          <p>暂无发布历史</p>
        </div>
        <div v-else v-for="(post, index) in publishHistory" :key="post.id" 
             class="history-item"
             @click="viewHistoryPost(post.id)">
          <div class="history-content">
            <span class="history-text">{{ post.title }}</span>
            <span class="history-date">{{ post.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-sidebar {
  width: 280px;
  height: 100%;
  background: var(--dark-surface);
  border-right: 1px solid var(--dark-border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--dark-border);
}

.return-home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  width: 100%;
  justify-content: center;
}

.return-home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.return-home-btn:hover::before {
  left: 100%;
}

.return-home-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.sidebar-search {
  margin-bottom: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--dark-bg);
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid var(--dark-border);
  overflow: hidden;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
}

.search-box button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
}

.search-box button:hover {
  color: var(--primary-color);
}

.history-section {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px 0;
  animation: fadeIn 0.5s ease-out 0.2s both;
}

.section-title {
  padding: 5px 20px;
  font-size: 0.9em;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.history-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.history-date {
  font-size: 0.75em;
  color: var(--text-secondary);
  opacity: 0.7;
  font-weight: 400;
}

.history-item:hover {
  background: linear-gradient(90deg, rgba(0, 206, 201, 0.1), transparent);
  border-left: 3px solid var(--secondary-color);
  transform: translateX(5px);
}

.history-item.active {
  background: linear-gradient(90deg, rgba(0, 206, 201, 0.2), transparent);
  border-left: 3px solid var(--secondary-color);
}

/* 加载状态和错误提示样式 */
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.loading-message i {
  margin-right: 8px;
}

.error-message {
  padding: 15px;
  text-align: center;
  color: #dc3545;
}

.error-message p {
  margin-bottom: 10px;
  font-size: 14px;
}

.retry-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #0056b3;
}

.no-history {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .community-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .sidebar-header {
    padding: 15px;
  }
  
  .return-home-btn {
    width: 100%;
  }
}
</style>