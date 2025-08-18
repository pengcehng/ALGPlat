// 链表数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

// 链表节点接口
interface ListNode {
  value: any;
  next: ListNode | null;
}

/**
 * 链表数据结构操作
 */
export function useLinkedListOperations() {
  // 将数组转换为链表节点数组（用于动画展示）
  const arrayToLinkedListElements = (data: any[]): AnimationElement[] => {
    return data.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      connections: index < data.length - 1 ? [`node-${index + 1}`] : []
    }));
  };

  // 添加元素到链表
  const addElement = (data: any[], element: any): AnimationElement[] => {
    // 添加元素到链表末尾
    data.push(element);
    
    // 返回更新后的动画元素
    return arrayToLinkedListElements(data).map((node, index) => ({
      ...node,
      highlighted: index === data.length - 1
    }));
  };

  // 从链表中删除元素
  const deleteElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    if (index !== -1) {
      // 删除元素
      data.splice(index, 1);
    }
    
    // 返回更新后的动画元素
    return arrayToLinkedListElements(data);
  };

  // 遍历链表
  const traverseOperation = (data: any[]): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return arrayToLinkedListElements(data).map(node => ({
      ...node,
      visited: true
    }));
  };

  // 在链表中搜索元素
  const searchElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    
    // 返回带有搜索结果的动画元素
    return arrayToLinkedListElements(data).map((node, i) => ({
      ...node,
      highlighted: i === index
    }));
  };

  // 获取链表结构的复杂度因子
  const getStructureComplexityFactor = (data: any[], operation: string): number => {
    switch (operation) {
      case 'add': return 1; // O(1) - 如果有尾指针
      case 'delete': return data.length; // O(n) - 需要找到前一个节点
      case 'traverse': return data.length; // O(n) - 遍历所有节点
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