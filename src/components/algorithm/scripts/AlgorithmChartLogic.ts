import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// 注册ChartJS组件
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

/**
 * 创建算法图表逻辑
 * @param props 组件属性
 * @returns 返回图表数据和配置
 */
export function useAlgorithmChart(props: {
  leftAlgorithm: { name: string } | Record<string, any>;
  rightAlgorithm: { name: string } | Record<string, any>;
  leftAnalysis: { executionTime: number; memoryUsage: number } | Record<string, any>;
  rightAnalysis: { executionTime: number; memoryUsage: number } | Record<string, any>;
}) {
  // 图表数据
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

  // 图表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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

  return {
    chartData,
    chartOptions
  };
}