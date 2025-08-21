// 操作队列管理系统
// 用于缓存用户操作，在页面卸载时统一发送请求

export interface Operation {
  id: string;
  type: 'like' | 'unlike' | 'favorite' | 'unfavorite' | 'share' | 'comment_like' | 'comment_unlike';
  targetId: number;
  targetType: 'post' | 'comment';
  timestamp: number;
  data?: any;
}

export class OperationQueue {
  private static instance: OperationQueue;
  private queue: Operation[] = [];
  private storageKey = 'community_operation_queue';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): OperationQueue {
    if (!OperationQueue.instance) {
      OperationQueue.instance = new OperationQueue();
    }
    return OperationQueue.instance;
  }

  // 添加操作到队列
  public addOperation(operation: Omit<Operation, 'id' | 'timestamp'>): void {
    const newOperation: Operation = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now()
    };

    // 检查是否有相同目标的相反操作，如果有则移除
    this.removeConflictingOperations(newOperation);
    
    this.queue.push(newOperation);
    this.saveToStorage();
  }

  // 移除冲突的操作（例如：先点赞后取消点赞）
  private removeConflictingOperations(newOperation: Operation): void {
    const conflictingTypes: Record<string, string> = {
      'like': 'unlike',
      'unlike': 'like',
      'favorite': 'unfavorite',
      'unfavorite': 'favorite',
      'comment_like': 'comment_unlike',
      'comment_unlike': 'comment_like'
    };

    const conflictingType = conflictingTypes[newOperation.type];
    if (conflictingType) {
      this.queue = this.queue.filter(op => 
        !(op.targetId === newOperation.targetId && 
          op.targetType === newOperation.targetType && 
          (op.type === conflictingType || op.type === newOperation.type))
      );
    }
  }

  // 获取队列中的所有操作
  public getOperations(): Operation[] {
    return [...this.queue];
  }

  // 清空队列
  public clearQueue(): void {
    this.queue = [];
    this.saveToStorage();
  }

  // 移除特定操作
  public removeOperation(operationId: string): void {
    this.queue = this.queue.filter(op => op.id !== operationId);
    this.saveToStorage();
  }

  // 从本地存储加载队列
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load operation queue from storage:', error);
      this.queue = [];
    }
  }

  // 保存队列到本地存储
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save operation queue to storage:', error);
    }
  }

  // 生成唯一ID
  private generateId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取队列大小
  public getQueueSize(): number {
    return this.queue.length;
  }

  // 检查是否有待处理的操作
  public hasPendingOperations(): boolean {
    return this.queue.length > 0;
  }
}