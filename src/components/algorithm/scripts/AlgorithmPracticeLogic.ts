// AlgorithmPracticeLogic.ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// 导入重构后的数据结构和算法模块
import type { Algorithm, AlgorithmCategory, AnimationStep, AnimationElement } from './algorithms/types';
import type { DataStructure } from './dataStructures/types';
import { getDataStructureOperations } from './dataStructures';
import { calculateStepsForAlgorithm } from './algorithms';
import { dataStructures as allDataStructures } from './dataStructures/types';
import { algorithmCategories as allAlgorithmCategories } from './algorithms/types';

// 使用组合式函数封装算法练习逻辑
export function useAlgorithmPractice() {
  const router = useRouter();
  
  // 页面模式：practice（练习模式）或 display（展示模式）
  const pageMode = ref('practice');
  
  // 动画相关状态
  const animationSteps = ref<AnimationStep[]>([]);
  const currentStepIndex = ref(0);
  const totalSteps = ref(0);
  const isAnimating = ref(false);
  const isPaused = ref(false);
  const isLoading = ref(false);
  const animationElements = ref<AnimationElement[]>([]);
  const analysisResult = ref('');
  
  // 使用从模块导入的数据结构和算法数据
  const dataStructures: DataStructure[] = allDataStructures;
  
  // 使用从模块导入的算法分类
  const algorithmCategories: AlgorithmCategory[] = allAlgorithmCategories;
  
  // 算法数据
  const algorithms: Record<string, Algorithm[]> = {
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
    stack: [
      {
        id: 'pushStack',
        name: '入栈操作',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '将元素添加到栈顶'
      },
      {
        id: 'popStack',
        name: '出栈操作',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '移除并返回栈顶元素'
      },
      {
        id: 'bracketMatching',
        name: '括号匹配',
        category: 'operation',
        complexity: { time: 'O(n)', space: 'O(n)' },
        description: '使用栈检查括号是否匹配'
      }
    ],
    queue: [
      {
        id: 'enqueue',
        name: '入队操作',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '将元素添加到队列尾部'
      },
      {
        id: 'dequeue',
        name: '出队操作',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '移除并返回队列头部元素'
      },
      {
        id: 'breadthFirstSearch',
        name: '广度优先搜索',
        category: 'search',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '使用队列实现的图遍历算法'
      }
    ],
    tree: [
      {
        id: 'inorderTraversal',
        name: '中序遍历',
        category: 'traversal',
        complexity: { time: 'O(n)', space: 'O(h)' },
        description: '左-根-右顺序遍历二叉树'
      },
      {
        id: 'preorderTraversal',
        name: '前序遍历',
        category: 'traversal',
        complexity: { time: 'O(n)', space: 'O(h)' },
        description: '根-左-右顺序遍历二叉树'
      },
      {
        id: 'postorderTraversal',
        name: '后序遍历',
        category: 'traversal',
        complexity: { time: 'O(n)', space: 'O(h)' },
        description: '左-右-根顺序遍历二叉树'
      },
      {
        id: 'binarySearchTreeInsert',
        name: 'BST插入',
        category: 'operation',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        description: '在二叉搜索树中插入新节点'
      },
      {
        id: 'binarySearchTreeSearch',
        name: 'BST查找',
        category: 'search',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        description: '在二叉搜索树中查找节点'
      }
    ],
    graph: [
      {
        id: 'depthFirstSearch',
        name: '深度优先搜索',
        category: 'search',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '使用递归或栈实现的图遍历算法'
      },
      {
        id: 'breadthFirstSearchGraph',
        name: '广度优先搜索',
        category: 'search',
        complexity: { time: 'O(V+E)', space: 'O(V)' },
        description: '使用队列实现的图遍历算法'
      },
      {
        id: 'dijkstra',
        name: '迪杰斯特拉算法',
        category: 'path',
        complexity: { time: 'O(V² + E)', space: 'O(V)' },
        description: '计算从源点到所有顶点的最短路径'
      }
    ],
    hashTable: [
      {
        id: 'hashInsert',
        name: '哈希插入',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '在哈希表中插入键值对'
      },
      {
        id: 'hashSearch',
        name: '哈希查找',
        category: 'search',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '在哈希表中查找键对应的值'
      },
      {
        id: 'hashDelete',
        name: '哈希删除',
        category: 'operation',
        complexity: { time: 'O(1)', space: 'O(1)' },
        description: '从哈希表中删除键值对'
      },
      {
        id: 'collisionResolution',
        name: '冲突解决',
        category: 'operation',
        complexity: { time: 'O(n)', space: 'O(1)' },
        description: '解决哈希冲突的链地址法'
      }
    ]
  };
  
  // 当前选中的数据结构和算法
  const selectedStructure = ref<DataStructure | null>(null);
  const selectedCategory = ref('all');
  const selectedAlgorithm = ref<Algorithm | null>(null);
  
  // 根据分类获取算法
  const getAlgorithmsByCategory = computed(() => {
    if (!selectedStructure.value) return [];
    
    const structureAlgorithms = algorithms[selectedStructure.value.id] || [];
    
    if (selectedCategory.value === 'all') {
      return structureAlgorithms;
    } else {
      return structureAlgorithms.filter(algo => algo.category === selectedCategory.value);
    }
  });
  
  // 当前分类的算法列表
  const currentCategoryAlgorithms = computed(() => {
    return getAlgorithmsByCategory.value;
  });
  
  // 用户代码输入
  const userCode = ref('');
  
  // 分析结果已在文件顶部声明
  
  // 用户输入数据
  const userInputData = ref('');
  
  // 动画状态
  // 动画状态已在文件顶部声明
  const animationSpeed = ref(1); // 1: 正常, 0.5: 慢, 2: 快
  
  // 输入模式：'manual'（手动输入）或 'code'（代码输入）
  const inputMode = ref('manual');
  
  // 加载状态已在文件顶部声明
  
  // 下拉菜单状态
  const isStructureDropdownOpen = ref(false);
  const isAlgorithmDropdownOpen = ref(false);
  
  // 动画元素数据已在文件顶部声明
  // 动画步骤数据已在文件顶部声明
  
  // 解析用户输入
  const parseUserInput = () => {
    try {
      if (!userInputData.value.trim()) {
        return [];
      }
      
      if (!selectedStructure.value) {
        return [];
      }
      
      const structureType = selectedStructure.value.id;
      
      // 根据数据结构类型解析输入
      switch (structureType) {
        case 'array':
          // 解析数组输入，例如："1, 2, 3, 4, 5"
          return userInputData.value.split(/[,\s]+/).map(item => {
            const num = Number(item.trim());
            return isNaN(num) ? item.trim() : num;
          }).filter(item => item !== '');
          
        case 'linkedList':
          // 解析链表输入，例如："1->2->3->4->5"
          return userInputData.value.split(/[->\s]+/).map(item => {
            const num = Number(item.trim());
            return isNaN(num) ? item.trim() : num;
          }).filter(item => item !== '');
          
        case 'stack':
        case 'queue':
          // 解析栈/队列输入，例如："1, 2, 3, 4, 5"
          return userInputData.value.split(/[,\s]+/).map(item => {
            const num = Number(item.trim());
            return isNaN(num) ? item.trim() : num;
          }).filter(item => item !== '');
          
        case 'tree':
          // 解析树输入，例如："1,2,3,4,5,null,6"
          return userInputData.value.split(/[,\s]+/).map(item => {
            if (item.trim().toLowerCase() === 'null') return null;
            const num = Number(item.trim());
            return isNaN(num) ? item.trim() : num;
          });
          
        case 'graph':
          // 解析图输入，例如："A-B,A-C,B-D,C-D"
          const edges = userInputData.value.split(/[,\s]+/).map(edge => edge.trim()).filter(edge => edge !== '');
          return edges.map(edge => {
            const [from, to] = edge.split('-').map(node => node.trim());
            return { from, to };
          });
          
        case 'hashTable':
          // 解析哈希表输入，例如："key1:value1, key2:value2"
          const pairs = userInputData.value.split(/[,\s]+/).map(pair => pair.trim()).filter(pair => pair !== '');
          return pairs.map(pair => {
            const [key, value] = pair.split(':').map(item => item.trim());
            const numValue = Number(value);
            // 创建符合AnimationElement接口的对象
            return { 
              key, 
              value: isNaN(numValue) ? value : numValue,
              id: `hash-${key}`,
              type: 'hashTable',
              from: key,
              to: String(isNaN(numValue) ? value : numValue)
            };
          });
          
        default:
          return [];
      }
    } catch (error) {
      console.error('解析用户输入时出错:', error);
      return [];
    }
  };
  
  // 数据结构构建函数已移至相应的数据结构模块
      
  // 图结构处理已移至相应的数据结构模块
  
  // 获取展示模式的数据
  const getDisplayModeData = (structureType: string) => {
    switch (structureType) {
      case 'array':
        return [5, 2, 9, 1, 7, 4, 8, 3, 6];
      case 'linkedList':
        return [10, 20, 30, 40, 50];
      case 'stack':
        return [6, 5, 4, 3, 2, 1];
      case 'queue':
        return [1, 2, 3, 4, 5];
      case 'tree':
        return [10, 5, 15, 3, 7, 12, 18];
      case 'graph':
        return [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'B', to: 'D' },
          { from: 'C', to: 'D' },
          { from: 'C', to: 'E' },
          { from: 'D', to: 'E' }
        ];
      case 'hashTable':
        return [
          { key: 'name', value: 'John' },
          { key: 'age', value: 30 },
          { key: 'city', value: 'New York' },
          { key: 'job', value: 'Developer' }
        ];
      default:
        return [];
    }
  };
  
  // 启动动画
  const startAnimation = async () => {
    if (!selectedStructure.value || !selectedAlgorithm.value) {
      return;
    }
    
    isLoading.value = true;
    isAnimating.value = true;
    isPaused.value = false;
    currentStepIndex.value = 0;
    
    try {
      // 解析用户输入或使用示例数据
      let inputData;
      if (pageMode.value === 'practice') {
        inputData = parseUserInput();
      } else {
        // 展示模式：若用户提供了自定义数据则优先使用，否则回退到示例数据
        inputData = userInputData.value && userInputData.value.trim()
          ? parseUserInput()
          : getDisplayModeData(selectedStructure.value.id);
      }
      
      // 计算动画步骤
      const steps = await calculateStepsForAlgorithm(
        selectedAlgorithm.value.id,
        selectedStructure.value.id,
        inputData
      );
      
      animationSteps.value = steps;
      totalSteps.value = steps.length;
      
      // 开始动画
      if (steps.length > 0) {
        animateStep(0);
      }
    } catch (error) {
      console.error('启动动画时出错:', error);
      analysisResult.value = `错误: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 使用重构后的算法和数据结构模块
  // 这些函数已经从导入的模块中获取
  // calculateStepsForAlgorithm 和 getAlgorithmComplexityFactor 已经在文件顶部导入
  
  // 动画单个步骤
  const animateStep = (stepIndex: number) => {
    if (stepIndex >= animationSteps.value.length || !isAnimating.value || isPaused.value) {
      return;
    }
    
    currentStepIndex.value = stepIndex;
    const step = animationSteps.value[stepIndex];
    
    // 更新动画元素
    if (step.elements) {
      animationElements.value = step.elements;
    }
    
    // 如果不是最后一步，安排下一步
    if (stepIndex < animationSteps.value.length - 1 && isAnimating.value && !isPaused.value) {
      const delay = 1000 / animationSpeed.value;
      setTimeout(() => animateStep(stepIndex + 1), delay);
    } else if (stepIndex === animationSteps.value.length - 1) {
      // 最后一步，更新分析结果
      const complexity = selectedAlgorithm.value?.complexity || { time: 'N/A', space: 'N/A' };
      const suggestion = selectedAlgorithm.value ? getOptimizationSuggestion(selectedAlgorithm.value.id) : 'N/A';
      
      analysisResult.value = `
算法: ${selectedAlgorithm.value?.name || 'N/A'}

时间复杂度: ${complexity.time}
空间复杂度: ${complexity.space}

优化建议: ${suggestion}

执行步骤: ${animationSteps.value.length}
      `;
    }
  };
  
  // 暂停动画
  const pauseAnimation = () => {
    isPaused.value = true;
  };
  
  // 继续动画
  const resumeAnimation = () => {
    if (isAnimating.value && isPaused.value) {
      isPaused.value = false;
      animateStep(currentStepIndex.value + 1);
    }
  };
  
  // 重置动画
  const resetAnimation = () => {
    isAnimating.value = false;
    isPaused.value = false;
    currentStepIndex.value = 0;
    animationElements.value = [];
    animationSteps.value = [];
    analysisResult.value = '';
  };
  
  // 设置动画速度
  const setAnimationSpeed = (speed: number) => {
    animationSpeed.value = speed;
  };
  
  // 选择数据结构
  const selectDataStructure = (structure: DataStructure) => {
    selectedStructure.value = structure;
    selectedAlgorithm.value = null;
    resetAnimation();
    isStructureDropdownOpen.value = false;
  };
  
  // 选择算法
  const selectAlgorithm = (algorithm: Algorithm) => {
    selectedAlgorithm.value = algorithm;
    resetAnimation();
    isAlgorithmDropdownOpen.value = false;
  };
  
  // 返回主页功能已由returnHome函数替代
  
  // 监听页面模式变化
  watch(pageMode, (newMode) => {
    resetAnimation();
    if (newMode === 'display' && selectedStructure.value) {
      // 在展示模式下，自动加载示例数据
      userInputData.value = '';
    }
  });
  
  // 监听数据结构变化
  watch(selectedStructure, (newStructure) => {
    if (newStructure && pageMode.value === 'display') {
      // 在展示模式下，自动加载示例数据
      userInputData.value = '';
    }
  });
  
  // 切换输入模式
  const toggleInputMode = (mode: string) => {
    inputMode.value = mode;
  };
  
  // 执行操作（增加、删除、遍历、查找）
  const performOperation = (operationType: string) => {
    if (!selectedStructure.value) return;
    
    // 使用从重构后的数据结构模块导入的函数
    const dataStructureOperations = getDataStructureOperations(selectedStructure.value.id);
    const { addElement, deleteElement, traverseOperation, searchElement } = dataStructureOperations;
    
    switch (operationType) {
      case 'add':
        // 创建一个模拟的MouseEvent对象，并传递默认元素值5
        addElement(new MouseEvent('click') as any, 5);
        break;
      case 'delete':
        // 创建一个模拟的MouseEvent对象，并传递默认元素值3
        deleteElement(new MouseEvent('click') as any, 3);
        break;
      case 'traverse':
        // 创建一个模拟的MouseEvent对象
        traverseOperation(new MouseEvent('click') as any);
        break;
      case 'search':
        // 创建一个模拟的MouseEvent对象，并传递默认元素值2
        searchElement(new MouseEvent('click') as any, 2);
        break;
    }
  };
  
  // 数据结构操作函数已迁移到DataStructureOperations.ts
  
  // 获取算法优化建议
  const getOptimizationSuggestion = (algorithmId: string): string => {
    // 根据算法ID返回优化建议
    switch (algorithmId) {
      case 'bubbleSort':
        return '可以通过添加标志位提前结束已排序部分的比较，减少不必要的迭代';
      case 'selectionSort':
        return '可以使用堆排序代替，将时间复杂度从O(n²)降低到O(n log n)';
      case 'insertionSort':
        return '对于小数据集效率较高，但对于大数据集可考虑使用归并或快速排序';
      case 'quickSort':
        return '可以优化基准元素的选择，如使用三数取中法，避免最坏情况';
      case 'mergeSort':
        return '可以在小规模子数组上使用插入排序，减少递归开销';
      case 'binarySearch':
        return '确保输入数组已排序，否则结果不可靠';
      default:
        return '根据具体应用场景选择合适的算法和数据结构';
    }
  };
  
  // 计算当前动画数据
  const currentAnimationData = computed(() => {
    if (currentStepIndex.value < animationSteps.value.length) {
      return animationSteps.value[currentStepIndex.value];
    }
    return null;
  });
  
  // 关闭所有下拉菜单
  const closeDropdowns = () => {
    isStructureDropdownOpen.value = false;
    isAlgorithmDropdownOpen.value = false;
  };
  
  // 组件挂载时添加点击事件监听器
  onMounted(() => {
    document.addEventListener('click', closeDropdowns);
  });
  
  // 组件卸载时移除点击事件监听器
  onUnmounted(() => {
    document.removeEventListener('click', closeDropdowns);
  });
  
  // 切换页面模式（展示模式/练习模式）
  const togglePageMode = (mode: string) => {
    pageMode.value = mode;
  };

  // 用户输入
  const userInput = ref('');

  // 下拉菜单状态（重命名以匹配组件中使用的变量名）
  const showDataStructureDropdown = computed(() => isStructureDropdownOpen.value);
  const showAlgorithmDropdown = computed(() => isAlgorithmDropdownOpen.value);

  // 切换数据结构下拉菜单
  const toggleDataStructureDropdown = (event: Event) => {
    event.stopPropagation();
    isStructureDropdownOpen.value = !isStructureDropdownOpen.value;
    isAlgorithmDropdownOpen.value = false;
  };

  // 切换算法下拉菜单
  const toggleAlgorithmDropdown = (event: Event) => {
    event.stopPropagation();
    isAlgorithmDropdownOpen.value = !isAlgorithmDropdownOpen.value;
    isStructureDropdownOpen.value = false;
  };

  // 当前选中的操作
  const selectedOperation = ref<{id: string; name: string} | null>(null);

  // 执行算法
  const executeAlgorithm = () => {
    if (!selectedStructure.value || !selectedAlgorithm.value) return;
    startAnimation();
  };

  // 返回主页函数已在组件中直接使用

  // 获取示例数据
  const getExampleData = () => {
    if (!selectedStructure.value) return '';
    return getDisplayModeData(selectedStructure.value.id);
  };

  // 使用示例数据
  const useExampleData = () => {
    if (!selectedStructure.value) return;
    const exampleData = getDisplayModeData(selectedStructure.value.id);
    
    // 根据数据结构类型格式化示例数据
    switch (selectedStructure.value.id) {
      case 'array':
        userInputData.value = exampleData.join(', ');
        break;
      case 'linkedList':
        userInputData.value = exampleData.join('->'); 
        break;
      case 'stack':
      case 'queue':
        userInputData.value = exampleData.join(', ');
        break;
      case 'tree':
        userInputData.value = exampleData.join(',');
        break;
      case 'graph':
        userInputData.value = exampleData.map((edge: any) => `${edge.from}-${edge.to}`).join(', ');
        break;
      case 'hashTable':
        userInputData.value = exampleData.map((item: any) => `${item.key}:${item.value}`).join(', ');
        break;
    }
  };

  // 提交代码
  const submitCode = () => {
    if (!userCode.value.trim()) {
      analysisResult.value = '请输入算法代码';
      return;
    }
    
    isLoading.value = true;
    
    // 模拟代码分析过程
    setTimeout(() => {
      try {
        // 这里应该有实际的代码分析逻辑
        const complexity = selectedAlgorithm.value?.complexity || { time: 'N/A', space: 'N/A' };
        const suggestion = selectedAlgorithm.value ? getOptimizationSuggestion(selectedAlgorithm.value.id) : 'N/A';
        
        analysisResult.value = `
代码分析结果：

算法: ${selectedAlgorithm.value?.name || 'N/A'}

时间复杂度: ${complexity.time}
空间复杂度: ${complexity.space}

优化建议: ${suggestion}
        `;
        
        // 启动动画展示
        startAnimation();
      } catch (error) {
        analysisResult.value = `分析错误: ${error instanceof Error ? error.message : String(error)}`;
      } finally {
        isLoading.value = false;
      }
    }, 1000);
  };

  // 动画数据
  const animationData = computed(() => {
    return animationElements.value;
  });

  // 动画步骤
  const animationStep = computed(() => {
    return currentStepIndex.value;
  });

  // 从DataStructureOperations获取数据结构操作函数
  const dataStructureOps = getDataStructureOperations(
    selectedStructure.value?.id || 'array'
  );
  
  // 创建适配器函数，将事件处理函数转换为接受MouseEvent的函数
  const addElement = (data: any[] | string | MouseEvent, elementValue?: any) => {
    let actualData: any[] | string;
    let element: any;
    
    // 检查第一个参数是否为MouseEvent
    if (data instanceof MouseEvent) {
      // 如果是MouseEvent，则从parseUserInput获取数据
      actualData = parseUserInput();
      // 从第二个参数或用户输入获取元素值
      element = elementValue !== undefined ? elementValue : parseInt(prompt('请输入要添加的元素值', '5') || '5');
    } else {
      // 如果不是MouseEvent，则第一个参数就是数据，第二个参数是元素
      actualData = data;
      element = elementValue;
    }
    
    // 执行添加操作并更新动画元素
    const newElements = dataStructureOps.addElement(actualData as any, element);
    // 更新动画元素
    animationElements.value = newElements;
    return newElements;
  };
  
  const deleteElement = (data: any[] | string | MouseEvent, elementValue?: any) => {
    let actualData: any[] | string;
    let element: any;
    
    // 检查第一个参数是否为MouseEvent
    if (data instanceof MouseEvent) {
      // 如果是MouseEvent，则从parseUserInput获取数据
      actualData = parseUserInput();
      // 从第二个参数或用户输入获取元素值
      element = elementValue !== undefined ? elementValue : parseInt(prompt('请输入要删除的元素值', '3') || '3');
    } else {
      // 如果不是MouseEvent，则第一个参数就是数据，第二个参数是元素
      actualData = data;
      element = elementValue;
    }
    
    // 执行删除操作并更新动画元素
    const newElements = dataStructureOps.deleteElement(actualData as any, element);
    // 更新动画元素
    animationElements.value = newElements;
    return newElements;
  };
  
  const traverseOperation = (data: any[] | string | MouseEvent, dummy?: any) => {
    let actualData: any[] | string;
    
    // 检查第一个参数是否为MouseEvent
    if (data instanceof MouseEvent) {
      // 如果是MouseEvent，则从parseUserInput获取数据
      actualData = parseUserInput();
    } else {
      // 如果不是MouseEvent，则第一个参数就是数据
      actualData = data;
    }
    
    // 执行遍历操作并更新动画元素
    const newElements = dataStructureOps.traverseOperation(actualData as any);
    // 更新动画元素
    animationElements.value = newElements;
    return newElements;
  };
  
  const searchElement = (data: any[] | string | MouseEvent, elementValue?: any) => {
    let actualData: any[] | string;
    let element: any;
    
    // 检查第一个参数是否为MouseEvent
    if (data instanceof MouseEvent) {
      // 如果是MouseEvent，则从parseUserInput获取数据
      actualData = parseUserInput();
      // 从第二个参数或用户输入获取元素值
      element = elementValue !== undefined ? elementValue : parseInt(prompt('请输入要搜索的元素值', '2') || '2');
    } else {
      // 如果不是MouseEvent，则第一个参数就是数据，第二个参数是元素
      actualData = data;
      element = elementValue;
    }
    
    // 执行搜索操作并更新动画元素
    const newElements = dataStructureOps.searchElement(actualData as any, element);
    // 更新动画元素
    animationElements.value = newElements;
    return newElements;
  };

  return {
    // 数据结构和算法
    dataStructures,
    algorithmCategories,
    selectedStructure,
    selectedCategory,
    selectedAlgorithm,
    algorithms,
    getAlgorithmsByCategory,
    currentCategoryAlgorithms,
    
    // 用户输入和分析
    userInput,
    userCode,
    analysisResult,
    userInputData,
    parseUserInput,
    
    // 动画控制
    isAnimating,
    isPaused,
    animationSpeed,
    animationStep,
    totalSteps,
    animationElements,
    currentAnimationData,
    animationSteps,
    animationData,
    
    // 页面状态
    pageMode,
    inputMode,
    isLoading,
    showDataStructureDropdown,
    showAlgorithmDropdown,
    
    // 方法
    selectDataStructure,
    selectAlgorithm,
    selectCategory: (categoryId: string) => { selectedCategory.value = categoryId; },
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    setAnimationSpeed,
    returnHome: () => {
      router.push('/');
    },
    toggleInputMode,
    togglePageMode,
    performOperation,
    getComplexity: (algorithm: Algorithm | null) => {
      return algorithm?.complexity || { time: 'N/A', space: 'N/A' };
    },
    getOptimizationSuggestion,
    getStructureComplexityFactor: (dataStructure: string) => {
      // 返回不同数据结构的复杂度因子
      const factors: Record<string, number> = {
        array: 1,
        linkedList: 1.2,
        stack: 1.1,
        queue: 1.1,
        tree: 1.5,
        graph: 2
      };
      return factors[dataStructure] || 1;
    },
    closeDropdowns,
    toggleDataStructureDropdown,
    toggleAlgorithmDropdown,
    selectedOperation,
    executeAlgorithm,
    getExampleData,
    useExampleData,
    submitCode,
    // 数据结构操作函数
    addElement,
    deleteElement,
    traverseOperation,
    searchElement
  };
}