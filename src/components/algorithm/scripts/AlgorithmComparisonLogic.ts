import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import AlgorithmAnalysisService, { 
  type AlgorithmAnalysisRequest, 
  type AlgorithmComparisonResponse 
} from '../../../api/algorithmAnalysis';

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

  // 错误状态
  const analysisError = ref<string>('');

  // 输入验证函数
  const validateInputs = (): { valid: boolean; error?: string } => {
    if (!leftAlgorithm.code.trim() || !rightAlgorithm.code.trim()) {
      return { valid: false, error: '请输入两个算法的代码' };
    }

    if (!leftAlgorithm.name.trim() || !rightAlgorithm.name.trim()) {
      return { valid: false, error: '请为两个算法设置名称' };
    }

    if (!leftAlgorithm.language || !rightAlgorithm.language) {
      return { valid: false, error: '请选择算法的编程语言' };
    }

    // 检查算法名称长度
    if (leftAlgorithm.name.length > 50 || rightAlgorithm.name.length > 50) {
      return { valid: false, error: '算法名称长度不能超过50个字符' };
    }

    // 检查代码长度
    if (leftAlgorithm.code.length > 10000 || rightAlgorithm.code.length > 10000) {
      return { valid: false, error: '算法代码长度不能超过10000个字符' };
    }

    // 基本的代码格式检查
    const codePattern = /[a-zA-Z]/; // 至少包含字母
    if (!codePattern.test(leftAlgorithm.code) || !codePattern.test(rightAlgorithm.code)) {
      return { valid: false, error: '请输入有效的算法代码' };
    }

    return { valid: true };
  };

  // 执行分析
  const runAnalysis = async () => {
    // 输入验证
    const validation = validateInputs();
    if (!validation.valid) {
      analysisError.value = validation.error || '输入验证失败';
      return;
    }
    
    isAnalyzing.value = true;
    analysisComplete.value = false;
    analysisError.value = '';
    
    try {
      // 构建请求数据
      const request: AlgorithmAnalysisRequest = {
        algorithmA: {
          code: leftAlgorithm.code,
          language: leftAlgorithm.language,
          name: leftAlgorithm.name
        },
        algorithmB: {
          code: rightAlgorithm.code,
          language: rightAlgorithm.language,
          name: rightAlgorithm.name
        }
      };

      // 发送分析请求到后端API
      const response: AlgorithmComparisonResponse = await AlgorithmAnalysisService.analyzeAlgorithms(request);
      
      if (response.success && response.data) {
        // 更新分析结果
        leftAnalysis.value = {
          timeComplexity: response.data.algorithmA.timeComplexity,
          spaceComplexity: response.data.algorithmA.spaceComplexity,
          executionTime: response.data.algorithmA.executionTime,
          memoryUsage: response.data.algorithmA.memoryUsage
        };
        
        rightAnalysis.value = {
          timeComplexity: response.data.algorithmB.timeComplexity,
          spaceComplexity: response.data.algorithmB.spaceComplexity,
          executionTime: response.data.algorithmB.executionTime,
          memoryUsage: response.data.algorithmB.memoryUsage
        };
        
        analysisComplete.value = true;
      } else {
        // 处理API错误
        analysisError.value = response.error || response.message || '分析失败';
        console.error('算法分析失败:', response.error);
      }
    } catch (error) {
      // 处理网络或其他错误
      analysisError.value = '网络请求失败，请检查连接后重试';
      console.error('算法分析请求异常:', error);
    } finally {
      isAnalyzing.value = false;
    }
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
    analysisError.value = '';
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
          : ''
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
    analysisError,
    runAnalysis,
    resetAnalysis,
    comparisonResult,
    loadSampleCode
  };
}