<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import AlgorithmAnimation from './AlgorithmAnimation.vue';

// 数据结构类型
const dataStructures = ref([
  { id: 'array', name: '数组', icon: '📊' },
  { id: 'linkedList', name: '链表', icon: '🔗' },
  { id: 'tree', name: '树', icon: '🌳' },
  { id: 'graph', name: '图', icon: '🕸️' },
  { id: 'stack', name: '栈', icon: '📚' },
  { id: 'queue', name: '队列', icon: '🚶' },
  { id: 'hashTable', name: '哈希表', icon: '🔍' }
]);

// 当前选中的数据结构 - 确保初始状态下有选中的按钮
const selectedStructure = ref(dataStructures.value[0]);

// 页面模式：展示(display)或练习(practice)
const pageMode = ref('display');

// 算法类型
const algorithms = ref([
  // 比较类排序算法
  { id: 'bubbleSort', name: '冒泡排序', category: 'sort', description: '相邻元素比较交换', complexity: 'O(n²)' },
  { id: 'quickSort', name: '快速排序', category: 'sort', description: '分治法排序', complexity: 'O(n log n)' },
  { id: 'mergeSort', name: '归并排序', category: 'sort', description: '分治法合并排序', complexity: 'O(n log n)' },
  { id: 'heapSort', name: '堆排序', category: 'sort', description: '利用堆数据结构排序', complexity: 'O(n log n)' },
  // 非比较类排序
  { id: 'countingSort', name: '计数排序', category: 'sort', description: '统计元素出现次数', complexity: 'O(n+k)' },
  { id: 'radixSort', name: '基数排序', category: 'sort', description: '按位排序', complexity: 'O(nk)' },
  
  // 查找算法
  { id: 'linearSearch', name: '线性查找', category: 'search', description: '顺序查找元素', complexity: 'O(n)' },
  { id: 'binarySearch', name: '二分查找', category: 'search', description: '在有序数组中查找元素', complexity: 'O(log n)' },
  { id: 'hashSearch', name: '哈希查找', category: 'search', description: '利用哈希表查找', complexity: 'O(1)' },
  { id: 'treeSearch', name: '树查找', category: 'search', description: '在树结构中查找', complexity: 'O(h)' },
  
  // 遍历算法
  { id: 'traverse', name: '线性遍历', category: 'traverse', description: '按顺序访问每个元素', complexity: 'O(n)' },
  { id: 'treeTraverse', name: '树遍历', category: 'traverse', description: '遍历树的所有节点', complexity: 'O(n)' },
  { id: 'dfs', name: '深度优先(DFS)', category: 'traverse', description: '深度优先遍历图或树', complexity: 'O(V+E)' },
  { id: 'bfs', name: '广度优先(BFS)', category: 'traverse', description: '广度优先遍历图或树', complexity: 'O(V+E)' },
]);

// 算法分类
const algorithmCategories = [
  { id: 'sort', name: '排序算法' },
  { id: 'search', name: '查找算法' },
  { id: 'traverse', name: '遍历算法' },
];

const selectedCategory = ref('sort');
// 定义算法类型接口
interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: string;
}

// 当前选中的算法 - 初始状态下设为空，确保只有数据结构有选中按钮
const selectedAlgorithm = ref<Algorithm>({ id: '', name: '', category: '', description: '', complexity: '' });

// 根据分类获取算法
const getAlgorithmsByCategory = (category: string) => {
  return algorithms.value.filter(algo => algo.category === category);
};

// 当前分类下的算法
const currentCategoryAlgorithms = computed<Algorithm[]>(() => {
  return getAlgorithmsByCategory(selectedCategory.value);
});

// 执行算法并生成动画步骤
const executeAlgorithm = () => {
  // 重置动画步骤
  animationSteps.splice(0, animationSteps.length);
  
  // 根据选择的算法和数据结构执行相应的算法
  const algorithmId = selectedAlgorithm.value.id;
  const structureId = selectedStructure.value.id;
  const data = [...(animationData[structureId] || [])] as any[];
  
  // 这里可以根据算法类型执行不同的算法
  // 实际实现会根据具体算法添加代码
};

// 默认操作类型
const selectedOperation = ref<Algorithm>({ 
  id: 'traverse', 
  name: '遍历', 
  description: '按顺序访问每个元素',
  category: 'traverse',
  complexity: 'O(n)'
});

// 用户代码输入
const userCode = ref('');

// 分析结果
const analysisResult = ref('');

// 用户输入数据
const userInput = ref('');

// 动画状态
const isAnimating = ref(false);
const animationSpeed = ref(1); // 动画速度，默认为1倍速
const animationStep = ref(0); // 当前动画步骤
const totalSteps = ref(0); // 总步骤数

// 输入模式：固定为code(程序输入)
const inputMode = ref('code');

// 是否正在加载
const isLoading = ref(false);

// 下拉菜单状态 - 初始状态设为展开
const showDataStructureDropdown = ref(true);
const showAlgorithmDropdown = ref(true);

// 切换数据结构下拉菜单
const toggleDataStructureDropdown = () => {
  showDataStructureDropdown.value = !showDataStructureDropdown.value;
  // 不再关闭另一个下拉菜单，允许同时展开
};

// 切换算法下拉菜单
const toggleAlgorithmDropdown = () => {
  showAlgorithmDropdown.value = !showAlgorithmDropdown.value;
  // 不再关闭另一个下拉菜单，允许同时展开
};

// 定义动画数据类型
interface AnimationDataType {
  array: any[];
  linkedList: any[];
  tree: any[];
  graph: any[];
  stack: any[];
  queue: any[];
  hashTable: any[];
  heap: any[];
  [key: string]: any[];
}

// 动画元素数据
const animationData = reactive<AnimationDataType>({
  array: [],
  linkedList: [],
  tree: [],
  graph: [],
  stack: [],
  queue: [],
  hashTable: [],
  heap: []
});

// 动画步骤数据
const animationSteps = reactive<any[]>([]);

