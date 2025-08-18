// 遍历算法实现
import type { AnimationStep, AnimationElement } from './types';

/**
 * 数组遍历算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function generateArrayTraversalSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本
  
  // 初始状态
  steps.push({
    description: '初始数组',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element'
    }))
  });
  
  // 遍历过程
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      description: `访问索引 ${i} 处的元素 ${arr[i]}`,
      elements: arr.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'array-element',
        highlighted: index === i,
        visited: index < i
      }))
    });
  }
  
  // 遍历完成
  steps.push({
    description: '遍历完成',
    elements: arr.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'array-element',
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 链表遍历算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function generateLinkedListTraversalSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本，模拟链表节点
  
  // 初始状态
  steps.push({
    description: '初始链表',
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index < arr.length - 1 ? `node-${index + 1}` : null
    }))
  });
  
  // 遍历过程
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      description: `访问节点 ${i} 的值 ${arr[i]}`,
      elements: arr.map((value, index) => ({
        id: `node-${index}`,
        value,
        type: 'linked-list-node',
        next: index < arr.length - 1 ? `node-${index + 1}` : null,
        highlighted: index === i,
        visited: index < i
      }))
    });
  }
  
  // 遍历完成
  steps.push({
    description: '遍历完成',
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index < arr.length - 1 ? `node-${index + 1}` : null,
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 二叉树前序遍历算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(h)，h为树的高度
 */
export function generateTreePreOrderTraversalSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 创建二叉树节点
  interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  
  // 从数组创建完全二叉树
  const createTree = (arr: number[], index: number = 0): TreeNode | null => {
    if (index >= arr.length || arr[index] === null) return null;
    
    const node: TreeNode = {
      id: `node-${index}`,
      value: arr[index],
      left: createTree(arr, 2 * index + 1),
      right: createTree(arr, 2 * index + 2)
    };
    
    return node;
  };
  
  // 创建树的可视化元素
  const createTreeElements = (node: TreeNode | null, highlighted: boolean = false, visited: boolean = false): AnimationElement[] => {
    if (!node) return [];
    
    const elements: AnimationElement[] = [
      {
        id: node.id,
        value: node.value,
        type: 'tree-node',
        highlighted,
        visited,
        // 将left和right作为自定义属性存储在value中
        connections: [node.left?.id, node.right?.id].filter(Boolean) as string[]
      }
    ];
    
    if (node.left) {
      elements.push(...createTreeElements(node.left));
    }
    
    if (node.right) {
      elements.push(...createTreeElements(node.right));
    }
    
    return elements;
  };
  
  // 创建二叉树
  const root = createTree(data);
  
  if (!root) {
    steps.push({
      description: '空树',
      elements: []
    });
    return steps;
  }
  
  // 初始状态
  steps.push({
    description: '初始二叉树',
    elements: createTreeElements(root)
  });
  
  // 前序遍历函数
  const preOrder = (node: TreeNode | null, visitedNodes: Set<string> = new Set()) => {
    if (!node) return;
    
    // 访问当前节点
    visitedNodes.add(node.id);
    
    steps.push({
      description: `访问节点 ${node.value}`,
      elements: createTreeElements(root).map(el => ({
        ...el,
        highlighted: el.id === node.id,
        visited: visitedNodes.has(el.id as string)
      }))
    });
    
    // 递归遍历左子树
    preOrder(node.left, visitedNodes);
    
    // 递归遍历右子树
    preOrder(node.right, visitedNodes);
  };
  
  // 执行前序遍历
  preOrder(root);
  
  // 遍历完成
  steps.push({
    description: '前序遍历完成',
    elements: createTreeElements(root).map(el => ({
      ...el,
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 二叉树中序遍历算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(h)，h为树的高度
 */
export function generateTreeInOrderTraversalSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 创建二叉树节点
  interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  
  // 从数组创建完全二叉树
  const createTree = (arr: number[], index: number = 0): TreeNode | null => {
    if (index >= arr.length || arr[index] === null) return null;
    
    const node: TreeNode = {
      id: `node-${index}`,
      value: arr[index],
      left: createTree(arr, 2 * index + 1),
      right: createTree(arr, 2 * index + 2)
    };
    
    return node;
  };
  
  // 创建树的可视化元素
  const createTreeElements = (node: TreeNode | null, highlighted: boolean = false, visited: boolean = false): AnimationElement[] => {
    if (!node) return [];
    
    const elements: AnimationElement[] = [
      {
        id: node.id,
        value: node.value,
        type: 'tree-node',
        highlighted,
        visited,
        // 将left和right作为自定义属性存储在value中
        connections: [node.left?.id, node.right?.id].filter(Boolean) as string[]
      }
    ];
    
    if (node.left) {
      elements.push(...createTreeElements(node.left));
    }
    
    if (node.right) {
      elements.push(...createTreeElements(node.right));
    }
    
    return elements;
  };
  
  // 创建二叉树
  const root = createTree(data);
  
  if (!root) {
    steps.push({
      description: '空树',
      elements: []
    });
    return steps;
  }
  
  // 初始状态
  steps.push({
    description: '初始二叉树',
    elements: createTreeElements(root)
  });
  
  // 中序遍历函数
  const inOrder = (node: TreeNode | null, visitedNodes: Set<string> = new Set()) => {
    if (!node) return;
    
    // 递归遍历左子树
    inOrder(node.left, visitedNodes);
    
    // 访问当前节点
    visitedNodes.add(node.id);
    
    steps.push({
      description: `访问节点 ${node.value}`,
      elements: createTreeElements(root).map(el => ({
        ...el,
        highlighted: el.id === node.id,
        visited: visitedNodes.has(el.id as string)
      }))
    });
    
    // 递归遍历右子树
    inOrder(node.right, visitedNodes);
  };
  
  // 执行中序遍历
  inOrder(root);
  
  // 遍历完成
  steps.push({
    description: '中序遍历完成',
    elements: createTreeElements(root).map(el => ({
      ...el,
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 二叉树后序遍历算法
 * 时间复杂度: O(n)
 * 空间复杂度: O(h)，h为树的高度
 */
export function generateTreePostOrderTraversalSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 创建二叉树节点
  interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  
  // 从数组创建完全二叉树
  const createTree = (arr: number[], index: number = 0): TreeNode | null => {
    if (index >= arr.length || arr[index] === null) return null;
    
    const node: TreeNode = {
      id: `node-${index}`,
      value: arr[index],
      left: createTree(arr, 2 * index + 1),
      right: createTree(arr, 2 * index + 2)
    };
    
    return node;
  };
  
  // 创建树的可视化元素
  const createTreeElements = (node: TreeNode | null, highlighted: boolean = false, visited: boolean = false): AnimationElement[] => {
    if (!node) return [];
    
    const elements: AnimationElement[] = [
      {
        id: node.id,
        value: node.value,
        type: 'tree-node',
        highlighted,
        visited,
        connections: [
          ...(node.left?.id ? [node.left.id] : []),
          ...(node.right?.id ? [node.right.id] : [])
        ]
      }
    ];
    
    if (node.left) {
      elements.push(...createTreeElements(node.left));
    }
    
    if (node.right) {
      elements.push(...createTreeElements(node.right));
    }
    
    return elements;
  };
  
  // 创建二叉树
  const root = createTree(data);
  
  if (!root) {
    steps.push({
      description: '空树',
      elements: []
    });
    return steps;
  }
  
  // 初始状态
  steps.push({
    description: '初始二叉树',
    elements: createTreeElements(root)
  });
  
  // 后序遍历函数
  const postOrder = (node: TreeNode | null, visitedNodes: Set<string> = new Set()) => {
    if (!node) return;
    
    // 递归遍历左子树
    postOrder(node.left, visitedNodes);
    
    // 递归遍历右子树
    postOrder(node.right, visitedNodes);
    
    // 访问当前节点
    visitedNodes.add(node.id);
    
    steps.push({
      description: `访问节点 ${node.value}`,
      elements: createTreeElements(root).map(el => ({
        ...el,
        highlighted: el.id === node.id,
        visited: visitedNodes.has(el.id as string)
      }))
    });
  };
  
  // 执行后序遍历
  postOrder(root);
  
  // 遍历完成
  steps.push({
    description: '后序遍历完成',
    elements: createTreeElements(root).map(el => ({
      ...el,
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 图的广度优先搜索(BFS)遍历算法
 * 时间复杂度: O(V + E)，V为顶点数，E为边数
 * 空间复杂度: O(V)
 */
export function generateGraphBFSTraversalSteps(adjacencyList: Record<string, string[]>): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 获取所有顶点
  const vertices = Object.keys(adjacencyList);
  
  if (vertices.length === 0) {
    steps.push({
      description: '空图',
      elements: []
    });
    return steps;
  }
  
  // 创建图的可视化元素
  const createGraphElements = (highlighted: string | null = null, visited: Set<string> = new Set()): AnimationElement[] => {
    const elements: AnimationElement[] = [];
    
    // 添加顶点
    for (const vertex of vertices) {
      elements.push({
        id: `vertex-${vertex}`,
        value: vertex,
        type: 'graph-vertex',
        highlighted: vertex === highlighted,
        visited: visited.has(vertex)
      });
    }
    
    // 添加边
    for (const [vertex, neighbors] of Object.entries(adjacencyList)) {
      for (const neighbor of neighbors) {
        elements.push({
          id: `edge-${vertex}-${neighbor}`,
          value: '',
          type: 'graph-edge',
          connections: [`vertex-${vertex}`, `vertex-${neighbor}`],
          highlighted: vertex === highlighted && visited.has(neighbor),
          visited: visited.has(vertex) && visited.has(neighbor)
        });
      }
    }
    
    return elements;
  };
  
  // 初始状态
  steps.push({
    description: '初始图',
    elements: createGraphElements()
  });
  
  // BFS遍历
  const startVertex = vertices[0]; // 从第一个顶点开始
  const visited = new Set<string>();
  const queue: string[] = [startVertex];
  visited.add(startVertex);
  
  steps.push({
    description: `从顶点 ${startVertex} 开始BFS遍历`,
    elements: createGraphElements(startVertex, visited)
  });
  
  while (queue.length > 0) {
    const currentVertex = queue.shift()!;
    
    // 访问当前顶点的所有邻居
    for (const neighbor of adjacencyList[currentVertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        
        steps.push({
          description: `访问顶点 ${currentVertex} 的邻居 ${neighbor}`,
          elements: createGraphElements(neighbor, visited)
        });
      }
    }
  }
  
  // 遍历完成
  steps.push({
    description: 'BFS遍历完成',
    elements: createGraphElements(null, visited)
  });
  
  return steps;
}

/**
 * 图的深度优先搜索(DFS)遍历算法
 * 时间复杂度: O(V + E)，V为顶点数，E为边数
 * 空间复杂度: O(V)
 */
export function generateGraphDFSTraversalSteps(adjacencyList: Record<string, string[]>): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 获取所有顶点
  const vertices = Object.keys(adjacencyList);
  
  if (vertices.length === 0) {
    steps.push({
      description: '空图',
      elements: []
    });
    return steps;
  }
  
  // 创建图的可视化元素
  const createGraphElements = (highlighted: string | null = null, visited: Set<string> = new Set()): AnimationElement[] => {
    const elements: AnimationElement[] = [];
    
    // 添加顶点
    for (const vertex of vertices) {
      elements.push({
        id: `vertex-${vertex}`,
        value: vertex,
        type: 'graph-vertex',
        highlighted: vertex === highlighted,
        visited: visited.has(vertex)
      });
    }
    
    // 添加边
    for (const [vertex, neighbors] of Object.entries(adjacencyList)) {
      for (const neighbor of neighbors) {
        elements.push({
          id: `edge-${vertex}-${neighbor}`,
          value: '',
          type: 'graph-edge',
          connections: [`vertex-${vertex}`, `vertex-${neighbor}`],
          highlighted: vertex === highlighted && visited.has(neighbor),
          visited: visited.has(vertex) && visited.has(neighbor)
        });
      }
    }
    
    return elements;
  };
  
  // 初始状态
  steps.push({
    description: '初始图',
    elements: createGraphElements()
  });
  
  // DFS遍历
  const startVertex = vertices[0]; // 从第一个顶点开始
  const visited = new Set<string>();
  
  // DFS递归函数
  const dfs = (vertex: string) => {
    visited.add(vertex);
    
    steps.push({
      description: `访问顶点 ${vertex}`,
      elements: createGraphElements(vertex, visited)
    });
    
    // 访问所有未访问的邻居
    for (const neighbor of adjacencyList[vertex]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  };
  
  // 执行DFS
  dfs(startVertex);
  
  // 遍历完成
  steps.push({
    description: 'DFS遍历完成',
    elements: createGraphElements(null, visited)
  });
  
  return steps;
}