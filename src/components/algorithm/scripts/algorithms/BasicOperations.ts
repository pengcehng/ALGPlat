// 基本操作算法实现
import type { AnimationStep, AnimationElement } from './types';

/**
 * 链表插入操作
 * 时间复杂度: O(n) 查找位置 + O(1) 插入
 * 空间复杂度: O(1)
 */
export function generateLinkedListInsertSteps(data: number[], newValue: number, position: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本，模拟链表节点
  
  // 确保位置有效
  position = Math.max(0, Math.min(position, arr.length));
  
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
  
  // 查找插入位置
  for (let i = 0; i < position; i++) {
    steps.push({
      description: `查找插入位置，当前位置: ${i}`,
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
  
  // 插入新节点
  arr.splice(position, 0, newValue);
  
  steps.push({
    description: `在位置 ${position} 插入新节点 ${newValue}`,
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index < arr.length - 1 ? `node-${index + 1}` : null,
      highlighted: index === position,
      visited: index < position
    }))
  });
  
  // 更新链接
  steps.push({
    description: '更新链表链接',
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index < arr.length - 1 ? `node-${index + 1}` : null,
      highlighted: index === position || (index === position - 1 && position > 0) || (index === position + 1 && position < arr.length - 1),
      visited: true
    }))
  });
  
  // 操作完成
  steps.push({
    description: '插入操作完成',
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
 * 链表删除操作
 * 时间复杂度: O(n) 查找位置 + O(1) 删除
 * 空间复杂度: O(1)
 */
export function generateLinkedListDeleteSteps(data: number[], position: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本，模拟链表节点
  
  // 确保位置有效
  if (position < 0 || position >= arr.length || arr.length === 0) {
    steps.push({
      description: '无效的删除位置',
      elements: arr.map((value, index) => ({
        id: `node-${index}`,
        value,
        type: 'linked-list-node',
        next: index < arr.length - 1 ? `node-${index + 1}` : null
      }))
    });
    return steps;
  }
  
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
  
  // 查找删除位置
  for (let i = 0; i < position; i++) {
    steps.push({
      description: `查找删除位置，当前位置: ${i}`,
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
  
  // 标记要删除的节点
  steps.push({
    description: `标记位置 ${position} 的节点 ${arr[position]} 准备删除`,
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index < arr.length - 1 ? `node-${index + 1}` : null,
      highlighted: index === position,
      visited: index < position
    }))
  });
  
  // 更新链接
  steps.push({
    description: '更新链表链接，跳过要删除的节点',
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index === position - 1 ? (position < arr.length - 1 ? `node-${position + 1}` : null) : (index < arr.length - 1 ? `node-${index + 1}` : null),
      highlighted: (index === position - 1 && position > 0) || (index === position + 1 && position < arr.length - 1),
      visited: index < position || index > position
    }))
  });
  
  // 删除节点
  arr.splice(position, 1);
  
  // 操作完成
  steps.push({
    description: '删除操作完成',
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
 * 链表反转操作
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function generateLinkedListReverseSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data]; // 创建数组副本，模拟链表节点
  
  if (arr.length <= 1) {
    steps.push({
      description: '链表太短，无需反转',
      elements: arr.map((value, index) => ({
        id: `node-${index}`,
        value,
        type: 'linked-list-node',
        next: index < arr.length - 1 ? `node-${index + 1}` : null
      }))
    });
    return steps;
  }
  
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
  
  // 反转过程
  let prev: number | null = null;
  let current = 0;
  let next = 1;
  
  while (current < arr.length) {
    // 显示当前状态
    steps.push({
      description: `当前节点: ${arr[current]}，前一节点: ${prev !== null ? arr[prev] : 'null'}，下一节点: ${next < arr.length ? arr[next] : 'null'}`,
      elements: arr.map((value, index) => ({
        id: `node-${index}`,
        value,
        type: 'linked-list-node',
        next: index === current ? (prev !== null ? `node-${prev}` : null) : 
             (index < current ? `node-${index - 1}` : (index < arr.length - 1 ? `node-${index + 1}` : null)),
        highlighted: index === current,
        visited: index < current
      }))
    });
    
    // 保存下一节点
    next = current + 1;
    
    // 反转当前节点的指针
    const temp = prev;
    prev = current;
    current = next;
    
    // 显示反转后的状态
    if (current < arr.length) {
      steps.push({
        description: `反转节点 ${prev !== null ? arr[prev] : 'null'} 的指针，指向 ${temp !== null ? arr[temp] : 'null'}`,
        elements: arr.map((value, index) => ({
          id: `node-${index}`,
          value,
          type: 'linked-list-node',
          next: index === prev ? (temp !== null ? `node-${temp}` : null) : 
               (index < (prev ?? -1) ? `node-${index - 1}` : (index < arr.length - 1 ? `node-${index + 1}` : null)),
          highlighted: index === prev,
          visited: index <= (prev ?? -1)
        }))
      });
    }
  }
  
  // 最终反转后的链表
  steps.push({
    description: '链表反转完成',
    elements: arr.map((value, index) => ({
      id: `node-${index}`,
      value,
      type: 'linked-list-node',
      next: index > 0 ? `node-${index - 1}` : null,
      visited: true
    }))
  });
  
  return steps;
}

