<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { eventBus } from '../eventBus';

// 控制工具栏和对话框的显示状态
const isAnalyzing = ref(false);
const showTools = ref(true);
const showFeatureMenu = ref(false);

// 侧边栏状态
const isSidebarCollapsed = ref(false);

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
  eventBus.on('sidebar-toggle', (collapsed) => {
    isSidebarCollapsed.value = collapsed;
  });
});

// 开始分析函数 - 支持连续对话模式
const startAnalysis = () => {
  // 确定当前使用的输入框
  const currentInputValue = isAnalyzing.value ? nextUserInput.value : userInput.value;
  
  if (!currentInputValue.trim()) return; // 防止空输入
  
  // 保存当前问题
  const currentQuestion = currentInputValue;
  
  // 清空当前输入框
  if (isAnalyzing.value) {
    nextUserInput.value = '';
  } else {
    userInput.value = '';
  }
  
  // 显示正在分析状态
  isAnalyzing.value = true;
  
  // 隐藏工具栏，只保留输入区域
  showTools.value = false;
  
  // 模拟AI分析过程
  setTimeout(() => {
    // 生成回答内容
    // 根据历史对话生成更连贯的回答
    let answer;
    if (responseHistory.value.length > 0) {
      // 如果有历史对话，生成连续性回答
      answer = `基于我们之前的对话，对于问题「${currentQuestion}」的分析是：

我将根据您的问题提供详细的算法解析和学习指导。`;
    } else {
      // 首次对话
      answer = `这是对问题「${currentQuestion}」的分析结果：

我将根据您的问题提供详细的算法解析和学习指导。`;
    }
    
    // 添加到历史记录（按照输入顺序添加到末尾）
    responseHistory.value.push({
      question: currentQuestion,
      answer: answer,
      expanded: false,
      questionExpanded: false, // 默认问题收起
      timestamp: Date.now()
    });
    
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
  { icon: '📊', text: '可视化演示', category: '核心功能' },
  { icon: '📚', text: '算法讲解', category: '学习辅助' },
  { icon: '📝', text: '算法练习', category: '练习与测评' },
  { icon: '🎯', text: '个性化推荐', category: '练习与测评' },
  { icon: '🔧', text: '自定义调试', category: '进阶工具' },
  { icon: '⚖️', text: '算法对比', category: '进阶工具' },
  { icon: '🗺️', text: '学习路径', category: '学习规划' },
  { icon: '📈', text: '进度追踪', category: '学习规划' },
  { icon: '👥', text: '社区讨论', category: '社区互动' }
]);

// 功能分类
const categories = ref([
  '核心功能',
  '学习辅助',
  '练习与测评',
  '进阶工具',
  '学习规划',
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
  fileInputRef.value?.click();
};

// 触发图片选择
const triggerImageUpload = () => {
  imageInputRef.value?.click();
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

// 控制功能菜单的显示和隐藏
const toggleFeatureMenu = () => {
  showFeatureMenu.value = !showFeatureMenu.value;
};

// 选择功能
const selectFeature = (tool: any) => {
  console.log('选择的功能:', tool.text);
  // 这里可以添加功能选择后的处理逻辑
  // 例如：根据不同功能执行不同操作
  
  // 选择后关闭菜单
  showFeatureMenu.value = false;
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
  <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
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
        <div class="conversation-row">
          <!-- 回答在左侧 -->
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
          
          <!-- 问题在右侧 -->
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
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-section" :class="{ 'input-section-analyzing': isAnalyzing }">
      <div class="input-container">
        <!-- 第一个输入框 - 初始输入 -->
        <textarea 
          v-if="!isAnalyzing"
          v-model="userInput"
          placeholder="输入您的问题或算法代码，与AI助手进行连续对话..." 
          class="message-input"
        ></textarea>
        
        <!-- 第二个输入框 - 后续输入 -->
        <textarea 
          v-if="isAnalyzing"
          v-model="nextUserInput"
          placeholder="输入您的下一个问题..." 
          class="message-input"
        ></textarea>
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
        <div class="input-actions">
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
          <button class="action-btn file-btn" @click="triggerFileUpload">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>文件</span>
          </button>
          <button class="action-btn image-btn" @click="triggerImageUpload">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>图片上传</span>
          </button>
          <button v-if="isAnalyzing" class="action-btn feature-btn" @click="toggleFeatureMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span>功能</span>
          </button>
          <button v-if="!isAnalyzing" class="action-btn send-btn" @click="startAnalysis">发送</button>
          <button v-else class="action-btn send-btn" @click="startAnalysis">发送</button>
          <button class="action-btn reset-btn" @click="clearConversation">清空对话</button>
        </div>
      </div>
    </div>
    
    <!-- 回复示例区域已移除 -->
    
    <!-- 图片区域已移除 -->
    
    <!-- 功能菜单弹出层 -->
    <div v-if="showFeatureMenu" class="feature-menu-overlay" @click="toggleFeatureMenu">
      <div class="feature-menu" @click.stop>
        <div class="feature-menu-header">
          <h3>选择功能</h3>
          <button class="close-btn" @click="toggleFeatureMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="feature-menu-content">
          <div 
            v-for="(tool, index) in tools" 
            :key="index" 
            class="feature-item"
            @click="selectFeature(tool)"
          >
            <span class="feature-icon">{{ tool.icon }}</span>
            <div class="feature-info">
              <span class="feature-text">{{ tool.text }}</span>
              <span class="feature-category">{{ tool.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <div class="tools-container" v-show="showTools" :class="{ 'tools-hiding': !showTools }">
      <div class="category-tabs">
        <button 
          class="category-tab" 
          :class="{ 'active': selectedCategory === '全部' }" 
          @click="selectedCategory = '全部'"
        >
          全部
        </button>
        <button 
          v-for="category in categories" 
          :key="category" 
          class="category-tab" 
          :class="{ 'active': selectedCategory === category }" 
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
      
      <div class="tools-section">
        <div 
          v-for="(tool, index) in tools.filter(t => selectedCategory === '全部' || t.category === selectedCategory)" 
          :key="index" 
          class="tool-item"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-text">{{ tool.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: var(--dark-bg);
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(108, 92, 231, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(0, 206, 201, 0.05) 0%, transparent 20%);
  overflow-y: auto; /* 使用auto，根据内容自动显示滚动条 */
  height: 100vh; /* 设置高度为视口高度 */
  box-sizing: border-box; /* 确保内边距不会增加元素高度 */
  position: relative;
  z-index: 1;
  max-width: calc(100% - 280px); /* 确保不会超过侧边栏以外的宽度 */
  width: calc(100% - 280px); /* 固定宽度为视口宽度减去侧边栏宽度 */
  transition: all 0.3s ease;
  margin: 0; /* 默认状态下不需要居中 */
}

.main-content.sidebar-collapsed {
  max-width: 95%;
  width: 95%;
  transform: scale(1.05);
  transform-origin: center center;
  padding-left: 30px;
  padding-right: 30px;
  margin: 0 auto; /* 居中显示 */
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

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(180deg, rgba(108, 92, 231, 0.05) 0%, transparent);
  z-index: -1;
}

.greeting-section {
  margin-bottom: 30px;
  animation: fadeIn 0.6s ease-out;
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
  margin-bottom: 30px;
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
}

.input-container {
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--dark-surface);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2), 
              0 0 0 1px rgba(108, 92, 231, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.input-container:focus-within {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 
              0 0 0 2px rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.message-input {
  width: 100%;
  min-height: 100px;
  padding: 20px;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 1em;
  outline: none;
  background: var(--dark-surface);
  color: var(--text-primary);
  transition: all 0.3s ease;
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
  color: white;
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

.reset-btn {
  background: rgba(30, 30, 30, 0.8);
  font-weight: 500;
  padding: 8px 20px;
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
}

.reset-btn:hover {
  background: rgba(255, 100, 100, 0.1);
  border-color: rgba(255, 100, 100, 0.5);
  color: rgba(255, 100, 100, 0.9);
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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
.reset-btn {
  background: var(--dark-surface);
  font-weight: 600;
  padding: 8px 20px;
  border: 1px solid #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.reset-btn:hover {
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.4);
  transform: translateY(-2px);
  color: white;
}

.reset-btn::before {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

/* 响应历史记录区域样式 */
.response-history-section {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh; /* 增加最大高度，使用视口高度的70% */
  overflow-y: auto; /* 使用auto，根据内容自动显示滚动条 */
  padding-right: 10px;
  padding-bottom: 100px; /* 增加底部内边距，确保内容不被底部输入区域遮挡 */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) var(--dark-surface);
  flex: 1; /* 允许区域伸展填充可用空间 */
  min-height: 0; /* 确保flex子元素可以正确滚动 */
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
  margin-bottom: 25px;
  padding: 0;
  background: var(--dark-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
  width: 100%; /* 确保宽度为100% */
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止长回答压缩其他内容 */
}

.conversation-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 5px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease; /* 添加过渡效果 */
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
  padding: 15px 20px;
  border-bottom: 1px solid var(--dark-border);
  background: rgba(30, 30, 30, 0.5);
  width: 55%; /* 问题容器占55%宽度，增加宽度以更好利用右侧空间 */
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
  align-self: flex-start;
  border-radius: 8px;
  margin-left: auto; /* 将问题容器推到右侧 */
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--dark-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-title {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.question-content {
  color: var(--text-primary);
  font-size: 0.95em;
  line-height: 1.5;
  word-wrap: break-word; /* 确保长文本换行 */
  white-space: pre-wrap; /* 保留空格和换行符 */
  overflow-wrap: break-word; /* 防止溢出 */
  position: relative;
}

.collapsed-question {
  position: relative;
  padding-bottom: 30px;
}

.expand-question-btn,
.collapse-question-btn {
  background: var(--dark-surface);
  border: none;
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8em;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.expand-question-btn:hover,
.collapse-question-btn:hover {
  background: var(--dark-hover);
  color: var(--text-primary);
}

.answer-container {
  padding: 15px 20px;
  width: 42%; /* 回答容器占42%宽度，与问题容器的55%形成平衡 */
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
  align-self: flex-start;
  background: rgba(40, 40, 40, 0.5);
  border-radius: 8px;
  margin-right: auto; /* 将回答容器推到左侧 */
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.answer-title {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--primary-color);
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
}

.question-badge {
  background-color: rgba(255, 165, 0, 0.2);
  color: #ff9800;
  border: 1px solid #ff9800;
}

.answer-content {
  color: var(--text-primary);
  font-size: 0.95em;
  line-height: 1.6;
  word-wrap: break-word; /* 确保长文本换行 */
  overflow-wrap: break-word; /* 防止溢出 */
  max-width: 100%; /* 确保内容不超出容器 */
  overflow-x: hidden; /* 防止水平方向溢出 */
  width: 100%; /* 确保宽度为100% */
}

.answer-content div {
  white-space: normal; /* 允许正常换行 */
}

/* 样式化HTML内容中的常见元素 */
.answer-content h1, .answer-content h2, .answer-content h3, 
.answer-content h4, .answer-content h5, .answer-content h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: var(--text-primary);
}

.answer-content p {
  margin-bottom: 1em;
}

.answer-content ul, .answer-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.answer-content li {
  margin-bottom: 0.5em;
}

.answer-content pre {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.answer-content code {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.answer-content pre code {
  background-color: transparent;
  padding: 0;
}

.answer-content a {
  color: var(--primary-color);
  text-decoration: none;
}

.answer-content a:hover {
  text-decoration: underline;
}

.answer-content blockquote {
  border-left: 4px solid var(--primary-color);
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: var(--text-secondary);
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
  background: var(--primary-color-transparent);
}

.expand-btn:hover {
  background: var(--primary-color);
  color: white;
}

.collapse-btn {
  color: var(--text-secondary);
}

.collapse-btn:hover {
  background: var(--dark-hover);
  color: var(--text-primary);
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