<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { eventBus } from '../eventBus';
import PersonalizedRecommendation from './PersonalizedRecommendation.vue';
import BottomInputBox from './BottomInputBox.vue';

// 控制工具栏和对话框的显示状态
const isAnalyzing = ref(false);
const showTools = ref(true);
const showFeatureMenu = ref(false); // 控制功能菜单的显示状态

// 侧边栏状态
const isSidebarCollapsed = ref(false);

// 输入框引用
const mainTextarea = ref<HTMLTextAreaElement | null>(null);
const nextTextarea = ref<HTMLTextAreaElement | null>(null);

// 输入框高度调整方法
const adjustMainTextareaHeight = () => {
  if (mainTextarea.value) {
    mainTextarea.value.style.height = 'auto';
    const scrollHeight = mainTextarea.value.scrollHeight;
    const maxHeight = 200; // 最大高度
    const minHeight = 60; // 最小高度
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    mainTextarea.value.style.height = newHeight + 'px';
  }
};

const resetMainTextareaHeight = () => {
  if (mainTextarea.value) {
    mainTextarea.value.style.height = '60px'; // 恢复原始高度
  }
};

const adjustNextTextareaHeight = () => {
  if (nextTextarea.value) {
    nextTextarea.value.style.height = 'auto';
    const scrollHeight = nextTextarea.value.scrollHeight;
    const maxHeight = 200; // 最大高度
    const minHeight = 60; // 最小高度
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    nextTextarea.value.style.height = newHeight + 'px';
  }
};

const resetNextTextareaHeight = () => {
  if (nextTextarea.value) {
    nextTextarea.value.style.height = '60px'; // 恢复原始高度
  }
};

// 监听侧边栏切换事件
eventBus.on('toggle-sidebar', (collapsed) => {
  isSidebarCollapsed.value = collapsed;
});

// 关闭功能菜单的点击事件处理函数
const closeFeatureMenuOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 如果点击的不是功能菜单按钮或其子元素，则关闭功能菜单
  if (showFeatureMenu.value && !target.closest('.feature-menu-container')) {
    showFeatureMenu.value = false;
  }
};

// 缩放控制
const zoomLevel = ref(100); // 统一的缩放级别
const showZoomMenu = ref(false);

// 缩放选项
const zoomOptions = [
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
  { value: 110, label: '110%' },
  { value: 120, label: '120%' },
  { value: 130, label: '130%' },
  { value: 150, label: '150%' },
];

// 切换缩放菜单显示
const toggleZoomMenu = () => {
  showZoomMenu.value = !showZoomMenu.value;
};

// 切换功能菜单显示
const toggleFeatureMenu = (event: MouseEvent) => {
  // 阻止事件冒泡，防止点击菜单按钮时触发document的点击事件
  if (event) {
    event.stopPropagation();
  }
  showFeatureMenu.value = !showFeatureMenu.value;
  console.log('功能菜单状态:', showFeatureMenu.value);
};

// 设置缩放级别
const setZoomLevel = (level: number) => {
  zoomLevel.value = level;
  showZoomMenu.value = false;
  
  // 保存用户的缩放偏好到本地存储
  localStorage.setItem('preferredZoomLevel', level.toString());
};

// 增加缩放级别
const increaseZoom = () => {
  const currentIndex = zoomOptions.findIndex(option => option.value === zoomLevel.value);
  if (currentIndex < zoomOptions.length - 1) {
    setZoomLevel(zoomOptions[currentIndex + 1].value);
  }
};

// 减少缩放级别
const decreaseZoom = () => {
  const currentIndex = zoomOptions.findIndex(option => option.value === zoomLevel.value);
  if (currentIndex > 0) {
    setZoomLevel(zoomOptions[currentIndex - 1].value);
  }
};

// 从本地存储加载用户的缩放偏好
onMounted(() => {
  // 加载缩放偏好
  const savedZoomLevel = localStorage.getItem('preferredZoomLevel');
  if (savedZoomLevel) {
    const parsedLevel = parseInt(savedZoomLevel);
    if (!isNaN(parsedLevel) && zoomOptions.some(option => option.value === parsedLevel)) {
      zoomLevel.value = parsedLevel;
    }
  }
  
  // 监听侧边栏状态变化事件
  eventBus.on('toggle-sidebar', (collapsed) => {
    if (collapsed !== undefined) {
      isSidebarCollapsed.value = collapsed;
    } else {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
  });
  
  // 添加点击页面其他区域关闭功能菜单的事件监听
  document.addEventListener('click', closeFeatureMenuOnClickOutside);
});

// 开始分析函数 - 支持连续对话模式
const startAnalysis = () => {
  // 确定当前使用的输入框
  const currentInputValue = isAnalyzing.value ? nextUserInput.value : userInput.value;
  
  if (!currentInputValue.trim()) return; // 防止空输入
  
  // 保存当前问题
  const currentQuestion = currentInputValue;
  
  // 清空当前输入框并重置高度
  if (isAnalyzing.value) {
    nextUserInput.value = '';
    resetNextTextareaHeight();
  } else {
    userInput.value = '';
    resetMainTextareaHeight();
  }
  
  // 显示正在分析状态
  isAnalyzing.value = true;
  
  // 隐藏工具栏，只保留输入区域
  showTools.value = false;
  // 隐藏功能菜单
  showFeatureMenu.value = false;
  
  // 处理输入框样式 - 使用Vue的响应式方式
  // 不再使用DOM操作直接创建新输入框，而是通过Vue的响应式系统控制输入框的显示和隐藏
  // 当第一次发送消息时，我们只需要设置isAnalyzing为true，让Vue的模板系统处理输入框的切换
  
  // 添加当前问题到历史记录中，这会触发Vue的响应式更新
  const newResponseIndex = responseHistory.value.length;
  responseHistory.value.push({
    question: currentQuestion,
    answer: '', // 先设置为空，等待模拟AI分析后更新
    expanded: true,
    questionExpanded: true,
    timestamp: Date.now()
  });
  
  // 模拟AI分析过程
  setTimeout(() => {
    // 生成回答内容
    // 根据历史对话生成更连贯的回答
    let answer;
    if (responseHistory.value.length > 1) {
      // 如果有历史对话，生成连续性回答
      answer = `基于我们之前的对话，对于问题「${currentQuestion}」的分析是：

我将根据您的问题提供详细的算法解析和学习指导。`;
    } else {
      // 首次对话
      answer = `这是对问题「${currentQuestion}」的分析结果：

我将根据您的问题提供详细的算法解析和学习指导。`;
    }
    
    // 更新刚刚添加的历史记录条目的answer字段
    if (newResponseIndex < responseHistory.value.length) {
      responseHistory.value[newResponseIndex].answer = answer;
      // 设置为折叠状态
      responseHistory.value[newResponseIndex].expanded = false;
      responseHistory.value[newResponseIndex].questionExpanded = false;
    }
    
    // 确保滚动到底部显示最新回答
    setTimeout(() => {
      const historySection = document.querySelector('.response-history-section');
      if (historySection) {
        historySection.scrollTop = historySection.scrollHeight;
      }
    }, 200);
    
    // 不再将isAnalyzing设置为false，保持功能按钮的显示
    // isAnalyzing.value = false; // 分析完成
  }, 1000);
};

// 用户输入和响应历史记录
const userInput = ref('');
const nextUserInput = ref(''); // 添加第二个输入框的状态
const responseHistory = ref<Array<{question: string, answer: string, expanded: boolean, questionExpanded: boolean, timestamp: number}>>([]);

// 回复示例相关变量已移除

// 切换展开/折叠状态
const toggleExpand = (index: number) => {
  responseHistory.value[index].expanded = !responseHistory.value[index].expanded;
};

// 切换问题展开/折叠状态
const toggleQuestionExpand = (index: number) => {
  if (!responseHistory.value[index].questionExpanded) {
    responseHistory.value[index].questionExpanded = true;
  } else {
    responseHistory.value[index].questionExpanded = false;
  }
};

// 获取预览内容（前250个字符）
const getPreviewContent = (content: string) => {
  // 创建一个临时的div元素来解析HTML内容
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // 获取纯文本内容
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  if (textContent.length <= 250) return content;
  
  // 截取HTML内容，保留前250个字符的文本
  let currentLength = 0;
  let result = '';
  let inTag = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    result += char;
    
    if (char === '<') {
      inTag = true;
    } else if (char === '>') {
      inTag = false;
    } else if (!inTag) {
      currentLength++;
    }
    
    if (currentLength >= 250 && !inTag) {
      result += '...';
      break;
    }
  }
  
  return result;
};

