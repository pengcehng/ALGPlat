import { ref, onMounted, onUnmounted } from 'vue';
import { 
  fetchVideosByCategory, 
  fetchVideosByCategoryPaginated,
  fetchAllVideos as apiFetchAllVideos,
  recordVideoPlay,
  type VideoInfo, 
  type PaginationParams,
  type PaginatedResponse,
  AlgorithmCategory 
} from '../../../api/playback';
import { videoCache } from '../../../utils/videoCache';

// 定义视频源接口
export interface VideoSource {
  url: string;
  quality: string;
  resolution: string;
  bitrate: number;
  codec: string;
  type: string;
}

// 定义视频对象接口
export interface Video {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  // 多分辨率视频源支持
  sources?: VideoSource[];
  // 视频元数据
  metadata?: {
    duration: number;
    originalResolution: string;
    fileSize: number;
    encoding: string;
  };
}

// 数据结构类型配置
export const dataStructureTypes = ref([
  { key: 'array', label: '数组', icon: '📊', description: '线性数据结构，支持随机访问' },
  { key: 'linkedList', label: '链表', icon: '🔗', description: '动态数据结构，支持高效插入删除' },
  { key: 'stack', label: '栈', icon: '📚', description: '后进先出(LIFO)的数据结构' },
  { key: 'queue', label: '队列', icon: '🚶‍♂️', description: '先进先出(FIFO)的数据结构' },
  { key: 'tree', label: '树', icon: '🌳', description: '层次化的非线性数据结构' },
  { key: 'graph', label: '图', icon: '🕸️', description: '由节点和边组成的复杂数据结构' },
  { key: 'hashTable', label: '哈希表', icon: '🔍', description: '基于哈希函数的快速查找结构' }
]);

// 算法类型配置
export const algorithmTypes = ref([
  { key: AlgorithmCategory.SORT, label: '排序算法', icon: '🔢', description: '对数据进行排序的算法' },
  { key: AlgorithmCategory.SEARCH, label: '查找算法', icon: '🔍', description: '在数据中查找特定元素的算法' },
  { key: AlgorithmCategory.GRAPH, label: '图算法', icon: '🕸️', description: '处理图结构的专门算法' },
  { key: AlgorithmCategory.DYNAMIC_PROGRAMMING, label: '动态规划', icon: '📊', description: '通过分解子问题求解最优解' },
  { key: AlgorithmCategory.DATA_STRUCTURE, label: '数据结构算法', icon: '🏗️', description: '数据结构相关的操作算法' },
  { key: AlgorithmCategory.MACHINE_LEARNING, label: '机器学习', icon: '🤖', description: '机器学习相关算法' }
]);

