// 点播记录相关API接口

// 定义点播记录接口
export interface PlaybackRecord {
  id: number;
  text: string;
  timestamp: string;
  active: boolean;
  videoUrl?: string;
  duration?: string;
  category?: string;
}

// API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 获取点播记录列表
 * @returns Promise<PlaybackRecord[]>
 */
export const fetchPlaybackRecords = async (): Promise<PlaybackRecord[]> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟后端响应数据
    const mockData: PlaybackRecord[] = [
      { 
        id: 1,
        text: '快速排序算法详解', 
        timestamp: '2024-01-15 14:30', 
        active: false,
        videoUrl: '/videos/quicksort.mp4',
        duration: '15:30',
        category: '排序算法'
      },
      { 
        id: 2,
        text: '归并排序实现教程', 
        timestamp: '2024-01-14 16:45', 
        active: false,
        videoUrl: '/videos/mergesort.mp4',
        duration: '12:15',
        category: '排序算法'
      },
      { 
        id: 3,
        text: '二分查找算法原理', 
        timestamp: '2024-01-12 10:20', 
        active: false,
        videoUrl: '/videos/binarysearch.mp4',
        duration: '8:45',
        category: '查找算法'
      },
      { 
        id: 4,
        text: 'Dijkstra最短路径算法', 
        timestamp: '2024-01-10 09:15', 
        active: false,
        videoUrl: '/videos/dijkstra.mp4',
        duration: '20:30',
        category: '图算法'
      },
      { 
        id: 5,
        text: '动态规划-背包问题', 
        timestamp: '2024-01-08 15:00', 
        active: false,
        videoUrl: '/videos/knapsack.mp4',
        duration: '18:20',
        category: '动态规划'
      },
      { 
        id: 6,
        text: '决策树算法实战', 
        timestamp: '2024-01-05 11:30', 
        active: false,
        videoUrl: '/videos/decisiontree.mp4',
        duration: '25:10',
        category: '机器学习'
      },
      { 
        id: 7,
        text: '哈希表原理与应用', 
        timestamp: '2024-01-03 13:45', 
        active: false,
        videoUrl: '/videos/hashtable.mp4',
        duration: '14:55',
        category: '数据结构'
      },
      { 
        id: 8,
        text: '红黑树平衡原理', 
        timestamp: '2024-01-01 16:20', 
        active: false,
        videoUrl: '/videos/redblacktree.mp4',
        duration: '22:40',
        category: '数据结构'
      }
    ];
    
    return mockData;
  } catch (error) {
    console.error('Failed to fetch playback records:', error);
    throw new Error('获取点播记录失败，请稍后重试');
  }
};

/**
 * 更新点播记录状态
 * @param recordId 记录ID
 * @param active 激活状态
 * @returns Promise<boolean>
 */
export const updatePlaybackRecordStatus = async (recordId: number, active: boolean): Promise<boolean> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 模拟API调用成功
    console.log(`更新记录 ${recordId} 状态为 ${active}`);
    return true;
  } catch (error) {
    console.error('Failed to update playback record status:', error);
    throw new Error('更新记录状态失败');
  }
};

/**
 * 播放视频记录
 * @param record 点播记录
 * @returns Promise<boolean>
 */
export const playVideo = async (record: PlaybackRecord): Promise<boolean> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟播放视频逻辑
    console.log('播放视频:', record.text, record.videoUrl);
    return true;
  } catch (error) {
    console.error('Failed to play video:', error);
    throw new Error('播放视频失败');
  }
};