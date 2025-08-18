import type { AnimationState, AlgorithmState } from './types';

// 栈动画初始化
export const initializeStackAnimation = (
  data: any[],
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    algorithmState.stack.elements = [];
    algorithmState.stack.topIndex = -1;
  }
};

// 更新栈动画
export const updateStackAnimation = (
  step: number,
  data: any[],
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    // 模拟栈操作（入栈/出栈）
    if (step <= data.length) {
      // 入栈操作
      algorithmState.stack.elements = data.slice(0, step);
      algorithmState.stack.topIndex = step - 1;
      animationState.highlightedIndices = step > 0 ? [step - 1] : [];
    } else {
      // 出栈操作
      const popSteps = step - data.length;
      algorithmState.stack.elements = data.slice(0, data.length - popSteps);
      algorithmState.stack.topIndex = data.length - popSteps - 1;
      animationState.highlightedIndices = algorithmState.stack.topIndex >= 0 ? [algorithmState.stack.topIndex] : [];
    }
  }
};

// 获取栈操作的步骤描述
export const getStackStepDescription = (
  step: number,
  data: any[]
): string => {
  if (!Array.isArray(data)) {
    return '数据不是数组，无法进行栈操作';
  }
  
  if (step <= data.length) {
    if (step === 0) {
      return '初始化空栈';
    } else {
      return `入栈操作：将元素 ${data[step-1]} 压入栈顶`;
    }
  } else {
    const popSteps = step - data.length;
    const poppedIndex = data.length - popSteps;
    if (poppedIndex >= 0 && poppedIndex < data.length) {
      return `出栈操作：从栈顶弹出元素 ${data[poppedIndex]}`;
    } else {
      return '栈已清空';
    }
  }
};

// 获取栈算法描述
export const getStackAlgorithmDescription = (): string => {
  return '栈操作：后进先出(LIFO)数据结构，入栈/出栈操作时间复杂度 O(1)';
};