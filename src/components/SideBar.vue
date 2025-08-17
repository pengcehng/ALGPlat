<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventBus } from '../eventBus';

const menuItems = ref([
  { icon: '✚', text: '新对话', highlighted: true },
  { icon: '🔍', text: '搜索' }
]);

// 侧边栏状态
const isCollapsed = ref(false);

import { useRouter } from 'vue-router';

const router = useRouter();

// 处理菜单项点击事件
const handleMenuItemClick = (item: { text: string, route?: string }) => {
  if (item.text === '新对话') {
    // 触发新对话事件
    eventBus.emit('new-conversation');
  } else if (item.route) {
    // 路由跳转
    router.push(item.route);
  }
};

// 监听侧边栏切换事件
onMounted(() => {
  eventBus.on('toggle-sidebar', (collapsed) => {
    if (collapsed !== undefined) {
      isCollapsed.value = collapsed;
    } else {
      isCollapsed.value = !isCollapsed.value;
    }
  });
});

const historyItems = ref([
  { text: '近期电脑操作系统开发进展', active: false },
  { text: '嵌入式Web开发技术开发进展', active: false },
  { text: 'PHP与Java的区别', active: false },
  { text: '自然语言处理AI微调技术', active: false },
  { text: '日志与日志平台', active: false },
  { text: '自动驾驶技术', active: false },
  { text: 'Spring作用域及其配置', active: false },
  { text: '搜索引擎', active: false },
  { text: '自然与技术的平衡', active: false },
  { text: 'Spring作用域及其配置', active: false },
]);
</script>

<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- 用户信息部分已移除 -->
    
    <div class="menu-section">
      <div v-for="(item, index) in menuItems" :key="index" 
           class="menu-item" :class="{ 'highlighted': item.highlighted }"
           @click="handleMenuItemClick(item)">
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text" v-if="!isCollapsed">{{ item.text }}</span>
      </div>
    </div>
    
    <div class="history-section" v-if="!isCollapsed">
      <div class="section-title">历史记录</div>
      <div v-for="(item, index) in historyItems" :key="index" 
           class="history-item" :class="{ 'active': item.active }">
        <span class="history-text">{{ item.text }}</span>
      </div>
    </div>
    
    <!-- 底部菜单已移除 -->
  </div>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background: var(--dark-surface);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--dark-border);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 5; /* 降低z-index，避免覆盖其他元素 */
  transition: width 0.3s ease;
  flex-shrink: 0; /* 防止侧边栏被压缩 */
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: var(--primary-gradient);
  z-index: 1;
}

/* 用户信息样式已移除 */

.menu-section {
  padding: 15px 0;
  border-bottom: 1px solid var(--dark-border);
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
  background: linear-gradient(90deg, rgba(108, 92, 231, 0.1), transparent);
  border-left: 3px solid var(--primary-color);
  transform: translateX(5px);
}

.menu-item.highlighted {
  background: linear-gradient(90deg, rgba(108, 92, 231, 0.2), transparent);
  border-left: 3px solid var(--primary-color);
}

.menu-icon {
  margin-right: 15px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  background: var(--primary-gradient);
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
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 3px solid transparent;
  margin: 2px 0;
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

/* 底部菜单样式已移除 */
</style>