// 解析用户输入
const parseUserInput = () => {
  try {
    // 根据不同的数据结构类型解析输入
    switch (selectedStructure.value.id) {
      case 'array':
        // 解析数组输入，例如：1,2,3,4,5
        animationData.array = userInput.value.split(',').map(item => item.trim()).filter(item => item !== '').map(item => parseInt(item) || item);
        break;
      case 'linkedList':
        // 解析链表输入
        animationData.linkedList = userInput.value.split('->').map(item => item.trim()).filter(item => item !== '').map(item => parseInt(item) || item);
        break;
      case 'tree':
        // 简单解析树输入，例如：1,2,3,4,5,null,6
        const treeNodes: (number | string | null)[] = userInput.value.split(',').map(item => item.trim()).map(item => item === 'null' ? null : (parseInt(item) || item));
        animationData.tree = buildTree(treeNodes);
        break;
      case 'graph':
        // 解析图输入，例如：A-B,B-C,A-C
        const edges: string[] = userInput.value.split(',').map(item => item.trim()).filter(item => item !== '');
        animationData.graph = buildGraph(edges);
        break;
      // 其他数据结构的解析...
      default:
        // 默认按数组处理
        animationData.array = userInput.value.split(',').map(item => item.trim()).filter(item => item !== '').map(item => parseInt(item) || item);
    }
    return true;
  } catch (error: any) {
    console.error('解析输入失败:', error);
    return false;
  }
};

// 构建树结构
const buildTree = (nodes: (number | string | null)[]) => {
  if (!nodes.length) return null;
  
  // 简单的树构建逻辑
  const tree: any[] = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === null) {
      tree.push(null);
    } else {
      tree.push({
        value: nodes[i],
        left: 2 * i + 1 < nodes.length ? 2 * i + 1 : null,
        right: 2 * i + 2 < nodes.length ? 2 * i + 2 : null
      });
    }
  }
  
  // 连接节点
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] !== null) {
      tree[i].left = tree[i].left !== null ? tree[tree[i].left] : null;
      tree[i].right = tree[i].right !== null ? tree[tree[i].right] : null;
    }
  }
  
  return tree[0]; // 返回根节点
};

// 构建图结构
const buildGraph = (edges: string[]) => {
  const graphObj: Record<string, string[]> = {};
  
  edges.forEach(edge => {
    const [from, to] = edge.split('-');
    if (!graphObj[from]) graphObj[from] = [];
    if (!graphObj[to]) graphObj[to] = [];
    
    graphObj[from].push(to);
    graphObj[to].push(from); // 无向图
  });
  
  // 将图对象转换为数组格式，以便与其他数据结构保持一致
  return Object.entries(graphObj).map(([node, edges]) => ({ node, edges }));
};

// 获取展示模式的默认数据
const getDisplayModeData = () => {
  switch (selectedStructure.value.id) {
    case 'array':
      return [1, 3, 5, 7, 9, 2, 4, 6, 8];
    case 'linkedList':
      return [1, 3, 5, 7, 9, 2, 4, 6, 8];
    case 'tree':
      return buildTree([1, 2, 3, 4, 5, null, 6, null, null, 7, 8]);
    case 'graph':
      // 将图数据转换为数组格式，以便与其他数据结构保持一致
      return buildGraph(['A-B', 'B-C', 'C-D', 'A-D', 'B-D']);
    case 'stack':
      return [1, 3, 5, 7, 9];
    case 'queue':
      return [1, 3, 5, 7, 9];
    case 'hashTable':
      return Object.entries({ a: 1, b: 3, c: 5, d: 7, e: 9 }).map(([key, value]) => ({ key, value }));
    default:
      return [];
  }
};

// 开始动画
const startAnimation = async () => {
  // 展示模式下使用默认数据
  if (pageMode.value === 'display') {
    isAnimating.value = true;
    animationStep.value = 0;
    
    // 获取展示模式的默认数据
    const displayData = getDisplayModeData();
    
    // 根据数据结构类型和算法类型设置总步骤数
    switch (selectedStructure.value.id) {
      case 'array':
        animationData.array = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, 'array', displayData.length);
        break;
      case 'linkedList':
        animationData.linkedList = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, 'linkedList', displayData.length);
        break;
      case 'tree':
        animationData.tree = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, 'tree');
        break;
      case 'graph':
        animationData.graph = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, 'graph');
        break;
      case 'stack':
      case 'queue':
        animationData[selectedStructure.value.id] = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, selectedStructure.value.id, displayData.length);
        break;
      case 'hashTable':
        animationData.hashTable = displayData;
        totalSteps.value = calculateStepsForAlgorithm(selectedAlgorithm.value.id, 'hashTable');
        break;
      default:
        totalSteps.value = 10;
    }
    
    // 开始动画循环
    animateStep();
  } else {
    // 发送代码到后端进行分析和执行
    try {
      isLoading.value = true;
      // 这里模拟后端API调用，实际项目中应替换为真实API
      // const response = await axios.post('/api/algorithm/analyze', {
      //   code: userCode.value,
      //   dataStructure: selectedStructure.value.id,
      //   algorithm: selectedAlgorithm.value.id,
      //   operation: selectedOperation.value.id
      // });
      
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        data: {
          result: `代码分析结果：\n- 时间复杂度: ${getComplexity(selectedAlgorithm.value.id)}\n- 空间复杂度: ${getSpaceComplexity(selectedAlgorithm.value.id)}\n- 算法类型: ${selectedAlgorithm.value.name}\n- 优化建议: ${getOptimizationSuggestion(selectedAlgorithm.value.id)}`,
          animationData: Array.isArray(animationData[selectedStructure.value.id]) ? 
            animationData[selectedStructure.value.id] : 
            [1, 2, 3, 4, 5],
          steps: calculateStepsForAlgorithm(selectedAlgorithm.value.id, selectedStructure.value.id)
        }
      };
      
      // 更新分析结果和动画数据
      analysisResult.value = mockResponse.data.result;
      animationData[selectedStructure.value.id] = mockResponse.data.animationData;
      totalSteps.value = mockResponse.data.steps;
      
      // 开始动画
      isAnimating.value = true;
      animationStep.value = 0;
      animateStep();
    } catch (error) {
      console.error('代码分析失败:', error);
      analysisResult.value = '代码分析失败，请检查您的代码或稍后再试。';
    } finally {
      isLoading.value = false;
    }
  }
};

