<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import CommunitySidebar from './CommunitySidebar.vue';
import { CommunityApiService, type Post, type Comment, type UserInfo } from '../../api/community';
import { OperationQueue, type Operation } from '../../utils/operationQueue';
import { BatchSyncService } from '../../utils/batchSyncService';
import { PageLifecycleManager } from '../../utils/pageLifecycleManager';

// 数据结构已从API文件导入

// 操作队列和批量同步服务
const operationQueue = OperationQueue.getInstance();
const batchSyncService = BatchSyncService.getInstance();
const pageLifecycleManager = PageLifecycleManager.getInstance();

// 帖子数据（通过API加载）
const posts = ref<Post[]>([]);
const originalPosts = ref<Post[]>([]); // 保存原始帖子数据
const isSearchMode = ref(false); // 是否处于搜索模式

// 加载状态
const isLoading = ref(false);
const error = ref<string | null>(null);

// 数据加载函数
const loadPosts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await CommunityApiService.getPosts();
    console.log('API返回的原始数据:', response);
    // 处理数据，确保author字段是字符串，并初始化isFavorited字段
    const processedPosts = response.map(post => {
      console.log('处理前的post.author:', post.author, typeof post.author);
      const processedPost = {
        ...post,
        author: typeof post.author === 'object' && post.author !== null 
          ? (post.author as any).name || (post.author as any).username || '未知用户'
          : post.author,
        isFavorited: post.isFavorited || false // 确保isFavorited字段存在
      };
      console.log('处理后的post.author:', processedPost.author);
      return processedPost;
    });
    posts.value = processedPosts;
    originalPosts.value = processedPosts; // 保存原始数据
  } catch (err) {
    error.value = '加载帖子失败，请稍后重试';
    console.error('Failed to load posts:', err);
  } finally {
    isLoading.value = false;
  }
};

// 处理搜索结果
const handleSearch = (keyword: string, results: Post[]) => {
  if (keyword.trim()) {
    isSearchMode.value = true;
    posts.value = results;
  } else {
    // 清空搜索，恢复原始数据
    isSearchMode.value = false;
    posts.value = originalPosts.value;
  }
};

// 处理历史帖子查看
const handleViewHistoryPost = async (postId: number) => {
  try {
    // 首先尝试从当前帖子列表中查找
    let targetPost = posts.value.find(post => post.id === postId);
    
    // 如果在当前列表中没找到，从所有帖子中查找
    if (!targetPost) {
      const allPosts = await CommunityApiService.getPosts();
      targetPost = allPosts.find(post => post.id === postId);
    }
    
    if (targetPost) {
      // 显示帖子详情
      selectedPost.value = targetPost;
      showPostDetail.value = true;
    } else {
      console.error('未找到指定的帖子:', postId);
    }
  } catch (err) {
    console.error('查看历史帖子失败:', err);
  }
};

// 当前选中的帖子
const selectedPost = ref<Post | null>(null);

// 评论列表
const comments = ref<Comment[]>([
]);

// 回复相关状态
const replyingTo = ref<Comment | null>(null); // 当前正在回复的评论
const replyContent = ref(''); // 回复内容

// 评论展开状态
const commentsExpandedMap = ref<Record<number, boolean>>({}); // 每个帖子的评论展开状态
const maxCommentsToShow = 3; // 初始显示的评论数量

// 分页相关状态
const currentPage = ref(1); // 当前页码
const postsPerPage = ref(9); // 每页显示的帖子数量，默认9个



// 过滤后的帖子列表
const filteredPosts = computed(() => {
  if (showMySpace.value) {
    // 显示用户发布的帖子
    return userPosts.value;
  } else if (showFavoritesOnly.value) {
    // 直接使用后端返回的收藏帖子数据
    console.log('filteredPosts计算 - 收藏视图模式，直接使用后端数据');
    console.log('收藏帖子数量:', favoritePosts.value.length);
    console.log('收藏帖子:', favoritePosts.value.map(p => ({id: p.id, title: p.title})));
    return favoritePosts.value;
  }
  return posts.value;
});

// 分页后的帖子列表
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage.value;
  const endIndex = startIndex + postsPerPage.value;
  return filteredPosts.value.slice(startIndex, endIndex);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage.value);
});

