// 搜索算法实现
import type { AnimationStep, AnimationElement } from './types';

/**
 * 线性搜索算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function generateLinearSearchSteps(data: number[], target: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 初始状态
  steps.push({
    description: `初始数组，搜索目标值: ${target}`,
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 线性搜索过程
  for (let i = 0; i < arr.length; i++) {
    // 当前检查的元素
    steps.push({
      description: `检查索引 ${i} 处的元素 ${arr[i]}`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === i,
        visited: index < i
      }))
    });
    
    // 找到目标元素
    if (arr[i] === target) {
      steps.push({
        description: `在索引 ${i} 处找到目标值 ${target}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === i,
          visited: index <= i
        }))
      });
      
      return steps;
    }
  }
  
  // 未找到目标元素
  steps.push({
    description: `未找到目标值 ${target}`,
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
 * 二分搜索算法
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 * 注意：二分搜索要求数组已排序
 */
export function generateBinarySearchSteps(data: number[], target: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 确保数组已排序
  arr.sort((a, b) => a - b);
  
  // 初始状态
  steps.push({
    description: `初始已排序数组，搜索目标值: ${target}`,
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  let left = 0;
  let right = arr.length - 1;
  
  // 二分搜索过程
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // 当前检查的中间元素
    steps.push({
      description: `检查中间索引 ${mid} 处的元素 ${arr[mid]}`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === mid,
        visited: (index < left || index > right) && !((index === left || index === right) && left === right)
      }))
    });
    
    // 找到目标元素
    if (arr[mid] === target) {
      steps.push({
        description: `在索引 ${mid} 处找到目标值 ${target}`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === mid,
          visited: true
        }))
      });
      
      return steps;
    }
    
    // 目标在左半部分
    if (arr[mid] > target) {
      right = mid - 1;
      
      steps.push({
        description: `目标值小于中间元素，在左半部分 [${left}...${right}] 继续搜索`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index >= left && index <= right,
          visited: index > right || index < left
        }))
      });
    } 
    // 目标在右半部分
    else {
      left = mid + 1;
      
      steps.push({
        description: `目标值大于中间元素，在右半部分 [${left}...${right}] 继续搜索`,
        elements: arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index >= left && index <= right,
          visited: index > right || index < left
        }))
      });
    }
  }
  
  // 未找到目标元素
  steps.push({
    description: `未找到目标值 ${target}`,
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
 * 哈希搜索算法
 * 时间复杂度: O(1) 平均情况
 * 空间复杂度: O(n)
 */
export function generateHashSearchSteps(data: number[], target: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 初始状态
  steps.push({
    description: `初始数组，搜索目标值: ${target}`,
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 创建哈希表
  const hashMap = new Map<number, number>();
  
  steps.push({
    description: '创建哈希表',
    elements: [
      {
        id: 'hash-table',
        value: 'Hash Table',
        type: 'hash-table'
      },
      ...arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element'
      }))
    ]
  });
  
  // 填充哈希表
  for (let i = 0; i < arr.length; i++) {
    hashMap.set(arr[i], i);
    
    steps.push({
      description: `将元素 ${arr[i]} 添加到哈希表，键为值 ${arr[i]}，值为索引 ${i}`,
      elements: [
        {
          id: 'hash-table',
          value: `Hash Table (${i + 1}/${arr.length})`,
          type: 'hash-table',
          highlighted: true
        },
        ...arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          highlighted: index === i,
          visited: index < i
        }))
      ]
    });
  }
  
  // 在哈希表中搜索
  steps.push({
    description: `在哈希表中搜索目标值 ${target}`,
    elements: [
      {
        id: 'hash-table',
        value: 'Hash Table (搜索中)',
        type: 'hash-table',
        highlighted: true
      },
      ...arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        visited: true
      }))
    ]
  });
  
  // 搜索结果
  if (hashMap.has(target)) {
    const index = hashMap.get(target)!;
    
    steps.push({
      description: `在哈希表中找到目标值 ${target}，对应原数组索引 ${index}`,
      elements: [
        {
          id: 'hash-table',
          value: 'Hash Table (搜索完成)',
          type: 'hash-table'
        },
        ...arr.map((value, idx) => ({
          id: `element-${idx}`,
          value,
          type: 'array-element',
          highlighted: idx === index,
          visited: true
        }))
      ]
    });
  } else {
    steps.push({
      description: `在哈希表中未找到目标值 ${target}`,
      elements: [
        {
          id: 'hash-table',
          value: 'Hash Table (搜索完成)',
          type: 'hash-table'
        },
        ...arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          type: 'array-element',
          visited: true
        }))
      ]
    });
  }
  
  return steps;
}