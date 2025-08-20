<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { useAlgorithmPerformanceCurve } from './scripts/AlgorithmPerformanceCurveLogic';

// 定义图表组件的属性
const props = defineProps({
  leftAlgorithm: {
    type: Object,
    required: true
  },
  rightAlgorithm: {
    type: Object,
    required: true
  },
  leftAnalysis: {
    type: Object,
    required: true
  },
  rightAnalysis: {
    type: Object,
    required: true
  }
});

// 使用提取的图表逻辑
const { chartData, chartOptions } = useAlgorithmPerformanceCurve(props);
</script>

<template>
  <div class="performance-curve-container">
    <h3 class="curve-title">性能曲线对比</h3>
    <div class="curve-chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.performance-curve-container {
  margin-top: 0;
  background-color: var(--dark-bg, #121212);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--dark-border, #333);
}

.curve-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: var(--text-primary, #ffffff);
  text-align: center;
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.curve-chart {
  height: 280px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>