<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

const chartData = computed(() => {
  return {
    labels: ['执行时间 (ms)', '内存使用 (MB)'],
    datasets: [
      {
        label: props.leftAlgorithm.name,
        backgroundColor: 'rgba(71, 118, 230, 0.8)',
        data: [props.leftAnalysis.executionTime, props.leftAnalysis.memoryUsage]
      },
      {
        label: props.rightAlgorithm.name,
        backgroundColor: 'rgba(142, 84, 233, 0.8)',
        data: [props.rightAnalysis.executionTime, props.rightAnalysis.memoryUsage]
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#ffffff'
      }
    },
    title: {
      display: true,
      text: '算法性能对比',
      color: '#ffffff',
      font: {
        size: 16
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
            if (context.dataIndex === 0) {
              label += ' ms';
            } else if (context.dataIndex === 1) {
              label += ' MB';
            }
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#aaaaaa'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#aaaaaa'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 100%;
  width: 100%;
  background-color: var(--dark-bg, #121212);
  border-radius: 4px;
  padding: 16px;
}
</style>