<template>
  <div class="welcome-area">
    <div class="welcome-content">
      <h2>🎓 算法学习平台</h2>
      <p>请在上方导航栏选择您想要学习的数据结构或算法类型</p>
      <div class="welcome-features">
        <div class="feature-item">
          <span class="feature-icon">🏗️</span>
          <h3>数据结构</h3>
          <p>学习线性结构和非线性结构的原理与应用</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⚙️</span>
          <h3>算法设计</h3>
          <p>掌握各种算法设计思想和实现技巧</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📹</span>
          <h3>视频教学</h3>
          <p>通过高质量视频深入理解算法原理</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 欢迎界面组件，无需额外逻辑
</script>

<style scoped>
/* 欢迎界面样式 */
.welcome-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--dark-surface, #1e1e1e);
}

.welcome-content {
  text-align: center;
  max-width: 800px;
  color: var(--dark-text, #ffffff);
}

.welcome-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-content > p {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.welcome-features {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
}

.feature-item {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  padding: 2rem;
  background: var(--dark-card, #2a2a2a);
  border-radius: 12px;
  border: 1px solid var(--dark-border, #333);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color, #667eea);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--dark-text, #ffffff);
}

.feature-item p {
  opacity: 0.7;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .welcome-features {
    gap: 1.5rem;
  }
  
  .feature-item {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .welcome-content h2 {
    font-size: 2rem;
  }
  
  .welcome-features {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .feature-item {
    min-width: 150px;
    flex: 1 1 calc(33.333% - 1rem);
  }
}

@media (max-width: 480px) {
  .welcome-features {
    flex-direction: column;
  }
  
  .feature-item {
    min-width: auto;
    max-width: none;
  }
}
</style>