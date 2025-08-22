/**
 * 视频缓存和预加载服务
 * 用于优化视频加载性能，提供预加载、缓存和智能加载策略
 */

interface CacheItem {
  url: string;
  timestamp: number;
  preloaded: boolean;
  element?: HTMLVideoElement | HTMLIFrameElement;
  size?: number;
}

interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  preloadMetadata?: boolean;
  preloadVideo?: boolean;
  timeout?: number;
}

interface CacheConfig {
  maxCacheSize: number; // MB
  maxCacheItems: number;
  preloadTimeout: number; // ms
  cleanupInterval: number; // ms
}

export class VideoCache {
  private cache = new Map<string, CacheItem>();
  private preloadQueue: string[] = [];
  private isPreloading = false;
  private config: CacheConfig;
  private cleanupTimer?: number;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxCacheSize: 100, // 100MB
      maxCacheItems: 20,
      preloadTimeout: 10000, // 10秒
      cleanupInterval: 300000, // 5分钟
      ...config
    };

    this.startCleanupTimer();
  }

  /**
   * 预加载视频
   */
  async preloadVideo(url: string, options: PreloadOptions = {}): Promise<boolean> {
    const {
      priority = 'medium',
      preloadMetadata = true,
      preloadVideo = false,
      timeout = this.config.preloadTimeout
    } = options;

    // 检查是否已缓存
    if (this.cache.has(url)) {
      const item = this.cache.get(url)!;
      item.timestamp = Date.now();
      return true;
    }

    // 添加到预加载队列
    if (priority === 'high') {
      this.preloadQueue.unshift(url);
    } else {
      this.preloadQueue.push(url);
    }

    // 开始预加载处理
    this.processPreloadQueue();

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.cache.has(url)) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);

      // 超时处理
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, timeout);
    });
  }

  /**
   * 处理预加载队列
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const url = this.preloadQueue.shift()!;
      
      if (!this.cache.has(url)) {
        await this.loadVideoToCache(url);
      }

      // 检查缓存大小限制
      this.enforceCacheLimits();
    }

    this.isPreloading = false;
  }

  /**
   * 将视频加载到缓存
   */
  private async loadVideoToCache(url: string): Promise<void> {
    try {
      // 判断是否为iframe视频（如YouTube、Bilibili等）
      if (this.isEmbedVideo(url)) {
        await this.preloadIframeVideo(url);
      } else {
        await this.preloadDirectVideo(url);
      }
    } catch (error) {
      console.warn(`视频预加载失败: ${url}`, error);
    }
  }

  /**
   * 预加载iframe视频
   */
  private async preloadIframeVideo(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.loading = 'eager';
      
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error('iframe预加载超时'));
      }, this.config.preloadTimeout);

      iframe.onload = () => {
        clearTimeout(timeout);
        
        // 添加到缓存
        this.cache.set(url, {
          url,
          timestamp: Date.now(),
          preloaded: true,
          element: iframe
        });

        resolve();
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        reject(new Error('iframe加载失败'));
      };

      document.body.appendChild(iframe);
    });
  }

  /**
   * 预加载直接视频文件
   */
  private async preloadDirectVideo(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'metadata';
      video.muted = true;
      video.style.display = 'none';
      
      const timeout = setTimeout(() => {
        reject(new Error('视频预加载超时'));
      }, this.config.preloadTimeout);

      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        
        // 估算视频大小
        const estimatedSize = this.estimateVideoSize(video);
        
        // 添加到缓存
        this.cache.set(url, {
          url,
          timestamp: Date.now(),
          preloaded: true,
          element: video,
          size: estimatedSize
        });

        resolve();
      };

      video.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('视频加载失败'));
      };

      // 开始加载
      video.load();
    });
  }

  /**
   * 判断是否为嵌入式视频
   */
  private isEmbedVideo(url: string): boolean {
    const embedDomains = [
      'youtube.com',
      'youtu.be',
      'bilibili.com',
      'vimeo.com',
      'dailymotion.com'
    ];

    return embedDomains.some(domain => url.includes(domain));
  }

  /**
   * 估算视频大小
   */
  private estimateVideoSize(video: HTMLVideoElement): number {
    // 基于视频时长和分辨率的粗略估算（MB）
    const duration = video.duration || 0;
    const width = video.videoWidth || 720;
    const height = video.videoHeight || 480;
    
    // 假设比特率：720p约2Mbps，1080p约5Mbps
    const bitrate = width >= 1920 ? 5 : width >= 1280 ? 3 : 2;
    
    return (duration * bitrate) / 8; // 转换为MB
  }

  /**
   * 获取缓存的视频
   */
  getCachedVideo(url: string): CacheItem | null {
    const item = this.cache.get(url);
    if (item) {
      item.timestamp = Date.now(); // 更新访问时间
      return item;
    }
    return null;
  }

  /**
   * 检查视频是否已缓存
   */
  isCached(url: string): boolean {
    return this.cache.has(url);
  }

  /**
   * 批量预加载视频列表
   */
  async preloadVideoList(urls: string[], options: PreloadOptions = {}): Promise<void> {
    const promises = urls.map(url => this.preloadVideo(url, options));
    await Promise.allSettled(promises);
  }

  /**
   * 智能预加载：基于用户行为预测
   */
  smartPreload(currentVideoIndex: number, videoList: string[], viewportVideos: string[] = []): void {
    // 预加载当前视频的前后视频
    const preloadIndices = [
      currentVideoIndex + 1,
      currentVideoIndex + 2,
      currentVideoIndex - 1
    ].filter(index => index >= 0 && index < videoList.length);

    preloadIndices.forEach(index => {
      this.preloadVideo(videoList[index], { priority: 'medium' });
    });

    // 预加载视口内的视频
    viewportVideos.forEach(url => {
      this.preloadVideo(url, { priority: 'low' });
    });
  }

  /**
   * 强制执行缓存限制
   */
  private enforceCacheLimits(): void {
    // 检查缓存项数量
    if (this.cache.size > this.config.maxCacheItems) {
      this.evictOldestItems(this.cache.size - this.config.maxCacheItems);
    }

    // 检查缓存大小
    const totalSize = this.getTotalCacheSize();
    if (totalSize > this.config.maxCacheSize) {
      this.evictBySize(totalSize - this.config.maxCacheSize);
    }
  }

  /**
   * 获取总缓存大小
   */
  private getTotalCacheSize(): number {
    let totalSize = 0;
    this.cache.forEach(item => {
      totalSize += item.size || 5; // 默认5MB
    });
    return totalSize;
  }

  /**
   * 驱逐最旧的缓存项
   */
  private evictOldestItems(count: number): void {
    const sortedItems = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (let i = 0; i < count && i < sortedItems.length; i++) {
      const [url, item] = sortedItems[i];
      this.removeCacheItem(url, item);
    }
  }

  /**
   * 按大小驱逐缓存项
   */
  private evictBySize(targetSize: number): void {
    const sortedItems = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => (b.size || 5) - (a.size || 5)); // 优先删除大文件

    let freedSize = 0;
    for (const [url, item] of sortedItems) {
      if (freedSize >= targetSize) break;
      
      freedSize += item.size || 5;
      this.removeCacheItem(url, item);
    }
  }

  /**
   * 移除缓存项
   */
  private removeCacheItem(url: string, item: CacheItem): void {
    // 清理DOM元素
    if (item.element) {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    }
    
    this.cache.delete(url);
  }

  /**
   * 开始清理定时器
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30分钟

    this.cache.forEach((item, url) => {
      if (now - item.timestamp > maxAge) {
        this.removeCacheItem(url, item);
      }
    });
  }

  /**
   * 清空所有缓存
   */
  clearCache(): void {
    this.cache.forEach((item, url) => {
      this.removeCacheItem(url, item);
    });
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): {
    itemCount: number;
    totalSize: number;
    preloadedCount: number;
  } {
    let preloadedCount = 0;
    this.cache.forEach(item => {
      if (item.preloaded) preloadedCount++;
    });

    return {
      itemCount: this.cache.size,
      totalSize: this.getTotalCacheSize(),
      preloadedCount
    };
  }

  /**
   * 销毁缓存服务
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clearCache();
  }
}

// 创建全局视频缓存实例
export const videoCache = new VideoCache();

// 导出类型
export type { CacheItem, PreloadOptions, CacheConfig };