// 检查内容是否需要折叠
const needsCollapsing = (content: string) => {
  // 创建一个临时的div元素来解析HTML内容
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // 获取纯文本内容
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  return textContent.length > 300;
};

// 检查问题是否需要折叠
const needsQuestionCollapsing = (content: string) => {
  return content.length > 100; // 问题超过100个字符时需要折叠
};

// 获取问题预览内容（前50个字符）
const getQuestionPreviewContent = (content: string) => {
  if (content.length <= 50) return content;
  return content.substring(0, 50) + '...';
};

// 重置分析函数 - 只重置分析状态和工具栏，不清空对话历史
const resetAnalysis = () => {
  isAnalyzing.value = false;
  // 显示工具栏
  showTools.value = true;
  
  // 清空两个输入框
  userInput.value = '';
  nextUserInput.value = '';
};

// 清空对话历史函数
const clearConversation = () => {
  // 添加确认提示
  if (responseHistory.value.length > 0 && confirm('确定要清空所有对话历史吗？')) {
    // 清空历史记录
    responseHistory.value = [];
    // 重置分析状态
    isAnalyzing.value = false;
    // 显示工具栏
    showTools.value = true;
  }
};

// 处理底部输入框发送事件
const handleBottomInputSend = (message: string) => {
  if (!message.trim()) return;
  
  // 添加新的问答对到历史记录
  const newResponseIndex = responseHistory.value.length;
  responseHistory.value.push({
    question: message,
    answer: '', // 先设置为空，等待模拟AI分析后更新
    expanded: true,
    questionExpanded: true,
    timestamp: Date.now()
  });
  
  // 模拟AI分析过程
  setTimeout(() => {
    // 生成连续性回答
    const answer = `基于我们之前的对话，对于问题「${message}」的分析是：

我将根据您的问题提供详细的算法解析和学习指导。这是一个连续对话的回答示例。`;
    
    // 更新刚刚添加的历史记录条目的answer字段
    if (newResponseIndex < responseHistory.value.length) {
      responseHistory.value[newResponseIndex].answer = answer;
      // 设置为折叠状态
      responseHistory.value[newResponseIndex].expanded = false;
      responseHistory.value[newResponseIndex].questionExpanded = false;
    }
    
    // 确保滚动到底部显示最新回答
    setTimeout(() => {
      const historySection = document.querySelector('.response-history-section');
      if (historySection) {
        historySection.scrollTop = historySection.scrollHeight;
      }
    }, 200);
  }, 1000);
};

// 新建对话函数
const newConversation = () => {
  // 重置分析状态
  isAnalyzing.value = false;
  // 显示工具栏
  showTools.value = true;
  // 清空输入框
  userInput.value = '';
  nextUserInput.value = '';
  // 清空历史记录，开始新的对话
  responseHistory.value = [];
  
  // 不再添加欢迎语句，让用户看到初始欢迎界面
};

// 监听事件总线的new-conversation事件
eventBus.on('new-conversation', () => {
  newConversation();
});

// 在组件加载时添加欢迎语句
onMounted(() => {
  // 不再自动添加欢迎语句，让用户看到初始欢迎界面
  
  // 添加监听器，确保新消息出现时滚动到底部
  const observer = new MutationObserver(() => {
    const historySection = document.querySelector('.response-history-section');
    if (historySection) {
      // 滚动到底部，显示最新的回答
      historySection.scrollTop = historySection.scrollHeight;
    }
  });
  
  // 监听响应历史区域的变化
  const historySection = document.querySelector('.response-history-section');
  if (historySection) {
    
    // 确保初始时滚动到底部，显示最新的回答
    setTimeout(() => {
      historySection.scrollTop = historySection.scrollHeight;
    }, 500);
    observer.observe(historySection, { childList: true });
  }
});

const tools = ref([
  { icon: '📊', text: '可视化演示', category: '核心功能', route: '/algorithm/visualization', highlighted: false },
  { icon: '📚', text: '算法学习', category: '学习辅助', route: '/algorithm', highlighted: false },
  { icon: '📝', text: '算法练习', category: '练习与测评', route: '/algorithm/practice', highlighted: false },
  { icon: '🎯', text: '个性化推荐', category: '练习与测评', action: 'showPersonalizedRecommendation', highlighted: false },
  { icon: '⚖️', text: '算法对比', category: '进阶工具', route: '/algorithm/comparison', highlighted: false },
  { icon: '👥', text: '社区讨论', category: '社区互动', route: '/community', highlighted: false }
]);

// 功能分类
const categories = ref([
  '核心功能',
  '学习辅助',
  '练习与测评',
  '进阶工具',
  '社区互动'
]);

// 当前选中的分类
const selectedCategory = ref('全部');

// 文件上传相关
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const selectedImage = ref<File | null>(null);

// 触发文件选择
const triggerFileUpload = () => {
  console.log('触发文件上传');
  fileInputRef.value?.click();
  // 关闭功能菜单
  document.removeEventListener('click', closeFeatureMenuOnClickOutside);
};

// 触发图片选择
const triggerImageUpload = () => {
  console.log('触发图片上传');
  imageInputRef.value?.click();
  // 关闭功能菜单
  document.removeEventListener('click', closeFeatureMenuOnClickOutside);
};

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    // 这里可以添加文件处理逻辑
    console.log('选择的文件:', selectedFile.value.name);
  }
};

// 处理图片选择
const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedImage.value = input.files[0];
    // 这里可以添加图片处理逻辑
    console.log('选择的图片:', selectedImage.value.name);
  }
};

// 图片上传相关处理可以在这里添加
// 例如：处理上传后的图片预览、分析等功能

// 获取初始状态的功能选项
const getInitialFeatureOptions = () => {
  return tools.value;
};
// 此函数已移除

