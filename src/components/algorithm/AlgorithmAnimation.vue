<script setup lang="ts">
import { onMounted } from 'vue';
import { useAlgorithmAnimation } from './scripts/AlgorithmAnimationLogic';

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

// 使用提取的算法动画逻辑
const {
  animationState,
  algorithmState,
  algorithmDescription,
  stepDescription,
  initializeAnimation
} = useAlgorithmAnimation(props);

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

<style src="./styles/AlgorithmAnimation.css" scoped></style>