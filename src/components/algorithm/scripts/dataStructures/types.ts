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

// 数据结构分类接口
export interface DataStructureCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  structures: DataStructure[];
}

// 线性结构数据结构
const linearStructures: DataStructure[] = [
  { id: 'array', name: '数组', icon: '📊', description: '连续存储的相同类型元素集合，支持随机访问O(1)，插入/删除需移动元素O(n)' },
  { id: 'linkedList', name: '链表', icon: '🔗', description: '非连续存储，通过指针连接节点，插入/删除高效O(1)，访问需遍历O(n)' },
  { id: 'stack', name: '栈', icon: '📚', description: '遵循"后进先出(LIFO)"原则，仅允许在栈顶操作，用于表达式求值、递归调用' },
  { id: 'queue', name: '队列', icon: '🚶‍♂️', description: '遵循"先进先出(FIFO)"原则，队尾插入、队头删除，用于任务调度、缓冲处理' },
  { id: 'string', name: '字符串', icon: '📝', description: '字符的线性序列，特殊数组，支持拼接、截取、匹配等操作' }
];

// 非线性结构数据结构
const nonLinearStructures: DataStructure[] = [
  { id: 'tree', name: '树', icon: '🌳', description: '由根节点和子节点组成的层次结构，根节点无父节点，子节点有唯一父节点' },
  { id: 'graph', name: '图', icon: '🕸️', description: '由顶点和边组成的网状结构，边可带权重，顶点间关系任意' },
  { id: 'hashTable', name: '哈希表', icon: '🔍', description: '通过哈希函数将键映射到存储地址，实现O(1)平均查找效率' }
];

// 数据结构分类列表
export const dataStructureCategories: DataStructureCategory[] = [
  {
    id: 'linear',
    name: '线性结构',
    icon: '📏',
    description: '数据元素之间存在一对一的线性关系',
    structures: linearStructures
  },
  {
    id: 'nonlinear',
    name: '非线性结构',
    icon: '🌐',
    description: '数据元素之间存在一对多或多对多的关系',
    structures: nonLinearStructures
  }
];

// 所有数据结构的扁平列表（保持向后兼容）
export const dataStructures: DataStructure[] = [
  ...linearStructures,
  ...nonLinearStructures
];

// 基本操作列表
export const operations: DataStructureOperation[] = [
  { id: 'add', name: '添加', icon: '➕', description: '向数据结构中添加元素' },
  { id: 'delete', name: '删除', icon: '➖', description: '从数据结构中删除元素' },
  { id: 'traverse', name: '遍历', icon: '🔄', description: '遍历数据结构中的所有元素' },
  { id: 'search', name: '查找', icon: '🔍', description: '在数据结构中查找特定元素' }
];