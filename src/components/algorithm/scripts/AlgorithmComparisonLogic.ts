import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

// 定义算法分析结果接口
export interface AlgorithmAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  executionTime: number; // 毫秒
  memoryUsage: number; // MB
}

// 定义算法输入接口
export interface AlgorithmInput {
  code: string;
  language: string;
  name: string;
}

// 支持的编程语言
export const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' }
];

// 示例代码
export const sampleCodes = {
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

export function useAlgorithmComparison() {
  // 获取路由实例
  const router = useRouter();

  // 返回主页方法
  const goToHome = () => {
    router.push('/');
  };

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

  // 加载示例代码
  const loadSampleCode = (side: 'left' | 'right', type: 'quickSort' | 'bubbleSort') => {
    const algorithm = side === 'left' ? leftAlgorithm : rightAlgorithm;
    algorithm.code = sampleCodes[algorithm.language as keyof typeof sampleCodes]?.[type] || '// 当前语言不支持此示例';
  };

  return {
    goToHome,
    leftAlgorithm,
    rightAlgorithm,
    supportedLanguages,
    leftAnalysis,
    rightAnalysis,
    isAnalyzing,
    analysisComplete,
    runAnalysis,
    resetAnalysis,
    comparisonResult,
    loadSampleCode
  };
}