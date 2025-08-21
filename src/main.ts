import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { PageLifecycleManager } from './utils/pageLifecycleManager'
import { BatchSyncService } from './utils/batchSyncService'

// 初始化页面生命周期管理器
const pageLifecycleManager = PageLifecycleManager.getInstance();
const batchSyncService = BatchSyncService.getInstance();

// 设置路由守卫，在路由切换时同步操作
router.beforeEach(async (to, from, next) => {
  // 如果离开社区相关页面，同步操作
  if (from.path.includes('/community') && !to.path.includes('/community')) {
    try {
      await batchSyncService.syncAllOperations();
      console.log('Route change: Operations synced before leaving community');
    } catch (error) {
      console.error('Route change: Failed to sync operations:', error);
    }
  }
  next();
});

// 初始化页面生命周期管理器
pageLifecycleManager.initialize();

createApp(App)
  .use(router)
  .mount('#app')
