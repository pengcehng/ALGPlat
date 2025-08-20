// 算法类型定义

// 算法接口
export interface Algorithm {
  id: string;
  name: string;
  category: string;
  complexity: {
    time: string;
    space: string;
  };
  description: string;
}

// 算法分类接口
export interface AlgorithmCategory {
  id: string;
  name: string;
}

// 动画步骤接口
export interface AnimationStep {
  description: string;
  elements: AnimationElement[];
}

// 动画元素接口
export interface AnimationElement {
  id: string;
  value: any;
  type: string;
  position?: { x: number; y: number };
  highlighted?: boolean;
  visited?: boolean;
  connections?: string[];
}

// 算法分类接口（扩展）
export interface AlgorithmCategoryExtended {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories?: AlgorithmSubcategory[];
}

// 算法子分类接口
export interface AlgorithmSubcategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  algorithms: Algorithm[];
}

// 基础算法分类
const basicAlgorithms: AlgorithmSubcategory[] = [
  {
    id: 'sort',
    name: '排序算法',
    icon: '📈',
    description: '对数据按指定顺序排列的算法',
    algorithms: [
      {
        id: 'bubbleSort',
        name: '冒泡排序',
        category: 'sort',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        description: '通过重复遍历数组，比较相邻元素并交换位置实现排序'
      },
      {
        id: 'selectionSort',
        name: '选择排序',
        category: 'sort',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        description: '每次从未排序部分找到最小元素，放到已排序部分末尾'
      },
      {
        id: 'insertionSort',
        name: '插入排序',
        category: 'sort',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        description: '构建有序序列，对未排序数据在已排序序列中找到合适位置插入'
      }
    ]
  },
  {
    id: 'search',
    name: '查找算法',
    icon: '🔍',
    description: '在数据集合中寻找目标元素的算法',
    algorithms: [
      {
        id: 'linearSearch',
        name: '线性查找',
        category: 'search',
        complexity: { time: 'O(n)', space: 'O(1)' },
        description: '顺序查找，逐个比较元素'
      },
      {
        id: 'binarySearch',
        name: '二分查找',
        category: 'search',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        description: '在有序数组中通过不断缩小范围查找目标值'
      }
    ]
  }
];

// 设计思想算法分类
const designAlgorithms: AlgorithmSubcategory[] = [
  {
    id: 'divide',
    name: '分治法',
    icon: '✂️',
    description: '将问题分解为子问题，解决子问题后合并结果',
    algorithms: [
      {
        id: 'quickSort',
        name: '快速排序',
        category: 'divide',
        complexity: { time: 'O(n log n)', space: 'O(log n)' },
        description: '选择基准元素，将数组分为两部分，递归排序'
      },
      {
        id: 'mergeSort',
        name: '归并排序',
        category: 'divide',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        description: '将数组分成两半，递归排序后合并'
      }
    ]
  },
  {
    id: 'dp',
    name: '动态规划',
    icon: '📊',
    description: '解决重叠子问题和最优子结构问题，通过存储中间结果避免重复计算',
    algorithms: [
      {
        id: 'fibonacci',
        name: '斐波那契数列',
        category: 'dp',
        complexity: { time: 'O(n)', space: 'O(n)' },
        description: '使用动态规划计算斐波那契数列'
      },
      {
        id: 'lcs',
        name: '最长公共子序列',
        category: 'dp',
        complexity: { time: 'O(mn)', space: 'O(mn)' },
        description: '找到两个序列的最长公共子序列'
      }
    ]
  },
  {
    id: 'greedy',
    name: '贪心算法',
    icon: '🎯',
    description: '每次选择局部最优解，期望得到全局最优',
    algorithms: [
      {
        id: 'huffman',
        name: '哈夫曼编码',
        category: 'greedy',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        description: '构建最优前缀编码树'
      }
    ]
  },
  {
    id: 'backtrack',
    name: '回溯算法',
    icon: '↩️',
    description: '尝试逐步构建解，若发现不满足条件则回溯',
    algorithms: [
      {
        id: 'nQueens',
        name: 'N皇后问题',
        category: 'backtrack',
        complexity: { time: 'O(N!)', space: 'O(N)' },
        description: '在N×N棋盘上放置N个皇后，使其不能相互攻击'
      }
    ]
  },
  {
    id: 'branch',
    name: '分支限界法',
    icon: '🌿',
    description: '类似回溯，但通过限界剪枝丢弃不可能最优的分支',
    algorithms: [
      {
        id: 'tsp',
        name: '旅行商问题',
        category: 'branch',
        complexity: { time: 'O(n!)', space: 'O(n)' },
        description: '找到访问所有城市的最短路径'
      }
    ]
  }
];

