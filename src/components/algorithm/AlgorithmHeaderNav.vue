<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义导航项接口
interface NavItem {
  id: string;
  name: string;
  icon?: string;
  children?: NavItem[];
}

// 数据结构分类（按用户提供的学术分类）
const dataStructureCategories = ref<NavItem[]>([
  {
    id: 'linear',
    name: '线性结构',
    icon: '📏',
    children: [
      { id: 'array', name: '数组', icon: '📊' },
      { id: 'linkedList', name: '链表', icon: '🔗' },
      { id: 'stack', name: '栈', icon: '📚' },
      { id: 'queue', name: '队列', icon: '🚶‍♂️' },
      { id: 'string', name: '字符串', icon: '📝' }
    ]
  },
  {
    id: 'nonlinear',
    name: '非线性结构',
    icon: '🌐',
    children: [
      { id: 'tree', name: '树', icon: '🌳' },
      { id: 'graph', name: '图', icon: '🕸️' },
      { id: 'hashTable', name: '哈希表', icon: '🔍' }
    ]
  }
]);

// 算法分类（精简版）
const algorithmCategories = ref<NavItem[]>([
  {
    id: 'design',
    name: '设计思想算法',
    icon: '💡',
    children: [
      { id: 'divide', name: '分治法', icon: '✂️' },
      { id: 'greedy', name: '贪心算法', icon: '🎯' },
      { id: 'backtrack', name: '回溯算法', icon: '↩️' },
      { id: 'branch', name: '分支限界法', icon: '🌿' }
    ]
  },
  {
    id: 'other',
    name: '其他算法',
    icon: '🔬',
    children: [
      { id: 'stringMatch', name: '字符串匹配', icon: '🔤' },
      { id: 'numerical', name: '数值计算', icon: '🧮' },
      { id: 'bitwise', name: '位运算算法', icon: '💻' }
    ]
  }
]);

// 当前激活的主分类
const activeMainCategory = ref<'dataStructure' | 'algorithm' | 'videoTutorial'>('dataStructure');
// 当前激活的子分类
const activeSubCategory = ref<string>('');
// 当前激活的具体项
const activeItem = ref<string>('');
// 下拉菜单状态
const openDropdown = ref<string>('');

// 事件定义
const emit = defineEmits<{
  categoryChange: [category: string, subcategory?: string, item?: string]
}>();

// 切换主分类
const switchMainCategory = (category: 'dataStructure' | 'algorithm' | 'videoTutorial') => {
  activeMainCategory.value = category;
  activeSubCategory.value = '';
  activeItem.value = '';
  openDropdown.value = '';
  emit('categoryChange', category);
};

// 选择子分类
const selectSubCategory = (categoryId: string) => {
  activeSubCategory.value = categoryId;
  activeItem.value = '';
  emit('categoryChange', activeMainCategory.value, categoryId);
};

// 选择具体项
const selectItem = (itemId: string) => {
  activeItem.value = itemId;
  emit('categoryChange', activeMainCategory.value, activeSubCategory.value, itemId);
};

// 获取当前分类数据
const currentCategories = computed(() => {
  return activeMainCategory.value === 'dataStructure' 
    ? dataStructureCategories.value 
    : algorithmCategories.value;
});

// 获取所有子项的扁平列表
const allItems = computed(() => {
  const items: any[] = [];
  currentCategories.value.forEach(category => {
    if (category.children) {
      category.children.forEach(item => {
        items.push({
          ...item,
          categoryId: category.id,
          categoryName: category.name,
          categoryIcon: category.icon
        });
      });
    }
  });
  return items;
});
</script>

