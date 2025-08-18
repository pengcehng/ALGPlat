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

// 算法分类列表
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