// 获取路由实例
const router = useRouter();

// 个性化推荐状态
const showPersonalizedRecommendation = ref(false);

// 选择功能
const selectFeature = (tool: { text: string, route?: string, action?: string, category: string, highlighted: boolean, icon: string }) => {
  console.log('选择的功能:', tool.text);
  // 如果工具有路由属性，则使用路由导航
  if (tool.route) {
    // 使用router.push导航到路由，创建新的历史记录
    router.push(tool.route);
  } else if (tool.action === 'showPersonalizedRecommendation') {
    // 显示个性化推荐
    showPersonalizedRecommendation.value = true;
  } else {
    // 这里可以添加其他功能选择后的处理逻辑
    // 例如：根据不同功能执行不同操作
  }
};

// 关闭个性化推荐
const closePersonalizedRecommendation = () => {
  showPersonalizedRecommendation.value = false;
};

// 展开所有对话内容
const expandAllContent = () => {
  responseHistory.value.forEach(item => {
    // 展开回答内容
    if (needsCollapsing(item.answer)) {
      item.expanded = true;
    }
    // 展开问题内容
    if (needsQuestionCollapsing(item.question)) {
      item.questionExpanded = true;
    }
  });
};

// 收起所有对话内容
const collapseAllContent = () => {
  responseHistory.value.forEach(item => {
    // 收起回答内容
    if (needsCollapsing(item.answer)) {
      item.expanded = false;
    }
    // 收起问题内容
    if (needsQuestionCollapsing(item.question)) {
      item.questionExpanded = false;
    }
  });
};
</script>

<template>
  <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'initial-state': responseHistory.length === 0 }">
    <!-- 欢迎语句，只在没有对话历史时显示 -->
    
    
    <!-- 欢迎语句，只在没有对话历史时显示 -->
    <div v-if="responseHistory.length === 0" class="greeting-section">
      <h1 class="greeting">欢迎使用算法学习助手</h1>
      <p class="greeting-subtitle">探索、学习、实践、掌握算法的智能平台</p>
    </div>
    
    <!-- 响应历史记录区域 -->
    <div v-if="responseHistory.length > 0" class="response-history-section">
      <!-- 控制面板 -->
      <div class="control-panel">
        <!-- 展开/收起按钮 -->
        <div class="expand-control">
          <button class="control-btn expand-all-btn" @click="expandAllContent" title="展开全部内容">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="7 13 12 18 17 13"></polyline>
              <polyline points="7 6 12 11 17 6"></polyline>
            </svg>
            <span class="btn-text">展开全部</span>
          </button>
          <button class="control-btn collapse-all-btn" @click="collapseAllContent" title="收起全部内容">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="7 11 12 6 17 11"></polyline>
              <polyline points="7 18 12 13 17 18"></polyline>
            </svg>
            <span class="btn-text">收起全部</span>
          </button>
        </div>
        
        <!-- 缩放控制按钮 -->
        <div class="zoom-control">
          <div class="zoom-label">缩放:</div>
          <button class="control-btn" @click="decreaseZoom" title="缩小">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <button class="control-btn zoom-level-btn" @click="toggleZoomMenu" title="缩放级别">
            {{ zoomLevel }}%
          </button>
          
          <button class="control-btn" @click="increaseZoom" title="放大">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <!-- 缩放菜单 -->
          <div v-if="showZoomMenu" class="zoom-menu">
            <div 
              v-for="option in zoomOptions" 
              :key="option.value" 
              class="zoom-option"
              :class="{ 'active': zoomLevel === option.value }"
              @click="setZoomLevel(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
      <div 
        v-for="(item, index) in responseHistory" 
        :key="index" 
        class="response-history-item"
      >
        <div class="conversation-column">
          <!-- 问题在上方 -->
          <div class="question-container" :style="{ fontSize: `${zoomLevel}%` }">
            <div class="question-header">
              <div class="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="question-title">您的问题</div>
              <div class="question-badge" v-if="!item.questionExpanded && needsQuestionCollapsing(item.question)">已折叠</div>
            </div>
            <div class="question-content">
              <!-- 折叠状态 -->
              <div v-if="!item.questionExpanded && needsQuestionCollapsing(item.question)" class="collapsed-question">
                {{ getQuestionPreviewContent(item.question) }}
                <button class="expand-question-btn" @click="toggleQuestionExpand(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 13 12 18 17 13"></polyline>
                  </svg>
                  展开
                </button>
              </div>
              <!-- 展开状态 -->
              <div v-else>
                {{ item.question }}
                <button 
                  v-if="needsQuestionCollapsing(item.question)" 
                  class="collapse-question-btn" 
                  @click="toggleQuestionExpand(index)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 11 12 6 17 11"></polyline>
                  </svg>
                  收起
                </button>
              </div>
            </div>
          </div>
          
          <!-- 回答在下方 -->
          <div class="answer-container" :style="{ fontSize: `${zoomLevel}%` }">
            <div class="answer-header">
              <div class="ai-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div class="answer-title">算法助手</div>
              <div class="answer-badge" v-if="!item.expanded && needsCollapsing(item.answer)">已折叠</div>
              <div class="answer-time">{{ new Date(item.timestamp).toLocaleString() }}</div>
            </div>
            <div class="answer-content">
              <div v-if="!item.expanded && needsCollapsing(item.answer)" class="collapsed-content">
                <div v-html="getPreviewContent(item.answer)" class="preview-content"></div>
                <div class="fade-overlay"></div>
                <button class="expand-btn" @click="toggleExpand(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 13 12 18 17 13"></polyline>
                  </svg>
                  展开全部
                </button>
              </div>
              <div v-else>
                <div v-html="item.answer"></div>
                <button 
                  v-if="needsCollapsing(item.answer)" 
                  class="collapse-btn" 
                  @click="toggleExpand(index)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 11 12 6 17 11"></polyline>
                  </svg>
                  收起
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 - 仅在没有对话历史时显示 -->
    <div v-if="responseHistory.length === 0" class="input-section" :class="{ 'input-section-analyzing': isAnalyzing, 'input-section-initial': responseHistory.length === 0 }">
    <!-- 个性化推荐组件 -->
    <PersonalizedRecommendation 
      v-if="showPersonalizedRecommendation" 
      :show="showPersonalizedRecommendation"
      :inputContent="userInput"
      @close="closePersonalizedRecommendation"
    />
      <div class="input-container">
        
        <!-- 第一个输入框 - 初始输入 -->
        <div class="input-wrapper">
          <textarea 
            v-if="!isAnalyzing"
            v-model="userInput"
            placeholder="输入您的问题或算法代码，与AI助手进行连续对话..." 
            class="message-input"
            ref="mainTextarea"
            @input="adjustMainTextareaHeight"
            @focus="adjustMainTextareaHeight"
            @blur="resetMainTextareaHeight"
          ></textarea>
          
          <!-- 第二个输入框 - 后续输入 -->
          <textarea 
            v-if="isAnalyzing"
            v-model="nextUserInput"
            placeholder="输入您的下一个问题..." 
            class="message-input"
            ref="nextTextarea"
            @input="adjustNextTextareaHeight"
            @focus="adjustNextTextareaHeight"
            @blur="resetNextTextareaHeight"
          ></textarea>
          
          <!-- 功能按钮区域，放在输入框内部下方 -->
          <div class="feature-buttons-container">
            <!-- 第一行：文件上传、图片上传、清空对话、发送按钮 -->
            <div class="feature-buttons-row">
              <div class="feature-buttons-left">
                <button class="feature-btn file-btn" @click="triggerFileUpload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  文件上传
                </button>
                <button class="feature-btn image-btn" @click="triggerImageUpload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  图片上传
                </button>
              </div>
              
              <div class="feature-buttons-right">
                <button class="feature-btn reset-btn" @click="clearConversation">清空对话</button>
                <button class="feature-btn send-btn" @click="startAnalysis">发送</button>
              </div>
            </div>
            
            <!-- 第二行：功能按钮 -->
            <div class="feature-buttons-row tools-row">
              <!-- 直接展示所有功能按钮 -->
              <button 
                v-for="(tool, index) in tools" 
                :key="index" 
                class="feature-btn tool-feature-btn" 
                @click="selectFeature(tool)"
              >
                <span class="tool-icon-small">{{ tool.icon }}</span>
                {{ tool.text }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="selectedFile" class="file-status">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          已选择文件: {{ selectedFile.name }}
        </div>
        <div v-if="selectedImage" class="file-status">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          已选择图片: {{ selectedImage.name }}
        </div>
        <div class="input-actions" :class="{ 'input-actions-initial': responseHistory.length === 0 }">
          <input 
            type="file" 
            ref="fileInputRef" 
            @change="handleFileChange" 
            class="hidden-input" 
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          />
          <input 
            type="file" 
            ref="imageInputRef" 
            @change="handleImageChange" 
            class="hidden-input" 
            accept="image/*"
          />
          
          <!-- 工具按钮行已移至输入框外部 -->
          
          <!-- 左侧功能按钮已移除 -->
          
          <!-- 右侧功能按钮已移除 -->
          
          <!-- 第二行功能按钮已移除，避免重复显示 -->
        </div>
      </div>
    </div>
    
    <!-- 回复示例区域已移除 -->
    
    <!-- 图片区域已移除 -->
    
    <!-- 功能菜单弹出层已移除，工具按钮直接显示在界面上 -->
    
    <!-- 工具栏 - 已移除，工具按钮已移至工具行 -->
    <!-- <div class="tools-container" v-show="showTools" :class="{ 'tools-hiding': !showTools }">
      <div class="tools-section">
        <div 
          v-for="(tool, index) in tools.filter(t => selectedCategory === '全部' || t.category === selectedCategory)" -->
          <!-- :key="index" 
          class="tool-item"
        >
          <!-- <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-text">{{ tool.text }}</span>
        </div>
      </div>
    </div> -->
    
    <!-- 底部输入框组件 - 仅在有对话历史时显示 -->
    <BottomInputBox 
      v-if="responseHistory.length > 0"
      v-model="nextUserInput"
      placeholder="输入您的下一个问题..."
      @send="handleBottomInputSend"
      @file-upload="triggerFileUpload"
      @image-upload="triggerImageUpload"
      @clear-conversation="clearConversation"
    />
  </div>
</template>

<style scoped>
.main-content {
  flex: 1; /* 自动占满剩余空间 */
  display: flex;
  flex-direction: column;
  padding: 30px;
  padding-bottom: 10px; /* 减小底部内边距，让输入区域下移 */
  background: var(--dark-bg); /* 使用暗色背景 */
  overflow-y: auto; /* 使用auto，根据内容自动显示滚动条 */
  height: 100%; /* 适应父容器高度 */
  box-sizing: border-box; /* 确保内边距不会增加元素高度 */
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  margin: 0; /* 默认状态下不需要居中 */
  /* 移除固定宽度，使用弹性布局自动填充 */
}

/* 初始状态下的主内容区域样式 */
.main-content.initial-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.main-content.sidebar-collapsed {
  /* 移除固定宽度和transform，让弹性布局自动填充空间 */
  padding-left: 30px;
  padding-right: 30px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .main-content {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .main-content {
    padding: 15px;
  }
}



.greeting-section {
  margin-bottom: 30px;
  animation: fadeIn 0.6s ease-out;
}

/* 初始状态下的功能按钮区域样式 */
.feature-buttons-section {
  position: absolute;
  top: 20%; /* 调整位置，减少顶部空白 */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  max-width: 800px;
  z-index: 5;
  animation: fadeIn 0.6s ease-out 0.1s both;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%; /* 使用全宽度 */
  margin: 0 auto; /* 居中显示 */
  border-radius: 10px; /* 减小圆角 */
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); /* 减小阴影 */
  background-color: var(--dark-card-bg);
  border: 1px solid var(--dark-border);
}

.message-input {
  width: 100%;
  min-height: 50px; /* 进一步减小高度 */
  padding: 8px 12px; /* 减小内边距 */
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--text-primary);
  font-size: 14px; /* 减小字体 */
  resize: none;
  border-bottom: none;
}

