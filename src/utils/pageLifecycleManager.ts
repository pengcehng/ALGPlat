// 页面生命周期管理器
// 处理页面关闭、刷新等事件，确保操作数据不丢失

import { BatchSyncService } from './batchSyncService';
import { OperationQueue } from './operationQueue';

export class PageLifecycleManager {
  private static instance: PageLifecycleManager;
  private batchSyncService: BatchSyncService;
  private operationQueue: OperationQueue;
  private isInitialized = false;

  private constructor() {
    this.batchSyncService = BatchSyncService.getInstance();
    this.operationQueue = OperationQueue.getInstance();
  }

  public static getInstance(): PageLifecycleManager {
    if (!PageLifecycleManager.instance) {
      PageLifecycleManager.instance = new PageLifecycleManager();
    }
    return PageLifecycleManager.instance;
  }

  // 初始化页面生命周期监听器
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // 监听页面卸载事件
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // 监听页面隐藏事件（移动端或标签页切换）
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // 监听页面焦点丢失事件
    window.addEventListener('blur', this.handlePageBlur.bind(this));
    
    // 监听路由变化（如果使用Vue Router）
    this.setupRouterGuards();

    this.isInitialized = true;
    console.log('Page lifecycle manager initialized');
  }

  // 清理监听器
  public cleanup(): void {
    if (!this.isInitialized) {
      return;
    }

    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('blur', this.handlePageBlur.bind(this));

    this.isInitialized = false;
    console.log('Page lifecycle manager cleaned up');
  }

  // 处理页面卸载事件
  private handleBeforeUnload(event: BeforeUnloadEvent): string | void {
    if (this.operationQueue.hasPendingOperations()) {
      // 尝试使用 sendBeacon 发送数据
      this.batchSyncService.forceSyncBeforeUnload();
      
      // 显示确认对话框（可选）
      const message = '您有未保存的操作，确定要离开吗？';
      event.returnValue = message;
      return message;
    }
  }

  // 处理页面可见性变化
  private handleVisibilityChange(): void {
    if (document.hidden && this.operationQueue.hasPendingOperations()) {
      // 页面被隐藏时，尝试同步操作
      console.log('Page hidden, attempting to sync operations');
      this.batchSyncService.syncAllOperations().catch(error => {
        console.error('Failed to sync on visibility change:', error);
      });
    }
  }

  // 处理页面失去焦点
  private handlePageBlur(): void {
    if (this.operationQueue.hasPendingOperations()) {
      // 页面失去焦点时，延迟同步操作
      setTimeout(() => {
        if (this.operationQueue.hasPendingOperations()) {
          console.log('Page blurred, attempting to sync operations');
          this.batchSyncService.syncAllOperations().catch(error => {
            console.error('Failed to sync on page blur:', error);
          });
        }
      }, 1000); // 延迟1秒，避免频繁触发
    }
  }

  // 设置路由守卫
  private setupRouterGuards(): void {
    // 这里可以根据实际的路由库进行配置
    // 对于Vue Router，可以在main.ts中设置全局守卫
    console.log('Router guards setup (implement in main.ts)');
  }

  // 手动触发同步
  public async manualSync(): Promise<void> {
    try {
      await this.batchSyncService.syncAllOperations();
      console.log('Manual sync completed');
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  }

  // 获取待同步操作数量
  public getPendingOperationsCount(): number {
    return this.operationQueue.getQueueSize();
  }

  // 检查是否有待同步的操作
  public hasPendingOperations(): boolean {
    return this.operationQueue.hasPendingOperations();
  }
}