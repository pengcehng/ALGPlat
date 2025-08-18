// 栈数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

/**
 * 栈数据结构操作
 */
export function useStackOperations() {
  // 将数组转换为栈元素（用于动画展示）
  const arrayToStackElements = (data: any[]): AnimationElement[] => {
    return data.map((value, index) => ({
      id: `stack-element-${index}`,
      value,
      type: 'stack-element',
      // 栈底在下，栈顶在上
      position: { x: 0, y: data.length - index - 1 }
    }));
  };

  // 添加元素到栈（入栈）
  const addElement = (data: any[], element: any): AnimationElement[] => {
    // 添加元素到栈顶
    data.push(element);
    
    // 返回更新后的动画元素
    return arrayToStackElements(data).map((stackElement, index) => ({
      ...stackElement,
      highlighted: index === 0 // 栈顶元素高亮
    }));
  };

  // 从栈中删除元素（出栈）
  const deleteElement = (data: any[]): AnimationElement[] => {
    // 从栈顶移除元素
    if (data.length > 0) {
      data.pop();
    }
    
    // 返回更新后的动画元素
    return arrayToStackElements(data).map((stackElement, index) => ({
      ...stackElement,
      highlighted: index === 0 // 新的栈顶元素高亮
    }));
  };

  // 遍历栈
  const traverseOperation = (data: any[]): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return arrayToStackElements(data).map(stackElement => ({
      ...stackElement,
      visited: true
    }));
  };

  // 在栈中搜索元素
  const searchElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引（从栈顶开始）
    const index = data.lastIndexOf(element);
    
    // 返回带有搜索结果的动画元素
    return arrayToStackElements(data).map((stackElement, i) => ({
      ...stackElement,
      highlighted: data.length - i - 1 === index
    }));
  };

  // 获取栈结构的复杂度因子
  const getStructureComplexityFactor = (data: any[], operation: string): number => {
    switch (operation) {
      case 'add': return 1; // O(1) - 入栈
      case 'delete': return 1; // O(1) - 出栈
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