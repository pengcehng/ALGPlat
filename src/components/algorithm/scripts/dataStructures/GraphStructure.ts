// 图数据结构操作
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AnimationElement } from '../algorithms/types';

// 图节点接口
interface GraphNode {
  id: string;
  value: any;
}

// 图边接口
interface GraphEdge {
  source: string;
  target: string;
}

/**
 * 图数据结构操作
 */
export function useGraphOperations() {
  // 将字符串表示转换为图元素（用于动画展示）
  // 假设输入格式为："A-B,B-C,C-D,A-D"
  const stringToGraphElements = (data: string): AnimationElement[] => {
    const elements: AnimationElement[] = [];
    const edges = data.split(',');
    const nodes = new Map<string, GraphNode>();
    
    // 解析边并收集节点
    edges.forEach(edge => {
      const [source, target] = edge.split('-');
      if (!nodes.has(source)) {
        nodes.set(source, { id: source, value: source });
      }
      if (!nodes.has(target)) {
        nodes.set(target, { id: target, value: target });
      }
    });
    
    // 创建节点元素
    nodes.forEach((node, id) => {
      elements.push({
        id: `node-${id}`,
        value: node.value,
        type: 'graph-node',
        connections: []
      });
    });
    
    // 添加连接
    edges.forEach(edge => {
      const [source, target] = edge.split('-');
      const sourceElement = elements.find(el => el.id === `node-${source}`);
      if (sourceElement && !sourceElement.connections!.includes(`node-${target}`)) {
        sourceElement.connections!.push(`node-${target}`);
      }
    });
    
    return elements;
  };

  // 添加元素到图（添加节点和边）
  const addElement = (data: string, element: string): AnimationElement[] => {
    // 添加新边
    const newData = data ? `${data},${element}` : element;
    
    // 返回更新后的动画元素
    const elements = stringToGraphElements(newData);
    const [source, target] = element.split('-');
    
    return elements.map(node => ({
      ...node,
      highlighted: node.id === `node-${source}` || node.id === `node-${target}`
    }));
  };

  // 从图中删除元素（删除边）
  const deleteElement = (data: string, element: string): AnimationElement[] => {
    // 删除指定的边
    const edges = data.split(',');
    const newEdges = edges.filter(edge => edge !== element);
    const newData = newEdges.join(',');
    
    // 返回更新后的动画元素
    return stringToGraphElements(newData);
  };

  // 遍历图（广度优先）
  const traverseOperation = (data: string): AnimationElement[] => {
    // 返回带有遍历标记的动画元素
    return stringToGraphElements(data).map(node => ({
      ...node,
      visited: true
    }));
  };

  // 在图中搜索元素（节点）
  const searchElement = (data: string, element: string): AnimationElement[] => {
    // 返回带有搜索结果的动画元素
    return stringToGraphElements(data).map(node => ({
      ...node,
      highlighted: node.id === `node-${element}`
    }));
  };

  // 获取图结构的复杂度因子
  const getStructureComplexityFactor = (data: string, operation: string): number => {
    const edges = data.split(',');
    const nodeSet = new Set<string>();
    
    edges.forEach(edge => {
      const [source, target] = edge.split('-');
      nodeSet.add(source);
      nodeSet.add(target);
    });
    
    const nodeCount = nodeSet.size;
    const edgeCount = edges.length;
    
    switch (operation) {
      case 'add': return 1; // O(1) - 添加边
      case 'delete': return edgeCount; // O(E) - 查找并删除边
      case 'traverse': return nodeCount + edgeCount; // O(V+E) - BFS/DFS
      case 'search': return nodeCount + edgeCount; // O(V+E) - 图搜索
      default: return 1;
    }
  };

  return {
    addElement,
    deleteElement,
    traverseOperation,
    searchElement,
    getStructureComplexityFactor
  };
}