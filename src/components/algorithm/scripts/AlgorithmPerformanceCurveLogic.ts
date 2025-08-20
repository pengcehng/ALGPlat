import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// 注册ChartJS组件
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

/**
 * 创建算法性能曲线逻辑
 * @param props 组件属性
 * @returns 返回图表数据和配置
 */
export function useAlgorithmPerformanceCurve(props: {
  leftAlgorithm: { name: string } | Record<string, any>;
  rightAlgorithm: { name: string } | Record<string, any>;
  leftAnalysis: { executionTime: number; memoryUsage: number } | Record<string, any>;
  rightAnalysis: { executionTime: number; memoryUsage: number } | Record<string, any>;
}) {
  
  // 生成模拟的性能数据点
  const generatePerformanceData = (baseTime: number, algorithmType: string) => {
    const dataSizes = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    
    return dataSizes.map(size => {
      let multiplier;
      
      // 根据算法名称模拟不同的时间复杂度
      if (algorithmType.toLowerCase().includes('bubble') || algorithmType.toLowerCase().includes('冒泡')) {
        // O(n²) 复杂度
        multiplier = Math.pow(size / 100, 2);
      } else if (algorithmType.toLowerCase().includes('quick') || algorithmType.toLowerCase().includes('快速')) {
        // O(n log n) 复杂度
        multiplier = (size / 100) * Math.log2(size / 100);
      } else if (algorithmType.toLowerCase().includes('merge') || algorithmType.toLowerCase().includes('归并')) {
        // O(n log n) 复杂度
        multiplier = (size / 100) * Math.log2(size / 100);
      } else if (algorithmType.toLowerCase().includes('heap') || algorithmType.toLowerCase().includes('堆')) {
        // O(n log n) 复杂度
        multiplier = (size / 100) * Math.log2(size / 100);
      } else {
        // 默认线性复杂度 O(n)
        multiplier = size / 100;
      }
      
      // 添加一些随机波动使曲线更真实
      const randomFactor = 0.8 + Math.random() * 0.4;
      return Math.round(baseTime * multiplier * randomFactor);
    });
  };

  // 图表数据
  const chartData = computed(() => {
    const dataSizes = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    
    const leftPerformanceData = generatePerformanceData(
      props.leftAnalysis.executionTime || 10,
      props.leftAlgorithm.name || 'algorithm1'
    );
    
    const rightPerformanceData = generatePerformanceData(
      props.rightAnalysis.executionTime || 15,
      props.rightAlgorithm.name || 'algorithm2'
    );

    return {
      labels: dataSizes.map(size => `${size}`),
      datasets: [
        {
          label: props.leftAlgorithm.name || '算法1',
          data: leftPerformanceData,
          borderColor: 'rgba(71, 118, 230, 1)',
          backgroundColor: 'rgba(71, 118, 230, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(71, 118, 230, 1)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.4
        },
        {
          label: props.rightAlgorithm.name || '算法2',
          data: rightPerformanceData,
          borderColor: 'rgba(142, 84, 233, 1)',
          backgroundColor: 'rgba(142, 84, 233, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(142, 84, 233, 1)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.4
        }
      ]
    };
  });

  // 图表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          boxWidth: 12,
          boxHeight: 12
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: function(context: any) {
            return `数据规模: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} ms`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '数据规模',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          },
          align: 'center'
        },
        ticks: {
          color: '#aaaaaa',
          font: {
            size: 11
          },
          align: 'center'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      y: {
        title: {
          display: true,
          text: '执行时间 (ms)',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          },
          align: 'center'
        },
        beginAtZero: true,
        ticks: {
          color: '#aaaaaa',
          font: {
            size: 11
          },
          align: 'center',
          callback: function(value: any) {
            return value + ' ms';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      }
    }
  };

  return {
    chartData,
    chartOptions
  };
}