.feature-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 3px; /* 进一步减小间距 */
  padding: 4px 6px; /* 进一步减小内边距 */
  border-top: 1px solid var(--dark-border);
  background-color: var(--dark-surface);
}

.feature-buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 减小按钮之间的间距 */
  width: 100%;
}

.tools-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
  padding-top: 10px;
  border-top: 1px dashed rgba(108, 92, 231, 0.2);
}

.feature-buttons-left {
  display: flex;
  gap: 8px; /* 减小间距 */
  flex: 1;
}

.feature-buttons-right {
  display: flex;
  gap: 8px; /* 减小间距 */
  justify-content: flex-end;
}

.feature-buttons-container .send-btn {
  margin-left: 10px;
}

.feature-buttons-container .reset-btn {
  margin-right: 0;
}

.tool-icon-small {
  margin-right: 5px;
  font-size: 1.1em;
}

.feature-btn.tool-btn {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  font-size: 0.85em; /* 减小字体 */
  padding: 6px 10px; /* 减小内边距 */
  white-space: nowrap;
}

.action-btn.tool-btn {
  background: rgba(75, 108, 183, 0.1);
  color: #4b6cb7;
  font-size: 0.85em;
  padding: 6px 10px;
  white-space: nowrap;
  border: 1px solid rgba(75, 108, 183, 0.3);
}

.action-btn.tool-btn:hover {
  background: rgba(75, 108, 183, 0.2);
  color: white;
}

.feature-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px; /* 减小内边距 */
  border-radius: 6px; /* 稍微减小圆角 */
  background: var(--dark-card-bg);
  border: 1px solid var(--dark-border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px; /* 减小最小宽度 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 13px; /* 减小字体大小 */
}

.feature-btn:hover {
  transform: translateY(-2px); /* 减小悬停时的上移距离 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 减小阴影 */
  border-color: var(--primary-color);
}

.feature-btn svg {
  margin-right: 8px;
}

.feature-btn.file-btn {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
}

.feature-btn.image-btn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.feature-btn.send-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 6px 10px; /* 减小内边距 */
  min-width: 60px; /* 减小最小宽度 */
}