// 图算法分类
const graphAlgorithms: AlgorithmSubcategory[] = [
  {
    id: 'traversal',
    name: '图的遍历',
    icon: '🔄',
    description: '系统地访问图中的所有顶点',
    algorithms: [
      {
        id: 'dfs',
        name: '深度优先搜索',
        category: 'traversal',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '尽可能深地搜索图的分支'
      },
      {
        id: 'bfs',
        name: '广度优先搜索',
        category: 'traversal',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '逐层访问图的顶点'
      }
    ]
  },
  {
    id: 'shortestPath',
    name: '最短路径',
    icon: '🛤️',
    description: '找到图中两点间的最短路径',
    algorithms: [
      {
        id: 'dijkstra',
        name: 'Dijkstra算法',
        category: 'shortestPath',
        complexity: { time: 'O((V+E)logV)', space: 'O(V)' },
        description: '单源最短路径，适用于非负权重'
      },
      {
        id: 'floyd',
        name: 'Floyd-Warshall算法',
        category: 'shortestPath',
        complexity: { time: 'O(V³)', space: 'O(V²)' },
        description: '多源最短路径算法'
      }
    ]
  },
  {
    id: 'mst',
    name: '最小生成树',
    icon: '🌲',
    description: '连接所有顶点的最小权重树',
    algorithms: [
      {
        id: 'prim',
        name: 'Prim算法',
        category: 'mst',
        complexity: { time: 'O(ElogV)', space: 'O(V)' },
        description: '适合稠密图的最小生成树算法'
      },
      {
        id: 'kruskal',
        name: 'Kruskal算法',
        category: 'mst',
        complexity: { time: 'O(ElogE)', space: 'O(V)' },
        description: '适合稀疏图的最小生成树算法'
      }
    ]
  },
  {
    id: 'topological',
    name: '拓扑排序',
    icon: '📋',
    description: '针对有向无环图，确定依赖关系的执行顺序',
    algorithms: [
      {
        id: 'topologicalSort',
        name: '拓扑排序',
        category: 'topological',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '对有向无环图进行拓扑排序'
      }
    ]
  }
];

// 其他算法分类
const otherAlgorithms: AlgorithmSubcategory[] = [
  {
    id: 'stringMatch',
    name: '字符串匹配',
    icon: '🔤',
    description: '在文本中查找模式字符串',
    algorithms: [
      {
        id: 'kmp',
        name: 'KMP算法',
        category: 'stringMatch',
        complexity: { time: 'O(n+m)', space: 'O(m)' },
        description: '高效的字符串模式匹配算法'
      }
    ]
  },
  {
    id: 'numerical',
    name: '数值计算',
    icon: '🧮',
    description: '数学计算相关算法',
    algorithms: [
      {
        id: 'fastPower',
        name: '快速幂',
        category: 'numerical',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        description: '高效计算a^b mod m'
      }
    ]
  },
  {
    id: 'bitwise',
    name: '位运算算法',
    icon: '💻',
    description: '利用二进制特性解决问题',
    algorithms: [
      {
        id: 'bitCount',
        name: '统计二进制中1的个数',
        category: 'bitwise',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        description: '统计整数二进制表示中1的个数'
      }
    ]
  }
];

// 算法分类列表（新的学术分类）
export const algorithmCategoriesExtended: AlgorithmCategoryExtended[] = [
  {
    id: 'basic',
    name: '基础算法',
    icon: '🔧',
    description: '排序和查找等基础算法',
    subcategories: basicAlgorithms
  },
  {
    id: 'design',
    name: '设计思想算法',
    icon: '💡',
    description: '基于特定设计思想的算法',
    subcategories: designAlgorithms
  },
  {
    id: 'graph',
    name: '图算法',
    icon: '🗺️',
    description: '处理图结构的专门算法',
    subcategories: graphAlgorithms
  },
  {
    id: 'other',
    name: '其他算法',
    icon: '🔬',
    description: '字符串匹配、数值计算、位运算等算法',
    subcategories: otherAlgorithms
  }
];

// 原有分类列表（保持向后兼容）
export const algorithmCategories: AlgorithmCategory[] = [
  { id: 'all', name: '全部' },
  { id: 'search', name: '搜索' },
  { id: 'sort', name: '排序' },
  { id: 'traversal', name: '遍历' },
  { id: 'path', name: '路径' },
  { id: 'operation', name: '基本操作' }
];

// 算法列表（按数据结构分类）
export const algorithms: Record<string, Algorithm[]> = {
  array: [
    {
      id: 'bubbleSort',
      name: '冒泡排序',
      category: 'sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: '通过重复遍历数组，比较相邻元素并交换位置实现排序'
    },
    {
      id: 'selectionSort',
      name: '选择排序',
      category: 'sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: '每次从未排序部分找到最小元素，放到已排序部分末尾'
    },
    {
      id: 'insertionSort',
      name: '插入排序',
      category: 'sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: '构建有序序列，对未排序数据在已排序序列中找到合适位置插入'
    },
    {
      id: 'quickSort',
      name: '快速排序',
      category: 'sort',
      complexity: { time: 'O(n log n)', space: 'O(log n)' },
      description: '选择基准元素，将数组分为两部分，递归排序'
    },
    {
      id: 'mergeSort',
      name: '归并排序',
      category: 'sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      description: '将数组分成两半，递归排序后合并'
    },
    {
      id: 'binarySearch',
      name: '二分查找',
      category: 'search',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      description: '在有序数组中通过不断缩小范围查找目标值'
    }
  ],
  linkedList: [
    {
      id: 'traverseLinkedList',
      name: '链表遍历',
      category: 'traversal',
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: '从头到尾访问链表的每个节点'
    },
    {
      id: 'insertNode',
      name: '插入节点',
      category: 'operation',
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: '在链表的指定位置插入新节点'
    },
    {
      id: 'deleteNode',
      name: '删除节点',
      category: 'operation',
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: '删除链表中的指定节点'
    },
    {
      id: 'reverseLinkedList',
      name: '反转链表',
      category: 'operation',
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: '将链表的指针方向反转'
    }
  ],
  // 其他数据结构的算法定义...
};