// 分页信息
const paginationInfo = computed(() => {
  const total = filteredPosts.value.length;
  const start = (currentPage.value - 1) * postsPerPage.value + 1;
  const end = Math.min(currentPage.value * postsPerPage.value, total);
  return { total, start, end };
});

// 新帖子表单
const newPost = reactive({
  title: '',
  content: '',
  tags: ''
});

// 新评论
const newComment = ref('');

// 编辑帖子相关状态
const isEditing = ref(false);
const editingPost = ref<Post | null>(null);
const editForm = reactive({
  title: '',
  content: '',
  tags: ''
});

// 显示新建帖子表单
const showNewPostForm = ref(false);

// 显示帖子详情
const showPostDetail = ref(false);

// 是否只显示收藏的帖子
const showFavoritesOnly = ref(false);

// 是否显示我的空间
const showMySpace = ref(false);

// 用户发布的帖子列表
const userPosts = ref<Post[]>([]);

// 用户空间相关状态
const showUserSpace = ref(false);
const currentViewingUser = ref<string>('');
const userInfo = ref<UserInfo>({
  id: '',
  username: '',
  joinDate: '',
  postsCount: 0,
  likesCount: 0
});
const viewingUserPosts = ref<Post[]>([]);



// 切换收藏视图
const toggleFavoritesView = async () => {
  if (!showFavoritesOnly.value) {
    // 切换到收藏视图
    console.log('切换到收藏视图，直接获取后端收藏数据...');
    showFavoritesOnly.value = true;
    // 收藏视图每页显示8个帖子
    postsPerPage.value = 8;
    
    try {
      // 直接从后端获取收藏帖子数据
      const favoritePostsData = await CommunityApiService.getFavoritePosts();
      // 处理author字段，确保显示用户名而不是用户对象
      const processedFavoritePosts = favoritePostsData.map(post => {
        console.log('处理收藏帖子author字段 - 处理前:', post.author, typeof post.author);
        const processedPost = {
          ...post,
          author: typeof post.author === 'object' && post.author !== null 
            ? (post.author as any).name || (post.author as any).username || '未知用户'
            : post.author
        };
        console.log('处理收藏帖子author字段 - 处理后:', processedPost.author);
        return processedPost;
      });
      favoritePosts.value = processedFavoritePosts;
      console.log('收藏数据加载完成，收藏帖子数量:', processedFavoritePosts.length);
      console.log('收藏帖子:', processedFavoritePosts.map(p => ({id: p.id, title: p.title, author: p.author})));
    } catch (err) {
      console.error('加载收藏数据失败:', err);
      favoritePosts.value = [];
    }
  } else {
    // 切换回全部视图
    console.log('切换回全部视图');
    showFavoritesOnly.value = false;
    // 恢复默认每页9个帖子
    postsPerPage.value = 9;
  }
  currentPage.value = 1; // 重置到第一页
};

// 切换我的空间视图
const toggleMySpace = async () => {
  if (!showMySpace.value) {
    // 切换到我的空间
    showMySpace.value = true;
    showFavoritesOnly.value = false; // 关闭收藏视图
    await loadUserPosts();
    // 我的空间每页显示8个帖子
    postsPerPage.value = 8;
  } else {
    // 切换回社区视图
    showMySpace.value = false;
    postsPerPage.value = 9; // 恢复默认每页9个帖子
    await loadPosts();
  }
  currentPage.value = 1; // 重置到第一页
};

// 加载用户发布的帖子
const loadUserPosts = async () => {
  try {
    // 首先获取用户历史记录
    const historyResponse = await CommunityApiService.getUserHistory();
    
    // 然后获取所有帖子来匹配完整内容
    const allPostsResponse = await CommunityApiService.getPosts();
    
    // 将HistoryPost转换为Post格式，并从完整帖子列表中获取内容
    userPosts.value = historyResponse.map(historyPost => {
      // 在所有帖子中查找匹配的帖子以获取完整内容
      const fullPost = allPostsResponse.find(post => post.id === historyPost.id);
      
      return {
        id: historyPost.id,
        title: historyPost.title,
        content: fullPost ? fullPost.content : '内容暂时无法加载，请稍后重试',
        author: fullPost ? fullPost.author : '当前用户',
        authorId: fullPost ? fullPost.authorId : 'current-user',
        date: historyPost.date,
        likes: fullPost ? fullPost.likes : 0,
        comments: fullPost ? fullPost.comments : 0,
        shares: fullPost ? fullPost.shares : 0,
        favorites: fullPost ? fullPost.favorites : 0,
        isLiked: fullPost ? fullPost.isLiked : false,
        isFavorited: fullPost ? fullPost.isFavorited : false,
        icon: fullPost ? fullPost.icon : 'fa-file-alt',
        tags: fullPost ? fullPost.tags : []
      };
    });
  } catch (err) {
    console.error('加载用户帖子失败:', err);
    userPosts.value = [];
  }
};

