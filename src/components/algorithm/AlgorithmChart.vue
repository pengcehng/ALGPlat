<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { useAlgorithmChart } from './scripts/AlgorithmChartLogic';

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
const { chartData, chartOptions } = useAlgorithmChart(props);
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
@import "./styles/AlgorithmChart.css";
</style>