.feature-btn.reset-btn {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  /* 确保文本始终可见 */
  color: white;
  opacity: 1;
  padding: 6px 10px; /* 减小内边距 */
  min-width: 60px; /* 减小最小宽度 */
}

/* 初始状态下的欢迎语句样式 - 放在输入框上方 */
.initial-state .greeting-section {
  position: absolute;
  top: 35%; /* 调整位置，与输入框位置协调 */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  max-width: 800px;
  z-index: 5;
}

.greeting {
  font-size: 2.2em;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(108, 92, 231, 0.2);
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.greeting-subtitle {
  font-size: 1.1em;
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 0.8;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.input-section {
  margin-top: auto;
  margin-bottom: 0;
  animation: fadeIn 0.6s ease-out 0.2s both;
  transition: all 0.5s ease-out;
  position: sticky;
  bottom: 0;
  background: var(--dark-bg);
  padding-top: 10px;
  z-index: 10;
}

.input-section-analyzing {
  margin-bottom: 20px;
  transform: translateY(-20px);
  width: 80%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 初始状态输入框位于欢迎语句下方 */
.input-section-initial {
  position: absolute;
  top: 50%; /* 进一步缩小与标签的间距 */
  left: 50%;
  transform: translateX(-50%); /* 只水平居中，避免垂直居中导致重叠 */
  width: calc(95% - 280px); /* 与其他容器保持一致的宽度 */
  max-width: 800px;
  margin: 0;
  padding: 0;
  height: fit-content; /* 自适应内容高度 */
  min-height: auto; /* 移除最小高度限制 */
}

/* 输入框隐藏动画 */
.input-section-hidden {
  transform: translateY(100px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  display: none;
}

/* 新输入框样式已移除，使用独立的BottomInputBox组件 */

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

/* 初始状态下的功能按钮样式 */
.input-actions-initial {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.input-container {
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--dark-surface);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2), 
              0 0 0 1px rgba(108, 92, 231, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  margin-bottom: 0;
  height: fit-content; /* 自适应内容高度 */
  min-height: auto; /* 移除最小高度限制 */
}

.input-container:focus-within {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 
              0 0 0 2px rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.message-input {
  width: 100%;
  min-height: 60px; /* 减少最小高度 */
  padding: 12px 16px; /* 减少内边距 */
  border: none;
  border-bottom: none;
  resize: none;
  font-family: inherit;
  font-size: 1em;
  outline: none;
  background: var(--dark-surface);
  color: var(--text-primary);
  transition: all 0.3s ease;
  margin-bottom: 0;
}

.message-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(30, 30, 30, 0.8);
  border-top: 1px solid var(--dark-border);
  position: relative; /* 添加相对定位，使功能菜单弹出层能够正确定位 */
}

.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 移除了span的特殊样式，使按钮文本直接显示 */

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  transition: left 0.3s ease;
  z-index: -1;
  opacity: 0;
}

.action-btn:hover {
  color: white; /* 明确设置悬停时的颜色 */
}

.action-btn.reset-btn:hover {
  color: white !important; /* 确保reset-btn在hover时文本颜色为白色 */
}

.action-btn:hover::before {
  left: 0;
  opacity: 1;
}

.file-btn,
.image-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
  transition: transform 0.3s ease;
  padding: 8px 15px;
}

.file-btn:hover,
.image-btn:hover {
  transform: scale(1.05);
}

.file-btn svg,
.image-btn svg {
  transition: transform 0.3s ease;
}

.file-btn:hover svg,
.image-btn:hover svg {
  transform: scale(1.2);
}

/* 移除了file-btn和image-btn的span特殊样式，使按钮文本直接显示 */

.send-btn {
  background: var(--primary-gradient);
  font-weight: 600;
  padding: 8px 20px;
  border: none;
  color: white;
  box-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
}

.send-btn:hover {
  box-shadow: 0 0 15px rgba(108, 92, 231, 0.5);
  transform: translateY(-2px);
}

/* 通用reset-btn样式 */
.reset-btn {
  /* 确保所有reset-btn按钮文本都能正常显示 */
  opacity: 1 !important;
  visibility: visible !important;
  color: inherit;
  font-weight: 500;
  padding: 8px 20px;
}

/* 确保清空对话按钮文本始终可见 */
button.reset-btn {
  color: inherit !important;
  opacity: 1 !important;
  visibility: visible !important;
}



/* 功能菜单样式 */
.feature-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.feature-menu {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feature-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.feature-menu-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.feature-menu-content {
  padding: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.feature-item:hover {
  background-color: #f5f5f5;
}

.feature-icon {
  font-size: 24px;
  margin-right: 16px;
  color: #5c6bc0;
}

.feature-info {
  display: flex;
  flex-direction: column;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.feature-category {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* 工具栏样式 */
.tools-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

/* 工具按钮行样式已移除，功能菜单已移至输入框内部 */

/* 工具按钮样式 */
.tool-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(75, 108, 183, 0.1) 0%, rgba(24, 40, 72, 0.2) 100%);
  color: var(--text-primary);
  border: 1px solid rgba(75, 108, 183, 0.3);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.tool-button:hover {
  background: linear-gradient(135deg, rgba(75, 108, 183, 0.2) 0%, rgba(24, 40, 72, 0.3) 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

/* 功能菜单按钮样式 */
.feature-menu-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(0, 206, 201, 0.2) 100%);
  font-weight: 600;
  padding: 8px 15px;
  border-color: rgba(108, 92, 231, 0.4);
  position: relative;
  z-index: 999;
}

.feature-menu-btn:hover {
  transform: scale(1.05);
}

/* 工具功能按钮样式 */
.tool-feature-btn {
  padding: 6px 10px;
  margin-right: 4px;
  margin-bottom: 4px;
  animation: fadeIn 0.3s ease-in-out;
  background: linear-gradient(135deg, rgba(75, 108, 183, 0.1) 0%, rgba(24, 40, 72, 0.2) 100%);
  border: 1px solid rgba(75, 108, 183, 0.3);
  font-size: 0.85em;
  flex-grow: 1;
  max-width: calc(25% - 6px);
  justify-content: flex-start;
}

/* 功能菜单弹出层样式 */
.feature-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 80%;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  padding: 15px;
  z-index: 9999;
  display: flex !important;
  flex-wrap: wrap;
  gap: 10px;
  animation: fadeIn 0.3s ease-out;
  margin-top: 10px;
  color: white;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  user-select: none;
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* 初始状态下的功能菜单样式 */
.initial-feature-menu {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 1000;
  animation: fadeInDown 0.3s ease-out;
}

/* 功能菜单项样式 */
.feature-menu-item {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.6) 0%, rgba(24, 40, 72, 0.7) 100%);
  border: 1px solid rgba(108, 92, 231, 0.8);
  border-radius: 12px;
  padding: 12px 15px;
  color: white;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  flex: 1 0 calc(33.333% - 20px);
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  user-select: none;
  position: relative;
  z-index: 10000;
  touch-action: manipulation;
}

.feature-menu-item:hover {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.9) 0%, rgba(0, 206, 201, 0.9) 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.8);
  border-color: rgba(0, 206, 201, 1);
}

.feature-menu-item:active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 1) 0%, rgba(0, 206, 201, 1) 100%);
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.6);
  transition: all 0.1s ease;
}

