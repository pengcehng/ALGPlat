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

// 视频信息接口
export interface VideoInfo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: string;
  thumbnail?: string;
}

// API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 算法类别枚举
export enum AlgorithmCategory {
  SORT = 'sort',
  SEARCH = 'search',
  GRAPH = 'graph',
  DYNAMIC_PROGRAMMING = 'dp',
  DATA_STRUCTURE = 'data_structure',
  MACHINE_LEARNING = 'ml'
}

/**
 * 根据算法类别获取视频列表
 * @param category 算法类别
 * @returns Promise<VideoInfo[]>
 */
export const fetchVideosByCategory = async (category: AlgorithmCategory): Promise<VideoInfo[]> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 根据不同类别返回不同的视频数据
    const videoData: Record<AlgorithmCategory, VideoInfo[]> = {
      [AlgorithmCategory.SORT]: [
        {
          id: 1,
          title: '快速排序算法详解',
          description: '深入讲解快速排序的原理、实现和优化技巧，包括分治思想和时间复杂度分析。',
          videoUrl: 'https://example.com/videos/quicksort.mp4',
          duration: '15:30',
          category: '排序算法',
          thumbnail: 'https://example.com/thumbnails/quicksort.jpg'
        },
        {
          id: 2,
          title: '归并排序实现教程',
          description: '从零开始实现归并排序，理解分治算法的精髓和稳定排序的特点。',
          videoUrl: 'https://example.com/videos/mergesort.mp4',
          duration: '12:15',
          category: '排序算法',
          thumbnail: 'https://example.com/thumbnails/mergesort.jpg'
        },
        {
          id: 3,
          title: '堆排序原理与应用',
          description: '学习堆数据结构和堆排序算法，掌握优先队列的实现原理。',
          videoUrl: 'https://example.com/videos/heapsort.mp4',
          duration: '18:45',
          category: '排序算法',
          thumbnail: 'https://example.com/thumbnails/heapsort.jpg'
        }
      ],
      [AlgorithmCategory.SEARCH]: [
        {
          id: 4,
          title: '二分查找算法原理',
          description: '掌握二分查找的核心思想，学会在有序数组中高效查找元素。',
          videoUrl: 'https://example.com/videos/binarysearch.mp4',
          duration: '8:45',
          category: '查找算法',
          thumbnail: 'https://example.com/thumbnails/binarysearch.jpg'
        },
        {
          id: 5,
          title: '深度优先搜索DFS',
          description: '理解深度优先搜索的递归实现，解决图遍历和路径查找问题。',
          videoUrl: 'https://example.com/videos/dfs.mp4',
          duration: '14:20',
          category: '查找算法',
          thumbnail: 'https://example.com/thumbnails/dfs.jpg'
        }
      ],
      [AlgorithmCategory.GRAPH]: [
        {
          id: 6,
          title: 'Dijkstra最短路径算法',
          description: '学习Dijkstra算法求解单源最短路径问题，理解贪心算法的应用。',
          videoUrl: 'https://example.com/videos/dijkstra.mp4',
          duration: '20:30',
          category: '图算法',
          thumbnail: 'https://example.com/thumbnails/dijkstra.jpg'
        },
        {
          id: 7,
          title: '最小生成树算法',
          description: '掌握Kruskal和Prim算法，解决最小生成树问题。',
          videoUrl: 'https://example.com/videos/mst.mp4',
          duration: '16:55',
          category: '图算法',
          thumbnail: 'https://example.com/thumbnails/mst.jpg'
        }
      ],
      [AlgorithmCategory.DYNAMIC_PROGRAMMING]: [
        {
          id: 8,
          title: '动态规划-背包问题',
          description: '从0-1背包问题入门动态规划，理解状态转移方程的设计思路。',
          videoUrl: 'https://example.com/videos/knapsack.mp4',
          duration: '18:20',
          category: '动态规划',
          thumbnail: 'https://example.com/thumbnails/knapsack.jpg'
        },
        {
          id: 9,
          title: '最长公共子序列LCS',
          description: '学习经典的LCS问题，掌握二维动态规划的解题技巧。',
          videoUrl: 'https://example.com/videos/lcs.mp4',
          duration: '13:40',
          category: '动态规划',
          thumbnail: 'https://example.com/thumbnails/lcs.jpg'
        }
      ],
      [AlgorithmCategory.DATA_STRUCTURE]: [
        {
          id: 10,
          title: '哈希表原理与应用',
          description: '深入理解哈希表的实现原理，学习冲突解决和性能优化。',
          videoUrl: 'https://example.com/videos/hashtable.mp4',
          duration: '14:55',
          category: '数据结构',
          thumbnail: 'https://example.com/thumbnails/hashtable.jpg'
        },
        {
          id: 11,
          title: '红黑树平衡原理',
          description: '掌握红黑树的平衡机制，理解自平衡二叉搜索树的设计。',
          videoUrl: 'https://example.com/videos/redblacktree.mp4',
          duration: '22:40',
          category: '数据结构',
          thumbnail: 'https://example.com/thumbnails/redblacktree.jpg'
        }
      ],
      [AlgorithmCategory.MACHINE_LEARNING]: [
        {
          id: 12,
          title: '决策树算法实战',
          description: '从理论到实践，学习决策树的构建过程和剪枝优化技术。',
          videoUrl: 'https://example.com/videos/decisiontree.mp4',
          duration: '25:10',
          category: '机器学习',
          thumbnail: 'https://example.com/thumbnails/decisiontree.jpg'
        },
        {
          id: 13,
          title: 'K-means聚类算法',
          description: '理解无监督学习中的K-means算法，学习聚类分析的基本方法。',
          videoUrl: 'https://example.com/videos/kmeans.mp4',
          duration: '19:25',
          category: '机器学习',
          thumbnail: 'https://example.com/thumbnails/kmeans.jpg'
        }
      ]
    };
    
    return videoData[category] || [];
  } catch (error) {
    console.error('获取视频列表失败:', error);
    throw new Error('获取视频列表失败，请稍后重试');
  }
};

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