<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import CommunitySidebar from './CommunitySidebar.vue';

// 帖子数据结构
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFavorited: boolean; // 新增收藏状态字段
  icon: string; // 新增帖子图标字段
  tags: string[];
}

// 评论数据结构
interface Comment {
  id: number;
  postId: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  parentId?: number; // 父评论ID，用于回复功能
  replies?: Comment[]; // 回复列表
}

// 模拟数据
const posts = ref<Post[]>([
  {
    id: 1,
    title: '算法学习心得：动态规划入门',
    content: '动态规划是解决具有重叠子问题和最优子结构的问题的算法范式。我最近学习了几个经典问题，包括斐波那契数列、最长公共子序列和背包问题，收获颇丰。这里分享一下我的学习方法和理解...',
    author: '算法爱好者',
    avatar: '/user-avatar.png',
    date: '2023-10-15',
    likes: 42,
    comments: 8,
    shares: 5,
    isLiked: false,
    isFavorited: false,
    icon: 'fa-book',
    tags: ['动态规划', '算法学习', '编程技巧']
  },
  {
    id: 2,
    title: '图论算法在实际项目中的应用',
    content: '最近在一个路径规划项目中应用了Dijkstra算法和A*算法，效果非常好。这篇帖子我想分享一下如何将理论算法应用到实际项目中，以及一些优化技巧...',
    author: '编程实践者',
    avatar: '/user-avatar.png',
    date: '2023-10-12',
    likes: 38,
    comments: 12,
    shares: 7,
    isLiked: true,
    isFavorited: true,
    icon: 'fa-project-diagram',
    tags: ['图论', '路径规划', '项目实践']
  },
  {
    id: 3,
    title: '求助：递归算法导致栈溢出问题',
    content: '我在实现一个复杂的树遍历算法时，遇到了栈溢出的问题。我的输入数据规模并不是特别大，但是递归深度似乎很深。有没有好的解决方案？代码片段如下...',
    author: '新手程序员',
    avatar: '/user-avatar.png',
    date: '2023-10-10',
    likes: 15,
    comments: 23,
    shares: 2,
    isLiked: false,
    isFavorited: false,
    icon: 'fa-question-circle',
    tags: ['递归', '栈溢出', '求助']
  }
]);

// 当前选中的帖子
const selectedPost = ref<Post | null>(null);

