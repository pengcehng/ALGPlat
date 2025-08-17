<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回主页
const backToHome = () => {
  router.push('/');
};

// 搜索关键词
const searchKeyword = ref('');

// 执行搜索
const performSearch = () => {
  if (!searchKeyword.value.trim()) return;
  // 实际应用中这里会有搜索逻辑
  console.log('搜索:', searchKeyword.value);
  // 可以通过事件总线或props回调通知父组件执行搜索
};

// 模拟用户发布历史
const publishHistory = ref([
  {
    id: 1,
    title: '递归算法优化技巧',
    date: '2023-10-20'
  },
  {
    id: 2,
    title: '图算法在社交网络中的应用',
    date: '2023-10-15'
  },
  {
    id: 3,
    title: '动态规划问题集锦',
    date: '2023-10-05'
  }
]);

// 查看历史帖子
const viewHistoryPost = (postId: number) => {
  // 实际应用中这里会跳转到对应帖子
  console.log('查看历史帖子:', postId);
};
</script>

<template>
  <div class="community-sidebar">
    <!-- 返回主页 -->
    <div class="sidebar-header">
      <button class="back-btn" @click="backToHome">
        <i class="fas fa-arrow-left"></i> 返回主页
      </button>
    </div>
    
    <!-- 搜索框 -->
    <div class="sidebar-search">
      <div class="search-box">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索帖子..." 
          @keyup.enter="performSearch"
        />
        <button @click="performSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    
    <!-- 发布历史 -->
    <div class="sidebar-section">
      <h3>我的发布历史</h3>
      <div class="history-list">
        <div 
          v-for="post in publishHistory" 
          :key="post.id" 
          class="history-item"
          @click="viewHistoryPost(post.id)"
        >
          <div class="history-title">{{ post.title }}</div>
          <div class="history-date">{{ post.date }}</div>
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
  margin-bottom: 10px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--primary-color);
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

.sidebar-section {
  margin-top: 10px;
}

.sidebar-section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: var(--dark-bg);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
}

.history-item:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.history-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 500;
}

.history-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
</style>