// 切换点赞状态
const toggleLike = (post: Post) => {
  try {
    if (post.isLiked) {
      // 添加取消点赞操作到队列
      operationQueue.addOperation({
        type: 'unlike',
        targetId: post.id,
        targetType: 'post'
      });
      // 立即更新UI状态
      post.isLiked = false;
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // 添加点赞操作到队列
      operationQueue.addOperation({
        type: 'like',
        targetId: post.id,
        targetType: 'post'
      });
      // 立即更新UI状态
      post.isLiked = true;
      post.likes = post.likes + 1;
    }
  } catch (err) {
    console.error('点赞操作失败:', err);
  }
};

// 切换评论点赞状态
const toggleCommentLike = (comment: Comment) => {
  try {
    if (comment.isLiked) {
      // 添加取消评论点赞操作到队列
      operationQueue.addOperation({
        type: 'comment_unlike',
        targetId: comment.id,
        targetType: 'comment'
      });
      // 立即更新UI状态
      comment.isLiked = false;
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // 添加评论点赞操作到队列
      operationQueue.addOperation({
        type: 'comment_like',
        targetId: comment.id,
        targetType: 'comment'
      });
      // 立即更新UI状态
      comment.isLiked = true;
      comment.likes = comment.likes + 1;
    }
  } catch (err) {
    console.error('评论点赞操作失败:', err);
  }
};

// 用户收藏的帖子ID列表
const userFavoritePostIds = ref<Set<number>>(new Set());

// 用户收藏的帖子列表（直接从后端获取）
const favoritePosts = ref<Post[]>([]);

// 检查帖子是否被收藏
const isPostFavorited = (postId: number) => {
  const post = posts.value.find(p => p.id === postId) || 
               userPosts.value.find(p => p.id === postId) || 
               viewingUserPosts.value.find(p => p.id === postId);
  return post ? post.isFavorited : userFavoritePostIds.value.has(postId);
};

// 切换收藏状态
const toggleFavorite = (post: Post) => {
  try {
    if (isPostFavorited(post.id)) {
      // 添加取消收藏操作到队列
      operationQueue.addOperation({
        type: 'unfavorite',
        targetId: post.id,
        targetType: 'post'
      });
      // 立即更新UI状态
      userFavoritePostIds.value.delete(post.id);
      post.isFavorited = false;
      post.favorites = Math.max(0, post.favorites - 1);
      alert(`已取消收藏！帖子标题：${post.title}`);
    } else {
      // 添加收藏操作到队列
      operationQueue.addOperation({
        type: 'favorite',
        targetId: post.id,
        targetType: 'post'
      });
      // 立即更新UI状态
      userFavoritePostIds.value.add(post.id);
      post.isFavorited = true;
      post.favorites = post.favorites + 1;
      alert(`收藏成功！帖子标题：${post.title}`);
    }
  } catch (err) {
    console.error('收藏操作失败:', err);
  }
};

// 分享帖子
const sharePost = (post: Post) => {
  try {
    // 添加分享操作到队列
    operationQueue.addOperation({
      type: 'share',
      targetId: post.id,
      targetType: 'post'
    });
    // 立即更新UI状态
    post.shares = post.shares + 1;
    alert(`分享成功！帖子标题：${post.title}`);
  } catch (err) {
    console.error('分享操作失败:', err);
    alert('分享失败，请稍后重试');
  }
};