/* 初始状态下的工具栏样式 */
.initial-state .tools-container {
  position: fixed;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.category-tab {
  padding: 8px 15px;
  border-radius: 20px;
  background: var(--dark-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  font-weight: 500;
}

.category-tab:hover {
  background: var(--primary-color-transparent);
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--primary-gradient);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

.tools-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: var(--dark-surface);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 110px;
  height: 110px;
  text-align: center;
}

.tool-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.tool-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
  border-color: var(--primary-color);
  color: white;
}

.tool-item:hover::before {
  opacity: 1;
}

.tool-icon {
  font-size: 2em;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
  display: block;
}

.tool-item:hover .tool-icon {
  transform: scale(1.2);
}

.tool-text {
  font-weight: 500;
  font-size: 0.9em;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.category-tab {
  padding: 8px 15px;
  border-radius: 20px;
  background: var(--dark-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  font-weight: 500;
}

.category-tab:hover {
  background: rgba(108, 92, 231, 0.1);
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--primary-gradient);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

.tools-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: var(--dark-surface);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 110px;
  height: 110px;
  text-align: center;
}

.tool-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.tool-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
  border-color: var(--primary-color);
  color: white;
}

.tool-item:hover::before {
  opacity: 1;
}

.tool-icon {
  font-size: 2em;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
  display: block;
}

.tool-item:hover .tool-icon {
  transform: scale(1.2);
}

.tool-text {
  font-weight: 500;
  font-size: 0.9em;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.hidden-input {
  display: none;
}

/* 文件上传状态提示 */
.file-status {
  font-size: 0.8em;
  color: var(--primary-color);
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-status svg {
  width: 14px;
  height: 14px;
}

/* 工具栏动画 */
.tools-container {
  transition: all 0.5s ease-out;
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
  margin-bottom: 30px;
}

.tools-hiding {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

/* 当工具栏隐藏时，确保输入区域紧贴在上方的内容 */
.input-section {
  transition: margin-top 0.5s ease-out;
}

.tools-container:not([style*="display: none"]):not(.tools-hiding) + .input-section {
  margin-top: 0;
}

/* 回复区域样式 */
.response-section, .image-response-section {
  margin-bottom: 30px;
  animation: slideUp 0.5s ease-out;
}

.response-container, .image-response-container {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2), 
              0 0 0 1px rgba(108, 92, 231, 0.1);
  transition: all 0.3s ease;
}

.response-header, .image-response-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.ai-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.8), rgba(90, 80, 200, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.ai-title {
  font-weight: 600;
  font-size: 1.1em;
  color: var(--text-primary);
}

.response-content, .image-response-content {
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 1em;
  max-width: 100%; /* 确保内容不超过容器宽度 */
  width: 100%;
  overflow-wrap: break-word; /* 防止溢出 */
  word-break: break-word; /* 确保长单词也能换行 */
}

/* 响应式布局 - 回答内容区域 */
@media (max-width: 1200px) {
  .response-content, .image-response-content {
    font-size: 0.95em;
  }
}

@media (max-width: 992px) {
  .response-content, .image-response-content {
    font-size: 0.9em;
    line-height: 1.5;
  }
}

/* 图片区域作为AI回答区的特殊样式 */
.image-response-section {
  margin-top: 20px;
  border-left: 3px solid var(--primary-color);
}

.image-response-container {
  background: linear-gradient(to right, rgba(108, 92, 231, 0.05), var(--dark-surface));
}

.image-response-header .ai-avatar {
  background: linear-gradient(45deg, #00cec9, #0984e3);
}

/* 重置按钮样式 */
/* 为不同类型的reset-btn添加更具体的选择器，避免样式冲突 */
.action-btn.reset-btn {
  background: var(--dark-surface);
  font-weight: 600;
  padding: 8px 20px;
  border: 1px solid #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  /* 确保文本始终可见 */
  opacity: 1;
}

.action-btn.reset-btn:hover {
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.4);
  transform: translateY(-2px);
  color: white;
}

.action-btn.reset-btn::before {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

/* 响应历史记录区域样式 */
.response-history-section {
  margin-bottom: 120px; /* 为固定在底部的输入框留出更多空间 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 100px); /* 增加高度，减少顶部空间占用 */
  min-height: calc(100vh - 200px); /* 设置最小高度，确保占据足够空间 */
  overflow-y: auto; /* 使用auto，根据内容自动显示滚动条 */
  padding-right: 10px;
  padding-bottom: 15px;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) var(--dark-surface);
  flex: 1; /* 允许区域伸展填充可用空间 */
  position: relative;
  overflow-x: hidden; /* 防止水平溢出 */
}

/* 控制面板样式 */
.control-panel {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.expand-control {
  display: flex;
  gap: 10px;
}

.expand-all-btn, .collapse-all-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 100px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.expand-all-btn {
  background: var(--primary-color-transparent);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.collapse-all-btn {
  background: var(--dark-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn-text {
  font-size: 0.9em;
  font-weight: 500;
}

.zoom-control {
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 15px;
  border-left: 1px solid #eaeaea;
  padding-left: 15px;
}

.zoom-label {
  font-size: 14px;
  color: #666;
  margin-right: 5px;
}

.zoom-level-btn {
  min-width: 60px;
  font-weight: 500;
  background: var(--dark-surface);
  color: var(--text-primary);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  color: var(--text-primary);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 36px;
}

.control-btn:hover {
  background: var(--dark-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.zoom-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 101;
  width: 80px;
}

.zoom-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: center;
}

.zoom-option:hover {
  background: var(--dark-hover);
}

.zoom-option.active {
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary-color);
  font-weight: 500;
}

.response-history-section::-webkit-scrollbar {
  width: 8px;
}

.response-history-section::-webkit-scrollbar-track {
  background: var(--dark-surface);
  border-radius: 4px;
}

.response-history-section::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.response-history-section::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, var(--primary-color), #00cec9);
}

.response-history-item {
  margin-bottom: 30px;
  padding: 0;
  background: rgba(35, 35, 45, 0.7);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(70, 70, 90, 0.3);
  width: 100%; /* 确保宽度为100% */
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止长回答压缩其他内容 */
  backdrop-filter: blur(10px);
}

.conversation-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 5px;
  width: 100%;
}

.conversation-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.sidebar-collapsed .conversation-row {
  gap: 25px; /* 侧边栏折叠时增加间距 */
}

.conversation-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.response-history-item:hover {
  box-shadow: 0 5px 20px rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.question-container {
  padding: 20px 25px;
  border-bottom: 1px solid rgba(74, 144, 226, 0.2);
  background: linear-gradient(135deg, rgba(35, 35, 45, 0.85), rgba(40, 40, 55, 0.8));
  max-width: 800px; /* 与输入框保持一致的最大宽度 */
  width: calc(95% - 280px); /* 与输入框保持一致的宽度计算 */
  box-sizing: border-box;
  align-self: center;
  border-radius: 14px;
  margin: 10px auto 20px auto; /* 调整间距，与回答容器形成呼应 */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(74, 144, 226, 0.2);
  backdrop-filter: blur(8px);
  position: relative;
}

.question-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.6), transparent);
  opacity: 0.8;
}

.sidebar-collapsed .question-container {
  width: 85%; /* 侧边栏折叠时增加问题容器宽度 */
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(70, 70, 90, 0.8), rgba(50, 50, 70, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.question-title {
  font-weight: 600;
  font-size: 0.95em;
  color: #e0e0e0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.question-content {
  color: var(--text-primary);
  font-size: 0.95em;
  line-height: 1.6;
  word-wrap: break-word; /* 确保长文本换行 */
  white-space: pre-wrap; /* 保留空格和换行符 */
  overflow-wrap: break-word; /* 防止溢出 */
  position: relative;
  letter-spacing: 0.01em;
  padding: 5px 0;
}

.collapsed-question {
  position: relative;
  padding-bottom: 30px;
}

.expand-question-btn,
.collapse-question-btn {
  background: linear-gradient(to right, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.2));
  border: 1px solid rgba(255, 165, 0, 0.3);
  color: #ff9800;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
  margin-top: 10px;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.expand-question-btn:hover,
.collapse-question-btn:hover {
  background: linear-gradient(to right, rgba(255, 165, 0, 0.2), rgba(255, 140, 0, 0.3));
  color: #fff;
  box-shadow: 0 3px 8px rgba(255, 165, 0, 0.3);
  transform: translateY(-1px);
}

.answer-container {
  padding: 25px 30px;
  max-width: 800px; /* 与输入框保持一致的最大宽度 */
  width: calc(95% - 280px); /* 与输入框保持一致的宽度计算 */
  box-sizing: border-box;
  align-self: center;
  background: linear-gradient(135deg, rgba(45, 45, 55, 0.9), rgba(50, 50, 65, 0.8));
  border-radius: 16px;
  margin: 15px auto; /* 增加上下间距 */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.answer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  opacity: 0.6;
}

.sidebar-collapsed .answer-container {
  width: 95%; /* 侧边栏折叠时增加回答容器宽度 */
  margin-left: auto;
  margin-right: auto; /* 保持居中显示 */
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(100, 100, 120, 0.2);
}

.answer-title {
  font-weight: 600;
  font-size: 1em;
  color: var(--primary-color);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.answer-time {
  font-size: 0.8em;
  color: var(--text-secondary);
  margin-left: auto;
}

.answer-badge, .question-badge {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 500;
}

.answer-badge {
  background-color: rgba(108, 92, 231, 0.2);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.question-badge {
  background-color: rgba(255, 165, 0, 0.2);
  color: #ff9800;
  border: 1px solid #ff9800;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.answer-content {
  color: var(--text-primary);
  font-size: 1em;
  line-height: 1.8;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  overflow-x: hidden;
  width: 100%;
  letter-spacing: 0.02em;
  /* 限制每行50个字符 */
  word-break: break-all;
  white-space: pre-wrap;
  max-width: 50ch;
  width: auto;
  text-align: center;
  margin: 0 auto;
  /* 美化样式 */
  padding: 25px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  font-family: 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.answer-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.6s ease;
}

.answer-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(108, 92, 231, 0.3);
}

.answer-content:hover::before {
  left: 100%;
}

.answer-content div {
  white-space: normal; /* 允许正常换行 */
}

/* 样式化HTML内容中的常见元素 */
.answer-content h1, .answer-content h2, .answer-content h3, 
.answer-content h4, .answer-content h5, .answer-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 700;
  color: #a29bfe;
  border-bottom: 2px solid rgba(162, 155, 254, 0.3);
  padding-bottom: 0.5em;
  text-shadow: 0 2px 4px rgba(162, 155, 254, 0.2);
  background: linear-gradient(135deg, rgba(162, 155, 254, 0.1), transparent);
  padding: 0.5em 1em;
  border-radius: 8px;
  border-left: 4px solid #a29bfe;
}

.answer-content p {
  margin-bottom: 1.2em;
  text-indent: 0;
  line-height: 1.9;
}

.answer-content ul, .answer-content ol {
  margin-left: 2em;
  margin-bottom: 1.2em;
  padding-left: 0.5em;
}

.answer-content li {
  margin-bottom: 0.6em;
  position: relative;
  padding-left: 0.5em;
}

.answer-content ul li::before {
  content: '•';
  color: var(--primary-color);
  font-weight: bold;
  position: absolute;
  left: -1em;
}

.answer-content pre {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2));
  padding: 1.5em;
  border-radius: 10px;
  overflow-x: auto;
  margin-bottom: 1.2em;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.answer-content code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(90, 80, 200, 0.1));
  padding: 0.3em 0.6em;
  border-radius: 6px;
  font-size: 0.9em;
  border: 1px solid rgba(108, 92, 231, 0.2);
  color: #e8e8e8;
}

