<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import TopNavBar from './components/TopNavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-container">
    <!-- 根据路由条件渲染不同的布局 -->
    <template v-if="$route.path.includes('/algorithm') || $route.path.includes('/community')">
      <router-view />
    </template>
    <template v-else>
      <div class="background-effects">
        <div class="gradient-orb orb1"></div>
        <div class="gradient-orb orb2"></div>
        <div class="gradient-orb orb3"></div>
      </div>
      <div class="main-layout">
        <TopNavBar />
        <div class="content-wrapper">
          <SideBar />
          <div class="main-content-area">
            <div class="content-container">
              <router-view />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;
  z-index: 1;
  background: var(--dark-bg);
}

.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto; /* 允许内容滚动 */
  position: relative;
}

.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0; /* 确保flex子项可以正确收缩 */
  position: relative;
}

.main-content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.content-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
  background: var(--dark-bg); /* 使用暗色背景 */
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  opacity: 0;
  display: none; /* 完全隐藏渐变背景效果 */
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
  animation: float 15s infinite ease-in-out;
}

.orb1 {
  width: 400px;
  height: 400px;
  background: var(--primary-gradient);
  top: -100px;
  left: 10%;
  animation-delay: 0s;
}

.orb2 {
  width: 300px;
  height: 300px;
  background: var(--secondary-gradient);
  bottom: -50px;
  right: 20%;
  animation-delay: -5s;
}

.orb3 {
  width: 250px;
  height: 250px;
  background: var(--accent-gradient);
  top: 40%;
  left: 60%;
  animation-delay: -10s;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}
</style>
