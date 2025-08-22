// 社区API服务
// API完整路径常量
const API_PATHS = {
  GET_POSTS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getPosts',                    // 获取帖子列表
  GET_USER_HISTORY: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getUserHistory',      // 获取用户发布历史
  GET_POST_COMMENTS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getPostComments',    // 获取帖子评论
  CREATE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/createPost',               // 创建新帖子
  LIKE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/likePost',                   // 点赞帖子
  UNLIKE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/unlikePost',               // 取消点赞帖子
  ADD_COMMENT: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/addComment',               // 添加评论
  LIKE_COMMENT: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/likeComment',             // 点赞评论
  UNLIKE_COMMENT: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/unlikeComment',         // 取消点赞评论
  REPLY_TO_COMMENT: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/replyToComment',      // 回复评论
  FAVORITE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/favoritePost',           // 收藏帖子
  UNFAVORITE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/unfavoritePost',       // 取消收藏帖子
  GET_FAVORITE_POSTS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getFavoritePosts',   // 获取用户收藏帖子
  SHARE_POST: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/sharePost',                 // 分享帖子
  SEARCH_POSTS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/searchPosts',              // 搜索帖子
  GET_USER_INFO: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getUserInfo',             // 获取用户信息
  GET_USER_POSTS: 'http://127.0.0.1:4523/m1/5357189-5028853-default/community/getUserPosts'            // 获取用户发布的帖子
} as const;

// 帖子数据结构
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: string;
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
  authorId: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  parentId?: number;
  replies?: Comment[];
}

// 用户信息数据结构
export interface UserInfo {
  id: string;
  username: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
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


// 获取JWT Token
function getAuthToken(): string | null {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// 通用请求函数
async function apiRequest<T>(fullUrl: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

    const response = await fetch(fullUrl, {
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
      const response = await apiRequest<Post[]>(API_PATHS.GET_POSTS);
      return response.data;
    } catch (error) {
      console.error('获取帖子失败:', error);
      throw new Error('获取帖子失败，请稍后重试');
    }
  }

  // 获取用户发布历史
  static async getUserHistory(): Promise<HistoryPost[]> {
    try {
      const response = await apiRequest<HistoryPost[]>(API_PATHS.GET_USER_HISTORY);
      return response.data;
    } catch (error) {
      console.error('获取发布历史失败:', error);
      throw new Error('获取发布历史失败，请稍后重试');
    }
  }

  // 获取帖子评论
  static async getPostComments(postId: number): Promise<Comment[]> {
    try {
      const response = await apiRequest<Comment[]>(`${API_PATHS.GET_POST_COMMENTS}?postId=${postId}`);
      return response.data;
    } catch (error) {
      console.error('获取评论失败:', error);
      throw new Error('获取评论失败，请稍后重试');
    }
  }

  // 创建新帖子
  static async createPost(post: Omit<Post, 'id' | 'date' | 'likes' | 'comments' | 'shares' | 'favorites' | 'isLiked' | 'isFavorited'>): Promise<Post> {
    try {
      const response = await apiRequest<Post>(API_PATHS.CREATE_POST, {
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
      const response = await apiRequest<{ success: boolean; likes: number }>(API_PATHS.LIKE_POST, {
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
      const response = await apiRequest<Comment>(API_PATHS.ADD_COMMENT, {
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
      const response = await apiRequest<{ success: boolean; likes: number }>(API_PATHS.LIKE_COMMENT, {
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
      const response = await apiRequest<{ success: boolean; likes: number }>(API_PATHS.UNLIKE_POST, {
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
      const response = await apiRequest<{ success: boolean; likes: number }>(API_PATHS.UNLIKE_COMMENT, {
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
      const response = await apiRequest<Comment>(API_PATHS.REPLY_TO_COMMENT, {
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
      const response = await apiRequest<{ success: boolean; favorites: number }>(API_PATHS.FAVORITE_POST, {
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
      const response = await apiRequest<{ success: boolean; favorites: number }>(API_PATHS.UNFAVORITE_POST, {
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
      const response = await apiRequest<{ success: boolean; shares: number }>(API_PATHS.SHARE_POST, {
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
      const response = await apiRequest<Post[]>(`${API_PATHS.SEARCH_POSTS}?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('搜索帖子失败:', error);
      throw new Error('搜索帖子失败，请稍后重试');
    }
  }

  // 获取用户收藏的帖子
  static async getFavoritePosts(): Promise<Post[]> {
    try {
      const response = await apiRequest<Post[]>(API_PATHS.GET_FAVORITE_POSTS);
      return response.data;
    } catch (error) {
      console.error('获取收藏帖子失败:', error);
      throw new Error('获取收藏帖子失败，请稍后重试');
    }
  }

  // 获取用户信息
  static async getUserInfo(userId: string): Promise<UserInfo> {
    try {
      const response = await apiRequest<UserInfo>(`${API_PATHS.GET_USER_INFO}?userId=${encodeURIComponent(userId)}`);
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw new Error('获取用户信息失败，请稍后重试');
    }
  }

  // 获取用户发布的帖子
  static async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const response = await apiRequest<Post[]>(`${API_PATHS.GET_USER_POSTS}?userId=${encodeURIComponent(userId)}`);
      return response.data;
    } catch (error) {
      console.error('获取用户帖子失败:', error);
      throw new Error('获取用户帖子失败，请稍后重试');
    }
  }
}