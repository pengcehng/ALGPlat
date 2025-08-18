import type { AnimationState, AlgorithmState } from './types';

// 链表动画初始化
export const initializeLinkedListAnimation = (
  data: any[],
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    animationState.currentElements = [...data];
    animationState.highlightedIndices = [];
    algorithmState.linkedList.currentNode = null;
  }
};

// 更新链表动画
export const updateLinkedListAnimation = (
  step: number,
  data: any[],
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    // 链表遍历动画
    const nodeIndex = Math.min(step, data.length - 1);
    animationState.highlightedIndices = [nodeIndex];
    algorithmState.linkedList.currentNode = nodeIndex;
    algorithmState.linkedList.prevNode = nodeIndex > 0 ? nodeIndex - 1 : null;
    algorithmState.linkedList.nextNode = nodeIndex < data.length - 1 ? nodeIndex + 1 : null;
  }
};

// 获取链表操作的步骤描述
export const getLinkedListStepDescription = (
  step: number,
  data: any[]
): string => {
  if (!Array.isArray(data)) {
    return `数据不是数组，无法进行链表操作`;
  } else if (step < data.length) {
    return `访问链表节点 ${step+1}，值为 ${data[step]}`;
  } else {
    return '链表遍历完成';
  }
};

// 获取链表算法描述
export const getLinkedListAlgorithmDescription = (): string => {
  return '链表操作：通过指针访问和修改节点，插入/删除操作时间复杂度 O(1)（已知节点位置）';
};