// 评论列表
const comments = ref<Comment[]>([
  {
    id: 1,
    postId: 1,
    author: '算法专家',
    avatar: '/user-avatar.png',
    content: '动态规划确实是一个强大的工具，建议你也可以看看记忆化搜索，它是DP的另一种实现方式，有时候更直观。',
    date: '2023-10-15',
    likes: 8,
    isLiked: true,
    replies: [
      {
        id: 4,
        postId: 1,
        parentId: 1,
        author: '算法爱好者',
        avatar: '/user-avatar.png',
        content: '感谢专家的建议，我会去研究记忆化搜索的！',
        date: '2023-10-15',
        likes: 2,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    postId: 1,
    author: '学习者',
    avatar: '/user-avatar.png',
    content: '谢谢分享！我一直对状态转移方程的构建有困惑，你的解释很有帮助。',
    date: '2023-10-16',
    likes: 3,
    isLiked: false,
    replies: []
  },
  {
    id: 3,
    postId: 2,
    author: '图论爱好者',
    avatar: '/user-avatar.png',
    content: 'A*算法确实在有启发信息的场景下比Dijkstra更高效，你有没有尝试过双向搜索？',
    date: '2023-10-13',
    likes: 5,
    isLiked: false,
    replies: []
  }
]);

// 回复相关状态
const replyingTo = ref<Comment | null>(null); // 当前正在回复的评论
const replyContent = ref(''); // 回复内容

// 过滤后的帖子列表
const filteredPosts = computed(() => {
  if (showFavoritesOnly.value) {
    return posts.value.filter(post => post.isFavorited);
  }
  return posts.value;
});

// 新帖子表单
const newPost = reactive({
  title: '',
  content: '',
  tags: ''
});

// 新评论
const newComment = ref('');

// 显示新建帖子表单
const showNewPostForm = ref(false);

// 显示帖子详情
const showPostDetail = ref(false);

// 是否只显示收藏的帖子
const showFavoritesOnly = ref(false);

// 切换点赞状态
const toggleLike = (post: Post) => {
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
};

// 切换评论点赞状态
const toggleCommentLike = (comment: Comment) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

// 切换收藏状态
const toggleFavorite = (post: Post) => {
  post.isFavorited = !post.isFavorited;
  if (post.isFavorited) {
    alert(`收藏成功！帖子标题：${post.title}`);
  } else {
    alert(`已取消收藏！帖子标题：${post.title}`);
  }
};

// 分享帖子
const sharePost = (post: Post) => {
  // 实际应用中这里会有分享逻辑
  alert(`分享帖子：${post.title}`);
  post.shares += 1;
};

// 查看帖子详情
const viewPostDetail = (post: Post) => {
  selectedPost.value = post;
  showPostDetail.value = true;
};

// 返回帖子列表
const backToList = () => {
  showPostDetail.value = false;
  selectedPost.value = null;
};

// 提交新帖子
const submitNewPost = () => {
  if (!newPost.title.trim() || !newPost.content.trim()) {
    alert('标题和内容不能为空');
    return;
  }
  
  const tagsArray = newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [];
  
  const post: Post = {
    id: posts.value.length + 1,
    title: newPost.title,
    content: newPost.content,
    author: '当前用户', // 实际应用中应该是登录用户
    avatar: '/user-avatar.png',
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    tags: tagsArray
  };
  
  posts.value.unshift(post);
  
  // 重置表单
  newPost.title = '';
  newPost.content = '';
  newPost.tags = '';
  
  showNewPostForm.value = false;
};

// 提交新评论
const submitNewComment = () => {
  if (!newComment.value.trim() || !selectedPost.value) {
    return;
  }
  
  const comment: Comment = {
    id: comments.value.length + 1,
    postId: selectedPost.value.id,
    author: '当前用户', // 实际应用中应该是登录用户
    avatar: '/user-avatar.png',
    content: newComment.value,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    isLiked: false,
    replies: []
  };
  
  comments.value.push(comment);
  selectedPost.value.comments += 1;
  
  // 重置评论输入
  newComment.value = '';
};

// 显示回复框
const showReplyForm = (comment: Comment) => {
  replyingTo.value = comment;
  replyContent.value = '';
};

// 取消回复
const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = '';
};

// 提交回复
const submitReply = () => {
  if (!replyContent.value.trim() || !replyingTo.value || !selectedPost.value) {
    return;
  }
  
  const reply: Comment = {
    id: comments.value.length + 1,
    postId: selectedPost.value.id,
    parentId: replyingTo.value.id,
    author: '当前用户', // 实际应用中应该是登录用户
    avatar: '/user-avatar.png',
    content: replyContent.value,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    isLiked: false
  };
  
  // 如果回复的是顶级评论
  if (!replyingTo.value.parentId) {
    if (!replyingTo.value.replies) {
      replyingTo.value.replies = [];
    }
    replyingTo.value.replies.push(reply);
  } 
  // 如果回复的是回复
  else {
    const parentComment = comments.value.find(c => c.id === replyingTo.value?.parentId);
    if (parentComment && parentComment.replies) {
      parentComment.replies.push(reply);
    }
  }
  
  selectedPost.value.comments += 1;
  
  // 重置回复状态
  replyingTo.value = null;
  replyContent.value = '';
};

// 获取指定帖子的评论
const getPostComments = (postId: number) => {
  return comments.value.filter(comment => comment.postId === postId);
};
</script>

<template>
  <div class="community-layout">
    <!-- 社区侧边栏，在查看收藏时不显示 -->
    <CommunitySidebar v-if="!showFavoritesOnly" />
    
    <div class="community-container" :class="{ 'detail-view': showPostDetail, 'full-width': showFavoritesOnly }">
      <!-- 社区头部 -->
      <div class="community-header">
        <h1>算法社区</h1>
        <div class="header-actions">
          <button class="secondary-btn" @click="showFavoritesOnly = !showFavoritesOnly">
            <i :class="['fas', 'fa-bookmark', { 'active': showFavoritesOnly }]"></i>
            {{ showFavoritesOnly ? '查看全部' : '查看收藏' }}
          </button>
          <button class="primary-btn" @click="showNewPostForm = true">
            <i class="fas fa-plus"></i> 发布新帖
          </button>
        </div>
      </div>
      
      <!-- 帖子列表视图 -->
      <div v-if="!showPostDetail" class="posts-container">
        <!-- 帖子过滤和排序 -->
        <div class="filter-bar">
          <div class="filter-options">
            <button class="filter-btn active">最新</button>
            <button class="filter-btn">热门</button>
            <button class="filter-btn">未回答</button>
          </div>
          <div class="search-box">
            <input type="text" placeholder="搜索帖子..." />
            <button><i class="fas fa-search"></i></button>
          </div>
        </div>
        
        <!-- 帖子列表 -->
        <div class="post-list">
          <div v-if="filteredPosts.length === 0 && showFavoritesOnly" class="no-favorites">
            <i class="fas fa-bookmark"></i>
            <p>暂无收藏的帖子</p>
            <button class="secondary-btn" @click="showFavoritesOnly = false">查看全部帖子</button>
          </div>
          <div v-for="post in filteredPosts" :key="post.id" class="post-card" @click="viewPostDetail(post)">
            <div class="post-header">
              <div class="post-author">
                <img :src="post.avatar" alt="用户头像" class="author-avatar" />
                <span class="author-name">{{ post.author }}</span>
                <span class="post-date">{{ post.date }}</span>
              </div>
              <div class="post-tags">
                <span v-for="(tag, index) in post.tags" :key="index" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="post-icon-title">
              <i :class="['fas', post.icon, 'post-type-icon']"></i>
              <h3 class="post-title">{{ post.title }}</h3>
            </div>
            <p class="post-excerpt">{{ post.content }}</p>
            <div class="post-footer">
              <div class="post-stats">
                <div class="stat-item" @click.stop="toggleLike(post)">
                  <i :class="['fas', 'fa-heart', { 'liked': post.isLiked }]"></i>
                  {{ post.likes }}
                </div>
                <div class="stat-item">
                  <i class="fas fa-comment"></i>
                  {{ post.comments }}
                </div>
                <div class="stat-item" @click.stop="sharePost(post)">
                  <i class="fas fa-share"></i>
                  {{ post.shares }}
                </div>
                <div class="stat-item" @click.stop="toggleFavorite(post)">
                  <i :class="['fas', 'fa-bookmark', { 'favorited': post.isFavorited }]"></i>
                  {{ post.isFavorited ? '已收藏' : '收藏' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 帖子详情视图 -->
      <div v-if="showPostDetail && selectedPost" class="post-detail">
        <button class="back-btn" @click="backToList">
          <i class="fas fa-arrow-left"></i> 返回列表
        </button>
        
        <div class="detail-post-card">
          <div class="post-header">
            <div class="post-author">
              <img :src="selectedPost.avatar" alt="用户头像" class="author-avatar" />
              <span class="author-name">{{ selectedPost.author }}</span>
              <span class="post-date">{{ selectedPost.date }}</span>
            </div>
            <div class="post-tags">
              <span v-for="(tag, index) in selectedPost.tags" :key="index" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="detail-title-container">
            <i :class="['fas', selectedPost.icon, 'detail-type-icon']"></i>
            <h2 class="post-title">{{ selectedPost.title }}</h2>
          </div>
          <div class="post-content">{{ selectedPost.content }}</div>
          <div class="post-actions">
            <button class="action-btn" @click="toggleLike(selectedPost)">
              <i :class="['fas', 'fa-heart', { 'liked': selectedPost.isLiked }]"></i>
              {{ selectedPost.likes }} {{ selectedPost.isLiked ? '已赞' : '点赞' }}
            </button>
            <button class="action-btn" @click="toggleFavorite(selectedPost)">
              <i :class="['fas', 'fa-bookmark', { 'favorited': selectedPost.isFavorited }]"></i>
              {{ selectedPost.isFavorited ? '已收藏' : '收藏' }}
            </button>
            <button class="action-btn" @click="sharePost(selectedPost)">
              <i class="fas fa-share"></i> {{ selectedPost.shares }} 分享
            </button>
          </div>
        </div>
        
        <!-- 评论区 -->
        <div class="comments-section">
          <h3>评论 ({{ selectedPost.comments }})</h3>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in getPostComments(selectedPost.id)" :key="comment.id" class="comment-card">
              <div class="comment-header">
                <div class="comment-author">
                  <img :src="comment.avatar" alt="评论者头像" class="author-avatar" />
                  <span class="author-name">{{ comment.author }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <button class="action-btn small" @click="toggleCommentLike(comment)">
                  <i :class="['fas', 'fa-heart', { 'liked': comment.isLiked }]"></i>
                  {{ comment.likes }}
                </button>
                <button class="action-btn small" @click="showReplyForm(comment)">
                  <i class="fas fa-reply"></i> 回复
                </button>
              </div>
              
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-card">
                  <div class="comment-header">
                    <div class="comment-author">
                      <img :src="reply.avatar" alt="回复者头像" class="author-avatar" />
                      <span class="author-name">{{ reply.author }}</span>
                      <span class="comment-date">{{ reply.date }}</span>
                    </div>
                  </div>
                  <div class="comment-content">{{ reply.content }}</div>
                  <div class="comment-actions">
                    <button class="action-btn small" @click="toggleCommentLike(reply)">
                      <i :class="['fas', 'fa-heart', { 'liked': reply.isLiked }]"></i>
                      {{ reply.likes }}
                    </button>
                    <button class="action-btn small" @click="showReplyForm(reply)">
                      <i class="fas fa-reply"></i> 回复
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 回复表单 -->
              <div v-if="replyingTo && replyingTo.id === comment.id" class="reply-form">
                <textarea v-model="replyContent" placeholder="回复评论..."></textarea>
                <div class="reply-form-actions">
                  <button class="secondary-btn small" @click="cancelReply">取消</button>
                  <button class="primary-btn small" @click="submitReply">回复</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 添加评论 -->
          <div class="add-comment">
            <textarea v-model="newComment" placeholder="添加评论..."></textarea>
            <button class="primary-btn" @click="submitNewComment">发表评论</button>
          </div>
        </div>
      </div>
      
      <!-- 新建帖子表单 -->
      <div v-if="showNewPostForm" class="new-post-overlay">
        <div class="new-post-form">
          <div class="form-header">
            <h2>发布新帖子</h2>
            <button class="close-btn" @click="showNewPostForm = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label for="post-title">标题</label>
              <input id="post-title" v-model="newPost.title" type="text" placeholder="请输入帖子标题" />
            </div>
            <div class="form-group">
              <label for="post-content">内容</label>
              <textarea id="post-content" v-model="newPost.content" placeholder="请输入帖子内容" rows="6"></textarea>
            </div>
            <div class="form-group">
              <label for="post-tags">标签</label>
              <input id="post-tags" v-model="newPost.tags" type="text" placeholder="输入标签，用逗号分隔" />
            </div>
          </div>
          <div class="form-footer">
            <button class="secondary-btn" @click="showNewPostForm = false">取消</button>
            <button class="primary-btn" @click="submitNewPost">发布</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.community-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  transition: all 0.3s ease;
}

/* 全宽模式样式 */
.community-container.full-width {
  max-width: 100%;
  padding: 20px 40px;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--dark-border);
}

.community-header h1 {
  font-size: 28px;
  color: var(--text-primary);
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.primary-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.secondary-btn {
  background: var(--dark-bg);
  color: var(--text-primary);
  border: 1px solid var(--dark-border);
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: var(--dark-surface);
  border-color: var(--primary-color);
}

/* 过滤栏样式 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-options {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-btn:hover, .filter-btn.active {
  background: var(--primary-color-transparent);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--dark-bg);
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid var(--dark-border);
  overflow: hidden;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
}

.search-box button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
}

.search-box button:hover {
  color: var(--primary-color);
}

/* 帖子列表样式 */
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.post-card {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeIn 0.5s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.post-date, .comment-date {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: var(--dark-bg);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.post-icon-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.post-type-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.post-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  line-height: 1.4;
}

.post-excerpt {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  margin-top: auto;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.stat-item i {
  margin-right: 2px;
}

.stat-item span {
  margin-left: 2px;
}

.stat-item:hover {
  color: var(--primary-color);
}

.stat-item i.liked {
  color: var(--accent-color);
}

.stat-item i.favorited {
  color: #ffa502;
}

.header-actions i.active {
  color: #ffa502;
}

/* 无收藏提示样式 */
.no-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--dark-surface);
  border-radius: 12px;
  border: 1px solid var(--dark-border);
  margin-bottom: 20px;
}

.no-favorites i {
  font-size: 48px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.no-favorites p {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

/* 帖子详情样式 */
.post-detail {
  animation: fadeIn 0.5s ease;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--primary-color);
}

.detail-post-card {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.detail-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.detail-type-icon {
  margin-right: 15px;
  font-size: 24px;
  color: var(--primary-color);
}

.detail-post-card .post-title {
  font-size: 1.8rem;
  margin: 0;
}

.detail-post-card .post-content {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.action-btn:hover {
  background: var(--dark-surface);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.action-btn i.liked {
  color: var(--accent-color);
}

.action-btn.small {
  padding: 4px 8px;
  font-size: 0.85rem;
}

/* 评论区样式 */
.comments-section {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comments-section h3 {
  margin-bottom: 20px;
  color: var(--text-primary);
  font-size: 1.3rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-card {
  background: var(--dark-bg);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--dark-border);
}

.comment-header {
  margin-bottom: 12px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-content {
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

/* 回复列表样式 */
.replies-list {
  margin-top: 12px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-card {
  background: var(--dark-surface);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid var(--dark-border);
}

/* 回复表单样式 */
.reply-form {
  margin-top: 12px;
  margin-left: 24px;
  background: var(--dark-surface);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid var(--dark-border);
}

.reply-form textarea {
  width: 100%;
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 10px;
  color: var(--text-primary);
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 12px;
  transition: border-color 0.3s ease;
}

.reply-form textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.reply-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.add-comment {
  margin-top: 24px;
}

.add-comment textarea {
  width: 100%;
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 16px;
  transition: border-color 0.3s ease;
}

.add-comment textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 新建帖子表单样式 */
.new-post-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.new-post-form {
  background: var(--dark-surface);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--dark-border);
}

.form-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--primary-color);
}

.form-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.form-group input, .form-group textarea {
  width: 100%;
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  padding: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-footer {
  padding: 20px;
  border-top: 1px solid var(--dark-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .post-list {
    grid-template-columns: 1fr;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-options {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .community-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .detail-post-card .post-title {
    font-size: 1.5rem;
  }
}

/* 详情视图样式调整 */
.community-container.detail-view {
  max-width: 800px;
}
</style>