// 跳转到用户空间
const goToUserSpace = async (authorId: string, username?: string) => {
  try {
    currentViewingUser.value = username || authorId;
    
    // 调用API获取用户信息
    const userData = await CommunityApiService.getUserInfo(authorId);
    userInfo.value = userData;
    
    // 获取该用户发布的帖子
    await loadUserPostsByUserId(authorId);
    
    // 显示用户空间
    showUserSpace.value = true;
    showPostDetail.value = false;
    showMySpace.value = false;
    showFavoritesOnly.value = false;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    alert('获取用户信息失败，请稍后重试');
  }
};

// 加载指定用户的帖子
const loadUserPostsByUserId = async (userId: string) => {
  try {
    // 调用API获取用户发布的帖子
    const userPosts = await CommunityApiService.getUserPosts(userId);
    viewingUserPosts.value = userPosts;
  } catch (err) {
    console.error('加载用户帖子失败:', err);
    viewingUserPosts.value = [];
  }
};

// 返回到社区主页
const backToMainFromUserSpace = () => {
  showUserSpace.value = false;
  currentViewingUser.value = '';
  viewingUserPosts.value = [];
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
const submitNewPost = async () => {
  if (!newPost.title.trim() || !newPost.content.trim()) {
    alert('标题和内容不能为空');
    return;
  }
  
  try {
    const tagsArray = newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [];
    
    const postData = {
      title: newPost.title,
      content: newPost.content,
      author: '当前用户', // 实际应用中应该是登录用户
      authorId: 'current-user-id', // 实际应用中应该是登录用户的ID
      icon: 'fa-file-alt',
      tags: tagsArray
    };
    
    const createdPost = await CommunityApiService.createPost(postData);
    
    // 添加到帖子列表顶部
    posts.value.unshift(createdPost);
    originalPosts.value.unshift(createdPost); // 同时更新原始数据
    
    // 重置表单
    newPost.title = '';
    newPost.content = '';
    newPost.tags = '';
    
    showNewPostForm.value = false;
    
    alert('帖子发布成功！');
  } catch (err) {
    console.error('发布帖子失败:', err);
    alert('发布帖子失败，请稍后重试');
  }
};

// 提交新评论
const submitNewComment = async () => {
  if (!newComment.value.trim() || !selectedPost.value) {
    return;
  }
  
  try {
    const comment = await CommunityApiService.addComment(selectedPost.value.id, newComment.value.trim());
    comments.value.push(comment);
    
    // 更新帖子的评论数
    selectedPost.value.comments++;
    
    // 重置评论输入
    newComment.value = '';
  } catch (err) {
    console.error('发布评论失败:', err);
    alert('发布评论失败，请稍后重试');
  }
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
    authorId: 'current-user-id', // 实际应用中应该是登录用户的ID
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
  
  // 重置回复状态
  replyingTo.value = null;
  replyContent.value = '';
};

// 编辑帖子
const editPost = (post: Post) => {
  editingPost.value = post;
  editForm.title = post.title;
  editForm.content = post.content;
  editForm.tags = post.tags ? post.tags.join(', ') : '';
  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  editingPost.value = null;
  editForm.title = '';
  editForm.content = '';
  editForm.tags = '';
};

// 保存编辑
const saveEdit = () => {
  if (!editForm.title.trim() || !editForm.content.trim() || !editingPost.value) {
    alert('请填写完整的帖子信息');
    return;
  }

  // 更新帖子信息
  editingPost.value.title = editForm.title;
  editingPost.value.content = editForm.content;
  editingPost.value.tags = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

  // 同时更新userPosts中的数据
  const userPostIndex = userPosts.value.findIndex(p => p.id === editingPost.value?.id);
  if (userPostIndex !== -1) {
    userPosts.value[userPostIndex] = { ...editingPost.value };
  }

  // 如果当前显示的是编辑的帖子，更新selectedPost
  if (selectedPost.value && selectedPost.value.id === editingPost.value.id) {
    selectedPost.value = { ...editingPost.value };
  }

  alert('帖子更新成功！');
  cancelEdit();
};

// 删除评论
const deleteComment = (comment: Comment) => {
  if (confirm('确定要删除这条评论吗？')) {
    const index = comments.value.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      comments.value.splice(index, 1);
      alert('评论已删除');
    }
  }
};

// 删除回复
const deleteReply = (parentComment: Comment, reply: Comment) => {
  if (confirm('确定要删除这条回复吗？')) {
    if (parentComment.replies) {
      const index = parentComment.replies.findIndex(r => r.id === reply.id);
      if (index !== -1) {
        parentComment.replies.splice(index, 1);
        alert('回复已删除');
      }
    }
  }
};

