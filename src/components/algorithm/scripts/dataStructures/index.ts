// 数据结构索引文件
// 导出所有数据结构类型和操作

// 导出类型定义
export * from './types';

// 导入各数据结构操作
import { useArrayOperations } from './ArrayStructure';
import { useLinkedListOperations } from './LinkedListStructure';
import { useStackOperations } from './StackStructure';
import { useQueueOperations } from './QueueStructure';
import { useTreeOperations } from './TreeStructure';
import { useGraphOperations } from './GraphStructure';
import { useHashTableOperations } from './HashTableStructure';

// 导出各数据结构操作
export { useArrayOperations };
export { useLinkedListOperations };
export { useStackOperations };
export { useQueueOperations };
export { useTreeOperations };
export { useGraphOperations };
export { useHashTableOperations };

/**
 * 数据结构操作工厂函数
 * 根据数据结构类型返回对应的操作函数
 */
export function getDataStructureOperations(structureType: string) {
  switch (structureType) {
    case 'array':
      return useArrayOperations();
    case 'linkedList':
      return useLinkedListOperations();
    case 'stack':
      return useStackOperations();
    case 'queue':
      return useQueueOperations();
    case 'tree':
      return useTreeOperations();
    case 'graph':
      return useGraphOperations();
    case 'hashTable':
      return useHashTableOperations();
    default:
      return useArrayOperations(); // 默认使用数组操作
  }
}