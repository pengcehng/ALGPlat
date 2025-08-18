<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';

// 定义动画组件的属性
const props = defineProps({
  // 算法类型：array, linkedList, tree, graph, stack, queue, hashTable
  algorithmType: {
    type: String,
    required: true
  },
  // 算法数据
  data: {
    type: [Array, Object],
    required: true
  },
  // 当前动画步骤
  step: {
    type: Number,
    default: 0
  },
  // 总步骤数
  totalSteps: {
    type: Number,
    default: 0
  },
  // 动画速度
  speed: {
    type: Number,
    default: 1
  },
  // 算法操作类型：traverse, insert, delete, search, sort
  operationType: {
    type: String,
    default: 'traverse'
  }
});

// 动画状态
interface AnimationState {
  currentElements: any[];
  highlightedIndices: number[];
  animationHistory: any[];
  currentStep: number;
}

const animationState = reactive<AnimationState>({
  currentElements: [], // 当前显示的元素
  highlightedIndices: [], // 高亮的元素索引
  animationHistory: [], // 动画历史记录
  currentStep: 0, // 当前步骤
});

// 算法执行过程中的状态变量
const algorithmState = reactive({
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
watch(() => props.data, (newData) => {
  initializeAnimation();
}, { deep: true });

// 初始化动画
const initializeAnimation = () => {
  // 根据算法类型初始化动画状态
  switch (props.algorithmType) {
    case 'array':
      initializeArrayAnimation();
      break;
    case 'linkedList':
      initializeLinkedListAnimation();
      break;
    case 'tree':
      initializeTreeAnimation();
      break;
    case 'graph':
      initializeGraphAnimation();
      break;
    case 'stack':
      initializeStackAnimation();
      break;
    case 'queue':
      initializeQueueAnimation();
      break;
    case 'hashTable':
      initializeHashTableAnimation();
      break;
  }

  // 设置算法描述
  setAlgorithmDescription();
};

// 更新动画状态
const updateAnimation = (step: number) => {
  animationState.currentStep = step;
  
  // 根据算法类型和操作类型更新动画
  switch (props.algorithmType) {
    case 'array':
      updateArrayAnimation(step);
      break;
    case 'linkedList':
      updateLinkedListAnimation(step);
      break;
    case 'tree':
      updateTreeAnimation(step);
      break;
    case 'graph':
      updateGraphAnimation(step);
      break;
    case 'stack':
      updateStackAnimation(step);
      break;
    case 'queue':
      updateQueueAnimation(step);
      break;
    case 'hashTable':
      updateHashTableAnimation(step);
      break;
  }

  // 更新步骤描述
  updateStepDescription(step);
};

// 数组动画初始化
const initializeArrayAnimation = () => {
  if (Array.isArray(props.data)) {
    animationState.currentElements = [...props.data];
    animationState.highlightedIndices = [];
    
    // 根据操作类型设置初始状态
    switch (props.operationType) {
      case 'traverse':
        algorithmState.array.currentIndex = -1;
        break;
      case 'search':
        algorithmState.array.currentIndex = -1;
        algorithmState.array.targetValue = (Array.isArray(props.data) && props.data.length > 0) ? props.data[Math.floor(props.data.length / 2)] : null;
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
const updateArrayAnimation = (step: number) => {
  if (Array.isArray(props.data)) {
    // 根据操作类型更新动画状态
    switch (props.operationType) {
      case 'traverse':
        // 遍历动画：逐个高亮元素
        const traverseIndex = Math.min(step, props.data.length - 1);
        algorithmState.array.currentIndex = traverseIndex;
        animationState.highlightedIndices = [traverseIndex];
        break;
      
      case 'search':
        // 二分查找动画
        if (step === 0) {
          // 初始化二分查找
          algorithmState.array.currentIndex = Math.floor(props.data.length / 2);
          animationState.highlightedIndices = [algorithmState.array.currentIndex];
        } else {
          // 模拟二分查找过程
          const mid = algorithmState.array.currentIndex;
          const target = algorithmState.array.targetValue;
          
          // 检查 target 是否为 null
          if (target === null) {
            // 如果目标值为 null，只高亮当前索引
            animationState.highlightedIndices = [mid];
          } else if (Array.isArray(props.data) && props.data[mid] === target) {
            // 找到目标值
            animationState.highlightedIndices = [mid];
          } else if (Array.isArray(props.data) && props.data[mid] > target) {
            // 目标在左半部分
            const newMid = Math.floor(mid / 2);
            algorithmState.array.currentIndex = newMid;
            animationState.highlightedIndices = [newMid];
          } else if (Array.isArray(props.data)) {
            // 目标在右半部分
            const newMid = Math.floor((mid + props.data.length) / 2);
            algorithmState.array.currentIndex = newMid;
            animationState.highlightedIndices = [newMid];
          }
        }
        break;
      
      case 'sort':
        // 排序动画（以冒泡排序为例）
        if (!Array.isArray(props.data)) {
          break;
        }
        if (step < props.data.length * props.data.length) {
          const i = Math.floor(step / props.data.length);
          const j = step % props.data.length;
          
          if (j < props.data.length - i - 1) {
            animationState.highlightedIndices = [j, j + 1];
            // 模拟比较和交换
            if (props.data[j] > props.data[j + 1]) {
              // 在实际应用中，这里会交换元素
              // 这里只是模拟高亮显示
            }
          } else {
            // 当前轮次结束，标记已排序的元素
            algorithmState.array.sortedIndices.push(props.data.length - i - 1);
          }
        }
        break;
      
      case 'insert':
        // 插入动画
        if (!Array.isArray(props.data)) {
          break;
        }
        if (step === 0) {
          // 初始状态，显示原数组
        } else if (step === 1) {
          // 找到插入位置
          const insertPos = Math.floor(props.data.length / 2);
          animationState.highlightedIndices = [insertPos];
        } else {
          // 执行插入，移动元素
          const insertPos = Math.floor(props.data.length / 2);
          animationState.highlightedIndices = [insertPos];
          // 在实际应用中，这里会插入新元素并移动后续元素
        }
        break;
      
      case 'delete':
        // 删除动画
        if (!Array.isArray(props.data)) {
          break;
        }
        if (step === 0) {
          // 初始状态，显示原数组
        } else if (step === 1) {
          // 找到删除位置
          const deletePos = Math.floor(props.data.length / 2);
          animationState.highlightedIndices = [deletePos];
        } else {
          // 执行删除，移动元素
          const deletePos = Math.floor(props.data.length / 2);
          // 在实际应用中，这里会删除元素并移动后续元素
        }
        break;
    }
  }
};

// 链表动画初始化和更新（类似数组的实现）
const initializeLinkedListAnimation = () => {
  if (Array.isArray(props.data)) {
    animationState.currentElements = [...props.data];
    animationState.highlightedIndices = [];
    algorithmState.linkedList.currentNode = null;
  }
};

const updateLinkedListAnimation = (step: number) => {
  if (Array.isArray(props.data)) {
    // 链表遍历动画
    const nodeIndex = Math.min(step, props.data.length - 1);
    animationState.highlightedIndices = [nodeIndex];
    algorithmState.linkedList.currentNode = nodeIndex;
    algorithmState.linkedList.prevNode = nodeIndex > 0 ? nodeIndex - 1 : null;
    algorithmState.linkedList.nextNode = nodeIndex < props.data.length - 1 ? nodeIndex + 1 : null;
  }
};

// 树动画初始化和更新
const initializeTreeAnimation = () => {
  // 初始化树动画状态
  algorithmState.tree.visitedNodes = [];
  algorithmState.tree.path = [];
};

const updateTreeAnimation = (step: number) => {
  // 更新树动画状态（这里需要根据具体的树结构实现）
};

// 图动画初始化和更新
const initializeGraphAnimation = () => {
  // 初始化图动画状态
  algorithmState.graph.visitedNodes = [];
  algorithmState.graph.queue = [];
  algorithmState.graph.stack = [];
};

const updateGraphAnimation = (step: number) => {
  // 更新图动画状态（这里需要根据具体的图结构实现）
};

// 栈动画初始化和更新
const initializeStackAnimation = () => {
  if (Array.isArray(props.data)) {
    algorithmState.stack.elements = [];
    algorithmState.stack.topIndex = -1;
  }
};

const updateStackAnimation = (step: number) => {
  if (Array.isArray(props.data)) {
    // 模拟栈操作（入栈/出栈）
    if (step <= props.data.length) {
      // 入栈操作
      algorithmState.stack.elements = props.data.slice(0, step);
      algorithmState.stack.topIndex = step - 1;
      animationState.highlightedIndices = step > 0 ? [step - 1] : [];
    } else {
      // 出栈操作
      const popSteps = step - props.data.length;
      algorithmState.stack.elements = props.data.slice(0, props.data.length - popSteps);
      algorithmState.stack.topIndex = props.data.length - popSteps - 1;
      animationState.highlightedIndices = algorithmState.stack.topIndex >= 0 ? [algorithmState.stack.topIndex] : [];
    }
  }
};

// 队列动画初始化和更新
const initializeQueueAnimation = () => {
  if (Array.isArray(props.data)) {
    algorithmState.queue.elements = [];
    algorithmState.queue.frontIndex = -1;
    algorithmState.queue.rearIndex = -1;
  }
};

const updateQueueAnimation = (step: number) => {
  if (Array.isArray(props.data)) {
    // 模拟队列操作（入队/出队）
    if (step <= props.data.length) {
      // 入队操作
      algorithmState.queue.elements = props.data.slice(0, step);
      algorithmState.queue.frontIndex = step > 0 ? 0 : -1;
      algorithmState.queue.rearIndex = step - 1;
      animationState.highlightedIndices = step > 0 ? [step - 1] : [];
    } else {
      // 出队操作
      const dequeueSteps = step - props.data.length;
      algorithmState.queue.elements = props.data.slice(dequeueSteps, props.data.length);
      algorithmState.queue.frontIndex = 0;
      algorithmState.queue.rearIndex = props.data.length - dequeueSteps - 1;
      animationState.highlightedIndices = [0];
    }
  }
};

// 哈希表动画初始化和更新
const initializeHashTableAnimation = () => {
  // 初始化哈希表动画状态
  algorithmState.hashTable.buckets = [];
  algorithmState.hashTable.currentBucket = -1;
  algorithmState.hashTable.collisions = [];
};

const updateHashTableAnimation = (step: number) => {
  // 更新哈希表动画状态（这里需要根据具体的哈希表实现）
};

// 设置算法描述
const setAlgorithmDescription = () => {
  // 根据算法类型和操作类型设置描述
  switch (props.algorithmType) {
    case 'array':
      switch (props.operationType) {
        case 'traverse':
          algorithmDescription.value = '数组遍历：按顺序访问每个元素，时间复杂度 O(n)';
          break;
        case 'search':
          algorithmDescription.value = '二分查找：在有序数组中查找目标值，时间复杂度 O(log n)';
          break;
        case 'sort':
          algorithmDescription.value = '冒泡排序：通过相邻元素比较和交换进行排序，时间复杂度 O(n²)';
          break;
        case 'insert':
          algorithmDescription.value = '数组插入：在指定位置插入元素，后续元素后移，时间复杂度 O(n)';
          break;
        case 'delete':
          algorithmDescription.value = '数组删除：删除指定位置元素，后续元素前移，时间复杂度 O(n)';
          break;
      }
      break;
    case 'linkedList':
      algorithmDescription.value = '链表操作：通过指针访问和修改节点，插入/删除操作时间复杂度 O(1)（已知节点位置）';
      break;
    case 'tree':
      algorithmDescription.value = '树操作：递归或迭代遍历树结构，查找/插入/删除操作时间复杂度 O(h)，h为树高';
      break;
    case 'graph':
      algorithmDescription.value = '图遍历：使用DFS或BFS遍历图结构，时间复杂度 O(V+E)，V为顶点数，E为边数';
      break;
    case 'stack':
      algorithmDescription.value = '栈操作：后进先出(LIFO)数据结构，入栈/出栈操作时间复杂度 O(1)';
      break;
    case 'queue':
      algorithmDescription.value = '队列操作：先进先出(FIFO)数据结构，入队/出队操作时间复杂度 O(1)';
      break;
    case 'hashTable':
      algorithmDescription.value = '哈希表操作：通过哈希函数映射键值，平均查找/插入/删除时间复杂度 O(1)';
      break;
  }
};

// 更新步骤描述
const updateStepDescription = (step: number) => {
  // 根据算法类型、操作类型和当前步骤设置描述
  switch (props.algorithmType) {
    case 'array':
      switch (props.operationType) {
        case 'traverse':
          if (Array.isArray(props.data) && step < props.data.length) {
            stepDescription.value = `正在访问索引 ${step} 的元素: ${props.data[step]}`;
          } else {
            stepDescription.value = '遍历完成';
          }
          break;
        case 'search':
          if (step === 0) {
            stepDescription.value = '初始化二分查找，选择中间元素';
          } else if (animationState.highlightedIndices.length > 0) {
            const mid = animationState.highlightedIndices[0];
            const target = algorithmState.array.targetValue;
            
            // 检查 target 是否为 null
            if (!Array.isArray(props.data)) {
              stepDescription.value = `数据不是数组，无法进行二分查找`;
            } else if (target === null) {
              stepDescription.value = `当前检查索引 ${mid} 的元素: ${props.data[mid]}`;
            } else if (props.data[mid] === target) {
              stepDescription.value = `找到目标值 ${target} 在索引 ${mid}`;
            } else if (props.data[mid] > target) {
              stepDescription.value = `中间元素 ${props.data[mid]} > 目标值 ${target}，在左半部分继续查找`;
            } else {
              stepDescription.value = `中间元素 ${props.data[mid]} < 目标值 ${target}，在右半部分继续查找`;
            }
          }
          break;
        case 'sort':
          if (!Array.isArray(props.data)) {
            stepDescription.value = `数据不是数组，无法进行排序`;
            break;
          }
          if (step < props.data.length * props.data.length) {
            const i = Math.floor(step / props.data.length);
            const j = step % props.data.length;
            if (j < props.data.length - i - 1) {
              stepDescription.value = `比较索引 ${j} 和 ${j+1} 的元素: ${props.data[j]} 和 ${props.data[j+1]}`;
              if (props.data[j] > props.data[j+1]) {
                stepDescription.value += '，需要交换';
              } else {
                stepDescription.value += '，不需要交换';
              }
            } else {
              stepDescription.value = `第 ${i+1} 轮比较完成，最大元素已移至末尾`;
            }
          } else {
            stepDescription.value = '排序完成';
          }
          break;
        case 'insert':
          if (step === 0) {
            stepDescription.value = '准备插入新元素';
          } else if (step === 1) {
            stepDescription.value = '找到插入位置';
          } else {
            stepDescription.value = '移动元素并完成插入';
          }
          break;
        case 'delete':
          if (step === 0) {
            stepDescription.value = '准备删除元素';
          } else if (step === 1) {
            stepDescription.value = '找到删除位置';
          } else {
            stepDescription.value = '移动元素并完成删除';
          }
          break;
      }
      break;
    case 'linkedList':
      if (!Array.isArray(props.data)) {
        stepDescription.value = `数据不是数组，无法进行链表操作`;
      } else if (step < props.data.length) {
        stepDescription.value = `访问链表节点 ${step+1}，值为 ${props.data[step]}`;
      } else {
        stepDescription.value = '链表遍历完成';
      }
      break;
    // 其他数据结构的步骤描述...
  }
};

// 组件挂载时初始化
onMounted(() => {
  initializeAnimation();
});
</script>

<template>
  <div class="algorithm-animation">
    <!-- 算法描述 -->
    <div class="algorithm-description">
      <h3>{{ algorithmDescription }}</h3>
      <p class="step-description">{{ stepDescription }}</p>
    </div>
    
    <!-- 数组可视化 -->
    <div v-if="props.algorithmType === 'array'" class="array-visualization">
      <div 
        v-for="(item, index) in animationState.currentElements" 
        :key="index"
        class="array-item" 
        :class="{
          'highlighted': animationState.highlightedIndices.includes(index),
          'sorted': props.operationType === 'sort' && algorithmState.array.sortedIndices.includes(index)
        }"
      >
        <div class="item-index">{{ index }}</div>
        <div class="item-value">{{ item }}</div>
      </div>
    </div>
    
    <!-- 链表可视化 -->
    <div v-else-if="props.algorithmType === 'linkedList'" class="linkedlist-visualization">
      <div 
        v-for="(item, index) in animationState.currentElements" 
        :key="index"
        class="linkedlist-item"
        :class="{ 'highlighted': animationState.highlightedIndices.includes(index) }"
      >
        <div class="node-value">{{ item }}</div>
        <div class="node-pointer" v-if="index < animationState.currentElements.length - 1">→</div>
      </div>
    </div>
    
    <!-- 树可视化 -->
    <div v-else-if="props.algorithmType === 'tree'" class="tree-visualization">
      <!-- 树的可视化实现 -->
      <div class="placeholder-text">树结构可视化</div>
    </div>
    
    <!-- 图可视化 -->
    <div v-else-if="props.algorithmType === 'graph'" class="graph-visualization">
      <!-- 图的可视化实现 -->
      <div class="placeholder-text">图结构可视化</div>
    </div>
    
    <!-- 栈可视化 -->
    <div v-else-if="props.algorithmType === 'stack'" class="stack-visualization">
      <div class="stack-container">
        <div class="stack-top-label" v-if="algorithmState.stack.topIndex >= 0">栈顶</div>
        <div 
          v-for="(item, index) in algorithmState.stack.elements" 
          :key="index"
          class="stack-item"
          :class="{ 'highlighted': index === algorithmState.stack.topIndex }"
        >
          {{ item }}
        </div>
        <div class="stack-bottom-label" v-if="algorithmState.stack.elements.length > 0">栈底</div>
      </div>
    </div>
    
    <!-- 队列可视化 -->
    <div v-else-if="props.algorithmType === 'queue'" class="queue-visualization">
      <div class="queue-container">
        <div class="queue-labels" v-if="algorithmState.queue.elements.length > 0">
          <div class="queue-front-label">队首</div>
          <div class="queue-rear-label">队尾</div>
        </div>
        <div class="queue-elements">
          <div 
            v-for="(item, index) in algorithmState.queue.elements" 
            :key="index"
            class="queue-item"
            :class="{
              'highlighted-front': index === 0 && algorithmState.queue.frontIndex >= 0,
              'highlighted-rear': index === algorithmState.queue.elements.length - 1 && algorithmState.queue.rearIndex >= 0
            }"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 哈希表可视化 -->
    <div v-else-if="props.algorithmType === 'hashTable'" class="hashtable-visualization">
      <!-- 哈希表的可视化实现 -->
      <div class="placeholder-text">哈希表可视化</div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-animation {
  width: 100%;
  padding: 20px;
  background: rgba(30, 30, 40, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
}

.algorithm-description {
  margin-bottom: 20px;
  text-align: center;
}

.algorithm-description h3 {
  margin-bottom: 10px;
  color: var(--primary-color, #6c5ce7);
  font-size: 1.2rem;
}

.step-description {
  color: var(--text-secondary, #aaaaaa);
  font-size: 0.9rem;
  padding: 8px;
  background: rgba(108, 92, 231, 0.1);
  border-radius: 6px;
}

/* 数组可视化样式 */
.array-visualization {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.array-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  transition: all 0.3s ease;
}

.item-index {
  font-size: 0.8rem;
  color: var(--text-secondary, #aaaaaa);
  margin-bottom: 5px;
}

.item-value {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border, #333);
  border-radius: 8px;
  font-size: 1.2rem;
  color: var(--text-primary, #ffffff);
}

.array-item.highlighted .item-value {
  background: rgba(108, 92, 231, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  color: white;
}

.array-item.sorted .item-value {
  background: rgba(0, 206, 201, 0.6);
  border-color: rgba(0, 206, 201, 0.8);
}

/* 链表可视化样式 */
.linkedlist-visualization {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}

.linkedlist-item {
  display: flex;
  align-items: center;
}

.node-value {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border, #333);
  border-radius: 50%;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: var(--text-primary, #ffffff);
}

.linkedlist-item.highlighted .node-value {
  background: rgba(108, 92, 231, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  color: white;
}

.node-pointer {
  margin: 0 5px;
  font-size: 1.5rem;
  color: var(--text-secondary, #aaaaaa);
}

/* 树和图的可视化占位符 */
.placeholder-text {
  text-align: center;
  padding: 50px;
  color: var(--text-secondary, #aaaaaa);
  font-size: 1.2rem;
  background: rgba(30, 30, 40, 0.3);
  border-radius: 8px;
  border: 1px dashed var(--dark-border, #333);
}

.tree-visualization,
.graph-visualization,
.hashtable-visualization {
  height: 300px;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}

/* 栈可视化样式 */
.stack-visualization {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.stack-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 300px;
}

.stack-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border, #333);
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: var(--text-primary, #ffffff);
}

.stack-item.highlighted {
  background: rgba(108, 92, 231, 0.6);
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  color: white;
}

.stack-top-label,
.stack-bottom-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #aaaaaa);
  margin: 5px 0;
}

/* 队列可视化样式 */
.queue-visualization {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.queue-container {
  width: 100%;
  max-width: 500px;
}

.queue-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.queue-front-label,
.queue-rear-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #aaaaaa);
}

.queue-elements {
  display: flex;
  gap: 5px;
  width: 100%;
}

.queue-item {
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border, #333);
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: var(--text-primary, #ffffff);
}

.queue-item.highlighted-front {
  background: rgba(108, 92, 231, 0.6);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  color: white;
}

.queue-item.highlighted-rear {
  background: rgba(0, 206, 201, 0.6);
  box-shadow: 0 5px 15px rgba(0, 206, 201, 0.4);
  color: white;
}
</style>