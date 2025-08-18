// 排序算法实现
import type { AnimationStep, AnimationElement } from './types';

/**
 * 冒泡排序算法
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function generateBubbleSortSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  const n = arr.length;
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 冒泡排序过程
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // 比较相邻元素
      steps.push({
        description: `比较元素 ${arr[j]} 和 ${arr[j + 1]}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === j || index === j + 1
        }))
      });
      
      // 如果需要交换
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        steps.push({
          description: `交换元素 ${arr[j]} 和 ${arr[j + 1]}`,
          elements: arr.map((value, index) => ({
            id: `element-${index}`,
            value,
            type: 'array-element',
            highlighted: index === j || index === j + 1
          }))
        });
      }
    }
    
    // 标记已排序部分
    steps.push({
      description: `第 ${i + 1} 轮结束，${arr[n - i - 1]} 已在正确位置`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: false,
        visited: index >= n - i - 1
      }))
    });
  }
  
  // 最终排序结果
  steps.push({
    description: '排序完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 选择排序算法
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function generateSelectionSortSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  const n = arr.length;
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 选择排序过程
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // 查找最小元素
    steps.push({
      description: `查找第 ${i + 1} 轮最小元素`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === i,
        visited: index < i
      }))
    });
    
    for (let j = i + 1; j < n; j++) {
      // 比较元素
      steps.push({
        description: `比较元素 ${arr[minIndex]} 和 ${arr[j]}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === minIndex || index === j,
          visited: index < i
        }))
      });
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        
        // 更新最小元素
        steps.push({
          description: `更新最小元素为 ${arr[minIndex]}`,
          elements: arr.map((value, index) => ({
            id: `element-${index}`,
            value,
            type: 'array-element',
            highlighted: index === minIndex,
            visited: index < i
          }))
        });
      }
    }
    
    // 交换元素
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      
      steps.push({
        description: `交换元素 ${arr[i]} 和 ${arr[minIndex]}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === i || index === minIndex,
          visited: index < i
        }))
      });
    }
    
    // 标记已排序部分
    steps.push({
      description: `第 ${i + 1} 轮结束，${arr[i]} 已在正确位置`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: false,
        visited: index <= i
      }))
    });
  }
  
  // 最终排序结果
  steps.push({
    description: '排序完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 插入排序算法
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function generateInsertionSortSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  const n = arr.length;
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: index === 0 // 第一个元素已排序
    }))
  });
  
  // 插入排序过程
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // 当前要插入的元素
    steps.push({
      description: `准备插入元素 ${key}`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === i,
        visited: index < i
      }))
    });
    
    // 查找插入位置并移动元素
    while (j >= 0 && arr[j] > key) {
      // 移动元素
      arr[j + 1] = arr[j];
      
      steps.push({
        description: `移动元素 ${arr[j]} 向右`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === j || index === j + 1,
          visited: index < i && index !== j + 1
        }))
      });
      
      j--;
    }
    
    // 插入元素
    arr[j + 1] = key;
    
    steps.push({
      description: `将元素 ${key} 插入到位置 ${j + 1}`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === j + 1,
        visited: index <= i
      }))
    });
  }
  
  // 最终排序结果
  steps.push({
    description: '排序完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 快速排序算法
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(log n)
 */
export function generateQuickSortSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 快速排序辅助函数
  const quickSort = (low: number, high: number) => {
    if (low < high) {
      // 选择基准元素
      const pivot = arr[high];
      
      steps.push({
        description: `选择基准元素 ${pivot}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === high
        }))
      });
      
      let i = low - 1;
      
      // 分区过程
      for (let j = low; j < high; j++) {
        // 比较元素
        steps.push({
          description: `比较元素 ${arr[j]} 和基准元素 ${pivot}`,
          elements: arr.map((value, index) => ({
            id: `element-${index}`,
            value,
            type: 'array-element',
            highlighted: index === j || index === high
          }))
        });
        
        if (arr[j] <= pivot) {
          i++;
          
          // 交换元素
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          if (i !== j) {
            steps.push({
              description: `交换元素 ${arr[i]} 和 ${arr[j]}`,
              elements: arr.map((value, index) => ({
                id: `element-${index}`,
                value,
                type: 'array-element',
                highlighted: index === i || index === j
              }))
            });
          }
        }
      }
      
      // 将基准元素放到正确位置
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      
      const pivotIndex = i + 1;
      
      steps.push({
        description: `将基准元素 ${pivot} 放到正确位置 ${pivotIndex}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === pivotIndex,
          visited: index === pivotIndex
        }))
      });
      
      // 递归排序左右子数组
      quickSort(low, pivotIndex - 1);
      quickSort(pivotIndex + 1, high);
    }
  };
  
  // 执行快速排序
  quickSort(0, arr.length - 1);
  
  // 最终排序结果
  steps.push({
    description: '排序完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 归并排序算法
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n)
 */
export function generateMergeSortSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 归并排序辅助函数
  const mergeSort = (start: number, end: number) => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      
      // 分割数组
      steps.push({
        description: `分割数组 [${start}...${end}] 为 [${start}...${mid}] 和 [${mid + 1}...${end}]`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index >= start && index <= end
        }))
      });
      
      // 递归排序左右子数组
      mergeSort(start, mid);
      mergeSort(mid + 1, end);
      
      // 合并子数组
      merge(start, mid, end);
    }
  };
  
  // 合并函数
  const merge = (start: number, mid: number, end: number) => {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    
    // 创建临时数组
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);
    
    steps.push({
      description: `准备合并子数组 [${start}...${mid}] 和 [${mid + 1}...${end}]`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index >= start && index <= end
      }))
    });
    
    let i = 0, j = 0, k = start;
    
    // 合并过程
    while (i < leftSize && j < rightSize) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        description: `将元素 ${arr[k]} 放到位置 ${k}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === k
        }))
      });
      
      k++;
    }
    
    // 处理剩余元素
    while (i < leftSize) {
      arr[k] = leftArr[i];
      
      steps.push({
        description: `将剩余左侧元素 ${arr[k]} 放到位置 ${k}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === k
        }))
      });
      
      i++;
      k++;
    }
    
    while (j < rightSize) {
      arr[k] = rightArr[j];
      
      steps.push({
        description: `将剩余右侧元素 ${arr[k]} 放到位置 ${k}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === k
        }))
      });
      
      j++;
      k++;
    }
    
    // 合并完成
    steps.push({
      description: `子数组 [${start}...${end}] 合并完成`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: false,
        visited: index >= start && index <= end
      }))
    });
  };
  
  // 执行归并排序
  mergeSort(0, arr.length - 1);
  
  // 最终排序结果
  steps.push({
    description: '排序完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}