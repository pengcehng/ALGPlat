import type { AnimationState, AlgorithmState } from './types';

// 队列动画初始化
export const initializeQueueAnimation = (
  data: any[],
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    algorithmState.queue.elements = [];
    algorithmState.queue.frontIndex = -1;
    algorithmState.queue.rearIndex = -1;
  }
};

// 更新队列动画
export const updateQueueAnimation = (
  step: number,
  data: any[],
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    // 模拟队列操作（入队/出队）
    if (step <= data.length) {
      // 入队操作
      algorithmState.queue.elements = data.slice(0, step);
      algorithmState.queue.frontIndex = step > 0 ? 0 : -1;
      algorithmState.queue.rearIndex = step - 1;
      animationState.highlightedIndices = step > 0 ? [step - 1] : [];
    } else {
      // 出队操作
      const dequeueSteps = step - data.length;
      algorithmState.queue.elements = data.slice(dequeueSteps, data.length);
      algorithmState.queue.frontIndex = 0;
      algorithmState.queue.rearIndex = data.length - dequeueSteps - 1;
      animationState.highlightedIndices = [0];
    }
  }
};

// 获取队列操作的步骤描述
export const getQueueStepDescription = (
  step: number,
  data: any[]
): string => {
  if (!Array.isArray(data)) {
    return '数据不是数组，无法进行队列操作';
  }
  
  if (step <= data.length) {
    if (step === 0) {
      return '初始化空队列';
    } else {
      return `入队操作：将元素 ${data[step-1]} 加入队尾`;
    }
  } else {
    const dequeueSteps = step - data.length;
    if (dequeueSteps < data.length) {
      return `出队操作：从队首移除元素 ${data[dequeueSteps-1]}`;
    } else {
      return '队列已清空';
    }
  }
};

// 获取队列算法描述
export const getQueueAlgorithmDescription = (): string => {
  return '队列操作：先进先出(FIFO)数据结构，入队/出队操作时间复杂度 O(1)';
};