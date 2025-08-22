// 点播记录相关API接口

// API完整路径常量
const API_PATHS = {
  GET_VIDEOS_BY_CATEGORY: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/getVideosByCategory',  // 按分类获取视频
  GET_RECORDS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/getRecords',                      // 获取播放记录
  UPDATE_RECORD_STATUS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/updateRecordStatus',     // 更新播放记录状态
  PLAY_VIDEO: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/playVideo',                        // 播放视频
  GET_ALL_VIDEOS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/getAllVideos',                 // 获取所有视频
  RECORD_PLAY: 'http://127.0.0.1:4523/m1/5357189-5028853-default/playback/recordPlay'                       // 记录视频播放
} as const;

// 获取JWT Token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// HTTP请求工具函数
const request = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };
    
    // 如果存在token，添加到请求头
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

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

// 定义分页参数接口
export interface PaginationParams {
  page: number;
  limit: number;
}

// 定义分页响应接口
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 算法类别常量
export const AlgorithmCategory = {
  SORT: 'sort',
  SEARCH: 'search',
  GRAPH: 'graph',
  DYNAMIC_PROGRAMMING: 'dp',
  DATA_STRUCTURE: 'data_structure',
  MACHINE_LEARNING: 'ml'
} as const;

export type AlgorithmCategory = typeof AlgorithmCategory[keyof typeof AlgorithmCategory];

/**
 * 按分类获取视频列表（支持分页）
 * @param category 算法分类
 * @param pagination 分页参数
 * @returns Promise<PaginatedResponse<VideoInfo>>
 */
export const fetchVideosByCategoryPaginated = async (
  category: AlgorithmCategory, 
  pagination?: PaginationParams
): Promise<PaginatedResponse<VideoInfo>> => {
  let url = `${API_PATHS.GET_VIDEOS_BY_CATEGORY}?category=${category}`;
  
  if (pagination) {
    url += `&page=${pagination.page}&limit=${pagination.limit}`;
  }
  
  const response = await request<PaginatedResponse<VideoInfo>['data']>(url);
  
  if (!response.success) {
    throw new Error(response.message || '获取分类视频失败');
  }
  
  // 清理返回的视频数据
  const cleanedData = {
    ...response.data,
    items: cleanVideoData(response.data.items)
  };
  
  return {
    success: true,
    data: cleanedData,
    message: response.message
  };
};

/**
 * 按分类获取视频列表（兼容旧版本，不分页）
 * @param category 算法分类
 * @returns Promise<VideoInfo[]>
 */
export const fetchVideosByCategory = async (category: string): Promise<VideoInfo[]> => {
  console.log('请求视频分类:', category);
  
  try {
    const response = await request<VideoInfo[]>(`${API_PATHS.GET_VIDEOS_BY_CATEGORY}?category=${category}`);
    
    console.log('API响应:', response);
    
    if (!response.success) {
      throw new Error(response.message || '获取分类视频失败');
    }
    
    console.log('原始视频数据:', response.data);
    
    // 清理返回的视频数据
    const cleanedData = cleanVideoData(response.data);
    console.log('清理后的视频数据:', cleanedData);
    
    return cleanedData;
  } catch (error) {
    console.warn('API请求失败，使用模拟数据:', error);
    
    // 返回模拟的视频数据用于测试
    const mockVideos: VideoInfo[] = [
      {
        id: 1,
        title: `${category} - 基础教程`,
        description: `这是关于${category}的基础教程视频，适合初学者学习。`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '10:30',
        category: category,
        thumbnail: 'https://via.placeholder.com/320x180/667eea/ffffff?text=Video+1'
      },
      {
        id: 2,
        title: `${category} - 进阶实践`,
        description: `这是关于${category}的进阶实践视频，包含实际案例分析。`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '15:45',
        category: category,
        thumbnail: 'https://via.placeholder.com/320x180/764ba2/ffffff?text=Video+2'
      },
      {
        id: 3,
        title: `${category} - 高级应用`,
        description: `这是关于${category}的高级应用视频，深入探讨复杂场景。`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '20:15',
        category: category,
        thumbnail: 'https://via.placeholder.com/320x180/667eea/ffffff?text=Video+3'
      }
    ];
    
    console.log('使用模拟视频数据:', mockVideos);
    return mockVideos;
  }
};

