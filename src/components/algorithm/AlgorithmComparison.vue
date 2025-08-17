<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AlgorithmChart from './AlgorithmChart.vue';

// 获取路由实例
const router = useRouter();

// 返回主页方法
const goToHome = () => {
  router.push('/');
};

// 定义算法分析结果接口
interface AlgorithmAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  executionTime: number; // 毫秒
  memoryUsage: number; // MB
}

// 定义算法输入接口
interface AlgorithmInput {
  code: string;
  language: string;
  name: string;
}

// 左侧算法输入
const leftAlgorithm = reactive<AlgorithmInput>({
  code: '',
  language: 'javascript',
  name: '算法 A'
});

// 右侧算法输入
const rightAlgorithm = reactive<AlgorithmInput>({
  code: '',
  language: 'javascript',
  name: '算法 B'
});

// 支持的编程语言
const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' }
];

// 分析结果
const leftAnalysis = ref<AlgorithmAnalysis>({
  timeComplexity: '-',
  spaceComplexity: '-',
  executionTime: 0,
  memoryUsage: 0
});

const rightAnalysis = ref<AlgorithmAnalysis>({
  timeComplexity: '-',
  spaceComplexity: '-',
  executionTime: 0,
  memoryUsage: 0
});

// 分析状态
const isAnalyzing = ref(false);
const analysisComplete = ref(false);

// 执行分析
const runAnalysis = () => {
  if (!leftAlgorithm.code || !rightAlgorithm.code) {
    alert('请输入两个算法的代码');
    return;
  }
  
  isAnalyzing.value = true;
  analysisComplete.value = false;
  
  // 模拟分析过程
  setTimeout(() => {
    // 这里只是模拟结果，实际项目中应该调用后端API进行真实分析
    leftAnalysis.value = {
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      executionTime: Math.floor(Math.random() * 100) + 50,
      memoryUsage: Math.floor(Math.random() * 10) + 5
    };
    
    rightAnalysis.value = {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      executionTime: Math.floor(Math.random() * 200) + 100,
      memoryUsage: Math.floor(Math.random() * 5) + 2
    };
    
    isAnalyzing.value = false;
    analysisComplete.value = true;
  }, 2000);
};

// 重置分析
const resetAnalysis = () => {
  leftAlgorithm.code = '';
  rightAlgorithm.code = '';
  leftAnalysis.value = {
    timeComplexity: '-',
    spaceComplexity: '-',
    executionTime: 0,
    memoryUsage: 0
  };
  rightAnalysis.value = {
    timeComplexity: '-',
    spaceComplexity: '-',
    executionTime: 0,
    memoryUsage: 0
  };
  analysisComplete.value = false;
};

// 计算比较结果
const comparisonResult = computed(() => {
  if (!analysisComplete.value) return null;
  
  const timeComparison = leftAnalysis.value.executionTime < rightAnalysis.value.executionTime
    ? `${leftAlgorithm.name}比${rightAlgorithm.name}快${Math.round((rightAnalysis.value.executionTime - leftAnalysis.value.executionTime) / leftAnalysis.value.executionTime * 100)}%`
    : `${rightAlgorithm.name}比${leftAlgorithm.name}快${Math.round((leftAnalysis.value.executionTime - rightAnalysis.value.executionTime) / rightAnalysis.value.executionTime * 100)}%`;
  
  const memoryComparison = leftAnalysis.value.memoryUsage < rightAnalysis.value.memoryUsage
    ? `${leftAlgorithm.name}比${rightAlgorithm.name}节省内存${Math.round((rightAnalysis.value.memoryUsage - leftAnalysis.value.memoryUsage) / leftAnalysis.value.memoryUsage * 100)}%`
    : `${rightAlgorithm.name}比${leftAlgorithm.name}节省内存${Math.round((leftAnalysis.value.memoryUsage - rightAnalysis.value.memoryUsage) / rightAnalysis.value.memoryUsage * 100)}%`;
  
  return {
    timeComparison,
    memoryComparison,
    recommendation: leftAnalysis.value.executionTime < rightAnalysis.value.executionTime && leftAnalysis.value.memoryUsage < rightAnalysis.value.memoryUsage
      ? `${leftAlgorithm.name}在时间和空间上都更优`
      : leftAnalysis.value.executionTime > rightAnalysis.value.executionTime && leftAnalysis.value.memoryUsage > rightAnalysis.value.memoryUsage
        ? `${rightAlgorithm.name}在时间和空间上都更优`
        : '两种算法各有优势，请根据实际需求选择'
  };
});

