// 数据结构类型定义
import type { AnimationElement } from '../algorithms/types';

// 数据结构接口
export interface DataStructure {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 数据结构操作接口
export interface DataStructureOperation {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 数据结构列表
export const dataStructures: DataStructure[] = [
  { id: 'array', name: '数组', icon: '📊', description: '基本的线性数据结构' },
  { id: 'linkedList', name: '链表', icon: '🔗', description: '节点通过指针连接的线性结构' },
  { id: 'stack', name: '栈', icon: '📚', description: '后进先出(LIFO)的数据结构' },
  { id: 'queue', name: '队列', icon: '🚶‍♂️', description: '先进先出(FIFO)的数据结构' },
  { id: 'tree', name: '树', icon: '🌳', description: '层次结构的非线性数据结构' },
  { id: 'graph', name: '图', icon: '🕸️', description: '由节点和边组成的非线性结构' },
  { id: 'hashTable', name: '哈希表', icon: '🔍', description: '通过键值对实现的高效查找结构' }
];

// 基本操作列表
export const operations: DataStructureOperation[] = [
  { id: 'add', name: '添加', icon: '➕', description: '向数据结构中添加元素' },
  { id: 'delete', name: '删除', icon: '➖', description: '从数据结构中删除元素' },
  { id: 'traverse', name: '遍历', icon: '🔄', description: '遍历数据结构中的所有元素' },
  { id: 'search', name: '查找', icon: '🔍', description: '在数据结构中查找特定元素' }
];