/**
 * 栈的入栈操作
 * 时间复杂度: O(1)
 * 空间复杂度: O(1)
 */
export function generateStackPushSteps(data: number[], newValue: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const stack = [...data]; // 创建数组副本，模拟栈
  
  // 初始状态
  steps.push({
    description: '初始栈',
    elements: stack.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'stack-element',
      position: { x: 0, y: index }
    }))
  });
  
  // 准备新元素
  steps.push({
    description: `准备将元素 ${newValue} 入栈`,
    elements: [
      ...stack.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'stack-element',
        position: { x: 0, y: index }
      })),
      {
        id: `element-new`,
        value: newValue,
        type: 'stack-element',
        highlighted: true,
        position: { x: 0, y: -1 } // 栈外
      }
    ]
  });
  
  // 入栈操作
  stack.push(newValue);
  
  // 入栈后的状态
  steps.push({
    description: `元素 ${newValue} 入栈完成`,
    elements: stack.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'stack-element',
      highlighted: index === stack.length - 1,
      position: { x: 0, y: index }
    }))
  });
  
  return steps;
}

/**
 * 栈的出栈操作
 * 时间复杂度: O(1)
 * 空间复杂度: O(1)
 */
export function generateStackPopSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const stack = [...data]; // 创建数组副本，模拟栈
  
  if (stack.length === 0) {
    steps.push({
      description: '栈为空，无法出栈',
      elements: []
    });
    return steps;
  }
  
  // 初始状态
  steps.push({
    description: '初始栈',
    elements: stack.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'stack-element',
      position: { x: 0, y: index }
    }))
  });
  
  // 标记要出栈的元素
  const topElement = stack[stack.length - 1];
  
  steps.push({
    description: `准备将栈顶元素 ${topElement} 出栈`,
    elements: stack.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'stack-element',
      highlighted: index === stack.length - 1,
      position: { x: 0, y: index }
    }))
  });
  
  // 出栈操作
  stack.pop();
  
  // 出栈后的状态
  steps.push({
    description: `元素 ${topElement} 出栈完成`,
    elements: [
      ...stack.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'stack-element',
        position: { x: 0, y: index }
      })),
      {
        id: `element-popped`,
        value: topElement,
        type: 'stack-element',
        highlighted: true,
        position: { x: 0, y: -1 }, // 栈外
        visited: true
      }
    ]
  });
  
  return steps;
}

/**
 * 队列的入队操作
 * 时间复杂度: O(1)
 * 空间复杂度: O(1)
 */
export function generateQueueEnqueueSteps(data: number[], newValue: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const queue = [...data]; // 创建数组副本，模拟队列
  
  // 初始状态
  steps.push({
    description: '初始队列',
    elements: queue.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'queue-element',
      position: { x: index, y: 0 }
    }))
  });
  
  // 准备新元素
  steps.push({
    description: `准备将元素 ${newValue} 入队`,
    elements: [
      ...queue.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'queue-element',
        position: { x: index, y: 0 }
      })),
      {
        id: `element-new`,
        value: newValue,
        type: 'queue-element',
        highlighted: true,
        position: { x: -1, y: 0 } // 队列外
      }
    ]
  });
  
  // 入队操作
  queue.push(newValue);
  
  // 入队后的状态
  steps.push({
    description: `元素 ${newValue} 入队完成`,
    elements: queue.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'queue-element',
      highlighted: index === queue.length - 1,
      position: { x: index, y: 0 }
    }))
  });
  
  return steps;
}