// 算法教程逻辑组合函数
export function useAlgorithmTutorial() {
  // 当前选中的类型和分类
  const selectedType = ref<'dataStructure' | 'algorithm' | 'videoTutorial' | null>(null);
  const selectedCategory = ref<string | null>(null);
  const selectedItem = ref<string | null>(null);

  // 视频数据和状态
  const apiVideos = ref<VideoInfo[]>([]);
  const isLoadingApiVideos = ref(false);
  const apiVideoError = ref('');

  // 分页状态
  const currentPage = ref(1);
  const limit = ref(12); // 每页显示12个视频
  const totalPages = ref(0);
  const totalCount = ref(0);

  // 是否显示视频列表
  const showVideoList = ref(false);

  // 当前播放的视频
  const currentVideo = ref<Video | null>(null);
  const isPlaying = ref(false);

  // 获取指定分类的视频
  const fetchCategoryVideos = async (category: AlgorithmCategory, page: number = 1) => {
    isLoadingApiVideos.value = true;
    apiVideoError.value = '';
    
    try {
      console.log('获取分类视频:', category, '页码:', page);
      const pagination: PaginationParams = {
        page,
        limit: limit.value
      };
      
      const response = await fetchVideosByCategoryPaginated(category, pagination);
      apiVideos.value = response.data.items;
      currentPage.value = response.data.page;
      totalPages.value = response.data.totalPages;
      totalCount.value = response.data.total;
      
      console.log('分类视频分页信息:', {
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalCount: response.data.total,
        limit: response.data.limit,
        videosCount: response.data.items.length
      });
      
      console.log('获取到的分类视频:', response.data);
      
      if (response.data.items.length === 0) {
        apiVideoError.value = '该分类暂无视频数据';
      }
    } catch (error) {
      console.error('获取分类视频失败:', error);
      apiVideoError.value = error instanceof Error ? error.message : '获取视频数据失败，请稍后重试';
    } finally {
      isLoadingApiVideos.value = false;
    }
  };

  // 获取所有视频（用于视频教学标签页）
  const fetchAllVideos = async (page: number = 1) => {
    isLoadingApiVideos.value = true;
    apiVideoError.value = '';
    
    try {
      console.log('获取所有视频数据，页码:', page);
      
      // 首先尝试使用新的API获取所有视频
      try {
        const pagination: PaginationParams = {
          page,
          limit: limit.value
        };
        
        const response = await apiFetchAllVideos(pagination);
        
        // 验证和清理视频数据
        const cleanedVideos = response.data.items.filter(video => {
          // 过滤掉无效的视频数据
          return video.id && video.title && video.videoUrl && video.videoUrl.trim() !== '';
        }).map(video => ({
          ...video,
          // 确保URL格式正确
          videoUrl: video.videoUrl.replace(/`/g, '').trim(),
          thumbnail: video.thumbnail?.replace(/`/g, '').trim() || '/default-thumbnail.jpg'
        }));
        
        apiVideos.value = cleanedVideos;
        currentPage.value = response.data.page;
        totalPages.value = response.data.totalPages;
        totalCount.value = response.data.total;
        
        console.log('API分页信息:', {
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalCount: response.data.total,
          limit: response.data.limit,
          videosCount: cleanedVideos.length
        });
        
        console.log('通过API获取到的所有视频:', response.data);
        
        // 确保分页控件显示：如果API返回的总页数小于等于1，强制设置为多页
        if (response.data.totalPages <= 1 && cleanedVideos.length > 0) {
          console.log('API返回数据不支持分页，强制设置分页显示');
          // 强制设置分页：确保分页控件显示
          totalPages.value = Math.max(2, Math.ceil(cleanedVideos.length / limit.value));
          totalCount.value = Math.max(cleanedVideos.length, totalPages.value * limit.value);
          
          console.log('强制分页信息:', {
            currentPage: page,
            totalPages: totalPages.value,
            totalCount: totalCount.value,
            limit: limit.value,
            videosCount: cleanedVideos.length
          });
        }
        
        // 智能预加载视频
        preloadVideosIntelligently(cleanedVideos);
        return;
      } catch (apiError) {
        console.warn('API获取所有视频失败，尝试分类获取:', apiError);
      }
      
      // 如果API失败，回退到分类获取
      const allVideos: VideoInfo[] = [];
      const categories = [AlgorithmCategory.SORT, AlgorithmCategory.SEARCH, AlgorithmCategory.GRAPH, AlgorithmCategory.DYNAMIC_PROGRAMMING, AlgorithmCategory.DATA_STRUCTURE, AlgorithmCategory.MACHINE_LEARNING];
      
      for (const category of categories) {
        try {
          const response = await fetchVideosByCategory(category);
          allVideos.push(...response);
        } catch (error) {
          console.warn(`获取分类 ${category} 的视频失败:`, error);
        }
      }
      
      // 如果所有API都失败，显示错误信息
      if (allVideos.length === 0) {
        console.log('未获取到任何视频数据');
        apiVideoError.value = '暂无视频数据，请稍后重试';
      } else {
        // 设置分页信息（回退逻辑）
        currentPage.value = page;
        totalPages.value = Math.max(2, Math.ceil(allVideos.length / limit.value));
        totalCount.value = allVideos.length;
        
        console.log('回退逻辑分页信息:', {
          currentPage: page,
          totalPages: totalPages.value,
          totalCount: totalCount.value,
          limit: limit.value,
          videosCount: allVideos.length
        });
      }
      
      apiVideos.value = allVideos;
      console.log('最终获取到的所有视频:', allVideos);
      
      // 智能预加载视频
      preloadVideosIntelligently(allVideos);
      
      if (allVideos.length === 0) {
        apiVideoError.value = '暂无视频数据，请稍后重试';
      }
    } catch (error) {
      console.error('获取所有视频失败:', error);
      apiVideoError.value = error instanceof Error ? error.message : '获取视频数据失败，请稍后重试';
    } finally {
      isLoadingApiVideos.value = false;
    }
  };

  // 处理头部导航栏的分类变化事件
  const handleCategoryChange = async (data: { category: string; subCategory?: string; item?: string }) => {
    console.log('Category change:', data);

    const { category, subCategory, item } = data;

    // 重置分页状态
    resetPagination();

    // 设置当前选中的类型和分类
    selectedType.value = category as 'dataStructure' | 'algorithm';
    selectedCategory.value = subCategory || null;
    selectedItem.value = item || null;

    // 如果没有选择详细的类别（只选择了数据结构或算法），显示全部视频
    if ((category === 'dataStructure' || category === 'algorithm') && !subCategory) {
      showVideoList.value = true;
      await fetchAllVideos();
      return;
    }

    // 如果选择了具体的子分类，根据分类获取视频
    if (subCategory) {
      showVideoList.value = true;
      await fetchCategoryVideos(subCategory as AlgorithmCategory);
      return;
    }

    // 如果有具体的项目选择，则获取视频
    if (item) {
      selectedItem.value = item;
      showVideoList.value = true;

      // 根据主分类决定调用哪个API
      if (category === 'dataStructure') {
        selectedType.value = 'dataStructure';
        selectedCategory.value = item;
        isLoadingApiVideos.value = true;
        apiVideoError.value = '';
        apiVideos.value = [];

        try {
          const response = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
          apiVideos.value = response;
          
          if (response.length === 0) {
            apiVideoError.value = '暂无数据结构相关视频内容';
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '获取数据结构视频失败，请稍后重试';
          apiVideoError.value = errorMessage;
          console.error('Failed to fetch data structure videos:', err);
          
          // 显示用户友好的错误信息
          if (errorMessage.includes('网络')) {
            apiVideoError.value = '网络连接异常，请检查网络后重试';
          } else if (errorMessage.includes('404')) {
            apiVideoError.value = '视频资源暂时不可用，请稍后重试';
          }
        } finally {
          isLoadingApiVideos.value = false;
        }
      } else if (category === 'algorithm') {
        selectedType.value = 'algorithm';
        // 根据子分类获取对应的算法视频
        if (subCategory) {
          const algorithmType = algorithmTypes.value.find(type => type.key === subCategory);
          if (algorithmType) {
            await handleAlgorithmClick(algorithmType);
          }
        }
      }
    } else {
      // 如果没有具体项目，隐藏视频列表
      showVideoList.value = false;
      selectedItem.value = null;
    }
  };

  // 处理数据结构类型点击（保留作为备用）
  const handleDataStructureClick = async (type: any) => {
    selectedType.value = 'dataStructure';
    selectedCategory.value = type.key;
    isLoadingApiVideos.value = true;
    apiVideoError.value = '';
    apiVideos.value = [];

    try {
      const response = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
      const filteredVideos = response.filter(video =>
        video.title.toLowerCase().includes(type.key.toLowerCase()) ||
        video.description.toLowerCase().includes(type.key.toLowerCase())
      );
      
      apiVideos.value = filteredVideos;
      
      if (filteredVideos.length === 0) {
        apiVideoError.value = `暂无关于"${type.label}"的视频内容`;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据结构视频失败，请稍后重试';
      apiVideoError.value = errorMessage;
      console.error('Failed to fetch data structure videos:', err);
      
      // 显示用户友好的错误信息
      if (errorMessage.includes('网络')) {
        apiVideoError.value = '网络连接异常，请检查网络后重试';
      } else if (errorMessage.includes('404')) {
        apiVideoError.value = '视频资源暂时不可用，请稍后重试';
      }
    } finally {
      isLoadingApiVideos.value = false;
    }
  };

  // 处理算法类型点击（保留作为备用）
  const handleAlgorithmClick = async (type: any) => {
    selectedType.value = 'algorithm';
    selectedCategory.value = type.key;
    isLoadingApiVideos.value = true;
    apiVideoError.value = '';
    apiVideos.value = [];

    try {
      const response = await fetchVideosByCategory(type.key);
      apiVideos.value = response;
      
      if (response.length === 0) {
        apiVideoError.value = `暂无关于"${type.label}"的视频内容`;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取算法视频失败，请稍后重试';
      apiVideoError.value = errorMessage;
      console.error('Failed to fetch algorithm videos:', err);
      
      // 显示用户友好的错误信息
      if (errorMessage.includes('网络')) {
        apiVideoError.value = '网络连接异常，请检查网络后重试';
      } else if (errorMessage.includes('404')) {
        apiVideoError.value = '视频资源暂时不可用，请稍后重试';
      } else if (errorMessage.includes('500')) {
        apiVideoError.value = '服务器暂时不可用，请稍后重试';
      }
    } finally {
      isLoadingApiVideos.value = false;
    }
  };

  // 处理API视频点击
  const handleApiVideoClick = async (video: VideoInfo) => {
    try {
      // 调试信息：检查视频数据
      console.log('点击的视频数据:', video);
      console.log('视频URL:', video.videoUrl);
      
      // 记录视频播放行为
      await recordVideoPlay(video.id, video.category);
      
      // 将API视频转换为本地Video格式
      const localVideo: Video = {
        id: video.id,
        categoryId: 1,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail || '/default-thumbnail.jpg',
        videoUrl: video.videoUrl
      };
      
      console.log('转换后的本地视频数据:', localVideo);
      
      // 预加载当前视频（高优先级）
      videoCache.preloadVideo(video.videoUrl, { priority: 'high' });
      
      // 智能预加载相关视频
      const currentIndex = apiVideos.value.findIndex(v => v.id === video.id);
      if (currentIndex !== -1) {
        const videoUrls = apiVideos.value.map(v => v.videoUrl);
        videoCache.smartPreload(currentIndex, videoUrls);
      }
      
      playVideo(localVideo);
    } catch (error) {
      console.error('处理视频点击失败:', error);
      // 即使记录失败，也要播放视频
      const localVideo: Video = {
        id: video.id,
        categoryId: 1,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail || '/default-thumbnail.jpg',
        videoUrl: video.videoUrl
      };
      
      // 仍然尝试预加载
      videoCache.preloadVideo(video.videoUrl, { priority: 'high' });
      
      playVideo(localVideo);
    }
  };

  // 播放视频
  const playVideo = (video: Video) => {
    currentVideo.value = video;
    isPlaying.value = true;
  };

  // 关闭视频播放器
  const closePlayer = () => {
    isPlaying.value = false;
    currentVideo.value = null;
  };

  // 返回主页面
  const goBack = () => {
    selectedType.value = null;
    selectedCategory.value = null;
    apiVideos.value = [];
    apiVideoError.value = '';
  };

  // 获取选中项的名称
  const getSelectedItemName = () => {
    if (!selectedItem.value) return '';

    if (selectedType.value === 'dataStructure') {
      const item = dataStructureTypes.value.find(type => type.key === selectedItem.value);
      return item ? item.label : '';
    } else if (selectedType.value === 'algorithm') {
      const item = algorithmTypes.value.find(type => type.key === selectedItem.value);
      return item ? item.label : '';
    }

    return '';
  };

  // 获取选中项的描述
  const getSelectedItemDescription = () => {
    if (!selectedItem.value) return '';

    if (selectedType.value === 'dataStructure') {
      const item = dataStructureTypes.value.find(type => type.key === selectedItem.value);
      return item ? item.description : '';
    } else if (selectedType.value === 'algorithm') {
      const item = algorithmTypes.value.find(type => type.key === selectedItem.value);
      return item ? item.description : '';
    }

    return '';
  };

  // 智能预加载视频
  const preloadVideosIntelligently = (videos: VideoInfo[]) => {
    if (videos.length === 0) return;
    
    // 预加载前3个视频（用户最可能观看的）
    const priorityVideos = videos.slice(0, 3).map(v => v.videoUrl);
    videoCache.preloadVideoList(priorityVideos, { priority: 'medium' });
    
    // 延迟预加载其他视频
    setTimeout(() => {
      const remainingVideos = videos.slice(3, 8).map(v => v.videoUrl);
      videoCache.preloadVideoList(remainingVideos, { priority: 'low' });
    }, 2000);
  };
  
  // 获取视频缓存状态
  const getVideoCacheStatus = (videoUrl: string) => {
    return videoCache.isCached(videoUrl);
  };
  
  // 获取缓存统计信息
  const getCacheStats = () => {
    return videoCache.getCacheStats();
  };

  // 处理分页变化
  const handlePageChange = async (page: number) => {
    if (page === currentPage.value) return;
    
    if (selectedType.value === 'videoTutorial') {
      // 视频教学标签页
      await fetchAllVideos(page);
    } else if (selectedCategory.value && selectedItem.value) {
      // 分类页面
      const category = selectedItem.value as AlgorithmCategory;
      await fetchCategoryVideos(category, page);
    }
  };

  // 重置分页状态
  const resetPagination = () => {
    currentPage.value = 1;
    totalPages.value = 0;
    totalCount.value = 0;
  };

  // 组件挂载时初始化并获取所有视频
  onMounted(() => {
    // 自动获取并显示所有视频
    showVideoList.value = true;
    fetchAllVideos();
  });
  
  // 组件卸载时清理缓存
  onUnmounted(() => {
    // 不完全清理缓存，只清理过期项
    // videoCache.destroy(); // 如果需要完全清理可以取消注释
  });

  return {
    // 状态
    selectedType,
    selectedCategory,
    selectedItem,
    apiVideos,
    isLoadingApiVideos,
    apiVideoError,
    showVideoList,
    currentVideo,
    isPlaying,
    
    // 分页状态
    currentPage,
    limit,
    totalPages,
    totalCount,
    
    // 方法
    handleCategoryChange,
    handleDataStructureClick,
    handleAlgorithmClick,
    handleApiVideoClick,
    playVideo,
    closePlayer,
    goBack,
    getSelectedItemName,
    handlePageChange,
    resetPagination,
    getSelectedItemDescription,
    fetchAllVideos,
    fetchCategoryVideos,
    
    // 缓存相关方法
    getVideoCacheStatus,
    getCacheStats
  };
}