.answer-content pre code {
  background: transparent;
  padding: 0;
  border: none;
}

.answer-content a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.answer-content a:hover {
  border-bottom: 1px solid var(--primary-color);
  text-shadow: 0 0 8px rgba(108, 92, 231, 0.5);
}

.answer-content blockquote {
  border-left: 4px solid var(--primary-color);
  padding: 1em 1.5em;
  margin: 1.2em 0;
  font-style: italic;
  color: var(--text-secondary);
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.05), rgba(90, 80, 200, 0.03));
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.answer-content blockquote::before {
  content: '"';
  font-size: 3em;
  color: var(--primary-color);
  position: absolute;
  top: -0.2em;
  left: 0.3em;
  opacity: 0.3;
}

/* 算法专用样式 - 算法步骤 */
.answer-content .algorithm-steps {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.08), rgba(90, 80, 200, 0.05));
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.answer-content .algorithm-steps h3,
.answer-content .algorithm-steps h4 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-content .algorithm-steps h3::before {
  content: '🔍';
  font-size: 1.2em;
}

.answer-content .algorithm-steps ol {
  counter-reset: step-counter;
  list-style: none;
  padding-left: 0;
}

.answer-content .algorithm-steps ol li {
  counter-increment: step-counter;
  position: relative;
  padding: 12px 20px 12px 50px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.answer-content .algorithm-steps ol li::before {
  content: counter(step-counter);
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary-color);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9em;
}

