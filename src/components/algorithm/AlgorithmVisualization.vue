<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import D3NetworkGraph from './D3NetworkGraph.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回主页
const goToHome = () => {
  router.push('/');
};

// 程序输入
const codeInput = ref('');

// 算法问题描述
const algorithmDescription = ref('请在此处输入算法问题描述...');

// 后端返回的文字分析
const textAnalysis = ref('算法分析结果将在此显示...');

// 性能描述
const performanceDescription = ref('算法性能分析将在此显示...');

// 示例数据
const graphData = reactive({
  nodes: [
    { id: '1', name: '节点1', group: 1 },
    { id: '2', name: '节点2', group: 1 },
    { id: '3', name: '节点3', group: 2 },
    { id: '4', name: '节点4', group: 2 },
    { id: '5', name: '节点5', group: 3 },
    { id: '6', name: '节点6', group: 3 },
    { id: '7', name: '节点7', group: 4 },
    { id: '8', name: '节点8', group: 4 }
  ],
  links: [
    { source: '1', target: '2', value: 1 },
    { source: '1', target: '3', value: 2 },
    { source: '2', target: '4', value: 1 },
    { source: '3', target: '5', value: 3 },
    { source: '4', target: '6', value: 1 },
    { source: '5', target: '7', value: 2 },
    { source: '6', target: '8', value: 1 },
    { source: '7', target: '8', value: 3 }
  ]
});

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
});
</script>

<template>
  <div class="algorithm-visualization">
    <!-- 头部导航栏 -->
    <AlgorithmHeaderNav 
      page-mode="visualization"
      @return-home="goToHome"
    />
    
    <div class="visualization-layout">
      <div class="visualization-left-panel">
        <!-- 程序输入框 -->
        <div class="code-input-container">
          <h3>程序输入</h3>
          <textarea 
            v-model="codeInput" 
            class="code-input" 
            placeholder="请在此处输入您的代码..."
          ></textarea>
          <button class="run-btn">运行算法</button>
        </div>
        
        <!-- 算法问题描述框 -->
        <div class="description-container">
          <h3>算法问题描述</h3>
          <div class="description-content">
            <textarea 
              v-model="algorithmDescription" 
              class="algorithm-description"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="visualization-center-panel">
        <!-- 动画展示框 -->
        <div class="animation-container">
          <h3>算法可视化动画</h3>
          <div class="animation-content">
            <D3NetworkGraph 
              :data="graphData" 
              :width="800" 
              :height="400" 
              :node-color="'#6c5ce7'" 
              :link-color="'#333333'" 
              :show-labels="true"
            />
          </div>
        </div>
      </div>
      
      <div class="visualization-right-panel">
        <!-- 后端返回的文字分析框 -->
        <div class="analysis-container">
          <h3>算法分析</h3>
          <div class="analysis-content">
            <p>{{ textAnalysis }}</p>
          </div>
        </div>
        
        <!-- 性能描述框 -->
        <div class="performance-container">
          <h3>性能分析</h3>
          <div class="performance-content">
            <p>{{ performanceDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-visualization {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--dark-bg);
  color: var(--text-primary);
}

.visualization-header {
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.algorithm-visualization .visualization-header .header-content {
  width: 100% !important;
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 30px;
  text-align: left !important;
  flex: none !important;
  position: relative !important;
}

.algorithm-visualization .title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.algorithm-visualization .title-section h2 {
  margin: 0;
  font-size: 1.8em;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.algorithm-visualization .title-section .subtitle {
  margin: 0;
  font-size: 0.95em;
  color: var(--text-secondary);
  opacity: 0.85;
  line-height: 1.4;
}

.algorithm-visualization .visualization-header .header-content .back-btn {
  padding: 8px 16px;
  font-size: 0.9em;
  font-weight: 500;
  background: var(--dark-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  align-self: center;
  position: relative;
}

.algorithm-visualization .visualization-header .header-content .back-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
}







.visualization-layout {
  display: flex;
  gap: 20px;
  height: calc(100% - 60px);
}

.visualization-left-panel,
.visualization-center-panel,
.visualization-right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.visualization-left-panel {
  width: 25%;
}

.visualization-center-panel {
  width: 50%;
  flex: 1;
}

.visualization-right-panel {
  width: 25%;
}

.code-input-container,
.description-container,
.animation-container,
.analysis-container,
.performance-container {
  background-color: var(--dark-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-input-container,
.description-container {
  flex: 1;
}

.animation-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.animation-content {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--dark-bg);
}

.code-input,
.algorithm-description {
  width: 100%;
  height: 200px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  font-family: monospace;
  resize: none;
}

.algorithm-description {
  height: 150px;
}

.run-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: var(--primary-gradient);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.run-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.analysis-content,
.performance-content {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--dark-bg);
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
}



h2, h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

h3 {
  font-size: 1.1em;
  font-weight: 600;
}
</style>