// 获取指定帖子的评论
const getPostComments = (postId: number) => {
  return comments.value.filter(comment => comment.postId === postId);
};

// 加载用户收藏状态
const loadUserFavoriteStatus = async () => {
  try {
    console.log('开始加载用户收藏状态...');
    // 获取用户收藏的帖子ID用于更新帖子的收藏状态
    const favoritePostsData = await CommunityApiService.getFavoritePosts();
    const favoriteIds = new Set(favoritePostsData.map(post => post.id));
    userFavoritePostIds.value = favoriteIds;
    
    // 更新帖子的isFavorited字段
    posts.value.forEach(post => {
      post.isFavorited = favoriteIds.has(post.id);
    });
    
    console.log('用户收藏状态加载完成，收藏帖子数量:', favoriteIds.size);
  } catch (err) {
    console.error('加载用户收藏状态失败:', err);
    userFavoritePostIds.value = new Set();
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadPosts();
  await loadUserFavoriteStatus();
  // 初始化页面生命周期管理器
  pageLifecycleManager.initialize();
});

// 组件卸载时同步所有操作
onBeforeUnmount(async () => {
  try {
    await batchSyncService.syncAllOperations();
    console.log('Component unmount: All operations synced successfully');
  } catch (error) {
    console.error('Component unmount: Failed to sync operations:', error);
  }
  // 清理页面生命周期管理器
  pageLifecycleManager.cleanup();
});

// 获取实际评论总数（包括回复）
const getTotalCommentsCount = (postId: number) => {
  const postComments = getPostComments(postId);
  let totalCount = postComments.length;
  
  postComments.forEach(comment => {
    if (comment.replies && comment.replies.length > 0) {
      totalCount += comment.replies.length;
    }
  });
  
  return totalCount;
};

// 获取显示的评论（根据展开状态）
const getDisplayedComments = (postId: number) => {
  const postComments = getPostComments(postId);
  if (commentsExpandedMap.value[postId]) {
    return postComments;
  }
  return postComments.slice(0, maxCommentsToShow);
};

// 切换评论展开状态
const toggleCommentsExpanded = (postId: number) => {
  commentsExpandedMap.value[postId] = !commentsExpandedMap.value[postId];
};

// 检查评论是否展开
const isCommentsExpanded = (postId: number) => {
  return commentsExpandedMap.value[postId] || false;
};

// 分页函数
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 获取分页按钮数组
const getPaginationButtons = computed(() => {
  const buttons = [];
  const maxButtons = 5; // 最多显示5个页码按钮
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= maxButtons) {
    // 如果总页数不超过最大按钮数，显示所有页码
    for (let i = 1; i <= total; i++) {
      buttons.push(i);
    }
  } else {
    // 否则显示当前页附近的页码
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);
    
    // 调整范围以确保显示足够的按钮
    if (end - start + 1 < maxButtons) {
      if (start === 1) {
        end = Math.min(total, start + maxButtons - 1);
      } else {
        start = Math.max(1, end - maxButtons + 1);
      }
    }
    
    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }
  }
  
  return buttons;
});

