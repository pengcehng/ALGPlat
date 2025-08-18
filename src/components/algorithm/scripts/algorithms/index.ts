// 算法模块索引文件
import type { Algorithm, AlgorithmCategory, AnimationStep } from './types';
import { generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps, generateQuickSortSteps, generateMergeSortSteps } from './SortAlgorithms';
import { generateLinearSearchSteps, generateBinarySearchSteps, generateHashSearchSteps } from './SearchAlgorithms';
import { generateArrayTraversalSteps, generateLinkedListTraversalSteps, generateTreePreOrderTraversalSteps, generateTreeInOrderTraversalSteps, generateTreePostOrderTraversalSteps, generateGraphBFSTraversalSteps, generateGraphDFSTraversalSteps } from './TraversalAlgorithms';
import { generateLinkedListInsertSteps, generateLinkedListDeleteSteps, generateLinkedListReverseSteps, generateStackPushSteps, generateStackPopSteps, generateQueueEnqueueSteps, generateQueueDequeueSteps, generateTreeInsertSteps, generateHashTableInsertSteps } from './BasicOperations';

// 导出所有算法类型和函数
export * from './types';
export * from './SortAlgorithms';
export * from './SearchAlgorithms';
export * from './TraversalAlgorithms';
export * from './BasicOperations';

/**
 * 根据算法ID和数据结构类型生成动画步骤
 */
export function calculateStepsForAlgorithm(algorithmId: string, structureType: string, data: any): AnimationStep[] {
  // 根据算法ID和数据结构类型选择合适的算法实现
  switch (algorithmId) {
    // 排序算法
    case 'bubbleSort':
      return generateBubbleSortSteps(data);
    case 'selectionSort':
      return generateSelectionSortSteps(data);
    case 'insertionSort':
      return generateInsertionSortSteps(data);
    case 'quickSort':
      return generateQuickSortSteps(data);
    case 'mergeSort':
      return generateMergeSortSteps(data);
      
    // 搜索算法
    case 'linearSearch':
      return generateLinearSearchSteps(data, data[0]); // 假设搜索第一个元素
    case 'binarySearch':
      return generateBinarySearchSteps(data, data[0]); // 假设搜索第一个元素
    case 'hashSearch':
      return generateHashSearchSteps(data, data[0]); // 假设搜索第一个元素
      
    // 遍历算法
    case 'arrayTraversal':
      return generateArrayTraversalSteps(data);
    case 'traverseLinkedList':
      return generateLinkedListTraversalSteps(data);
    case 'treePreOrder':
      return generateTreePreOrderTraversalSteps(data);
    case 'treeInOrder':
      return generateTreeInOrderTraversalSteps(data);
    case 'treePostOrder':
      return generateTreePostOrderTraversalSteps(data);
    case 'graphBFS':
      return generateGraphBFSTraversalSteps(data);
    case 'graphDFS':
      return generateGraphDFSTraversalSteps(data);
      
    // 基本操作
    case 'insertNode':
      return generateLinkedListInsertSteps(data, 99, 1); // 假设在位置1插入值99
    case 'deleteNode':
      return generateLinkedListDeleteSteps(data, 1); // 假设删除位置1的元素
    case 'reverseLinkedList':
      return generateLinkedListReverseSteps(data);
    case 'stackPush':
      return generateStackPushSteps(data, 99); // 假设入栈值99
    case 'stackPop':
      return generateStackPopSteps(data);
    case 'queueEnqueue':
      return generateQueueEnqueueSteps(data, 99); // 假设入队值99
    case 'queueDequeue':
      return generateQueueDequeueSteps(data);
    case 'treeInsert':
      return generateTreeInsertSteps(data, 99); // 假设插入值99
    case 'hashTableInsert':
      return generateHashTableInsertSteps({}, 'key', 99); // 假设插入键值对
      
    default:
      console.error(`未找到算法: ${algorithmId}`);
      return [];
  }
}

/**
 * 获取算法的复杂度因子
 */
export function getAlgorithmComplexityFactor(algorithmId: string): { time: string; space: string } {
  // 根据算法ID返回时间和空间复杂度
  switch (algorithmId) {
    // 排序算法
    case 'bubble-sort':
      return { time: 'O(n²)', space: 'O(1)' };
    case 'selection-sort':
      return { time: 'O(n²)', space: 'O(1)' };
    case 'insertion-sort':
      return { time: 'O(n²)', space: 'O(1)' };
    case 'quick-sort':
      return { time: 'O(n log n)', space: 'O(log n)' };
    case 'merge-sort':
      return { time: 'O(n log n)', space: 'O(n)' };
      
    // 搜索算法
    case 'linear-search':
      return { time: 'O(n)', space: 'O(1)' };
    case 'binary-search':
      return { time: 'O(log n)', space: 'O(1)' };
    case 'hash-search':
      return { time: 'O(1)', space: 'O(n)' };
      
    // 遍历算法
    case 'array-traversal':
      return { time: 'O(n)', space: 'O(1)' };
    case 'linked-list-traversal':
      return { time: 'O(n)', space: 'O(1)' };
    case 'tree-preorder':
    case 'tree-inorder':
    case 'tree-postorder':
      return { time: 'O(n)', space: 'O(h)' }; // h为树的高度
    case 'graph-bfs':
    case 'graph-dfs':
      return { time: 'O(V + E)', space: 'O(V)' }; // V为顶点数，E为边数
      
    // 基本操作
    case 'linked-list-insert':
    case 'linked-list-delete':
      return { time: 'O(n)', space: 'O(1)' };
    case 'linked-list-reverse':
      return { time: 'O(n)', space: 'O(1)' };
    case 'stack-push':
    case 'stack-pop':
      return { time: 'O(1)', space: 'O(1)' };
    case 'queue-enqueue':
      return { time: 'O(1)', space: 'O(1)' };
    case 'queue-dequeue':
      return { time: 'O(n)', space: 'O(1)' };
    case 'tree-insert':
      return { time: 'O(log n)', space: 'O(h)' }; // h为树的高度
    case 'hash-table-insert':
      return { time: 'O(1)', space: 'O(1)' };
      
    default:
      return { time: '未知', space: '未知' };
  }
}