// 动画状态接口定义
import type { AnimationElement } from '../scripts/algorithms/types';

export type { AnimationElement };

export interface AnimationState {
  currentElements: any[];
  highlightedIndices: number[];
  animationHistory: any[];
  currentStep: number;
}

// 算法状态接口
export interface AlgorithmState {
  array: {
    currentIndex: number;
    targetValue: number | null;
    sortedIndices: number[];
    pivotIndex: number;
  };
  linkedList: {
    currentNode: number | null;
    prevNode: number | null;
    nextNode: number | null;
  };
  tree: {
    currentNode: number | null;
    visitedNodes: number[];
    path: number[];
  };
  graph: {
    visitedNodes: number[];
    currentNode: number | null;
    queue: number[];
    stack: number[];
  };
  stack: {
    elements: any[];
    topIndex: number;
  };
  queue: {
    elements: any[];
    frontIndex: number;
    rearIndex: number;
  };
  hashTable: {
    buckets: any[];
    currentBucket: number;
    collisions: number[];
  };
}