// 批量同步服务
// 负责将缓存的操作批量发送到服务器

import { OperationQueue, type Operation } from './operationQueue';
import { CommunityApiService } from '../api/community';

export class BatchSyncService {
  private static instance: BatchSyncService;
  private operationQueue: OperationQueue;
  private isSyncing = false;

  private constructor() {
    this.operationQueue = OperationQueue.getInstance();
  }

  public static getInstance(): BatchSyncService {
    if (!BatchSyncService.instance) {
      BatchSyncService.instance = new BatchSyncService();
    }
    return BatchSyncService.instance;
  }

  // 同步所有待处理的操作
  public async syncAllOperations(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    const operations = this.operationQueue.getOperations();
    if (operations.length === 0) {
      console.log('No operations to sync');
      return;
    }

    this.isSyncing = true;
    console.log(`Starting sync of ${operations.length} operations`);

    try {
      // 按类型分组操作以优化网络请求
      const groupedOperations = this.groupOperationsByType(operations);
      
      // 并行处理不同类型的操作
      const syncPromises = Object.entries(groupedOperations).map(([type, ops]) => 
        this.syncOperationsByType(type as Operation['type'], ops)
      );

      await Promise.allSettled(syncPromises);
      
      // 同步成功后清空队列
      this.operationQueue.clearQueue();
      console.log('All operations synced successfully');
    } catch (error) {
      console.error('Failed to sync operations:', error);
      // 不清空队列，保留操作以便下次重试
    } finally {
      this.isSyncing = false;
    }
  }

  // 按类型分组操作
  private groupOperationsByType(operations: Operation[]): Record<string, Operation[]> {
    return operations.reduce((groups, operation) => {
      const key = operation.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(operation);
      return groups;
    }, {} as Record<string, Operation[]>);
  }

  // 按类型同步操作
  private async syncOperationsByType(type: Operation['type'], operations: Operation[]): Promise<void> {
    const promises = operations.map(operation => this.syncSingleOperation(operation));
    
    try {
      await Promise.all(promises);
      console.log(`Synced ${operations.length} ${type} operations`);
    } catch (error) {
      console.error(`Failed to sync ${type} operations:`, error);
      throw error;
    }
  }

  // 同步单个操作
  private async syncSingleOperation(operation: Operation): Promise<void> {
    try {
      switch (operation.type) {
        case 'like':
          await CommunityApiService.likePost(operation.targetId);
          break;
        case 'unlike':
          await CommunityApiService.unlikePost(operation.targetId);
          break;
        case 'favorite':
          await CommunityApiService.favoritePost(operation.targetId);
          break;
        case 'unfavorite':
          await CommunityApiService.unfavoritePost(operation.targetId);
          break;
        case 'share':
          await CommunityApiService.sharePost(operation.targetId);
          break;
        case 'comment_like':
          await CommunityApiService.likeComment(operation.targetId);
          break;
        case 'comment_unlike':
          await CommunityApiService.unlikeComment(operation.targetId);
          break;
        default:
          console.warn(`Unknown operation type: ${operation.type}`);
      }
    } catch (error) {
      console.error(`Failed to sync operation ${operation.id}:`, error);
      throw error;
    }
  }

  // 强制同步（用于页面卸载时）
  public async forceSyncBeforeUnload(): Promise<void> {
    if (!this.operationQueue.hasPendingOperations()) {
      return;
    }

    // 使用 sendBeacon API 进行可靠的页面卸载时数据发送
    const operations = this.operationQueue.getOperations();
    
    try {
      // 如果支持 sendBeacon，使用它来发送数据
      if (navigator.sendBeacon) {
        const data = JSON.stringify({ operations });
        const success = navigator.sendBeacon('/api/community/batch-sync', data);
        
        if (success) {
          this.operationQueue.clearQueue();
          console.log('Operations sent via sendBeacon');
        } else {
          console.warn('sendBeacon failed, operations will be retried on next visit');
        }
      } else {
        // 降级到同步请求（可能被浏览器阻止）
        await this.syncAllOperations();
      }
    } catch (error) {
      console.error('Failed to force sync before unload:', error);
    }
  }

  // 获取待同步操作数量
  public getPendingOperationsCount(): number {
    return this.operationQueue.getQueueSize();
  }

  // 检查是否正在同步
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}