/**
 * 队列的出队操作
 * 时间复杂度: O(n) 因为需要移动元素
 * 空间复杂度: O(1)
 */
export function generateQueueDequeueSteps(data: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const queue = [...data]; // 创建数组副本，模拟队列
  
  if (queue.length === 0) {
    steps.push({
      description: '队列为空，无法出队',
      elements: []
    });
    return steps;
  }
  
  // 初始状态
  steps.push({
    description: '初始队列',
    elements: queue.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'queue-element',
      position: { x: index, y: 0 }
    }))
  });
  
  // 标记要出队的元素
  const frontElement = queue[0];
  
  steps.push({
    description: `准备将队首元素 ${frontElement} 出队`,
    elements: queue.map((value, index) => ({
      id: `element-${index}`,
      value,
      type: 'queue-element',
      highlighted: index === 0,
      position: { x: index, y: 0 }
    }))
  });
  
  // 出队操作
  queue.shift();
  
  // 出队后的状态
  steps.push({
    description: `元素 ${frontElement} 出队完成`,
    elements: [
      {
        id: `element-dequeued`,
        value: frontElement,
        type: 'queue-element',
        highlighted: true,
        position: { x: -1, y: 0 }, // 队列外
        visited: true
      },
      ...queue.map((value, index) => ({
        id: `element-${index}`,
        value,
        type: 'queue-element',
        position: { x: index, y: 0 }
      }))
    ]
  });
  
  return steps;
}

/**
 * 二叉树插入操作
 * 时间复杂度: O(log n) 平均情况，O(n) 最坏情况
 * 空间复杂度: O(h)，h为树的高度
 */
export function generateTreeInsertSteps(data: number[], newValue: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 创建二叉搜索树节点
  interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  
  // 创建树的可视化元素
  const createTreeElements = (root: TreeNode | null, highlighted: string | null = null, visited: Set<string> = new Set()): AnimationElement[] => {
    if (!root) return [];
    
    const elements: AnimationElement[] = [
      {
        id: root.id,
        value: root.value,
        type: 'tree-node',
        highlighted: root.id === highlighted,
        visited: visited.has(root.id),
        connections: [
          ...(root.left?.id ? [root.left.id] : []),
          ...(root.right?.id ? [root.right.id] : [])
        ]
      }
    ];
    
    if (root.left) {
      elements.push(...createTreeElements(root.left, highlighted, visited));
    }
    
    if (root.right) {
      elements.push(...createTreeElements(root.right, highlighted, visited));
    }
    
    return elements;
  };
  
  // 从数组创建二叉搜索树
  const createBST = (arr: number[]): TreeNode | null => {
    if (arr.length === 0) return null;
    
    let root: TreeNode | null = null;
    
    for (const value of arr) {
      root = insertNode(root, value, null);
    }
    
    return root;
  };
  
  // 插入节点到二叉搜索树
  const insertNode = (root: TreeNode | null, value: number, visitedNodes: Set<string> | null): TreeNode => {
    if (!root) {
      const newNode: TreeNode = {
        id: `node-${value}`,
        value,
        left: null,
        right: null
      };
      
      if (visitedNodes) {
        steps.push({
          description: `创建新节点 ${value}`,
          elements: [
            {
              id: newNode.id,
              value: newNode.value,
              type: 'tree-node',
              highlighted: true
            }
          ]
        });
      }
      
      return newNode;
    }
    
    if (visitedNodes) {
      visitedNodes.add(root.id);
      
      steps.push({
        description: `比较 ${value} 与节点 ${root.value}`,
        elements: createTreeElements(bst, root.id, visitedNodes)
      });
    }
    
    if (value < root.value) {
      if (visitedNodes) {
        steps.push({
          description: `${value} < ${root.value}，向左子树移动`,
          elements: createTreeElements(bst, root.id, visitedNodes)
        });
      }
      
      root.left = insertNode(root.left, value, visitedNodes);
    } else if (value > root.value) {
      if (visitedNodes) {
        steps.push({
          description: `${value} > ${root.value}，向右子树移动`,
          elements: createTreeElements(bst, root.id, visitedNodes)
        });
      }
      
      root.right = insertNode(root.right, value, visitedNodes);
    } else {
      if (visitedNodes) {
        steps.push({
          description: `节点 ${value} 已存在，不进行插入`,
          elements: createTreeElements(bst, root.id, visitedNodes)
        });
      }
    }
    
    return root;
  };
  
  // 创建初始二叉搜索树
  const bst = createBST(data);
  
  // 初始状态
  steps.push({
    description: '初始二叉搜索树',
    elements: createTreeElements(bst) || []
  });
  
  // 插入新节点
  const visitedNodes = new Set<string>();
  insertNode(bst, newValue, visitedNodes);
  
  // 插入完成后的状态
  steps.push({
    description: `插入节点 ${newValue} 完成`,
    elements: createTreeElements(bst).map(el => ({
      ...el,
      highlighted: el.value === newValue,
      visited: visitedNodes.has(el.id as string)
    }))
  });
  
  return steps;
}

