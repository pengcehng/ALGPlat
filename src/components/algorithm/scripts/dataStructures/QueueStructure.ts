// 队列数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

/**
 * 队列数据结构操作
 */
export function useQueueOperations() {
  // 将数组转换为队列元素（用于动画展示）
  const arrayToQueueElements = (data: any[]): AnimationElement[] => {
    return data.map((value, index) => ({
      id: `queue-element-${index}`,
      value,
      type: 'queue-element',
      // 队首在左，队尾在右
      position: { x: index, y: 0 }
    }));
  };

  // 添加元素到队列（入队）
  const addElement = (data: any[], element: any): AnimationElement[] => {
    // 添加元素到队尾
    data.push(element);
    
    // 返回更新后的动画元素
    return arrayToQueueElements(data).map((queueElement, index) => ({
      ...queueElement,
      highlighted: index === data.length - 1 // 队尾元素高亮
    }));
  };

  // 从队列中删除元素（出队）
  const deleteElement = (data: any[]): AnimationElement[] => {
    // 从队首移除元素
    if (data.length > 0) {
      data.shift();
    }
    
    // 返回更新后的动画元素
    return arrayToQueueElements(data).map((queueElement, index) => ({
      ...queueElement,
      highlighted: index === 0 // 新的队首元素高亮
    }));
  };

  // 遍历队列
  const traverseOperation = (data: any[]): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return arrayToQueueElements(data).map(queueElement => ({
      ...queueElement,
      visited: true
    }));
  };

  // 在队列中搜索元素
  const searchElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    
    // 返回带有搜索结果的动画元素
    return arrayToQueueElements(data).map((queueElement, i) => ({
      ...queueElement,
      highlighted: i === index
    }));
  };

  // 获取队列结构的复杂度因子
  const getStructureComplexityFactor = (data: any[], operation: string): number => {
    switch (operation) {
      case 'add': return 1; // O(1) - 入队
      case 'delete': return 1; // O(1) - 出队
      case 'traverse': return data.length; // O(n) - 遍历所有元素
      case 'search': return data.length; // O(n) - 线性搜索
      default: return 1;
    }
  };

  return {
    addElement,
    deleteElement,
    traverseOperation,
    searchElement,
    getStructureComplexityFactor
  };
}