// 示例代码
const sampleCodes = {
  javascript: {
    quickSort: `// 快速排序实现
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    bubbleSort: `// 冒泡排序实现
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
  },
  python: {
    quickSort: `# 快速排序实现
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)`,
    bubbleSort: `# 冒泡排序实现
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
  }
};

// 加载示例代码
const loadSampleCode = (side: 'left' | 'right', type: 'quickSort' | 'bubbleSort') => {
  const algorithm = side === 'left' ? leftAlgorithm : rightAlgorithm;
  algorithm.code = sampleCodes[algorithm.language as keyof typeof sampleCodes]?.[type] || '// 当前语言不支持此示例';
};
</script>

<template>
  <div class="algorithm-comparison-container">
    <div class="header-with-back">
      <button class="back-btn" @click="goToHome">
        <span class="back-icon">←</span> 返回主页
      </button>
      <h1 class="comparison-title">算法性能对比分析</h1>
    </div>
    
    <div class="comparison-layout">
      <!-- 左侧算法输入 -->
      <div class="algorithm-input left-algorithm">
        <div class="input-header">
          <input v-model="leftAlgorithm.name" class="algorithm-name-input" placeholder="算法名称">
          <select v-model="leftAlgorithm.language" class="language-select">
            <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
        
        <div class="code-editor-container">
          <textarea 
            v-model="leftAlgorithm.code" 
            class="code-editor enhanced" 
            placeholder="在此输入算法代码..."
          ></textarea>
        </div>
        
        <div class="sample-buttons">
          <button @click="loadSampleCode('left', 'quickSort')" class="sample-btn">加载快速排序</button>
          <button @click="loadSampleCode('left', 'bubbleSort')" class="sample-btn">加载冒泡排序</button>
        </div>
      </div>
      
      <!-- 中间分析结果 -->
      <div class="analysis-result">
        <div class="analysis-header">
          <h2>性能分析</h2>
          <div class="action-buttons">
            <button @click="runAnalysis" class="primary-btn" :disabled="isAnalyzing">
              {{ isAnalyzing ? '分析中...' : '运行分析' }}
            </button>
            <button @click="resetAnalysis" class="secondary-btn">重置</button>
          </div>
        </div>
        
        <div class="analysis-content" v-if="!isAnalyzing">
          <div v-if="!analysisComplete" class="empty-analysis">
            <p>请输入两个算法代码并点击"运行分析"按钮</p>
          </div>
          
          <div v-else class="analysis-data">
            <div class="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>指标</th>
                    <th>{{ leftAlgorithm.name }}</th>
                    <th>{{ rightAlgorithm.name }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>时间复杂度</td>
                    <td>{{ leftAnalysis.timeComplexity }}</td>
                    <td>{{ rightAnalysis.timeComplexity }}</td>
                  </tr>
                  <tr>
                    <td>空间复杂度</td>
                    <td>{{ leftAnalysis.spaceComplexity }}</td>
                    <td>{{ rightAnalysis.spaceComplexity }}</td>
                  </tr>
                  <tr>
                    <td>执行时间</td>
                    <td>{{ leftAnalysis.executionTime }}ms</td>
                    <td>{{ rightAnalysis.executionTime }}ms</td>
                  </tr>
                  <tr>
                    <td>内存使用</td>
                    <td>{{ leftAnalysis.memoryUsage }}MB</td>
                    <td>{{ rightAnalysis.memoryUsage }}MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="comparison-charts">
              <AlgorithmChart 
                :leftAlgorithm="leftAlgorithm" 
                :rightAlgorithm="rightAlgorithm"
                :leftAnalysis="leftAnalysis"
                :rightAnalysis="rightAnalysis"
              />
            </div>
            
            <div class="comparison-conclusion">
              <h3>分析结论</h3>
              <p>{{ comparisonResult?.timeComparison }}</p>
              <p>{{ comparisonResult?.memoryComparison }}</p>
              <p class="recommendation">{{ comparisonResult?.recommendation }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="analyzing-indicator">
          <div class="spinner"></div>
          <p>正在分析中，请稍候...</p>
        </div>
      </div>
      
      <!-- 右侧算法输入 -->
      <div class="algorithm-input right-algorithm">
        <div class="input-header">
          <input v-model="rightAlgorithm.name" class="algorithm-name-input" placeholder="算法名称">
          <select v-model="rightAlgorithm.language" class="language-select">
            <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
        
        <div class="code-editor-container">
          <textarea 
            v-model="rightAlgorithm.code" 
            class="code-editor enhanced" 
            placeholder="在此输入算法代码..."
          ></textarea>
        </div>
        
        <div class="sample-buttons">
          <button @click="loadSampleCode('right', 'quickSort')" class="sample-btn">加载快速排序</button>
          <button @click="loadSampleCode('right', 'bubbleSort')" class="sample-btn">加载冒泡排序</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-comparison-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--dark-bg, #121212);
  color: var(--text-primary, #ffffff);
  padding: 20px;
}

.header-with-back {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(108, 92, 231, 0.2);
  position: absolute;
  left: 0;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
}

.back-icon {
  margin-right: 5px;
  font-size: 16px;
}

.comparison-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.comparison-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 100px);
}

.algorithm-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--dark-surface, #1e1e1e);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.algorithm-name-input {
  flex: 1;
  background-color: var(--dark-bg, #121212);
  border: 1px solid var(--dark-border, #333);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--text-primary, #ffffff);
  font-size: 14px;
}

.language-select {
  width: 120px;
  margin-left: 10px;
  background-color: var(--dark-bg, #121212);
  border: 1px solid var(--dark-border, #333);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--text-primary, #ffffff);
  font-size: 14px;
}

.code-editor-container {
  flex: 1;
  margin-bottom: 12px;
}

.code-editor {
  width: 100%;
  height: 100%;
  background-color: var(--dark-bg, #121212);
  border: 1px solid var(--dark-border, #333);
  border-radius: 4px;
  padding: 12px;
  color: var(--text-primary, #ffffff);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: none;
  line-height: 1.5;
}

.code-editor.enhanced {
  font-family: 'Fira Code', 'Courier New', monospace;
  tab-size: 2;
  white-space: pre;
  overflow: auto;
}

/* 自定义滚动条 */
.code-editor.enhanced::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-editor.enhanced::-webkit-scrollbar-track {
  background: var(--dark-bg, #121212);
}

.code-editor.enhanced::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.code-editor.enhanced::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.sample-buttons {
  display: flex;
  gap: 10px;
}

.sample-btn {
  background-color: var(--dark-bg, #121212);
  border: 1px solid var(--dark-border, #333);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--text-primary, #ffffff);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sample-btn:hover {
  background-color: var(--dark-hover, #2a2a2a);
}

.analysis-result {
  flex: 1.2;
  background-color: var(--dark-surface, #1e1e1e);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analysis-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary, #ffffff);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.primary-btn {
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: transparent;
  border: 1px solid var(--dark-border, #333);
  border-radius: 4px;
  padding: 8px 16px;
  color: var(--text-primary, #ffffff);
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background-color: var(--dark-hover, #2a2a2a);
}

.analysis-content {
  flex: 1;
  overflow-y: auto;
}

.empty-analysis {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary, #aaaaaa);
}

.analyzing-indicator {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary, #aaaaaa);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4776E6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.comparison-table {
  margin-bottom: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--dark-border, #333);
}

th {
  background-color: var(--dark-bg, #121212);
  font-weight: 500;
}

tr:hover {
  background-color: var(--dark-hover, #2a2a2a);
}

.comparison-charts {
  margin-bottom: 24px;
}

.chart-placeholder {
  height: 200px;
  background-color: var(--dark-bg, #121212);
  border: 1px dashed var(--dark-border, #333);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary, #aaaaaa);
}

.comparison-conclusion {
  background-color: var(--dark-bg, #121212);
  border-radius: 4px;
  padding: 16px;
}

.comparison-conclusion h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  color: var(--text-primary, #ffffff);
}

.comparison-conclusion p {
  margin: 8px 0;
  color: var(--text-secondary, #aaaaaa);
}

.recommendation {
  font-weight: 500;
  color: #4776E6 !important;
  margin-top: 12px !important;
}
</style>