// 计算特定算法的步骤数
const calculateStepsForAlgorithm = (algorithmId: string, structureId: string, dataLength: number = 10): number => {
  switch (algorithmId) {
    case 'traverse':
      return dataLength;
    case 'search':
      return Math.min(dataLength, Math.ceil(dataLength / 2));
    case 'binarySearch':
      return Math.ceil(Math.log2(dataLength)) + 1;
    case 'sort':
      return dataLength * Math.ceil(Math.log2(dataLength));
    case 'insert':
    case 'delete':
      return Math.ceil(dataLength / 2) + 2;
    case 'dfs':
    case 'bfs':
      return structureId === 'tree' || structureId === 'graph' ? dataLength * 2 : dataLength;
    default:
      return dataLength;
  }
};

// 获取算法的时间复杂度
const getComplexity = (algorithmId: string): string => {
  switch (algorithmId) {
    case 'traverse':
      return 'O(n)';
    case 'search':
      return 'O(n)';
    case 'binarySearch':
      return 'O(log n)';
    case 'sort':
      return 'O(n log n)';
    case 'insert':
    case 'delete':
      return 'O(n)';
    case 'dfs':
    case 'bfs':
      return 'O(V + E)';
    default:
      return 'O(n)';
  }
};

// 获取算法的空间复杂度
const getSpaceComplexity = (algorithmId: string): string => {
  switch (algorithmId) {
    case 'traverse':
      return 'O(1)';
    case 'search':
      return 'O(1)';
    case 'binarySearch':
      return 'O(1)';
    case 'sort':
      return 'O(n)';
    case 'insert':
    case 'delete':
      return 'O(1)';
    case 'dfs':
      return 'O(h)';
    case 'bfs':
      return 'O(w)';
    default:
      return 'O(1)';
  }
};

// 获取算法的优化建议
const getOptimizationSuggestion = (algorithmId: string): string => {
  switch (algorithmId) {
    case 'traverse':
      return '可以使用迭代器模式优化遍历过程';
    case 'search':
      return '对于有序数据，可以使用二分查找提高效率';
    case 'binarySearch':
      return '确保数据已排序，可以考虑插值查找进一步优化';
    case 'sort':
      return '对于小数据集可以使用插入排序，大数据集考虑快速排序或归并排序';
    case 'insert':
    case 'delete':
      return '使用适当的数据结构如链表或动态数组可以提高效率';
    case 'dfs':
      return '可以使用迭代方式代替递归减少栈空间使用';
    case 'bfs':
      return '使用双端队列可以优化某些场景下的性能';
    default:
      return '根据具体场景选择合适的算法和数据结构';
  }
};

// 动画单步执行
const animateStep = () => {
  if (animationStep.value < totalSteps.value) {
    // 根据当前步骤更新动画状态
    // 这里可以根据不同的数据结构和算法类型实现不同的动画效果
    
    // 计算精确的动画延迟时间
    const baseDelay = 1000; // 基础延迟时间（毫秒）
    const algorithmFactor = getAlgorithmTimeFactor(selectedAlgorithm.value.id);
    const structureFactor = getStructureComplexityFactor(selectedStructure.value.id);
    
    // 综合考虑算法类型、数据结构和用户设置的速度
    const delay = baseDelay * algorithmFactor * structureFactor / animationSpeed.value;
    
    setTimeout(() => {
      animationStep.value++;
      animateStep();
    }, delay);
  } else {
    // 动画完成
    isAnimating.value = false;
  }
};

// 获取算法时间因子
const getAlgorithmTimeFactor = (algorithmId: string): number => {
  switch (algorithmId) {
    case 'traverse':
      return 0.8; // 遍历算法相对较快
    case 'search':
      return 0.9;
    case 'binarySearch':
      return 0.7; // 二分查找较快
    case 'sort':
      return 1.2; // 排序算法相对较慢
    case 'insert':
    case 'delete':
      return 1.0;
    case 'dfs':
      return 1.1;
    case 'bfs':
      return 1.0;
    default:
      return 1.0;
  }
};

// 获取数据结构复杂度因子
const getStructureComplexityFactor = (structureId: string): number => {
  switch (structureId) {
    case 'array':
      return 0.8; // 数组操作相对简单
    case 'linkedList':
      return 1.0;
    case 'tree':
      return 1.2; // 树结构相对复杂
    case 'graph':
      return 1.5; // 图结构最复杂
    case 'stack':
    case 'queue':
      return 0.9;
    case 'hashTable':
      return 1.1;
    default:
      return 1.0;
  }
};

// 暂停动画
const pauseAnimation = () => {
  isAnimating.value = false;
};

// 继续动画
const resumeAnimation = () => {
  if (!isAnimating.value && animationStep.value < totalSteps.value) {
    isAnimating.value = true;
    animateStep();
  }
};

// 重置动画
const resetAnimation = () => {
  isAnimating.value = false;
  animationStep.value = 0;
};

// 调整动画速度
const setAnimationSpeed = (speed: number) => {
  animationSpeed.value = speed;
};

// 选择数据结构
const selectDataStructure = (structure: { id: string; name: string; icon: string; }) => {
  // 直接设置id值，而不是替换整个对象，这样不会改变选项的顺序
  selectedStructure.value = { id: structure.id, name: structure.name, icon: structure.icon };
  resetAnimation();
  
  // 确保只有一个选择按钮高亮 - 清除算法选择
  // 将算法选择设为空对象，确保只有数据结构按钮高亮
  selectedAlgorithm.value = { id: '', name: '', category: '', description: '', complexity: '' };
  
  // 不关闭下拉菜单，允许同时展开
  
  // 如果是展示模式，自动加载默认数据
  if (pageMode.value === 'display') {
    // 重置动画状态
    animationStep.value = 0;
    totalSteps.value = 0;
    isAnimating.value = false;
    
    // 清空当前动画数据
    animationData[selectedStructure.value.id] = [];
  }
  
  // 重置分析结果
  analysisResult.value = '';
};

// 选择算法
const selectAlgorithm = (algorithm: Algorithm) => {
  // 创建新对象而不是直接引用，避免改变原始数组中的顺序
  selectedAlgorithm.value = { 
    id: algorithm.id, 
    name: algorithm.name, 
    category: algorithm.category, 
    description: algorithm.description, 
    complexity: algorithm.complexity 
  };
  resetAnimation();
  
  // 确保只有一个选择按钮高亮 - 清除数据结构选择
  // 将数据结构选择设为空对象，确保只有算法按钮高亮
  selectedStructure.value = { id: '', name: '', icon: '' };
  
  // 不关闭数据结构下拉菜单，允许同时展开
  
  // 重置分析结果
  analysisResult.value = '';
};

