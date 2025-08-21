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
 * 根据算法类别获取视频列表
 * @param category 算法类别
 * @returns Promise<VideoInfo[]>
 */
export const fetchVideosByCategory = async (category: AlgorithmCategory): Promise<VideoInfo[]> => {
  const response = await request<VideoInfo[]>(`${API_PATHS.GET_VIDEOS_BY_CATEGORY}?category=${category}`);
  
  if (!response.success) {
    throw new Error(response.message || '获取视频列表失败');
  }
  
  return response.data;
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
export const fetchAllVideos = async (): Promise<VideoInfo[]> => {
  const response = await request<VideoInfo[]>(API_PATHS.GET_ALL_VIDEOS);
  
  if (!response.success) {
    throw new Error(response.message || '获取视频列表失败');
  }
  
  return response.data;
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
