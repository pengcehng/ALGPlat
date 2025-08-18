<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import D3NetworkGraph from './D3NetworkGraph.vue';

// 可视化类型
const visualizationTypes = [
  { id: 'graph', name: '网络图', icon: '🕸️' },
  { id: 'tree', name: '树结构', icon: '🌳' },
  { id: 'array', name: '数组', icon: '📊' },
  { id: 'linkedList', name: '链表', icon: '🔗' }
];

// 当前选择的可视化类型
const selectedVisualizationType = ref(visualizationTypes[0]);

// 示例数据
const graphData = reactive({
  nodes: [
    { id: '1', name: '节点1', group: 1 },
    { id: '2', name: '节点2', group: 1 },
    { id: '3', name: '节点3', group: 2 },
    { id: '4', name: '节点4', group: 2 },
    { id: '5', name: '节点5', group: 3 },
    { id: '6', name: '节点6', group: 3 },
    { id: '7', name: '节点7', group: 4 },
    { id: '8', name: '节点8', group: 4 }
  ],
  links: [
    { source: '1', target: '2', value: 1 },
    { source: '1', target: '3', value: 2 },
    { source: '2', target: '4', value: 1 },
    { source: '3', target: '5', value: 3 },
    { source: '4', target: '6', value: 1 },
    { source: '5', target: '7', value: 2 },
    { source: '6', target: '8', value: 1 },
    { source: '7', target: '8', value: 3 }
  ]
});

// 树结构数据
const treeData = reactive({
  name: 'Root',
  children: [
    {
      name: 'Child 1',
      children: [
        { name: 'Grandchild 1.1' },
        { name: 'Grandchild 1.2' }
      ]
    },
    {
      name: 'Child 2',
      children: [
        { name: 'Grandchild 2.1' },
        { name: 'Grandchild 2.2' }
      ]
    }
  ]
});

// 数组数据
const arrayData = reactive({
  values: [10, 25, 15, 30, 5, 20, 35, 40]
});

// 链表数据
const linkedListData = reactive({
  nodes: [
    { value: 10, next: 1 },
    { value: 20, next: 2 },
    { value: 30, next: 3 },
    { value: 40, next: 4 },
    { value: 50, next: null }
  ]
});

// 根据选择的可视化类型获取数据
const currentData = computed(() => {
  switch (selectedVisualizationType.value.id) {
    case 'graph':
      return graphData;
    case 'tree':
      // 将树结构数据转换为图数据格式
      return convertTreeToGraphData(treeData);
    case 'array':
      // 将数组数据转换为图数据格式
      return convertArrayToGraphData(arrayData.values);
    case 'linkedList':
      // 将链表数据转换为图数据格式
      return convertLinkedListToGraphData(linkedListData.nodes);
    default:
      return graphData;
  }
});

// 将树结构转换为图数据格式
function convertTreeToGraphData(tree: any) {
  const nodes: any[] = [];
  const links: any[] = [];
  let nodeId = 0;
  
  function traverse(node: any, parentId: number | null = null) {
    const currentId = nodeId++;
    nodes.push({ id: currentId.toString(), name: node.name, group: 1 });
    
    if (parentId !== null) {
      links.push({ source: parentId.toString(), target: currentId.toString(), value: 1 });
    }
    
    if (node.children) {
      for (const child of node.children) {
        traverse(child, currentId);
      }
    }
  }
  
  traverse(tree);
  
  return { nodes, links };
}

// 将数组转换为图数据格式
function convertArrayToGraphData(array: any[]) {
  const nodes = array.map((value, index) => ({
    id: index.toString(),
    name: value.toString(),
    group: 1
  }));
  
  const links = [];
  for (let i = 0; i < array.length - 1; i++) {
    links.push({
      source: i.toString(),
      target: (i + 1).toString(),
      value: 1
    });
  }
  
  return { nodes, links };
}

// 将链表转换为图数据格式
function convertLinkedListToGraphData(linkedList: any[]) {
  const nodes = linkedList.map((node, index) => ({
    id: index.toString(),
    name: node.value.toString(),
    group: 1
  }));
  
  const links = [];
  for (let i = 0; i < linkedList.length; i++) {
    const nextIndex = linkedList[i].next;
    if (nextIndex !== null) {
      links.push({
        source: i.toString(),
        target: nextIndex.toString(),
        value: 1
      });
    }
  }
  
  return { nodes, links };
}

// 选择可视化类型
function selectVisualizationType(type: typeof visualizationTypes[0]) {
  selectedVisualizationType.value = type;
}

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
});
</script>

<template>
  <div class="algorithm-visualization">
    <div class="visualization-header">
      <h2>算法可视化</h2>
      <div class="visualization-type-selector">
        <button 
          v-for="type in visualizationTypes" 
          :key="type.id"
          class="type-btn" 
          :class="{ active: selectedVisualizationType.id === type.id }"
          @click="selectVisualizationType(type)"
        >
          <span class="type-icon">{{ type.icon }}</span>
          <span class="type-name">{{ type.name }}</span>
        </button>
      </div>
    </div>
    
    <div class="visualization-container">
      <!-- 网络图可视化 -->
      <D3NetworkGraph 
        :data="currentData" 
        :width="800" 
        :height="500" 
        :node-color="'#1f77b4'" 
        :link-color="'#999'" 
        :show-labels="true"
      />
    </div>
    
    <div class="visualization-controls">
      <div class="control-panel">
        <h3>控制面板</h3>
        <div class="control-group">
          <label>节点颜色</label>
          <select>
            <option value="#1f77b4">蓝色</option>
            <option value="#ff7f0e">橙色</option>
            <option value="#2ca02c">绿色</option>
            <option value="#d62728">红色</option>
          </select>
        </div>
        <div class="control-group">
          <label>显示标签</label>
          <input type="checkbox" checked>
        </div>
        <div class="control-group">
          <label>布局</label>
          <select>
            <option value="force">力导向</option>
            <option value="radial">放射状</option>
            <option value="grid">网格</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-visualization {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.visualization-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.visualization-type-selector {
  display: flex;
  gap: 10px;
}

.type-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn:hover {
  background-color: #e0e0e0;
}

.type-btn.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.type-icon {
  margin-right: 8px;
  font-size: 18px;
}

.visualization-container {
  flex: 1;
  min-height: 500px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.visualization-controls {
  display: flex;
  justify-content: flex-end;
}

.control-panel {
  width: 300px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.control-group select,
.control-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>