// 返回主页
const returnToHome = () => {
  // 实现返回主页的逻辑
  window.location.href = '/';
};

// 监听页面模式变化
watch(pageMode, (newMode) => {
  resetAnimation();
  
  // 如果切换到展示模式，自动加载默认数据
  if (newMode === 'display') {
    // 清空用户输入和代码
    userInput.value = '';
    userCode.value = '';
    analysisResult.value = '';
  }
});

// 监听数据结构变化，在展示模式下自动更新数据
watch(selectedStructure, (newStructure) => {
  if (pageMode.value === 'display') {
    resetAnimation();
  }
});

// 注意：操作类型选择已移除，使用默认的遍历操作

// 输入模式已固定为程序输入，不再需要切换
// 保留此函数以兼容现有代码，但已简化逻辑
const toggleInputMode = (mode: string) => {
  // 输入模式已固定为'code'，忽略切换请求
  resetAnimation();
  analysisResult.value = '';
};

// 执行操作
const performOperation = (operationType: string) => {
  // 根据操作类型设置当前选中的操作
  const foundOperation = algorithms.value.find(algo => algo.id === operationType);
  selectedOperation.value = foundOperation || selectedOperation.value;
  
  // 根据当前算法分类自动调整操作类型
  if (selectedAlgorithm.value && selectedAlgorithm.value.category) {
    // 确保操作类型与算法分类一致
    switch (selectedAlgorithm.value.category) {
      case 'sort':
        // 对于排序算法，使用排序操作
        const sortOperation = algorithms.value.find(algo => algo.id === 'bubbleSort');
        if (sortOperation) selectedOperation.value = sortOperation;
        break;
      case 'search':
        // 对于查找算法，使用查找操作
        const searchOperation = algorithms.value.find(algo => algo.id === 'linearSearch');
        if (searchOperation) selectedOperation.value = searchOperation;
        break;
      case 'traverse':
        // 对于遍历算法，使用遍历操作
        const traverseOperation = algorithms.value.find(algo => algo.id === 'traverse');
        if (traverseOperation) selectedOperation.value = traverseOperation;
        break;
    }
  }
  
  // 如果有用户输入数据，则解析并开始动画
  if (inputMode.value === 'custom' && userInput.value) {
    if (parseUserInput()) {
      startAnimation();
    }
  } else if (inputMode.value === 'code' && userCode.value) {
    startAnimation();
  } else {
    // 提示用户输入数据
    alert('请先输入数据');
  }
};

// 添加元素操作
const addElement = () => {
  // 根据当前选择的数据结构类型添加元素
  const structureId = selectedStructure.value.id;
  
  // 生成一个随机值（1-100之间）
  const newValue = Math.floor(Math.random() * 100) + 1;
  
  switch (structureId) {
    case 'array':
      // 向数组末尾添加元素
      animationData.array.push(newValue);
      break;
    case 'linkedList':
      // 向链表末尾添加元素
      animationData.linkedList.push(newValue);
      break;
    case 'stack':
      // 向栈顶添加元素
      animationData.stack.push(newValue);
      break;
    case 'queue':
      // 向队列末尾添加元素
      animationData.queue.push(newValue);
      break;
    case 'tree':
      // 向树添加元素（简化处理，实际应该按照树的规则添加）
      if (!animationData.tree.length) {
        animationData.tree = [{ value: newValue, left: null, right: null }];
      } else {
        // 简单地添加到第一个可用位置
        const insertNode = (node: any) => {
          if (!node.left) {
            node.left = { value: newValue, left: null, right: null };
            return true;
          } else if (!node.right) {
            node.right = { value: newValue, left: null, right: null };
            return true;
          } else {
            return insertNode(node.left) || insertNode(node.right);
          }
        };
        insertNode(animationData.tree[0]);
      }
      break;
    case 'hashTable':
      // 向哈希表添加元素
      const key = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z的随机字母
      animationData.hashTable.push({ key, value: newValue });
      break;
    case 'graph':
      // 向图添加节点（简化处理）
      const nodeId = String.fromCharCode(65 + animationData.graph.length % 26); // A-Z的字母
      animationData.graph.push({ id: nodeId, connections: [] });
      break;
  }
  
  // 重置动画状态并开始新的动画
  resetAnimation();
  startAnimation();
};

// 删除元素操作
const deleteElement = () => {
  // 根据当前选择的数据结构类型删除元素
  const structureId = selectedStructure.value.id;
  
  switch (structureId) {
    case 'array':
      // 从数组末尾删除元素
      if (animationData.array.length > 0) {
        animationData.array.pop();
      }
      break;
    case 'linkedList':
      // 从链表末尾删除元素
      if (animationData.linkedList.length > 0) {
        animationData.linkedList.pop();
      }
      break;
    case 'stack':
      // 从栈顶删除元素
      if (animationData.stack.length > 0) {
        animationData.stack.pop();
      }
      break;
    case 'queue':
      // 从队列头部删除元素
      if (animationData.queue.length > 0) {
        animationData.queue.shift();
      }
      break;
    case 'tree':
      // 从树删除元素（简化处理，实际应该按照树的规则删除）
      if (animationData.tree.length > 0) {
        // 简单地删除最后添加的节点
        const removeLastNode = (node: any) => {
          if (node.right && (node.right.left || node.right.right)) {
            return removeLastNode(node.right);
          } else if (node.left && (node.left.left || node.left.right)) {
            return removeLastNode(node.left);
          } else if (node.right) {
            node.right = null;
            return true;
          } else if (node.left) {
            node.left = null;
            return true;
          }
          return false;
        };
        
        if (animationData.tree[0]) {
          if (!removeLastNode(animationData.tree[0])) {
            animationData.tree = [];
          }
        }
      }
      break;
    case 'hashTable':
      // 从哈希表删除元素
      if (animationData.hashTable.length > 0) {
        animationData.hashTable.pop();
      }
      break;
    case 'graph':
      // 从图删除节点（简化处理）
      if (animationData.graph.length > 0) {
        animationData.graph.pop();
      }
      break;
  }
  
  // 重置动画状态并开始新的动画
  resetAnimation();
  startAnimation();
};