<template>
  <div class="algorithm-header-nav" @click.stop>
    <!-- 主分类切换 -->
    <div class="main-category-tabs">
      <div class="tabs-container">
        <button 
          class="main-tab"
          :class="{ active: activeMainCategory === 'dataStructure' }"
          @click="switchMainCategory('dataStructure')"
        >
          <span class="tab-icon">🏗️</span>
          <span class="tab-text">数据结构</span>
          <div class="tab-indicator"></div>
        </button>
        <button 
          class="main-tab"
          :class="{ active: activeMainCategory === 'algorithm' }"
          @click="switchMainCategory('algorithm')"
        >
          <span class="tab-icon">⚙️</span>
          <span class="tab-text">算法</span>
          <div class="tab-indicator"></div>
        </button>
      </div>
    </div>

    <!-- 子分类导航 -->
    <div class="sub-category-nav" v-if="activeMainCategory !== 'videoTutorial'">
      <div class="nav-header">
        <h3 class="nav-title">
          <span class="title-icon">{{ activeMainCategory === 'dataStructure' ? '🏗️' : '⚙️' }}</span>
          {{ activeMainCategory === 'dataStructure' ? '数据结构分类' : '算法分类' }}
        </h3>
        <div class="nav-subtitle">选择一个类别开始学习</div>
      </div>
      <div class="items-grid">
        <button
          v-for="item in allItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeItem === item.id }"
          @click="selectItem(item.id)"
        >
          <div class="item-content">
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-text">{{ item.name }}</span>
            <div class="item-category">{{ item.categoryName }}</div>
          </div>
          <div class="item-hover-effect"></div>
        </button>
      </div>
    </div>
    
    <!-- 视频教学内容区域 -->
    <div class="video-tutorial-area" v-if="activeMainCategory === 'videoTutorial'">
      <div class="nav-header">
        <h3 class="nav-title">
          <span class="title-icon">🎥</span>
          视频教学
        </h3>
        <div class="nav-subtitle">通过高质量视频深入理解算法原理</div>
      </div>
      <div class="video-welcome">
        <div class="welcome-content">
          <div class="welcome-icon">📹</div>
          <h4>欢迎来到视频教学模块</h4>
          <p>这里提供丰富的算法和数据结构视频教程，帮助您更好地理解复杂概念。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-header-nav {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-bottom: 1px solid rgba(108, 92, 231, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 100;
  overflow: hidden;
}

.algorithm-header-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at top, rgba(108, 92, 231, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* 主分类标签 */
.main-category-tabs {
  padding: 8px 20px 0;
  position: relative;
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(15px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  min-width: 140px;
  justify-content: center;
}

.main-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.main-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(108, 92, 231, 0.5);
  box-shadow: 0 12px 40px rgba(108, 92, 231, 0.3);
}

.main-tab:hover::before {
  left: 100%;
}

.main-tab.active {
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  border-color: #6c5ce7;
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(108, 92, 231, 0.5);
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.main-tab.active .tab-indicator {
  transform: translateX(-50%) scaleX(1);
}

.tab-icon {
  font-size: 1.2em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tab-text {
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

/* 子分类导航 */
.sub-category-nav {
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.9) 50%, rgba(15, 52, 96, 0.95) 100%);
  border-bottom: 1px solid rgba(108, 92, 231, 0.2);
  position: relative;
  backdrop-filter: blur(10px);
}

.sub-category-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(108, 92, 231, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* 导航标题区域 */
.nav-header {
  text-align: center;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.nav-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.nav-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 400;
  margin: 0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(85px, 1fr));
  gap: 8px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.nav-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  min-height: 42px;
}

.item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  position: relative;
  z-index: 2;
}

.item-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
  z-index: 1;
}

.nav-item:hover .item-hover-effect {
  left: 100%;
}

.nav-item:hover {
  background: rgba(108, 92, 231, 0.25);
  border-color: rgba(108, 92, 231, 0.5);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.3);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.4) 0%, rgba(162, 155, 254, 0.3) 100%);
  border-color: rgba(108, 92, 231, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(108, 92, 231, 0.4);
}

.item-icon {
  font-size: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  margin-bottom: 0;
}

.item-text {
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 0.1px;
  text-align: center;
  line-height: 1.2;
}

.item-category {
  display: none;
}

/* 视频教学区域样式 */
.video-tutorial-area {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  margin: 16px 0;
}

.video-welcome {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.welcome-content {
  text-align: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.05) 0%, rgba(162, 155, 254, 0.05) 100%);
}

.welcome-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.welcome-content h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  letter-spacing: -0.025em;
}

.welcome-content p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-category-tabs {
    padding: 6px 12px 0;
  }
  
  .tabs-container {
    gap: 6px;
    max-width: 100%;
  }
  
  .main-tab {
    padding: 8px 16px;
    min-width: 100px;
    font-size: 0.85rem;
  }
  
  .nav-title {
    font-size: 1.3rem;
  }
  
  .sub-category-nav {
    padding: 6px 12px;
  }
  
  .nav-header {
    margin-bottom: 6px;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 6px;
  }
  
  .item-content {
    padding: 5px 3px;
    gap: 1px;
  }
  
  .item-icon {
    font-size: 0.9rem;
  }
  
  .item-text {
    font-size: 0.65rem;
  }
  
  .nav-item {
    min-height: 38px;
    border-radius: 5px;
  }
  
  .nav-title {
    font-size: 1.2rem;
    gap: 5px;
  }
  
  .title-icon {
    font-size: 1rem;
  }
  
  .nav-subtitle {
    font-size: 0.75rem;
  }
  
  .video-tutorial-area {
    padding: 8px 12px;
  }
  
  .video-welcome {
    margin-top: 8px;
  }
  
  .welcome-content {
    text-align: center;
    padding: 12px;
  }
  
  .welcome-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
  
  .welcome-content h4 {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
  
  .welcome-content p {
    font-size: 0.7rem;
    color: #666;
  }
}

@media (max-width: 480px) {
  .main-category-tabs {
    padding: 4px 8px 0;
  }
  
  .tabs-container {
    flex-direction: column;
    gap: 4px;
  }
  
  .main-tab {
    padding: 6px 12px;
    min-width: auto;
    width: 100%;
    border-radius: 10px;
    font-size: 0.8rem;
  }
  
  .nav-title {
    font-size: 1.1rem;
    flex-direction: column;
    gap: 6px;
  }
  
  .sub-category-nav {
    padding: 4px 8px;
  }
  
  .nav-header {
    margin-bottom: 4px;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
    gap: 4px;
  }
  
  .nav-item {
    min-height: 35px;
    border-radius: 4px;
  }
  
  .item-content {
    padding: 4px 2px;
    gap: 1px;
  }
  
  .item-icon {
    font-size: 0.8rem;
  }
  
  .item-text {
    font-size: 0.6rem;
  }
  
  .item-category {
    font-size: 0.65rem;
  }
  
  .nav-title {
    font-size: 1rem;
    gap: 4px;
  }
  
  .title-icon {
    font-size: 0.9rem;
  }
  
  .nav-subtitle {
    font-size: 0.7rem;
  }
  
  .nav-item:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 3px 8px rgba(108, 92, 231, 0.3);
  }
}
</style>