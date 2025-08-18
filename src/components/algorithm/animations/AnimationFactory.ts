import type { AnimationState, AlgorithmState } from './types';

// 导入各种算法动画实现
import * as ArrayAnimation from './ArrayAnimation';
import * as LinkedListAnimation from './LinkedListAnimation';
import * as TreeAnimation from './TreeAnimation';
import * as GraphAnimation from './GraphAnimation';
import * as StackAnimation from './StackAnimation';
import * as QueueAnimation from './QueueAnimation';
import * as HashTableAnimation from './HashTableAnimation';

// 初始化动画
export const initializeAnimation = (
  algorithmType: string,
  data: any,
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  // 根据算法类型初始化动画状态
  switch (algorithmType) {
    case 'array':
      ArrayAnimation.initializeArrayAnimation(data, operationType, animationState, algorithmState);
      break;
    case 'linkedList':
      LinkedListAnimation.initializeLinkedListAnimation(data, animationState, algorithmState);
      break;
    case 'tree':
      TreeAnimation.initializeTreeAnimation(algorithmState);
      break;
    case 'graph':
      GraphAnimation.initializeGraphAnimation(algorithmState);
      break;
    case 'stack':
      StackAnimation.initializeStackAnimation(data, algorithmState);
      break;
    case 'queue':
      QueueAnimation.initializeQueueAnimation(data, algorithmState);
      break;
    case 'hashTable':
      HashTableAnimation.initializeHashTableAnimation(algorithmState);
      break;
  }
};

// 更新动画状态
export const updateAnimation = (
  step: number,
  algorithmType: string,
  data: any,
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  // 根据算法类型和操作类型更新动画
  switch (algorithmType) {
    case 'array':
      ArrayAnimation.updateArrayAnimation(step, data, operationType, animationState, algorithmState);
      break;
    case 'linkedList':
      LinkedListAnimation.updateLinkedListAnimation(step, data, animationState, algorithmState);
      break;
    case 'tree':
      TreeAnimation.updateTreeAnimation(step, data, animationState, algorithmState);
      break;
    case 'graph':
      GraphAnimation.updateGraphAnimation(step, data, animationState, algorithmState);
      break;
    case 'stack':
      StackAnimation.updateStackAnimation(step, data, animationState, algorithmState);
      break;
    case 'queue':
      QueueAnimation.updateQueueAnimation(step, data, animationState, algorithmState);
      break;
    case 'hashTable':
      HashTableAnimation.updateHashTableAnimation(step, data, animationState, algorithmState);
      break;
  }
};

// 获取算法描述
export const getAlgorithmDescription = (
  algorithmType: string,
  operationType: string
): string => {
  // 根据算法类型和操作类型设置描述
  switch (algorithmType) {
    case 'array':
      return ArrayAnimation.getArrayAlgorithmDescription(operationType);
    case 'linkedList':
      return LinkedListAnimation.getLinkedListAlgorithmDescription();
    case 'tree':
      return TreeAnimation.getTreeAlgorithmDescription();
    case 'graph':
      return GraphAnimation.getGraphAlgorithmDescription();
    case 'stack':
      return StackAnimation.getStackAlgorithmDescription();
    case 'queue':
      return QueueAnimation.getQueueAlgorithmDescription();
    case 'hashTable':
      return HashTableAnimation.getHashTableAlgorithmDescription();
    default:
      return '算法可视化';
  }
};

// 获取步骤描述
export const getStepDescription = (
  step: number,
  algorithmType: string,
  data: any,
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
): string => {
  // 根据算法类型、操作类型和当前步骤设置描述
  switch (algorithmType) {
    case 'array':
      return ArrayAnimation.getArrayStepDescription(step, data, operationType, animationState, algorithmState);
    case 'linkedList':
      return LinkedListAnimation.getLinkedListStepDescription(step, data);
    case 'tree':
      return TreeAnimation.getTreeStepDescription(step, data);
    case 'graph':
      return GraphAnimation.getGraphStepDescription(step, data);
    case 'stack':
      return StackAnimation.getStackStepDescription(step, data);
    case 'queue':
      return QueueAnimation.getQueueStepDescription(step, data);
    case 'hashTable':
      return HashTableAnimation.getHashTableStepDescription(step, data);
    default:
      return `步骤 ${step+1}`;
  }
};