// 遍历数据结构
const traverseStructure = () => {
  // 设置操作类型为遍历
  const traverseOperation = algorithms.value.find(algo => algo.id === 'traverse');
  if (traverseOperation) {
    selectedOperation.value = traverseOperation;
  }
  
  // 开始遍历动画
  resetAnimation();
  startAnimation();
};

// 查找元素
const searchElement = () => {
  // 设置操作类型为查找
  const searchOperation = algorithms.value.find(algo => algo.id === 'linearSearch');
  if (searchOperation) {
    selectedOperation.value = searchOperation;
  }
  
  // 生成一个随机值作为查找目标
  const structureId = selectedStructure.value.id;
  let targetValue;
  
  switch (structureId) {
    case 'array':
      if (animationData.array.length > 0) {
        // 随机选择数组中的一个元素作为查找目标
        const randomIndex = Math.floor(Math.random() * animationData.array.length);
        targetValue = animationData.array[randomIndex];
      }
      break;
    case 'linkedList':
      if (animationData.linkedList.length > 0) {
        // 随机选择链表中的一个元素作为查找目标
        const randomIndex = Math.floor(Math.random() * animationData.linkedList.length);
        targetValue = animationData.linkedList[randomIndex];
      }
      break;
    // 其他数据结构类似处理...
    default:
      // 默认生成一个1-100之间的随机值
      targetValue = Math.floor(Math.random() * 100) + 1;
  }
  
  // 设置查找目标并开始动画
  if (targetValue !== undefined) {
    // 这里可以设置查找目标到某个状态变量中
    // 例如: searchTarget.value = targetValue;
    
    // 开始查找动画
    resetAnimation();
    startAnimation();
  }
};

// 获取当前数据结构的动画数据
const currentAnimationData = computed((): any[] => {
  return animationData[selectedStructure.value.id] || [];
});

// 点击页面其他区域关闭下拉菜单
const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  
  // 检查点击的元素是否在下拉菜单内
  if (!target.closest('.dropdown-container')) {
    showDataStructureDropdown.value = false;
    showAlgorithmDropdown.value = false;
  }
};