// 监听过滤条件变化，重置到第一页
watch(showFavoritesOnly, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="community-layout">
    <!-- 社区侧边栏，在查看收藏时不显示 -->
    <CommunitySidebar v-if="!showFavoritesOnly" @search="handleSearch" @viewHistoryPost="handleViewHistoryPost" />
    
    <div class="community-container" :class="{ 'detail-view': showPostDetail, 'full-width': showFavoritesOnly }">
      <!-- 用户空间视图 -->
      <div v-if="showUserSpace" class="user-space-view">
        <button class="back-btn" @click="backToMainFromUserSpace">
          <i class="fas fa-arrow-left"></i> 返回社区
        </button>
        
        <!-- 用户信息卡片 -->
        <div class="user-info-card">
          <div class="user-details">
            <h2 class="user-display-name">{{ userInfo.username }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
            <p class="user-join-date">加入时间: {{ userInfo.joinDate }}</p>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.postsCount }}</span>
              <span class="stat-label">发布帖子</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.likesCount }}</span>
              <span class="stat-label">获得点赞</span>
            </div>
          </div>
        </div>
        
        <!-- 用户发布的帖子 -->
        <div class="user-posts-section">
          <h3>发布的帖子 ({{ viewingUserPosts.length }})</h3>
          <div v-if="viewingUserPosts.length === 0" class="no-posts">
            <i class="fas fa-inbox"></i>
            <p>该用户还没有发布任何帖子</p>
          </div>
          <div v-else class="posts-grid">
            <div v-for="post in viewingUserPosts" :key="post.id" class="post-card" @click="viewPostDetail(post)">
              <div class="post-header">
                <div class="post-type">
                  <i :class="['fas', post.icon]"></i>
                </div>
                <div class="post-meta">
                  <span class="post-date">{{ post.date }}</span>
                </div>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-preview">{{ post.content.substring(0, 100) }}...</p>
              <div class="post-stats">
                <span class="stat"><i class="fas fa-heart"></i> {{ post.likes }}</span>
                <span class="stat"><i class="fas fa-comment"></i> {{ post.comments }}</span>
                <span class="stat"><i class="fas fa-share"></i> {{ post.shares }}</span>
              </div>
              <div class="post-tags">
                <span v-for="(tag, index) in post.tags" :key="index" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 社区主界面 (在用户空间视图时隐藏) -->
      <div v-if="!showUserSpace" class="community-main-view">
        <!-- 社区头部 -->
        <div class="community-header">
        <h1>算法社区</h1>
        <div class="header-actions">
          <button class="secondary-btn" @click="toggleFavoritesView">
            <i :class="['fas', 'fa-bookmark', { 'active': showFavoritesOnly }]"></i>
            {{ showFavoritesOnly ? '查看全部' : '查看收藏' }}
          </button>
          <button class="secondary-btn" @click="toggleMySpace">
            <i :class="['fas', 'fa-user', { 'active': showMySpace }]"></i>
            {{ showMySpace ? '返回社区' : '我的空间' }}
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
        
        <!-- 加载状态和错误提示 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载帖子...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <button @click="loadPosts()" class="retry-button">重试</button>
        </div>
        
        <!-- 帖子列表 -->
        <div v-else class="post-list">
          <div v-if="filteredPosts.length === 0 && showFavoritesOnly" class="no-favorites">
            <i class="fas fa-bookmark"></i>
            <p>暂无收藏的帖子</p>
            <button class="secondary-btn" @click="showFavoritesOnly = false">查看全部帖子</button>
          </div>
          <div v-for="post in paginatedPosts" :key="post.id" class="post-card" @click="viewPostDetail(post)">
            <div class="post-header">
              <div class="post-author">
                <i class="fas fa-user-circle author-avatar-icon" @click.stop="goToUserSpace(post.authorId, post.author)" title="查看用户空间"></i>
                <span class="author-name" @click.stop="goToUserSpace(post.authorId, post.author)" title="查看用户空间">{{ post.author }}</span>
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
              <div class="post-stats-row">
                <div class="stat-item" @click.stop="toggleLike(post)">
                  <i :class="['fas', 'fa-heart', { 'liked': post.isLiked }]"></i>
                  {{ post.likes }}
                </div>
                <div class="stat-item">
                  <i class="fas fa-comment"></i>
                  {{ post.comments }}
                </div>
              </div>
              <div class="post-actions-row">
                <div class="stat-item" @click.stop="sharePost(post)">
                  <i class="fas fa-share"></i>
                  {{ post.shares }}
                </div>
                <div class="stat-item" @click.stop="toggleFavorite(post)">
                  <i :class="['fas', 'fa-bookmark', { 'favorited': isPostFavorited(post.id) }]"></i>
                  {{ post.favorites }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页组件 -->
        <div v-if="totalPages > 1" class="pagination">
          <div class="pagination-info">
            显示第 {{ paginationInfo.start }} - {{ paginationInfo.end }} 条，共 {{ paginationInfo.total }} 条
          </div>
          <div class="pagination-controls">
            <button class="pagination-btn" @click="goToPreviousPage" :disabled="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in getPaginationButtons" 
              :key="page" 
              class="pagination-btn" 
              :class="{ 'active': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button class="pagination-btn" @click="goToNextPage" :disabled="currentPage === totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
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
              <span class="author-name" @click.stop="goToUserSpace(selectedPost.authorId, selectedPost.author)" title="查看用户空间">{{ selectedPost.author }}</span>
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
              {{ selectedPost.likes }}
            </button>
            <button class="action-btn" @click="toggleFavorite(selectedPost)">
              <i :class="['fas', 'fa-bookmark', { 'favorited': isPostFavorited(selectedPost.id) }]"></i>
              {{ selectedPost.favorites }}
            </button>
            <button class="action-btn" @click="sharePost(selectedPost)">
              <i class="fas fa-share"></i>
              {{ selectedPost.shares }}
            </button>
            <!-- 我的空间中显示编辑按钮 -->
            <button v-if="showMySpace" class="action-btn edit-btn" @click="editPost(selectedPost)">
              <i class="fas fa-edit"></i>
              编辑
            </button>
          </div>
        </div>
        
        <!-- 评论区 -->
        <div class="comments-section">
          <h3>评论 ({{ getTotalCommentsCount(selectedPost.id) }})</h3>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in getDisplayedComments(selectedPost.id)" :key="comment.id" class="comment-card">
              <div class="comment-header">
                <div class="comment-author">
                  <span class="author-name" @click.stop="goToUserSpace(comment.authorId, comment.author)" title="查看用户空间">{{ comment.author }}</span>
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
                <!-- 我的空间中显示删除评论按钮 -->
                <button v-if="showMySpace" class="action-btn small delete-btn" @click="deleteComment(comment)">
                  <i class="fas fa-trash"></i> 删除
                </button>
              </div>
              
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-card">
                  <div class="comment-header">
                    <div class="comment-author">
                      <span class="author-name" @click.stop="goToUserSpace(reply.authorId, reply.author)" title="查看用户空间">{{ reply.author }}</span>
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
                    <!-- 我的空间中显示删除回复按钮 -->
                    <button v-if="showMySpace" class="action-btn small delete-btn" @click="deleteReply(comment, reply)">
                      <i class="fas fa-trash"></i> 删除
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
            
            <!-- 展开/收起按钮 -->
            <div v-if="getPostComments(selectedPost.id).length > maxCommentsToShow" class="comments-toggle">
              <button class="toggle-comments-btn" @click="toggleCommentsExpanded(selectedPost.id)">
                <i :class="['fas', isCommentsExpanded(selectedPost.id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                {{ isCommentsExpanded(selectedPost.id) ? '收起评论' : `查看全部 ${getTotalCommentsCount(selectedPost.id)} 条评论` }}
              </button>
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

      <!-- 编辑帖子表单 -->
      <div v-if="isEditing" class="new-post-overlay">
        <div class="new-post-form">
          <div class="form-header">
            <h2>编辑帖子</h2>
            <button class="close-btn" @click="cancelEdit">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label for="edit-title">标题</label>
              <input id="edit-title" v-model="editForm.title" type="text" placeholder="请输入帖子标题" />
            </div>
            <div class="form-group">
              <label for="edit-content">内容</label>
              <textarea id="edit-content" v-model="editForm.content" placeholder="请输入帖子内容" rows="6"></textarea>
            </div>
            <div class="form-group">
              <label for="edit-tags">标签</label>
              <input id="edit-tags" v-model="editForm.tags" type="text" placeholder="输入标签，用逗号分隔" />
            </div>
          </div>
          <div class="form-footer">
            <button class="secondary-btn" @click="cancelEdit">取消</button>
            <button class="primary-btn" @click="saveEdit">保存</button>
          </div>
        </div>
      </div>
      </div> <!-- 社区主界面结束 -->
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.primary-btn:hover::before {
  left: 100%;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.secondary-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: 2px solid transparent;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.secondary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.secondary-btn:hover::before {
  left: 100%;
}

.secondary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(79, 172, 254, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  padding: 8px;
}

.post-card {
  background: linear-gradient(145deg, var(--dark-surface) 0%, rgba(102, 126, 234, 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(102, 126, 234, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeIn 0.6s ease;
  position: relative;
  overflow: hidden;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover::before {
  opacity: 1;
}

.post-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  background: linear-gradient(145deg, var(--dark-surface) 0%, rgba(102, 126, 234, 0.1) 100%);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-name {
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: color 0.3s ease;
  line-height: 1.2;
}

.post-card:hover .author-name {
  color: rgba(102, 126, 234, 0.9);
}

.post-date, .comment-date {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.8;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  color: rgba(102, 126, 234, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.post-card:hover .tag {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.25));
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.post-icon-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 0;
}

.post-type-icon {
  margin-right: 12px;
  font-size: 1.4rem;
  color: var(--primary-color);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.post-card:hover .post-type-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  transform: scale(1.1) rotate(5deg);
}

.post-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.post-card:hover .post-title {
  color: rgba(102, 126, 234, 0.95);
}

.post-excerpt {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.post-card:hover .post-excerpt {
  opacity: 1;
}

.post-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.post-stats-row,
.post-actions-row {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.post-actions-row {
  margin-bottom: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 20px;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid transparent;
}

.stat-item i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.stat-item:hover i {
  transform: scale(1.2);
}

.stat-item i.liked {
  color: var(--accent-color);
  animation: pulse 1.5s infinite;
}

.stat-item i.favorited {
  color: #ffa502;
  animation: bounce 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-3px); }
  60% { transform: translateY(-2px); }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.back-btn:hover::before {
  left: 100%;
}

.back-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
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

.action-btn.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.action-btn.edit-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border: none;
}

.action-btn.delete-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

/* 评论区样式 */
.comments-section {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--dark-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}



.comment-author {
  display: flex;
  align-items: center;
  gap: 10px;
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

/* 评论展开/收起按钮样式 */
.comments-toggle {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.toggle-comments-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.toggle-comments-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.toggle-comments-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.toggle-comments-btn:hover::before {
  left: 100%;
}

.toggle-comments-btn:active {
  transform: translateY(0) scale(1.02);
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

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 24px;
  background: linear-gradient(145deg, var(--dark-surface) 0%, rgba(102, 126, 234, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.pagination-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination-btn {
  background: linear-gradient(145deg, var(--dark-bg) 0%, rgba(102, 126, 234, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: var(--text-secondary);
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
  transition: left 0.5s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(145deg, var(--dark-surface) 0%, rgba(102, 126, 234, 0.15) 100%);
  color: var(--text-primary);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.pagination-btn:hover:not(:disabled)::before {
  left: 100%;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.pagination-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 添加淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-list {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 4px;
  }
  
  .post-card {
    padding: 20px;
  }
  
  .post-stats-row,
  .post-actions-row {
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .stat-item {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  
  .pagination-btn {
    padding: 8px 12px;
    min-width: 36px;
  }
}

@media (max-width: 480px) {
  .post-card {
    padding: 16px;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
  

  
  .post-type-icon {
    font-size: 1.2rem;
    padding: 6px;
  }
}

/* 用户空间样式 */
.user-space-view {
  padding: 20px;
}

.user-info-card {
  background: var(--dark-surface);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid var(--dark-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}



.user-details h2.user-display-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.user-id, .user-join-date {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 4px;
}

.user-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
  padding: 16px 24px;
  background: var(--dark-bg);
  border-radius: 12px;
  border: 1px solid var(--dark-border);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.user-posts-section h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 24px;
  font-weight: 600;
}

.no-posts {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.no-posts i {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-posts p {
  font-size: 1.1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.posts-grid .post-card {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--dark-border);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.posts-grid .post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.posts-grid .post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.posts-grid .post-type i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.posts-grid .post-meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.posts-grid .post-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.posts-grid .post-preview {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.posts-grid .post-stats-row,
.posts-grid .post-actions-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.posts-grid .post-actions-row {
  margin-bottom: 16px;
}

.posts-grid .post-stats-row .stat-item,
.posts-grid .post-actions-row .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.posts-grid .post-stats-row .stat-item i,
.posts-grid .post-actions-row .stat-item i {
  font-size: 0.8rem;
}

.posts-grid .post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.posts-grid .post-tags .tag {
  background: var(--dark-bg);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid var(--dark-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-stats {
    justify-content: center;
    gap: 16px;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

/* 加载状态和错误提示样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.error-message {
  color: #dc3545;
  margin-bottom: 15px;
  font-size: 16px;
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #0056b3;
}

/* 详情视图样式调整 */
.community-container.detail-view {
  max-width: 90%;
  width: 100%;
}
</style>