/* 代码块分组样式 */
.answer-content .code-section {
  margin: 25px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.answer-content .code-header {
  background: linear-gradient(135deg, #2d3748, #4a5568);
  padding: 12px 20px;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.answer-content .code-header::before {
  content: '💻';
  font-size: 1.1em;
}

.answer-content .code-section pre {
  margin: 0;
  border-radius: 0;
  background: linear-gradient(135deg, #1a202c, #2d3748);
}

/* 复杂度分析样式 */
.answer-content .complexity-analysis {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
  border-radius: 10px;
  padding: 18px;
  margin: 20px 0;
  border-left: 4px solid #ffc107;
  box-shadow: 0 3px 12px rgba(255, 193, 7, 0.2);
}

.answer-content .complexity-analysis h4 {
  color: #ffc107;
  margin-top: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-content .complexity-analysis h4::before {
  content: '⚡';
  font-size: 1.2em;
}

.answer-content .complexity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.answer-content .complexity-label {
  font-weight: 600;
  color: #ffecb3;
}

.answer-content .complexity-value {
  font-family: 'Consolas', monospace;
  background: rgba(255, 193, 7, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff3c4;
  font-weight: bold;
}

/* 图算法可视化区域 */
.answer-content .graph-visualization {
  background: linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.05));
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
  border: 2px dashed rgba(0, 188, 212, 0.3);
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.answer-content .graph-visualization h4 {
  color: #00bcd4;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-content .graph-visualization h4::before {
  content: '📊';
  font-size: 1.3em;
}

.answer-content .graph-placeholder {
  color: rgba(0, 188, 212, 0.7);
  font-style: italic;
  font-size: 0.9em;
}

/* 算法示例样式 */
.answer-content .algorithm-example {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(56, 142, 60, 0.05));
  border-radius: 10px;
  padding: 18px;
  margin: 20px 0;
  border-left: 4px solid #4caf50;
  box-shadow: 0 3px 12px rgba(76, 175, 80, 0.2);
}

.answer-content .algorithm-example h4 {
  color: #4caf50;
  margin-top: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-content .algorithm-example h4::before {
  content: '📝';
  font-size: 1.2em;
}

/* 输入输出样式 */
.answer-content .input-output {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 20px 0;
}

.answer-content .input-section,
.answer-content .output-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.answer-content .input-section h5,
.answer-content .output-section h5 {
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--primary-color);
}

.answer-content .input-section h5::before {
  content: '📥 ';
}

.answer-content .output-section h5::before {
  content: '📤 ';
}

/* 响应式调整 */
@media (max-width: 768px) {
  .answer-content .input-output {
    grid-template-columns: 1fr;
  }
  
  .answer-content .algorithm-steps ol li {
    padding-left: 40px;
  }
  
  .answer-content .algorithm-steps ol li::before {
    width: 20px;
    height: 20px;
    font-size: 0.8em;
  }
}

.collapsed-content {
  position: relative;
}

.preview-content {
  max-height: 200px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.fade-overlay {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--dark-bg));
  pointer-events: none;
}

.expand-btn, .collapse-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--dark-surface);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  padding: 5px 10px;
  transition: all 0.2s ease;
}

.expand-btn {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: linear-gradient(to right, rgba(108, 92, 231, 0.1), rgba(90, 80, 200, 0.2));
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85em;
}

.expand-btn:hover {
  background: linear-gradient(to right, rgba(108, 92, 231, 0.3), rgba(90, 80, 200, 0.4));
  color: white;
  box-shadow: 0 3px 8px rgba(108, 92, 231, 0.3);
  transform: translateY(-1px);
}

.collapse-btn {
  color: var(--text-secondary);
  background: linear-gradient(to right, rgba(70, 70, 90, 0.1), rgba(60, 60, 80, 0.2));
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85em;
}

.collapse-btn:hover {
  background: linear-gradient(to right, rgba(70, 70, 90, 0.3), rgba(60, 60, 80, 0.4));
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

/* 算法内容专用布局样式 */
.algorithm-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
}

.algorithm-header {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(74, 144, 226, 0.1));
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.algorithm-header h3 {
  color: rgba(108, 92, 231, 1);
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.algorithm-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95em;
  line-height: 1.5;
  margin: 0;
}

/* 算法步骤布局 */
.algorithm-steps {
  background: linear-gradient(135deg, rgba(45, 45, 55, 0.6), rgba(50, 50, 65, 0.5));
  border: 1px solid rgba(80, 80, 100, 0.4);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  backdrop-filter: blur(5px);
}

.algorithm-steps h4 {
  color: rgba(74, 144, 226, 1);
  margin: 0 0 16px 0;
  font-size: 1.05em;
  font-weight: 600;
  border-bottom: 2px solid rgba(74, 144, 226, 0.3);
  padding-bottom: 8px;
}

.algorithm-steps ol {
  margin: 0;
  padding-left: 20px;
}

.algorithm-steps li {
  margin: 12px 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
}

.algorithm-steps li::marker {
  color: rgba(74, 144, 226, 0.8);
  font-weight: 600;
}

/* 代码块分组布局 */
.code-section {
  background: linear-gradient(135deg, rgba(25, 25, 35, 0.8), rgba(30, 30, 40, 0.7));
  border: 1px solid rgba(60, 60, 80, 0.4);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  backdrop-filter: blur(8px);
}

.code-section h4 {
  color: rgba(144, 238, 144, 1);
  margin: 0 0 16px 0;
  font-size: 1.05em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-section h4::before {
  content: '💻';
  font-size: 1.1em;
}

.code-section pre {
  margin: 12px 0 0 0;
  background: rgba(15, 15, 25, 0.8) !important;
  border: 1px solid rgba(144, 238, 144, 0.2);
}

/* 复杂度分析布局 */
.complexity-analysis {
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.08));
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  backdrop-filter: blur(5px);
}

.complexity-analysis h4 {
  color: rgba(255, 165, 0, 1);
  margin: 0 0 16px 0;
  font-size: 1.05em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.complexity-analysis h4::before {
  content: '⚡';
  font-size: 1.1em;
}

.complexity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  padding: 8px 12px;
  background: rgba(255, 165, 0, 0.05);
  border-radius: 6px;
  border-left: 3px solid rgba(255, 165, 0, 0.5);
}

.complexity-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.complexity-value {
  color: rgba(255, 165, 0, 0.9);
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 600;
}

/* 图算法可视化区域 */
.graph-visualization {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.08));
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  backdrop-filter: blur(5px);
  text-align: center;
}

.graph-visualization h4 {
  color: rgba(138, 43, 226, 1);
  margin: 0 0 16px 0;
  font-size: 1.05em;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.graph-visualization h4::before {
  content: '🔗';
  font-size: 1.1em;
}

.graph-placeholder {
  background: rgba(138, 43, 226, 0.05);
  border: 2px dashed rgba(138, 43, 226, 0.3);
  border-radius: 8px;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

/* 算法示例布局 */
.algorithm-example {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(30, 144, 255, 0.08));
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  backdrop-filter: blur(5px);
}

.algorithm-example h4 {
  color: rgba(0, 191, 255, 1);
  margin: 0 0 16px 0;
  font-size: 1.05em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.algorithm-example h4::before {
  content: '📝';
  font-size: 1.1em;
}

/* 输入输出布局 */
.input-output {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

.input-section, .output-section {
  background: rgba(45, 45, 55, 0.6);
  border: 1px solid rgba(80, 80, 100, 0.4);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(3px);
}

.input-section h5, .output-section h5 {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 12px 0;
  font-size: 0.95em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-section h5::before {
  content: '📥 ';
}

.output-section h5::before {
  content: '📤 ';
}

.input-section pre, .output-section pre {
  margin: 0;
  background: rgba(25, 25, 35, 0.8) !important;
  font-size: 0.9em;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .algorithm-steps, .code-section, .complexity-analysis, .graph-visualization, .algorithm-example {
    padding: 15px;
    margin: 12px 0;
  }
  
  .input-output {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .algorithm-header {
    padding: 12px 16px;
  }
}

/* 动画关键帧 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>