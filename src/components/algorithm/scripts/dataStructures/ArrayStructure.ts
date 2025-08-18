// 数组数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

/**
 * 数组数据结构操作
 */
export function useArrayOperations() {
  // 添加元素到数组
  const addElement = (data: any[], element: any): AnimationElement[] => {
    // 添加元素到数组末尾
    data.push(element);
    
    // 返回更新后的动画元素
    return data.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      highlighted: index === data.length - 1
    }));
  };

  // 从数组中删除元素
  const deleteElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    if (index !== -1) {
      // 删除元素
      data.splice(index, 1);
    }
    
    // 返回更新后的动画元素
    return data.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      highlighted: false
    }));
  };

  // 遍历数组
  const traverseOperation = (data: any[]): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return data.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }));
  };

  // 在数组中搜索元素
  const searchElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    
    // 返回带有搜索结果的动画元素
    return data.map((value, i) => ({
      id: `element-${i}`,
      value,
      type: 'array-element',
      highlighted: i === index
    }));
  };

  // 获取数组结构的复杂度因子
  const getStructureComplexityFactor = (data: any[], operation: string): number => {
    switch (operation) {
      case 'add': return 1; // O(1) - 添加到末尾
      case 'delete': return data.length; // O(n) - 可能需要移动元素
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