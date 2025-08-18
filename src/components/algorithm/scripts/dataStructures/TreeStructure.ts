// 树数据结构操作
import type { AnimationElement } from '../algorithms/types';

// 树节点接口
export interface TreeNode {
  value: any;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * 树数据结构操作
 */
export function useTreeOperations() {
  // 将数组转换为树元素（用于动画展示）
  // 假设输入是层序遍历的数组表示
  const arrayToTreeElements = (data: any[]): AnimationElement[] => {
    const elements: AnimationElement[] = [];
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) continue;
      
      const element: AnimationElement = {
        id: `tree-node-${i}`,
        value: data[i],
        type: 'tree-node',
        connections: []
      };
      
      // 添加左子节点连接
      const leftChildIndex = 2 * i + 1;
      if (leftChildIndex < data.length && data[leftChildIndex] !== null) {
        element.connections!.push(`tree-node-${leftChildIndex}`);
      }
      
      // 添加右子节点连接
      const rightChildIndex = 2 * i + 2;
      if (rightChildIndex < data.length && data[rightChildIndex] !== null) {
        element.connections!.push(`tree-node-${rightChildIndex}`);
      }
      
      elements.push(element);
    }
    
    return elements;
  };

  // 添加元素到树
  const addElement = (data: any[], element: any): AnimationElement[] => {
    // 找到第一个空位置添加元素
    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) {
        data[i] = element;
        break;
      }
    }
    
    // 如果没有空位置，则添加到末尾
    if (!data.includes(element)) {
      data.push(element);
    }
    
    // 返回更新后的动画元素
    const elements = arrayToTreeElements(data);
    const addedIndex = data.indexOf(element);
    
    return elements.map(node => ({
      ...node,
      highlighted: node.id === `tree-node-${addedIndex}`
    }));
  };

  // 从树中删除元素
  const deleteElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    if (index !== -1) {
      // 将节点标记为null（删除）
      data[index] = null;
      
      // 如果删除的是非叶子节点，需要重新组织树结构
      // 这里简化处理，实际应用中可能需要更复杂的逻辑
    }
    
    // 返回更新后的动画元素
    return arrayToTreeElements(data);
  };

  // 遍历树（层序遍历）
  const traverseOperation = (data: any[]): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return arrayToTreeElements(data).map(node => ({
      ...node,
      visited: true
    }));
  };

  // 在树中搜索元素
  const searchElement = (data: any[], element: any): AnimationElement[] => {
    // 查找元素索引
    const index = data.indexOf(element);
    
    // 返回带有搜索结果的动画元素
    return arrayToTreeElements(data).map((node) => ({
      ...node,
      highlighted: node.id === `tree-node-${index}`
    }));
  };

  // 获取树结构的复杂度因子
  const getStructureComplexityFactor = (data: any[], operation: string): number => {
    const height = Math.floor(Math.log2(data.length + 1));
    
    switch (operation) {
      case 'add': return height; // O(log n) - 平衡树的插入
      case 'delete': return height; // O(log n) - 平衡树的删除
      case 'traverse': return data.length; // O(n) - 遍历所有节点
      case 'search': return height; // O(log n) - 平衡树的搜索
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