/**
 * 获取点播记录列表
 * @returns Promise<PlaybackRecord[]>
 */
export const fetchPlaybackRecords = async (): Promise<PlaybackRecord[]> => {
  const response = await request<PlaybackRecord[]>(API_PATHS.GET_RECORDS);
  
  if (!response.success) {
    throw new Error(response.message || '获取点播记录失败');
  }
  
  return response.data;
};

/**
 * 更新点播记录状态
 * @param recordId 记录ID
 * @param active 激活状态
 * @returns Promise<boolean>
 */
export const updatePlaybackRecordStatus = async (recordId: number, active: boolean): Promise<boolean> => {
  const response = await request<boolean>(API_PATHS.UPDATE_RECORD_STATUS, {
    method: 'PUT',
    body: JSON.stringify({ recordId, active })
  });
  
  if (!response.success) {
    throw new Error(response.message || '更新记录状态失败');
  }
  
  return response.data;
};

/**
 * 播放视频记录
 * @param record 点播记录
 * @returns Promise<boolean>
 */
export const playVideo = async (record: PlaybackRecord): Promise<boolean> => {
  const response = await request<boolean>(API_PATHS.PLAY_VIDEO, {
    method: 'POST',
    body: JSON.stringify({ recordId: record.id, videoUrl: record.videoUrl })
  });
  
  if (!response.success) {
    throw new Error(response.message || '播放视频失败');
  }
  
  return response.data;
};

/**
 * 获取所有视频列表
 * @returns Promise<VideoInfo[]>
 */
// 清理视频数据的辅助函数
const cleanVideoData = (videos: VideoInfo[]): VideoInfo[] => {
  return videos.map(video => ({
    ...video,
    // 清理videoUrl中的反引号和多余空格
    videoUrl: video.videoUrl?.replace(/`/g, '').trim() || '',
    // 清理thumbnail中的反引号和多余空格
    thumbnail: video.thumbnail?.replace(/`/g, '').trim() || ''
  }));
};

/**
 * 获取所有视频列表（支持分页）
 * @param pagination 分页参数
 * @returns Promise<PaginatedResponse<VideoInfo>>
 */
export const fetchAllVideos = async (pagination?: PaginationParams): Promise<PaginatedResponse<VideoInfo>> => {
  let url = API_PATHS.GET_ALL_VIDEOS;
  
  if (pagination) {
    url += `?page=${pagination.page}&limit=${pagination.limit}`;
  }
  
  const response = await request<PaginatedResponse<VideoInfo>['data']>(url);
  
  if (!response.success) {
    throw new Error(response.message || '获取视频列表失败');
  }
  
  // 清理返回的视频数据
  const cleanedData = {
    ...response.data,
    items: cleanVideoData(response.data.items)
  };
  
  return {
    success: true,
    data: cleanedData,
    message: response.message
  };
};

/**
 * 获取所有视频列表（兼容旧版本，不分页）
 * @returns Promise<VideoInfo[]>
 */
export const fetchAllVideosLegacy = async (): Promise<VideoInfo[]> => {
  const response = await request<VideoInfo[]>(API_PATHS.GET_ALL_VIDEOS);
  
  if (!response.success) {
    throw new Error(response.message || '获取视频列表失败');
  }
  
  // 清理返回的视频数据
  return cleanVideoData(response.data);
};

/**
 * 记录视频播放
 * @param videoId 视频ID
 * @param category 视频类别
 * @returns Promise<boolean>
 */
export const recordVideoPlay = async (videoId: number, category: string): Promise<boolean> => {
  const response = await request<boolean>(API_PATHS.RECORD_PLAY, {
    method: 'POST',
    body: JSON.stringify({ videoId, category, timestamp: new Date().toISOString() })
  });
  
  if (!response.success) {
    throw new Error(response.message || '记录播放失败');
  }
  
  return response.data;
};
