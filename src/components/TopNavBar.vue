<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventBus } from '../eventBus';
import UserInfoModal from './UserInfoModal.vue';

// 用户信息
const userInfo = ref({
  name: '互帮',
  phone: '138****1234'
});

// 控制用户菜单显示
const showUserMenu = ref(false);

// 控制模态框显示
const showModal = ref(false);
const modalType = ref('info'); // 'info' 或 'password'

// 侧边栏状态
const isSidebarCollapsed = ref(false);

// 切换用户菜单
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

// 切换侧边栏状态
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  eventBus.emit('toggle-sidebar', isSidebarCollapsed.value);
}

// 打开修改信息模态框
function openUserInfoModal() {
  modalType.value = 'info';
  showModal.value = true;
  showUserMenu.value = false;
}

// 打开修改密码模态框
function openChangePasswordModal() {
  modalType.value = 'password';
  showModal.value = true;
  showUserMenu.value = false;
}

// 关闭模态框
function closeModal() {
  showModal.value = false;
}

// 更新用户信息
function updateUserInfo(data: any) {
  if (data.type === 'info') {
    userInfo.value = { ...userInfo.value, ...data.data };
  } else if (data.type === 'password') {
    console.log('密码已更新');
  }
}

// 退出登录
function logout() {
  // 这里添加退出登录的逻辑
  console.log('用户退出登录');
  // 可以清除本地存储的用户信息
  localStorage.removeItem('userInfo');
  // 跳转到登录页面
  // window.location.href = '/login';
}
</script>

<template>
  <div class="top-navbar">
    <!-- 左侧Logo和名称 -->
    <div class="left-section">
      <div class="logo-container">
        <img src="/logo.svg" alt="Logo" class="logo" />
      </div>
      <div class="app-name">智能助手</div>
      <div class="sidebar-toggle" @click="toggleSidebar">
        <span class="toggle-text" :class="{ 'collapsed': isSidebarCollapsed }">
          {{ isSidebarCollapsed ? '展开' : '收起' }}
        </span>
      </div>
    </div>
    
    <!-- 右侧用户信息 -->
    <div class="right-section">
      <div class="user-info" @click="toggleUserMenu">
        <div class="avatar-icon">👤</div>
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="dropdown-icon">▼</div>
      </div>
      
      <!-- 用户菜单 -->
      <div v-if="showUserMenu" class="user-menu">
        <div class="menu-item" @click="openUserInfoModal">
          <span class="menu-icon">👤</span>
          <span class="menu-text">个人信息</span>
        </div>
        <div class="menu-item" @click="openChangePasswordModal">
          <span class="menu-icon">🔒</span>
          <span class="menu-text">修改密码</span>
        </div>
        <div class="menu-item" @click="logout">
          <span class="menu-icon">🚪</span>
          <span class="menu-text">退出登录</span>
        </div>
      </div>
    </div>
    
    <!-- 用户信息和密码修改模态框 -->
    <UserInfoModal 
      :show="showModal" 
      :type="modalType" 
      :userInfo="userInfo" 
      @close="closeModal" 
      @update="updateUserInfo"
    />
  </div>
</template>

<style scoped>
.top-navbar {
  height: 60px;
  width: 100%;
  background: var(--dark-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--dark-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 101; /* 确保高于其他元素 */
}

.logo-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--primary-gradient);
  box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.5);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-name {
  font-weight: 600;
  font-size: 1.2em;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(108, 92, 231, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 5px;
}

.sidebar-toggle:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.toggle-text {
  font-size: 0.9em;
  color: var(--primary-color);
  transition: color 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.toggle-text.collapsed {
  color: var(--accent-color);
}

.right-section {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(108, 92, 231, 0.05);
  border: 1px solid rgba(108, 92, 231, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info:hover {
  background: rgba(108, 92, 231, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-gradient);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: normal;
}

.avatar-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  border-radius: 50%;
  z-index: -1;
  animation: rotate 4s linear infinite;
}

.user-info:hover .avatar-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.5);
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.user-name {
  font-weight: 600;
  font-size: 0.95em;
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.dropdown-icon {
  font-size: 0.7em;
  opacity: 0.7;
  transition: all 0.3s ease;
  color: #6c5ce7;
  margin-left: 2px;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
  opacity: 1;
}

.user-info:hover .user-name {
  transform: translateX(-2px);
}

.user-menu {
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  background: var(--dark-surface);
  border: 1px solid rgba(108, 92, 231, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 0 15px rgba(108, 92, 231, 0.1);
  overflow: hidden;
  z-index: 1000;
  animation: fadeInDown 0.3s ease-out;
  padding: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 3px 0;
}

.menu-item:hover {
  background: rgba(108, 92, 231, 0.15);
  transform: translateX(3px);
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.2em;
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
  transform: scale(1.1);
}

.menu-text {
  font-weight: 500;
  font-size: 0.9em;
  transition: transform 0.3s ease;
}

.menu-item:hover .menu-text {
  font-weight: 600;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>