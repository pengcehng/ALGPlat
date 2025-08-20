<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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

// 点播记录数据
const playbackRecords = ref([
  { text: '快速排序详解', timestamp: '2023-06-15', active: false },
  { text: '归并排序教程', timestamp: '2023-06-14', active: false },
  { text: '二分查找算法', timestamp: '2023-06-12', active: false },
  { text: '最短路径算法', timestamp: '2023-06-10', active: false },
  { text: '背包问题讲解', timestamp: '2023-06-08', active: false },
  { text: '决策树算法', timestamp: '2023-06-05', active: false },
]);


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
      <div class="section-title">点播记录</div>
      <div v-for="(item, index) in playbackRecords" :key="index" 
           class="playback-item" :class="{ 'active': item.active }">
        <span class="playback-text">{{ item.text }}</span>
        <span class="playback-date">{{ item.timestamp }}</span>
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

.section-title {
  padding: 5px 20px;
  font-size: 0.9em;
  color: var(--text-secondary, #aaa);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.playback-item {
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 3px solid transparent;
  margin: 2px 0;
  display: flex;
  flex-direction: column;
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

.playback-text {
  font-weight: 500;
  margin-bottom: 3px;
}

.playback-date {
  font-size: 0.8em;
  color: var(--text-secondary, #aaa);
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