// 哈希表数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

/**
 * 哈希表数据结构操作
 */
export function useHashTableOperations() {
  // 将字符串表示转换为哈希表元素（用于动画展示）
  // 假设输入格式为："a:1,b:3,c:5,d:7,e:9"
  const stringToHashTableElements = (data: string): AnimationElement[] => {
    const elements: AnimationElement[] = [];
    const pairs = data.split(',');
    
    pairs.forEach((pair, index) => {
      const [key, value] = pair.split(':');
      elements.push({
        id: `hash-element-${index}`,
        value: { key, value },
        type: 'hash-element',
        position: { x: index, y: 0 }
      });
    });
    
    return elements;
  };

  // 添加元素到哈希表
  const addElement = (data: string, element: string): AnimationElement[] => {
    // 解析新元素
    const [key, value] = element.split(':');
    
    // 检查键是否已存在
    const pairs = data.split(',');
    const existingIndex = pairs.findIndex(pair => pair.startsWith(`${key}:`));
    
    if (existingIndex !== -1) {
      // 更新现有键的值
      pairs[existingIndex] = `${key}:${value}`;
    } else {
      // 添加新键值对
      pairs.push(`${key}:${value}`);
    }
    
    const newData = pairs.join(',');
    
    // 返回更新后的动画元素
    const elements = stringToHashTableElements(newData);
    const addedIndex = pairs.findIndex(pair => pair === `${key}:${value}`);
    
    return elements.map((hashElement, index) => ({
      ...hashElement,
      highlighted: index === addedIndex
    }));
  };

  // 从哈希表中删除元素
  const deleteElement = (data: string, key: string): AnimationElement[] => {
    // 删除指定键的元素
    const pairs = data.split(',');
    const newPairs = pairs.filter(pair => !pair.startsWith(`${key}:`));
    const newData = newPairs.join(',');
    
    // 返回更新后的动画元素
    return stringToHashTableElements(newData);
  };

  // 遍历哈希表
  const traverseOperation = (data: string): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return stringToHashTableElements(data).map(hashElement => ({
      ...hashElement,
      visited: true
    }));
  };

  // 在哈希表中搜索元素
  const searchElement = (data: string, key: string): AnimationElement[] => {
    // 查找元素索引
    const pairs = data.split(',');
    const foundIndex = pairs.findIndex(pair => pair.startsWith(`${key}:`));
    
    // 返回带有搜索结果的动画元素
    return stringToHashTableElements(data).map((hashElement, index) => ({
      ...hashElement,
      highlighted: index === foundIndex
    }));
  };

  // 获取哈希表结构的复杂度因子
  const getStructureComplexityFactor = (data: string, operation: string): number => {
    switch (operation) {
      case 'add': return 1; // O(1) - 理想情况
      case 'delete': return 1; // O(1) - 理想情况
      case 'traverse': return data.split(',').length; // O(n) - 遍历所有元素
      case 'search': return 1; // O(1) - 理想情况
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