/**
 * 哈希表插入操作
 * 时间复杂度: O(1) 平均情况
 * 空间复杂度: O(1)
 */
export function generateHashTableInsertSteps(data: Record<string, number>, key: string, value: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const hashTable = { ...data }; // 创建对象副本，模拟哈希表
  
  // 初始状态
  steps.push({
    description: '初始哈希表',
    elements: [
      {
        id: 'hash-table',
        value: 'Hash Table',
        type: 'hash-table'
      },
      ...Object.entries(hashTable).map(([k, v]) => ({
        id: `entry-${k}`,
        value: `${k}: ${v}`,
        type: 'hash-table-entry'
      }))
    ]
  });
  
  // 计算哈希值（模拟）
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
  
  steps.push({
    description: `计算键 "${key}" 的哈希值: ${hash}`,
    elements: [
      {
        id: 'hash-table',
        value: 'Hash Table',
        type: 'hash-table',
        highlighted: true
      },
      ...Object.entries(hashTable).map(([k, v]) => ({
        id: `entry-${k}`,
        value: `${k}: ${v}`,
        type: 'hash-table-entry'
      })),
      {
        id: 'new-entry',
        value: `${key}: ${value}`,
        type: 'hash-table-entry',
        highlighted: true
      }
    ]
  });
  
  // 检查是否存在冲突
  const isUpdate = hashTable.hasOwnProperty(key);
  
  if (isUpdate) {
    steps.push({
      description: `键 "${key}" 已存在，更新值为 ${value}`,
      elements: [
        {
          id: 'hash-table',
          value: 'Hash Table',
          type: 'hash-table'
        },
        ...Object.entries(hashTable).map(([k, v]) => ({
        id: `entry-${k}`,
        value: `${k}: ${v}`,
        type: 'hash-table-entry',
        highlighted: k === key
      }))
      ]
    });
  } else {
    steps.push({
      description: `在哈希表中添加新键值对 "${key}": ${value}`,
      elements: [
        {
          id: 'hash-table',
          value: 'Hash Table',
          type: 'hash-table'
        },
        ...Object.entries(hashTable).map(([k, v], index) => ({
          id: `entry-${k}`,
          value: `${k}: ${v}`,
          type: 'hash-table-entry'
        })),
        {
          id: `entry-${key}`,
          value: `${key}: ${value}`,
          type: 'hash-table-entry',
          highlighted: true
        }
      ]
    });
  }
  
  // 插入/更新操作
  hashTable[key] = value;
  
  // 操作完成后的状态
  steps.push({
    description: `${isUpdate ? '更新' : '插入'}操作完成`,
    elements: [
      {
        id: 'hash-table',
        value: 'Hash Table',
        type: 'hash-table'
      },
      ...Object.entries(hashTable).map(([k, v]) => ({
        id: `entry-${k}`,
        value: `${k}: ${v}`,
        type: 'hash-table-entry',
        highlighted: k === key,
        visited: true
      }))
    ]
  });
  
  return steps;
}