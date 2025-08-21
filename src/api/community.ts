// 社区API服务

// 帖子数据结构
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  favorites: number;
  isLiked: boolean;
  isFavorited: boolean;
  icon: string;
  tags: string[];
}

// 评论数据结构
export interface Comment {
  id: number;
  postId: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  parentId?: number;
  replies?: Comment[];
}

// 历史帖子数据结构
export interface HistoryPost {
  id: number;
  title: string;
  date: string;
}

// API响应结构
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API基础URL
const API_BASE_URL = 'http://localhost:8080';

// 获取JWT Token
function getAuthToken(): string | null {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// 通用请求函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
}

// 社区API服务类
export class CommunityApiService {
  // 获取所有帖子
  static async getPosts(): Promise<Post[]> {
    try {
      const response = await apiRequest<Post[]>('/community/getPosts');
      return response.data;
    } catch (error) {
      console.error('获取帖子失败:', error);
      throw new Error('获取帖子失败，请稍后重试');
    }
  }

  // 获取用户发布历史
  static async getUserHistory(): Promise<HistoryPost[]> {
    try {
      const response = await apiRequest<HistoryPost[]>('/community/getUserHistory');
      return response.data;
    } catch (error) {
      console.error('获取发布历史失败:', error);
      throw new Error('获取发布历史失败，请稍后重试');
    }
  }

  // 获取帖子评论
  static async getPostComments(postId: number): Promise<Comment[]> {
    try {
      const response = await apiRequest<Comment[]>(`/community/getPostComments?postId=${postId}`);
      return response.data;
    } catch (error) {
      console.error('获取评论失败:', error);
      throw new Error('获取评论失败，请稍后重试');
    }
  }

  // 创建新帖子
  static async createPost(post: Omit<Post, 'id' | 'date' | 'likes' | 'comments' | 'shares' | 'favorites' | 'isLiked' | 'isFavorited'>): Promise<Post> {
    try {
      const response = await apiRequest<Post>('/community/createPost', {
        method: 'POST',
        body: JSON.stringify(post),
      });
      return response.data;
    } catch (error) {
      console.error('创建帖子失败:', error);
      throw new Error('创建帖子失败，请稍后重试');
    }
  }

  // 点赞帖子
  static async likePost(postId: number): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await apiRequest<{ success: boolean; likes: number }>('/community/likePost', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      });
      return response.data;
    } catch (error) {
      console.error('点赞失败:', error);
      throw new Error('点赞失败，请稍后重试');
    }
  }



  // 添加评论
  static async addComment(postId: number, content: string): Promise<Comment> {
    try {
      const response = await apiRequest<Comment>('/community/addComment', {
        method: 'POST',
        body: JSON.stringify({ postId, content }),
      });
      return response.data;
    } catch (error) {
      console.error('添加评论失败:', error);
      throw new Error('添加评论失败，请稍后重试');
    }
  }

  // 点赞评论
  static async likeComment(commentId: number): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await apiRequest<{ success: boolean; likes: number }>('/community/likeComment', {
        method: 'POST',
        body: JSON.stringify({ commentId }),
      });
      return response.data;
    } catch (error) {
      console.error('点赞评论失败:', error);
      throw new Error('点赞评论失败，请稍后重试');
    }
  }

  // 取消点赞帖子
  static async unlikePost(postId: number): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await apiRequest<{ success: boolean; likes: number }>('/community/unlikePost', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      });
      return response.data;
    } catch (error) {
      console.error('取消点赞失败:', error);
      throw new Error('取消点赞失败，请稍后重试');
    }
  }

  // 取消点赞评论
  static async unlikeComment(commentId: number): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await apiRequest<{ success: boolean; likes: number }>('/community/unlikeComment', {
        method: 'POST',
        body: JSON.stringify({ commentId }),
      });
      return response.data;
    } catch (error) {
      console.error('取消点赞评论失败:', error);
      throw new Error('取消点赞评论失败，请稍后重试');
    }
  }

  // 回复评论
  static async replyToComment(commentId: number, content: string): Promise<Comment> {
    try {
      const response = await apiRequest<Comment>('/community/replyToComment', {
        method: 'POST',
        body: JSON.stringify({ commentId, content }),
      });
      return response.data;
    } catch (error) {
      console.error('回复评论失败:', error);
      throw new Error('回复评论失败，请稍后重试');
    }
  }

  // 收藏帖子
  static async favoritePost(postId: number): Promise<{ success: boolean; favorites: number }> {
    try {
      const response = await apiRequest<{ success: boolean; favorites: number }>('/community/favoritePost', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      });
      return response.data;
    } catch (error) {
      console.error('收藏帖子失败:', error);
      throw new Error('收藏帖子失败，请稍后重试');
    }
  }

  // 取消收藏帖子
  static async unfavoritePost(postId: number): Promise<{ success: boolean; favorites: number }> {
    try {
      const response = await apiRequest<{ success: boolean; favorites: number }>('/community/unfavoritePost', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      });
      return response.data;
    } catch (error) {
      console.error('取消收藏失败:', error);
      throw new Error('取消收藏失败，请稍后重试');
    }
  }

  // 分享帖子
  static async sharePost(postId: number): Promise<{ success: boolean; shares: number }> {
    try {
      const response = await apiRequest<{ success: boolean; shares: number }>('/community/sharePost', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      });
      return response.data;
    } catch (error) {
      console.error('分享帖子失败:', error);
      throw new Error('分享帖子失败，请稍后重试');
    }
  }

  // 搜索帖子
  static async searchPosts(keyword: string): Promise<Post[]> {
    try {
      const response = await apiRequest<Post[]>(`/community/searchPosts?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('搜索帖子失败:', error);
      throw new Error('搜索帖子失败，请稍后重试');
    }
  }
}