import { ref, reactive, watch } from 'vue';
import type { AnimationState, AlgorithmState } from '../animations/types';
import * as AnimationFactory from '../animations/AnimationFactory';
// 导入重构后的算法模块
import { calculateStepsForAlgorithm } from './algorithms';

/**
 * 创建算法动画逻辑
 * @param props 组件属性
 * @returns 返回动画状态和方法
 */
export function useAlgorithmAnimation(props: {
  algorithmType: string;
  data: any[] | object;
  step: number;
  totalSteps: number;
  speed: number;
  operationType: string;
}) {
  // 动画状态
  const animationState = reactive<AnimationState>({
    currentElements: [], // 当前显示的元素
    highlightedIndices: [], // 高亮的元素索引
    animationHistory: [], // 动画历史记录
    currentStep: 0, // 当前步骤
  });

  // 算法执行过程中的状态变量
  const algorithmState = reactive<AlgorithmState>({
    // 数组算法状态
    array: {
      currentIndex: -1,
      targetValue: null as number | null,
      sortedIndices: [] as number[],
      pivotIndex: -1,
    },
    // 链表算法状态
    linkedList: {
      currentNode: null as number | null,
      prevNode: null as number | null,
      nextNode: null as number | null,
    },
    // 树算法状态
    tree: {
      currentNode: null as number | null,
      visitedNodes: [] as number[],
      path: [] as number[],
    },
    // 图算法状态
    graph: {
      visitedNodes: [] as number[],
      currentNode: null as number | null,
      queue: [] as number[],
      stack: [] as number[],
    },
    // 栈算法状态
    stack: {
      elements: [] as any[],
      topIndex: -1,
    },
    // 队列算法状态
    queue: {
      elements: [] as any[],
      frontIndex: -1,
      rearIndex: -1,
    },
    // 哈希表算法状态
    hashTable: {
      buckets: [] as any[],
      currentBucket: -1,
      collisions: [] as number[],
    }
  });

  // 算法描述和步骤说明
  const algorithmDescription = ref('');
  const stepDescription = ref('');

  // 监听步骤变化
  watch(() => props.step, (newStep) => {
    updateAnimation(newStep);
  });

  // 监听数据变化
  watch(() => props.data, () => {
    initializeAnimation();
  }, { deep: true });

  // 初始化动画
  const initializeAnimation = () => {
    // 使用动画工厂初始化动画
    AnimationFactory.initializeAnimation(
      props.algorithmType,
      props.data,
      props.operationType,
      animationState,
      algorithmState
    );

    // 设置算法描述
    algorithmDescription.value = AnimationFactory.getAlgorithmDescription(
      props.algorithmType,
      props.operationType
    );
  };

  // 更新动画状态
  const updateAnimation = (step: number) => {
    animationState.currentStep = step;
    
    // 使用动画工厂更新动画
    AnimationFactory.updateAnimation(
      step,
      props.algorithmType,
      props.data,
      props.operationType,
      animationState,
      algorithmState
    );

    // 更新步骤描述
    stepDescription.value = AnimationFactory.getStepDescription(
      step,
      props.algorithmType,
      props.data,
      props.operationType,
      animationState,
      algorithmState
    );
  };

  return {
    animationState,
    algorithmState,
    algorithmDescription,
    stepDescription,
    initializeAnimation,
    updateAnimation
  };
}