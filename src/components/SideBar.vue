<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { eventBus } from '../eventBus';
import { useRouter, useRoute } from 'vue-router';

const menuItems = ref([
  { icon: '✚', text: '新对话', highlighted: true },
  { icon: '🔍', text: '搜索' },
  { icon: '📚', text: '算法学习', route: '/algorithm' },
  { icon: '👥', text: '社区讨论', route: '/community' }
]);

// 侧边栏状态
const isCollapsed = ref(false);

const router = useRouter();
const route = useRoute();

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

// 发布历史数据（社区讨论页面使用）
const publishHistoryItems = ref([
  { text: '算法复杂度分析的方法与技巧', active: false, date: '2023-08-10' },
  { text: '单调栈与单调队列的应用场景', active: false, date: '2023-08-12' },
  { text: '位运算技巧在算法优化中的妙用', active: false, date: '2023-08-15' },
  { text: '分治算法的设计模式与经典应用', active: false, date: '2023-08-18' },
  { text: '最短路径算法的选择与优化', active: false, date: '2023-08-20' },
  { text: '滑动窗口算法的模板与技巧', active: false, date: '2023-08-22' },
  { text: '拓扑排序在依赖关系处理中的应用', active: false, date: '2023-08-25' },
  { text: '字典树(Trie)的构建与应用', active: false, date: '2023-08-27' },
  { text: '堆排序与优先队列的实现原理', active: false, date: '2023-08-29' },
  { text: '二分查找的变种与边界处理', active: false, date: '2023-09-01' },
  { text: '动态规划状态设计的艺术', active: false, date: '2023-09-03' },
  { text: '图的遍历算法：DFS vs BFS 深度对比', active: false, date: '2023-09-05' },
  { text: '红黑树的平衡性质与旋转操作详解', active: false, date: '2023-09-07' },
  { text: 'KMP算法的next数组构建原理', active: false, date: '2023-09-09' },
  { text: '并查集的路径压缩与按秩合并优化', active: false, date: '2023-09-11' },
  { text: '线段树的区间查询与懒惰传播', active: false, date: '2023-09-13' },
  { text: '哈希表冲突解决：链地址法vs开放地址法', active: false, date: '2023-09-15' },
  { text: 'A*算法在路径规划中的应用实践', active: false, date: '2023-09-17' },
  { text: '背包问题的多种变形与解法总结', active: false, date: '2023-09-19' },
  { text: '字符串匹配：从暴力到KMP到AC自动机', active: false, date: '2023-09-21' },
  { text: '树状数组的原理与区间更新技巧', active: false, date: '2023-09-23' },
  { text: '图论中的强连通分量算法比较', active: false, date: '2023-09-25' },
  { text: '递归与迭代的性能对比分析', active: false, date: '2023-09-27' },
  { text: '贪心算法的正确性证明方法', active: false, date: '2023-09-29' },
  { text: '数据结构选择指南：何时用什么结构', active: false, date: '2023-10-01' },
  { text: '算法优化技巧：从O(n²)到O(n log n)', active: false, date: '2023-10-03' },
  { text: '分布式算法中的一致性哈希原理', active: false, date: '2023-10-05' },
  { text: '机器学习中的梯度下降算法优化', active: false, date: '2023-10-07' },
  { text: '图神经网络的消息传递机制解析', active: false, date: '2023-10-09' },
  { text: '量子算法入门：Shor算法原理', active: false, date: '2023-10-11' },
]);

// 问题记录数据（主页使用）
const questionHistoryItems = ref([
  { text: '如何优化递归算法的时间复杂度？', active: false, date: '2023-09-08' },
  { text: '什么情况下使用哈希表比数组更合适？', active: false, date: '2023-09-07' },
  { text: '动态规划和贪心算法的区别是什么？', active: false, date: '2023-09-06' },
  { text: '如何判断一个问题适合用分治法解决？', active: false, date: '2023-09-05' },
  { text: '二叉搜索树的平衡性为什么重要？', active: false, date: '2023-09-04' },
  { text: '图算法中DFS和BFS的选择标准？', active: false, date: '2023-09-03' },
  { text: '字符串匹配算法KMP的核心思想？', active: false, date: '2023-09-02' },
  { text: '排序算法的稳定性有什么实际意义？', active: false, date: '2023-09-01' },
  { text: '如何设计高效的缓存淘汰策略？', active: false, date: '2023-08-31' },
  { text: '并查集在实际项目中的应用场景？', active: false, date: '2023-08-30' },
]);

// 根据当前路由计算显示的历史记录
const currentHistoryItems = computed(() => {
  return route.path === '/community' ? publishHistoryItems.value : questionHistoryItems.value;
});

// 根据当前路由计算历史记录标题
const historyTitle = computed(() => {
  return route.path === '/community' ? '我的发布历史' : '问题记录';
});
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
      <div class="section-title">{{ historyTitle }}</div>
      <div v-for="(item, index) in currentHistoryItems" :key="index" 
           class="history-item" :class="{ 'active': item.active }">
        <div class="history-content">
          <span class="history-text">{{ item.text }}</span>
          <span class="history-date">{{ item.date }}</span>
        </div>
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
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.history-date {
  font-size: 0.75em;
  color: var(--text-secondary);
  opacity: 0.7;
  font-weight: 400;
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