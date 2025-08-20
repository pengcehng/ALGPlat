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
  overflow: hidden;
  position: relative;
  z-index: 1;
  background: var(--dark-bg);
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.6s ease-out;
}

.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.main-content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: linear-gradient(135deg, var(--dark-bg) 0%, rgba(18, 18, 18, 0.95) 50%, var(--dark-bg) 100%);
  position: relative;
}

.main-content-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(108, 92, 231, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0, 206, 201, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(253, 121, 168, 0.04) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.content-container {
  flex: 1;
  padding: 25px 30px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) var(--dark-surface);
}

.content-container::-webkit-scrollbar {
  width: 6px;
}

.content-container::-webkit-scrollbar-track {
  background: var(--dark-surface);
  border-radius: 3px;
}

.content-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
}

.content-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  opacity: 0.5;
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
