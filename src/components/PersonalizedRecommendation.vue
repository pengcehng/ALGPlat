<script setup lang="ts">
import { ref, onMounted, defineProps, watch, nextTick } from 'vue';
import { gsap } from 'gsap';

// 定义推荐项接口
interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  type: 'tip' | 'optimization' | 'resource';
  importance: 'high' | 'medium' | 'low';
}

// 定义组件属性
const props = defineProps<{
  show: boolean;
  inputContent?: string; // 用户输入内容，用于生成个性化推荐
}>();

// 定义事件
const emit = defineEmits(['close']);

// 推荐列表
const recommendations = ref<RecommendationItem[]>([]);

// 加载状态
const loading = ref(false);

// 动画完成状态
const animationComplete = ref(false);

// 监听显示状态变化
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadRecommendations();
  } else {
    // 重置状态
    recommendations.value = [];
    animationComplete.value = false;
  }
});

// 模拟加载个性化推荐
const loadRecommendations = () => {
  loading.value = true;
  animationComplete.value = false;
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 根据用户输入生成个性化推荐
    recommendations.value = [
      {
        id: 1,
        title: '算法优化建议',
        description: '基于您的输入，我们推荐您学习快速排序算法，它在大多数情况下性能优于其他排序算法。',
        type: 'optimization',
        importance: 'high'
      },
      {
        id: 2,
        title: '学习路径推荐',
        description: '建议您先掌握基础数据结构，然后学习常见算法范式如分治、动态规划等。',
        type: 'tip',
        importance: 'medium'
      },
      {
        id: 3,
        title: '练习资源',
        description: '推荐您尝试LeetCode平台上的算法题目，从简单难度开始逐步提升。',
        type: 'resource',
        importance: 'medium'
      },
      {
        id: 4,
        title: '进阶学习',
        description: '当您掌握基础算法后，可以尝试学习高级数据结构如红黑树、B树等。',
        type: 'resource',
        importance: 'low'
      }
    ];
    
    loading.value = false;
    
    // 触发动画
    nextTick(() => {
      animateRecommendations();
    });
  }, 1000);
};

// 动画效果
const animateRecommendations = () => {
  const cards = document.querySelectorAll('.recommendation-card');
  
  gsap.fromTo(cards, 
    { 
      y: 50, 
      opacity: 0,
      scale: 0.8,
      rotationX: -15
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      rotationX: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.7)',
      onComplete: () => {
        animationComplete.value = true;
        // 添加闪光效果
        gsap.to('.recommendation-card', {
          boxShadow: '0 0 15px rgba(120, 120, 255, 0.7)',
          duration: 0.5,
          yoyo: true,
          repeat: 1
        });
      }
    }
  );
};

// 获取推荐项图标
const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'tip': return '💡';
    case 'optimization': return '⚡';
    case 'resource': return '📚';
    default: return '✨';
  }
};

// 获取重要性样式类
const getImportanceClass = (importance: string) => {
  switch (importance) {
    case 'high': return 'high-importance';
    case 'medium': return 'medium-importance';
    case 'low': return 'low-importance';
    default: return '';
  }
};

// 导入路由
import { useRouter } from 'vue-router';
const router = useRouter();

// 处理推荐卡片点击
const handleRecommendationClick = (item: RecommendationItem) => {
  // 根据推荐类型执行不同的跳转
  switch (item.type) {
    case 'optimization':
      // 跳转到算法优化页面
      router.push('/algorithm/optimization');
      break;
    case 'tip':
      // 跳转到算法技巧页面
      router.push('/algorithm/tips');
      break;
    case 'resource':
      // 跳转到学习资源页面
      router.push('/algorithm/resources');
      break;
    default:
      // 默认跳转到算法主页
      router.push('/algorithm');
  }
};
</script>

<template>
  <div class="personalized-recommendation" v-if="show">
    <div class="recommendation-header">
      <div class="header-content">
        <h3>个性化推荐</h3>
        <div class="recommendation-subtitle">基于您的输入内容生成</div>
      </div>
      <button class="close-recommendation-btn" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div v-if="loading" class="recommendation-loading">
      <div class="loading-spinner"></div>
      <p>正在生成个性化推荐...</p>
    </div>
    
    <div v-else class="recommendation-content">
      <div 
        v-for="item in recommendations" 
        :key="item.id" 
        class="recommendation-card"
        :class="[`type-${item.type}`, getImportanceClass(item.importance)]"
        @click="handleRecommendationClick(item)"
      >
        <div class="recommendation-icon">{{ getRecommendationIcon(item.type) }}</div>
        <div class="recommendation-details">
          <h4 class="recommendation-title">{{ item.title }}</h4>
          <p class="recommendation-description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personalized-recommendation {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(30, 30, 60, 0.8) 0%, rgba(60, 60, 120, 0.8) 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.header-content {
  text-align: center;
  flex: 1;
}

.close-recommendation-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.close-recommendation-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: rotate(90deg);
}

.recommendation-header h3 {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(90deg, #9c27b0, #3f51b5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.recommendation-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.recommendation-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #9c27b0;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.recommendation-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.recommendation-card {
  background: rgba(30, 30, 60, 0.5);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.recommendation-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.recommendation-card:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.1s ease;
}

.recommendation-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommendation-card:hover::after {
  opacity: 1;
}

.recommendation-icon {
  font-size: 1.8rem;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.recommendation-details {
  flex: 1;
}

.recommendation-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.recommendation-description {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

/* 类型样式 */
.type-tip .recommendation-icon {
  color: #ffeb3b;
}

.type-optimization .recommendation-icon {
  color: #00bcd4;
}

.type-resource .recommendation-icon {
  color: #4caf50;
}

/* 重要性样式 */
.high-importance {
  border-left: 3px solid #f44336;
}

.medium-importance {
  border-left: 3px solid #ff9800;
}

.low-importance {
  border-left: 3px solid #8bc34a;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .recommendation-content {
    grid-template-columns: 1fr;
  }
  
  .recommendation-card {
    padding: 12px;
  }
  
  .recommendation-icon {
    font-size: 1.5rem;
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  
  .recommendation-title {
    font-size: 1rem;
  }
  
  .recommendation-description {
    font-size: 0.8rem;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(156, 39, 176, 0); }
  100% { box-shadow: 0 0 0 0 rgba(156, 39, 176, 0); }
}

.recommendation-card {
  animation: slideUp 0.5s ease-out forwards;
}

.high-importance {
  animation: pulse 2s infinite;
}
</style>