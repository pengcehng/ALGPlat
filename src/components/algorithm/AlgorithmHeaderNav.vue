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
const activeMainCategory = ref<'dataStructure' | 'algorithm'>('dataStructure');
// 当前激活的子分类
const activeSubCategory = ref<string>('');
// 当前激活的具体项
const activeItem = ref<string>('');

// 事件定义
const emit = defineEmits<{
  categoryChange: (category: string, subcategory?: string, item?: string) => void
}>();

// 切换主分类
const switchMainCategory = (category: 'dataStructure' | 'algorithm') => {
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
      <button 
        class="main-tab"
        :class="{ active: activeMainCategory === 'dataStructure' }"
        @click="switchMainCategory('dataStructure')"
      >
        <span class="tab-icon">🏗️</span>
        <span class="tab-text">数据结构</span>
      </button>
      <button 
        class="main-tab"
        :class="{ active: activeMainCategory === 'algorithm' }"
        @click="switchMainCategory('algorithm')"
      >
        <span class="tab-icon">⚙️</span>
        <span class="tab-text">算法</span>
      </button>
    </div>

    <!-- 子分类导航 -->
    <div class="sub-category-nav">
      <div class="items-grid">
        <button
          v-for="item in allItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeItem === item.id }"
          @click="selectItem(item.id)"
        >
          <span class="item-icon">{{ item.icon }}</span>
          <span class="item-text">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-header-nav {
  background: var(--dark-surface, #1e1e1e);
  border-bottom: 1px solid var(--border-color, #333);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

/* 主分类标签 */
.main-category-tabs {
  display: flex;
  justify-content: center;
  padding: 20px 20px 0;
  gap: 8px;
  background: linear-gradient(135deg, var(--dark-bg, #121212) 0%, rgba(18, 18, 18, 0.95) 50%, var(--dark-bg, #121212) 100%);
  position: relative;
}

.main-category-tabs::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(108, 92, 231, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 50, 0.8) 100%);
  border: 2px solid rgba(108, 92, 231, 0.2);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  color: var(--text-secondary, #aaa);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.1), transparent);
  transition: 0.6s;
}

.main-tab:hover {
  background: linear-gradient(135deg, rgba(40, 40, 50, 0.9) 0%, rgba(50, 50, 60, 0.8) 100%);
  color: var(--text-primary, #fff);
  transform: translateY(-3px);
  border-color: rgba(108, 92, 231, 0.4);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.main-tab:hover::before {
  left: 100%;
}

.main-tab.active {
  background: linear-gradient(135deg, #6c5ce7 0%, #4834d4 100%);
  color: white;
  border-color: #6c5ce7;
  z-index: 1;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(108, 92, 231, 0.4);
}

.tab-icon {
  font-size: 1.4em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tab-text {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

/* 子分类导航 */
.sub-category-nav {
  padding: 30px 20px;
  background: linear-gradient(135deg, var(--dark-surface, #1e1e1e) 0%, rgba(30, 30, 30, 0.95) 50%, var(--dark-surface, #1e1e1e) 100%);
  border-bottom: 1px solid rgba(108, 92, 231, 0.1);
  position: relative;
}

.sub-category-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(108, 92, 231, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: var(--text-primary, #ffffff);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  font-size: 0.9em;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(108, 92, 231, 0.2);
  border-color: rgba(108, 92, 231, 0.4);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.25);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.3) 0%, rgba(108, 92, 231, 0.2) 100%);
  border-color: rgba(108, 92, 231, 0.6);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.3);
}

.item-icon {
  font-size: 1.2em;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.item-text {
  font-weight: 600;
  font-size: 0.95em;
}

.item-text {
  letter-spacing: 0.3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-category-tabs {
    gap: 8px;
  }
  
  .main-tab {
    padding: 12px 20px;
    font-size: 0.9em;
  }
  
  .sub-category-nav {
    padding: 15px;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .nav-item {
    padding: 10px 12px;
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .main-category-tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .main-tab {
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
  }
  
  .sub-category-nav {
    padding: 10px;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }
  
  .nav-item {
    padding: 8px 10px;
    font-size: 0.8em;
  }
  
  .item-icon {
    font-size: 1em;
  }
  
  .item-text {
    font-size: 0.85em;
  }
}
</style>