<script setup lang="ts">
import { ref } from 'vue';
import { eventBus } from '../eventBus';

const menuItems = ref([
  { icon: '✚', text: '新对话', highlighted: true },
  { icon: '🔍', text: '搜索' }
]);

// 处理菜单项点击事件
const handleMenuItemClick = (item: { text: string }) => {
  if (item.text === '新对话') {
    // 触发新对话事件
    eventBus.emit('new-conversation');
  }
};

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
  <div class="sidebar">
    <div class="user-info">
      <div class="avatar-container">
        <img src="#" alt="用户头像" class="avatar" />
      </div>
      <div class="user-name">互帮</div>
      <div class="copy-btn">📋</div>
    </div>
    
    <div class="menu-section">
      <div v-for="(item, index) in menuItems" :key="index" 
           class="menu-item" :class="{ 'highlighted': item.highlighted }"
           @click="handleMenuItemClick(item)">
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>
    
    <div class="history-section">
      <div class="section-title">历史记录</div>
      <div v-for="(item, index) in historyItems" :key="index" 
           class="history-item" :class="{ 'active': item.active }">
        <span class="history-text">{{ item.text }}</span>
      </div>
    </div>
    
    <div class="bottom-menu">
      <div class="menu-item">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">设置</span>
      </div>
    </div>
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
  z-index: 10;
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

.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--dark-border);
  background: rgba(108, 92, 231, 0.05);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.5s ease-out;
}

.avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary-gradient);
  margin-right: 15px;
  box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.5);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  flex-grow: 1;
  font-weight: 600;
  font-size: 1.1em;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.copy-btn {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.copy-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

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
  transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
  transform: scale(1.2);
}

.menu-text {
  font-weight: 500;
  letter-spacing: 0.3px;
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

.bottom-menu {
  border-top: 1px solid var(--dark-border);
  background: rgba(108, 92, 231, 0.05);
  animation: fadeIn 0.5s ease-out 0.3s both;
}

.bottom-menu .menu-item {
  padding: 15px 20px;
}

.bottom-menu .menu-icon {
  background: var(--secondary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>