// 组件挂载时的初始化
onMounted(() => {
  // 添加全局点击事件监听器
  document.addEventListener('click', closeDropdowns);
});

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<template>
  <div class="algorithm-practice">
    <div class="page-header">
      <h1 class="practice-title">算法练习</h1>
      <button class="return-home-btn" @click="returnToHome">
        <i class="fas fa-home"></i> 返回主页
      </button>
    </div>
    
    <div class="layout-container">
      <!-- 左侧控制面板 - 减小宽度 -->
      <div class="control-sidebar">
        <!-- 导航栏 - 数据结构 -->
        <div class="sidebar-section">
          <h3 class="section-subtitle">数据结构</h3>
          <div class="dropdown-container data-structure-dropdown">
            <button class="dropdown-btn" @click.stop="toggleDataStructureDropdown">
              <span class="structure-name">{{ selectedStructure.name || '请选择数据结构' }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-content" v-if="showDataStructureDropdown">
              <button 
                v-for="structure in dataStructures" 
                :key="structure.id"
                class="structure-btn" 
                :class="{ active: selectedStructure.id === structure.id }"
                @click.stop="selectDataStructure(structure)"
              >
                <span class="structure-icon">{{ structure.icon }}</span>
                <span class="structure-name">{{ structure.name }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 算法 -->
        <div class="sidebar-section">
          <h3 class="section-subtitle">算法</h3>
          <div class="dropdown-container algorithm-dropdown">
            <button class="dropdown-btn" @click.stop="toggleAlgorithmDropdown">
              <span class="algorithm-name">{{ selectedAlgorithm.name || '请选择算法' }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-content" v-if="showAlgorithmDropdown">
              <!-- 算法分类选项 -->
              <div class="category-selector">
                <button 
                  v-for="category in algorithmCategories" 
                  :key="category.id"
                  class="category-btn"
                  :class="{ active: selectedCategory === category.id }"
                  @click.stop="selectedCategory = category.id"
                >
                  {{ category.name }}
                </button>
              </div>
              
              <!-- 算法列表 -->
              <div class="algorithm-list">
                <div 
                  v-for="algorithm in currentCategoryAlgorithms" 
                  :key="algorithm.id"
                  class="algorithm-card"
                  :class="{ active: selectedAlgorithm.id === algorithm.id }"
                  @click.stop="selectAlgorithm(algorithm)"
                >
                  <div class="algorithm-name">{{ algorithm.name }}</div>
                  <div class="algorithm-complexity">{{ algorithm.complexity }}</div>
                  <div class="algorithm-desc">{{ algorithm.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 侧边栏中的返回主页按钮已移除 -->
        
        <!-- 侧边栏中的输入方式和操作按钮已移除 -->
        
        <!-- 侧边栏中的练习模式内容已移除 -->
      </div>
      
      <!-- 右侧动画展示区域 - 作为页面核心 -->
      <div class="animation-main-container">
        <div class="animation-header">
          <h2 class="section-title">{{ pageMode === 'display' ? '算法演示' : '算法练习' }}</h2>
          
          <!-- 页面模式切换 -->
          <div class="mode-toggle">
            <button 
              class="mode-btn" 
              :class="{ active: pageMode === 'display' }"
              @click="pageMode = 'display'"
            >
              <span class="mode-icon">👁️</span>
              <span class="mode-name">展示模式</span>
            </button>
            <button 
              class="mode-btn" 
              :class="{ active: pageMode === 'practice' }"
              @click="pageMode = 'practice'"
            >
              <span class="mode-icon">✏️</span>
              <span class="mode-name">练习模式</span>
            </button>
          </div>
        </div>
        
        <!-- 动画控制按钮 -->
        <div class="animation-controls">
          <!-- 展示模式下的控制按钮 -->
          <template v-if="pageMode === 'display'">
            <!-- 动画控制按钮 -->
            <div class="animation-control-group">
              <button 
                class="control-btn start-btn" 
                @click="startAnimation" 
                :disabled="isAnimating || isLoading"
              >
                {{ isLoading ? '处理中...' : '开始演示' }}
              </button>
              <button 
                class="control-btn resume-btn" 
                @click="resumeAnimation" 
                :disabled="isAnimating || animationStep === 0 || animationStep === totalSteps"
              >
                继续
              </button>
              <button 
                class="control-btn reset-btn" 
                @click="resetAnimation" 
                :disabled="animationStep === 0"
              >
                重置
              </button>
            </div>
            
            <!-- 数据结构操作按钮 -->
            <div class="data-operation-group">
              <h4 class="operation-title">数据操作</h4>
              <div class="operation-buttons">
                <button 
                  class="operation-btn add-btn" 
                  @click="addElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">➕</span>
                  <span class="operation-name">增加</span>
                </button>
                <button 
                  class="operation-btn delete-btn" 
                  @click="deleteElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">➖</span>
                  <span class="operation-name">删除</span>
                </button>
                <button 
                  class="operation-btn traverse-btn" 
                  @click="traverseStructure"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">🔄</span>
                  <span class="operation-name">遍历</span>
                </button>
                <button 
                  class="operation-btn search-btn" 
                  @click="searchElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">🔍</span>
                  <span class="operation-name">查找</span>
                </button>
              </div>
            </div>
          </template>
          
          <!-- 练习模式下不需要控制按钮 -->
          <template v-else>
            <!-- 控制按钮已移除 -->
          </template>
        </div>
        
        <!-- 进度指示器 -->
        <div class="animation-progress" v-if="totalSteps > 0">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(animationStep / totalSteps) * 100}%` }"
            ></div>
          </div>
          <div class="step-indicator">
            步骤: {{ animationStep }} / {{ totalSteps }}
          </div>
        </div>
        
        <!-- 练习模式功能区 -->
        <div class="practice-features" v-if="pageMode === 'practice'">
          <!-- 输入方式已设置为程序输入 -->
          
          <!-- 操作按钮已移除 -->
          
          <!-- 数据输入区域 -->
          <div class="feature-section">
            <div>
              <h3 class="section-subtitle">{{ selectedStructure.name }} 算法代码输入</h3>
              <div class="input-guide">
                请输入您的{{ selectedOperation.name }}算法代码，系统将分析并展示动画效果
              </div>
              
              <div class="input-container">
                <textarea 
                  v-model="userCode" 
                  class="code-input" 
                  placeholder="请输入您的算法代码..."
                  :disabled="isAnimating"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- 分析结果区域 -->
          <div class="feature-section">
            <h3 class="section-subtitle">分析结果</h3>
            <div class="analysis-content" v-if="analysisResult">
              <pre>{{ analysisResult }}</pre>
            </div>
            <div class="analysis-content" v-else>
              <div class="analysis-placeholder">
                <p>在这里将显示算法分析结果</p>
                <p>包括时间复杂度、空间复杂度和优化建议</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 展示模式下显示数据示例 -->
        <div class="data-examples-container" v-if="pageMode === 'display'">
          <h3 class="section-subtitle">数据示例</h3>
          <div class="display-examples">
            <div class="example-data">
              <p>当前展示的{{ selectedStructure.name }}示例：</p>
              <div class="data-preview">
                <pre v-if="selectedStructure.id === 'array'">[1, 3, 5, 7, 9, 2, 4, 6, 8]</pre>
                <pre v-if="selectedStructure.id === 'linkedList'">1->3->5->7->9->2->4->6->8</pre>
                <pre v-if="selectedStructure.id === 'tree'">[1,2,3,4,5,null,6,null,null,7,8]</pre>
                <pre v-if="selectedStructure.id === 'graph'">A-B,B-C,C-D,A-D,B-D</pre>
                <pre v-if="selectedStructure.id === 'stack'">1,3,5,7,9 (底->顶)</pre>
                <pre v-if="selectedStructure.id === 'queue'">1,3,5,7,9 (前->后)</pre>
                <pre v-if="selectedStructure.id === 'hashTable'">a:1,b:3,c:5,d:7,e:9</pre>
              </div>
            </div>
            <div class="algorithm-description">
              <p>{{ selectedStructure.name }}的遍历过程：</p>
              <ul>
                <li v-if="selectedStructure.id === 'array'">从第一个元素开始，依次访问每个元素</li>
                <li v-if="selectedStructure.id === 'linkedList'">从头节点开始，沿着next指针访问每个节点</li>
                <li v-if="selectedStructure.id === 'tree'">可以采用前序、中序或后序遍历</li>
                <li v-if="selectedStructure.id === 'graph'">可以采用深度优先或广度优先遍历</li>
                <li v-if="selectedStructure.id === 'stack'">从栈顶开始，依次弹出元素</li>
                <li v-if="selectedStructure.id === 'queue'">从队首开始，依次出队元素</li>
                <li v-if="selectedStructure.id === 'hashTable'">遍历所有键值对</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 使用AlgorithmAnimation组件 -->
        <div class="animation-main-area">
          <AlgorithmAnimation
            :algorithm-type="selectedStructure.id"
            :data="currentAnimationData"
            :step="animationStep"
            :total-steps="totalSteps"
            :speed="animationSpeed"
            :operation-type="selectedOperation.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-practice {
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  background: var(--dark-bg);
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 10;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 3s infinite;
}

.practice-title {
  margin: 0;
  font-size: 2rem;
  color: white;
  animation: fadeIn 0.8s ease-out;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  padding-left: 15px;
}

.practice-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 70%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
}

/* 导航区域 - 更紧凑的布局 */
.data-structure-nav, .category-nav, .algorithm-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
  animation: slideInFromTop 0.6s ease-out;
}

.category-nav {
  margin-bottom: 20px;
}

.algorithm-nav {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.structure-btn, .category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 10px;
  background: rgba(108, 92, 231, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.3);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.structure-btn::after, .category-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: 0.5s;
}

.structure-btn:hover::after, .category-btn:hover::after {
  left: 100%;
}

.structure-btn:hover, .category-btn:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.structure-btn.active, .category-btn.active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.8), rgba(0, 206, 201, 0.8));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
}

.algorithm-card {
  background-color: rgba(30, 30, 40, 0.5);
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.algorithm-card::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.1));
  transform: scale(0);
  transform-origin: center;
  transition: transform 0.5s ease;
  border-radius: 12px;
}

.algorithm-card:hover::before {
  transform: scale(1);
}

.algorithm-card:hover {
  background-color: rgba(108, 92, 231, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.algorithm-card.active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.3), rgba(0, 206, 201, 0.3));
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(108, 92, 231, 0.4);
}

.algorithm-card.active::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent #6c5ce7 transparent transparent;
  z-index: 2;
}

.algorithm-name {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 0.95rem;
}

.algorithm-complexity {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #00cec9;
}

.algorithm-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

.structure-icon {
  font-size: 1.1rem;
}

/* 操作类型导航栏 - 更紧凑的布局 */
.operation-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
  animation: slideInFromTop 0.6s ease-out 0.1s both;
}

.operation-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(0, 206, 201, 0.1);
  border: 1px solid rgba(0, 206, 201, 0.3);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.operation-btn:hover {
  background: rgba(0, 206, 201, 0.2);
  transform: translateY(-2px);
}

.operation-btn.active {
  background: linear-gradient(135deg, rgba(0, 206, 201, 0.8), rgba(108, 92, 231, 0.8));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(0, 206, 201, 0.4);
}

/* 输入模式切换 - 更紧凑的布局 */
.input-mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
  animation: slideInFromTop 0.6s ease-out 0.2s both;
}

.mode-btn {
  padding: 8px 20px;
  border-radius: 20px;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-btn:hover {
  background: rgba(30, 30, 40, 0.9);
}

.mode-btn.active {
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
}

.mode-icon {
  font-size: 16px;
}

.mode-toggle {
  display: flex;
  gap: 10px;
  animation: fadeIn 0.8s ease-out;
}

/* 展示模式样式 */
.data-examples-container {
  background-color: rgba(30, 30, 40, 0.4);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 25px;
  margin-top: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(108, 92, 231, 0.3);
  transition: all 0.3s ease;
}

.display-examples {
  background-color: rgba(30, 30, 40, 0.5);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.example-data {
  background-color: rgba(25, 25, 35, 0.6);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(108, 92, 231, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-preview {
  background-color: rgba(30, 30, 40, 0.8);
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  font-family: monospace;
  overflow-x: auto;
  border-left: 3px solid rgba(108, 92, 231, 0.6);
}

.algorithm-description {
  background-color: rgba(25, 25, 35, 0.6);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(108, 92, 231, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.algorithm-description p {
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-weight: 600;
}

.algorithm-description ul {
  padding-left: 20px;
  margin-top: 10px;
  list-style-type: none;
}

.algorithm-description li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}

.algorithm-description li:before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

/* 用户交互区域 - 更紧凑的布局 */
.user-interaction {
  background: rgba(30, 30, 40, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out 0.2s both;
  max-height: 50vh;
  overflow-y: auto;
}

.user-interaction h2 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.input-guide {
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(108, 92, 231, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.input-container {
  margin-bottom: 20px;
}

.data-input, .code-input {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border);
  color: var(--text-primary);
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.code-input {
  min-height: 200px;
  font-family: 'Courier New', monospace;
}

.data-input:focus, .code-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  outline: none;
}

/* 动画控制按钮 - 更紧凑的布局 */
.animation-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

/* 数据操作按钮组 */
.data-operation-group {
  margin-top: 15px;
  background: rgba(30, 30, 50, 0.4);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(108, 92, 231, 0.2);
}

.operation-title {
  font-size: 1rem;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  text-align: center;
}

.operation-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.operation-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(40, 40, 60, 0.6);
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.operation-btn:hover {
  background: rgba(50, 50, 70, 0.7);
  border-color: rgba(108, 92, 231, 0.5);
  transform: translateY(-2px);
}

.operation-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.operation-icon {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.operation-name {
  font-size: 0.9rem;
}

.animation-control-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.control-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn {
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  color: white;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.4);
}

.pause-btn, .resume-btn {
  background: rgba(108, 92, 231, 0.2);
  color: var(--text-primary);
}

.operation-btn:hover:not(:disabled), .resume-btn:hover:not(:disabled) {
  background: rgba(108, 92, 231, 0.3);
}

.return-home-btn {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.return-home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.return-home-btn:hover::before {
  left: 100%;
}

.return-home-btn:hover {
  background: linear-gradient(135deg, #3498db, #2c3e50);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.return-home-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.reset-btn {
  background: rgba(255, 118, 117, 0.2);
  color: var(--text-primary);
}

.reset-btn:hover:not(:disabled) {
  background: rgba(255, 118, 117, 0.3);
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-size: 0.9rem;
}

.speed-btn {
  padding: 5px 10px;
  border-radius: 4px;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.speed-btn.active {
  background: rgba(108, 92, 231, 0.3);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

/* 内容展示区域 */
.content-display {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  margin-top: 10px;
}

@media (min-width: 992px) {
  .content-display {
    grid-template-columns: 3fr 2fr;
  }
}

/* 练习模式功能区样式 */
.practice-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background: rgba(30, 30, 40, 0.7);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
  animation: fadeIn 0.5s ease-out;
}

.feature-section {
  background: rgba(40, 40, 50, 0.6);
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.input-mode-toggle {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.input-guide {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 8px 0;
  line-height: 1.4;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.input-container {
  margin-top: 8px;
}

/* 动画展示区域 - 作为页面核心，更加突出 */
.animation-display-container {
  background: rgba(30, 30, 40, 0.6);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-height: 550px;
  animation: fadeIn 0.8s ease-out 0.4s both;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(108, 92, 231, 0.2);
}

.animation-display h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.animation-progress {
  margin-bottom: 20px;
}

.progress-bar {
  height: 8px;
  background: rgba(30, 30, 40, 0.8);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #6c5ce7, #00cec9);
  transition: width 0.3s ease;
}

.step-indicator {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: right;
}

/* 分析结果区域 - 更紧凑的布局 */
.analysis-display {
  background: rgba(30, 30, 40, 0.5);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out 0.4s both;
  border: 1px solid rgba(108, 92, 231, 0.2);
}

.analysis-display h3.panel-title {
  margin-bottom: 15px;
  font-size: 1.3rem;
  color: var(--primary-color);
  font-weight: 600;
}

.analysis-content {
  background: rgba(30, 30, 40, 0.8);
  border-radius: 8px;
  padding: 15px;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 200px;
  line-height: 1.5;
  border-left: 3px solid #6c5ce7;
}

.analysis-content pre {
  margin: 0;
  font-family: inherit;
}

.analysis-placeholder {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px 0;
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 120px;
  background: rgba(30, 30, 40, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(108, 92, 231, 0.2);
}

/* 输入框美化 */
.data-input, .code-input {
  width: 100%;
  border-radius: 10px;
  padding: 12px;
  background: rgba(30, 30, 40, 0.6);
  border: 1px solid rgba(108, 92, 231, 0.3);
  color: white;
  font-family: 'Consolas', monospace;
  resize: vertical;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 120px;
}

.data-input:focus, .code-input:focus {
  outline: none;
  border-color: rgba(108, 92, 231, 0.8);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2), inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 分析结果区域美化 */
.analysis-content {
  background: rgba(30, 30, 40, 0.4);
  border-radius: 10px;
  padding: 15px;
  min-height: 120px;
  border: 1px solid rgba(108, 92, 231, 0.2);
  max-height: 300px;
  overflow-y: auto;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromTop {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 新的布局结构 */
.layout-container {
  display: flex;
  flex: 1;
  gap: 30px;
  overflow: hidden;
  padding: 30px;
  margin: 0;
  color: var(--text-primary);
  background: var(--dark-bg);
  min-height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  animation: fadeIn 0.5s ease-out;
  background-image: radial-gradient(circle at 10% 20%, rgba(90, 92, 106, 0.05) 0%, rgba(32, 45, 58, 0.1) 81.3%);
}

.layout-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(108, 92, 231, 0.05), transparent 70%);
  pointer-events: none;
}

.control-sidebar {
  flex: 0 0 25%; /* 减小侧边栏宽度比例 */
  max-width: 300px; /* 减小最大宽度 */
  overflow-y: visible; /* 修改为visible以确保下拉内容可以正常显示 */
  max-height: calc(100vh - 80px);
  padding-right: 10px;
  position: relative; /* 确保下拉内容相对于侧边栏定位 */
  z-index: 100; /* 确保下拉内容显示在其他元素之上 */
}

.animation-main-container {
  flex: 1;
  background: rgba(30, 30, 40, 0.6);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 600px;
  border: 1px solid rgba(108, 92, 231, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  position: relative;
  backdrop-filter: blur(5px);
  margin-left: 15px; /* 添加左侧间距 */
}

.animation-main-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.5), rgba(0, 206, 201, 0.5));
  border-radius: 18px;
  z-index: -1;
  opacity: 0.3;
  filter: blur(8px);
}

.sidebar-section {
  background: rgba(30, 30, 40, 0.3);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 60px; /* 增加底部间距，为下拉框留出空间 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible; /* 确保下拉内容可以正常显示 */
}

.sidebar-section:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: rgba(108, 92, 231, 0.3);
  background: rgba(30, 30, 40, 0.4);
}

.sidebar-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(108, 92, 231, 0.5), rgba(0, 206, 201, 0.5));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.sidebar-section:hover::after {
  transform: scaleX(1);
}

/* 章节副标题样式 */
.section-subtitle {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-secondary);
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

/* 下拉菜单样式 */
.dropdown-container {
  position: relative;
  width: 100%;
  overflow: visible; /* 确保下拉内容可以溢出显示 */
}

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 15px;
  background: rgba(40, 40, 60, 0.6);
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.structure-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-btn:hover {
  background: rgba(50, 50, 70, 0.7);
  border-color: rgba(108, 92, 231, 0.5);
}

.dropdown-arrow {
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-width: 100%;
  background: rgba(30, 30, 50, 0.95);
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 10px;
  margin-top: 5px;
  padding: 10px;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-out;
}

/* 为算法下拉框设置更高的z-index和位置调整，确保它显示在数据结构下拉框之上且不被遮挡 */
.algorithm-dropdown .dropdown-content {
  z-index: 1001;
}

/* 为数据结构下拉框设置z-index */
.data-structure-dropdown .dropdown-content {
  z-index: 1000;
}

/* 确保下拉框中的按钮和内容能够完整显示 */
.dropdown-content button,
.dropdown-content .algorithm-card,
.dropdown-content .structure-btn {
  white-space: normal;
  word-break: break-word;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dropdown-content button:hover,
.dropdown-content .algorithm-card:hover,
.dropdown-content .structure-btn:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: translateX(5px);
}

.algorithm-dropdown {
  max-height: 400px;
}

.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(108, 92, 231, 0.3);
}

.algorithm-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.algorithm-list li, .dropdown-content li {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.algorithm-list li:hover, .dropdown-content li:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: translateX(5px);
}

.section-subtitle {
  letter-spacing: 0.5px;
}

.section-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #6c5ce7, #00cec9);
  border-radius: 2px;
}

.section-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #6c5ce7, #00cec9);
  border-radius: 2px;
}

.animation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(108, 92, 231, 0.2);
}

.section-title {
  font-size: 1.8rem;
  color: var(--primary-color);
  font-weight: 700;
  position: relative;
  padding-bottom: 5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #6c5ce7, #00cec9);
  border-radius: 3px;
}

.animation-main-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 25, 35, 0.4);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(108, 92, 231, 0.2);
  margin-top: 25px;
  min-height: 450px;
  transition: all 0.3s ease;
}

/* 紧凑的输入区域 */
.input-guide.compact {
  font-size: 0.9rem;
  padding: 10px;
  margin-bottom: 10px;
}

.data-input.compact,
.code-input.compact {
  min-height: 100px;
  font-size: 0.9rem;
}

/* 操作按钮样式 */
.operation-btn, .control-btn, .mode-btn, .home-btn {
  padding: 10px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.8), rgba(0, 206, 201, 0.8));
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.operation-btn:hover, .control-btn:hover, .mode-btn:hover, .home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.9), rgba(0, 206, 201, 0.9));
}

.operation-btn:active, .control-btn:active, .mode-btn:active, .home-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.operation-btn:disabled, .control-btn:disabled, .mode-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.operation-buttons, .animation-controls, .mode-toggle, .input-mode-toggle {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .layout-container {
    flex-direction: column;
  }
  
  .control-sidebar {
    max-width: 100%;
  }
  
  .animation-main-container {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .data-structure-nav,
  .operation-nav,
  .input-mode-toggle,
  .animation-controls,
  .speed-control {
    flex-direction: column;
    align-items: stretch;
  }

  .speed-control {
    margin-top: 15px;
  }

  .structure-btn,
  .operation-btn,
  .mode-btn,
  .control-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>