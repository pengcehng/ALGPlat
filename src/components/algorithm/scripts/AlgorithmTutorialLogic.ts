import { ref, onMounted } from 'vue';
import { 
  fetchVideosByCategory, 
  fetchAllVideos as apiFetchAllVideos,
  recordVideoPlay,
  type VideoInfo, 
  AlgorithmCategory 
} from '../../../api/playback';

// 定义视频对象接口
export interface Video {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
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

  // 是否显示视频列表
  const showVideoList = ref(false);

  // 当前播放的视频
  const currentVideo = ref<Video | null>(null);
  const isPlaying = ref(false);

  // 筛选后的视频
  const filteredVideos = ref<Video[]>([]);

  // 更新筛选视频
  const updateFilteredVideos = () => {
    // 这里可以根据需要实现筛选逻辑
  };

  // 获取所有视频（用于视频教学标签页）
  const fetchAllVideos = async () => {
    isLoadingApiVideos.value = true;
    apiVideoError.value = '';
    
    try {
      console.log('获取所有视频数据');
      
      // 首先尝试使用新的API获取所有视频
      try {
        const allVideos = await apiFetchAllVideos();
        apiVideos.value = allVideos;
        console.log('通过API获取到的所有视频:', allVideos);
        return;
      } catch (apiError) {
        console.warn('API获取所有视频失败，尝试分类获取:', apiError);
      }
      
      // 如果API失败，回退到分类获取
      const allVideos: VideoInfo[] = [];
      const categories = [AlgorithmCategory.SORT, AlgorithmCategory.SEARCH, AlgorithmCategory.GRAPH, AlgorithmCategory.DYNAMIC_PROGRAMMING, AlgorithmCategory.DATA_STRUCTURE, AlgorithmCategory.MACHINE_LEARNING];
      
      for (const category of categories) {
        try {
          const videos = await fetchVideosByCategory(category);
          allVideos.push(...videos);
        } catch (error) {
          console.warn(`获取分类 ${category} 的视频失败:`, error);
        }
      }
      
      apiVideos.value = allVideos;
      console.log('通过分类获取到的所有视频:', allVideos);
      
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

    // 如果是视频教学分类，直接显示所有视频
    if (category === 'videoTutorial') {
      selectedType.value = 'videoTutorial';
      selectedCategory.value = null;
      selectedItem.value = null;
      showVideoList.value = true;
      await fetchAllVideos();
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
          const videoList = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
          apiVideos.value = videoList;
          
          if (videoList.length === 0) {
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
      const videoList = await fetchVideosByCategory(AlgorithmCategory.DATA_STRUCTURE);
      const filteredVideos = videoList.filter(video =>
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
      const videoList = await fetchVideosByCategory(type.key);
      apiVideos.value = videoList;
      
      if (videoList.length === 0) {
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

  // 组件挂载时初始化筛选视频
  onMounted(() => {
    updateFilteredVideos();
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
    filteredVideos,
    
    // 方法
    handleCategoryChange,
    handleDataStructureClick,
    handleAlgorithmClick,
    handleApiVideoClick,
    playVideo,
    closePlayer,
    goBack,
    getSelectedItemName,
    getSelectedItemDescription,
    updateFilteredVideos,
    fetchAllVideos
  };
}