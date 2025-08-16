<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import MainContent from './components/MainContent.vue'
</script>

<template>
  <div class="app-container">
    <div class="background-effects">
      <div class="gradient-orb orb1"></div>
      <div class="gradient-orb orb2"></div>
      <div class="gradient-orb orb3"></div>
    </div>
    <SideBar />
    <MainContent />
  </div>
</template>

<style>
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: auto; /* 改为auto，允许内容滚动 */
  position: relative;
  z-index: 1;
  background: var(--dark-bg);
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
