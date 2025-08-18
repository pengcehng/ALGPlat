<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

// 定义组件属性
const props = defineProps({
  // 图数据
  data: {
    type: Object,
    required: true,
    default: () => ({
      nodes: [],
      links: []
    })
  },
  // 宽度
  width: {
    type: Number,
    default: 600
  },
  // 高度
  height: {
    type: Number,
    default: 400
  },
  // 节点颜色
  nodeColor: {
    type: String,
    default: '#1f77b4'
  },
  // 连线颜色
  linkColor: {
    type: String,
    default: '#999'
  },
  // 是否显示节点标签
  showLabels: {
    type: Boolean,
    default: true
  }
});

// 图表容器引用
const svgContainer = ref<HTMLElement | null>(null);

// 创建力导向图
const createForceGraph = () => {
  if (!svgContainer.value) return;
  
  // 清除之前的图表
  d3.select(svgContainer.value).selectAll('*').remove();
  
  // 创建SVG元素
  const svg = d3.select(svgContainer.value)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height);
  
  // 创建力导向模拟
  const simulation = d3.forceSimulation(props.data.nodes)
    .force('link', d3.forceLink(props.data.links).id((d: any) => d.id))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(props.width / 2, props.height / 2));
  
  // 绘制连线
  const link = svg.append('g')
    .selectAll('line')
    .data(props.data.links)
    .enter()
    .append('line')
    .attr('stroke', props.linkColor)
    .attr('stroke-width', 1.5);
  
  // 绘制节点
  const node = svg.append('g')
    .selectAll('circle')
    .data(props.data.nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', props.nodeColor)
    .call(d3.drag<SVGCircleElement, any, any>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended) as any);
  
  // 添加节点标签
  if (props.showLabels) {
    const labels = svg.append('g')
      .selectAll('text')
      .data(props.data.nodes)
      .enter()
      .append('text')
      .text((d: any) => d.name || d.id)
      .attr('font-size', 10)
      .attr('dx', 8)
      .attr('dy', 3);
    
    // 更新标签位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
      
      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });
  } else {
    // 不显示标签时的更新
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }
  
  // 拖拽事件处理函数
  function dragstarted(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
};

// 监听数据变化
watch(() => props.data, () => {
  createForceGraph();
}, { deep: true });

// 组件挂载时初始化图表
onMounted(() => {
  createForceGraph();
});
</script>

<template>
  <div class="d3-network-graph" ref="svgContainer"></div>
</template>

<style scoped>
.d3-network-graph {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 4px;
}

/* 节点悬停效果 */
:deep(circle:hover) {
  fill: #ff7f0e;
  cursor: pointer;
}

/* 连线悬停效果 */
:deep(line:hover) {
  stroke: #ff7f0e;
  stroke-width: 2;
}
</style>