import type { AnimationState, AlgorithmState } from './types';

// 数组动画初始化
export const initializeArrayAnimation = (
  data: any[],
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    animationState.currentElements = [...data];
    animationState.highlightedIndices = [];
    
    // 根据操作类型设置初始状态
    switch (operationType) {
      case 'traverse':
        algorithmState.array.currentIndex = -1;
        break;
      case 'search':
        algorithmState.array.currentIndex = -1;
        algorithmState.array.targetValue = (Array.isArray(data) && data.length > 0) ? data[Math.floor(data.length / 2)] : null;
        break;
      case 'sort':
        algorithmState.array.sortedIndices = [];
        break;
      case 'insert':
      case 'delete':
        // 初始化插入/删除操作的状态
        break;
    }
  }
};

// 更新数组动画
export const updateArrayAnimation = (
  step: number,
  data: any[],
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
) => {
  if (Array.isArray(data)) {
    // 根据操作类型更新动画状态
    switch (operationType) {
      case 'traverse':
        // 遍历动画：逐个高亮元素
        const traverseIndex = Math.min(step, data.length - 1);
        algorithmState.array.currentIndex = traverseIndex;
        animationState.highlightedIndices = [traverseIndex];
        break;
      
      case 'search':
        // 二分查找动画
        if (step === 0) {
          // 初始化二分查找
          algorithmState.array.currentIndex = Math.floor(data.length / 2);
          animationState.highlightedIndices = [algorithmState.array.currentIndex];
        } else {
          // 模拟二分查找过程
          const mid = algorithmState.array.currentIndex;
          const target = algorithmState.array.targetValue;
          
          // 检查 target 是否为 null
          if (target === null) {
            // 如果目标值为 null，只高亮当前索引
            animationState.highlightedIndices = [mid];
          } else if (Array.isArray(data) && data[mid] === target) {
            // 找到目标值
            animationState.highlightedIndices = [mid];
          } else if (Array.isArray(data) && data[mid] > target) {
            // 目标在左半部分
            const newMid = Math.floor(mid / 2);
            algorithmState.array.currentIndex = newMid;
            animationState.highlightedIndices = [newMid];
          } else if (Array.isArray(data)) {
            // 目标在右半部分
            const newMid = Math.floor((mid + data.length) / 2);
            algorithmState.array.currentIndex = newMid;
            animationState.highlightedIndices = [newMid];
          }
        }
        break;
      
      case 'sort':
        // 排序动画（以冒泡排序为例）
        if (!Array.isArray(data)) {
          break;
        }
        if (step < data.length * data.length) {
          const i = Math.floor(step / data.length);
          const j = step % data.length;
          
          if (j < data.length - i - 1) {
            animationState.highlightedIndices = [j, j + 1];
            // 模拟比较和交换
            if (data[j] > data[j + 1]) {
              // 在实际应用中，这里会交换元素
              // 这里只是模拟高亮显示
            }
          } else {
            // 当前轮次结束，标记已排序的元素
            algorithmState.array.sortedIndices.push(data.length - i - 1);
          }
        }
        break;
      
      case 'insert':
        // 插入动画
        if (!Array.isArray(data)) {
          break;
        }
        if (step === 0) {
          // 初始状态，显示原数组
        } else if (step === 1) {
          // 找到插入位置
          const insertPos = Math.floor(data.length / 2);
          animationState.highlightedIndices = [insertPos];
        } else {
          // 执行插入，移动元素
          const insertPos = Math.floor(data.length / 2);
          animationState.highlightedIndices = [insertPos];
          // 在实际应用中，这里会插入新元素并移动后续元素
        }
        break;
      
      case 'delete':
        // 删除动画
        if (!Array.isArray(data)) {
          break;
        }
        if (step === 0) {
          // 初始状态，显示原数组
        } else if (step === 1) {
          // 找到删除位置
          const deletePos = Math.floor(data.length / 2);
          animationState.highlightedIndices = [deletePos];
        } else {
          // 执行删除，移动元素
          const deletePos = Math.floor(data.length / 2);
          // 在实际应用中，这里会删除元素并移动后续元素
        }
        break;
    }
  }
};

// 获取数组操作的步骤描述
export const getArrayStepDescription = (
  step: number,
  data: any[],
  operationType: string,
  animationState: AnimationState,
  algorithmState: AlgorithmState
): string => {
  let description = '';
  
  switch (operationType) {
    case 'traverse':
      if (Array.isArray(data) && step < data.length) {
        description = `正在访问索引 ${step} 的元素: ${data[step]}`;
      } else {
        description = '遍历完成';
      }
      break;
    case 'search':
      if (step === 0) {
        description = '初始化二分查找，选择中间元素';
      } else if (animationState.highlightedIndices.length > 0) {
        const mid = animationState.highlightedIndices[0];
        const target = algorithmState.array.targetValue;
        
        // 检查 target 是否为 null
        if (!Array.isArray(data)) {
          description = `数据不是数组，无法进行二分查找`;
        } else if (target === null) {
          description = `当前检查索引 ${mid} 的元素: ${data[mid]}`;
        } else if (data[mid] === target) {
          description = `找到目标值 ${target} 在索引 ${mid}`;
        } else if (data[mid] > target) {
          description = `中间元素 ${data[mid]} > 目标值 ${target}，在左半部分继续查找`;
        } else {
          description = `中间元素 ${data[mid]} < 目标值 ${target}，在右半部分继续查找`;
        }
      }
      break;
    case 'sort':
      if (!Array.isArray(data)) {
        description = `数据不是数组，无法进行排序`;
        break;
      }
      if (step < data.length * data.length) {
        const i = Math.floor(step / data.length);
        const j = step % data.length;
        if (j < data.length - i - 1) {
          description = `比较索引 ${j} 和 ${j+1} 的元素: ${data[j]} 和 ${data[j+1]}`;
          if (data[j] > data[j+1]) {
            description += '，需要交换';
          } else {
            description += '，不需要交换';
          }
        } else {
          description = `第 ${i+1} 轮比较完成，最大元素已移至末尾`;
        }
      } else {
        description = '排序完成';
      }
      break;
    case 'insert':
      if (step === 0) {
        description = '准备插入新元素';
      } else if (step === 1) {
        description = '找到插入位置';
      } else {
        description = '移动元素并完成插入';
      }
      break;
    case 'delete':
      if (step === 0) {
        description = '准备删除元素';
      } else if (step === 1) {
        description = '找到删除位置';
      } else {
        description = '移动元素并完成删除';
      }
      break;
  }
  
  return description;
};

// 获取数组算法描述
export const getArrayAlgorithmDescription = (operationType: string): string => {
  switch (operationType) {
    case 'traverse':
      return '数组遍历：按顺序访问每个元素，时间复杂度 O(n)';
    case 'search':
      return '二分查找：在有序数组中查找目标值，时间复杂度 O(log n)';
    case 'sort':
      return '冒泡排序：通过相邻元素比较和交换进行排序，时间复杂度 O(n²)';
    case 'insert':
      return '数组插入：在指定位置插入元素，后续元素后移，时间复杂度 O(n)';
    case 'delete':
      return '数组删除：删除指定位置元素，后续元素前移，时间复杂度 O(n)';
    default:
      return '数组操作';
  }
};