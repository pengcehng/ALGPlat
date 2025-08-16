<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventBus } from '../eventBus';

// 控制工具栏和对话框的显示状态
const isAnalyzing = ref(false);
const showTools = ref(true);
const showFeatureMenu = ref(false);

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
    // 生成回答内容（这里使用模拟数据）
    // 根据历史对话生成更连贯的回答
    let answer;
    if (responseHistory.value.length > 0) {
      // 如果有历史对话，生成连续性回答
      answer = `基于我们之前的对话，对于问题「${currentQuestion}」的分析是：这是一个模拟的AI回答内容。`;
    } else {
      // 首次对话
      answer = `这是对问题「${currentQuestion}」的分析结果：这是一个模拟的AI回答内容。`;
    }
    
    // 添加到历史记录
    responseHistory.value.unshift({
      question: currentQuestion,
      answer: answer,
      expanded: false,
      timestamp: Date.now()
    });
    
    // 不再将isAnalyzing设置为false，保持功能按钮的显示
    // isAnalyzing.value = false; // 分析完成
  }, 1000);
};

// 用户输入和响应历史记录
const userInput = ref('');
const nextUserInput = ref(''); // 添加第二个输入框的状态
const responseHistory = ref<Array<{question: string, answer: string, expanded: boolean, timestamp: number}>>([]);

// 回复示例相关变量已移除

// 切换展开/折叠状态
const toggleExpand = (index: number) => {
  responseHistory.value[index].expanded = !responseHistory.value[index].expanded;
};

// 获取预览内容（前150个字符）
const getPreviewContent = (content: string) => {
  if (content.length <= 150) return content;
  return content.substring(0, 150) + '...';
};

// 检查内容是否需要折叠
const needsCollapsing = (content: string) => {
  return content.length > 150;
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
  
  // 添加AI欢迎语句到新对话
  responseHistory.value.unshift({
    question: '',
    answer: '你好！我是AI助手，很高兴为你服务。请问有什么我可以帮助你的吗？',
    expanded: false,
    timestamp: Date.now()
  });
};

// 监听事件总线的new-conversation事件
eventBus.on('new-conversation', () => {
  newConversation();
});

// 在组件加载时添加欢迎语句
onMounted(() => {
  // 添加AI欢迎语句到对话历史
  responseHistory.value.unshift({
    question: '',
    answer: '你好！我是AI助手，很高兴为你服务。请问有什么我可以帮助你的吗？',
    expanded: false,
    timestamp: Date.now()
  });
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
</script>

<template>
  <div class="main-content">
    <div class="greeting-section">
      <h1 class="greeting">欢迎使用算法学习助手</h1>
      <p class="greeting-subtitle">探索、学习、实践、掌握算法的智能平台</p>
    </div>
    
    <!-- 响应历史记录区域 -->
    <div v-if="responseHistory.length > 0" class="response-history-section">
      <div 
        v-for="(item, index) in responseHistory" 
        :key="index" 
        class="response-history-item"
      >
        <div class="question-container">
          <div class="question-header">
            <div class="user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="question-title">您的问题</div>
          </div>
          <div class="question-content">{{ item.question }}</div>
        </div>
        
        <div class="answer-container">
          <div class="answer-header">
            <div class="ai-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div class="answer-title">算法助手</div>
            <div class="answer-time">{{ new Date(item.timestamp).toLocaleString() }}</div>
          </div>
          <div class="answer-content">
            <div v-if="!item.expanded && needsCollapsing(item.answer)">
              {{ getPreviewContent(item.answer) }}
              <button class="expand-btn" @click="toggleExpand(index)">展开全部</button>
            </div>
            <div v-else>
              {{ item.answer }}
              <button 
                v-if="needsCollapsing(item.answer)" 
                class="collapse-btn" 
                @click="toggleExpand(index)"
              >
                收起
              </button>
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: var(--dark-bg);
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(108, 92, 231, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(0, 206, 201, 0.05) 0%, transparent 20%);
  overflow-y: auto;
  position: relative;
  z-index: 1;
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
  border: 1px solid var(--dark-border);
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
  border: 1px solid var(--dark-border);
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
}

.response-history-item {
  background: var(--dark-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid var(--dark-border);
}

.response-history-item:hover {
  box-shadow: 0 5px 20px rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.question-container {
  padding: 15px 20px;
  border-bottom: 1px solid var(--dark-border);
  background: rgba(30, 30, 30, 0.5);
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
}

.answer-container {
  padding: 15px 20px;
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

.answer-content {
  color: var(--text-primary);
  font-size: 0.95em;
  line-height: 1.6;
}

.expand-btn, .collapse-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 10px;
  margin-top: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.expand-btn:hover, .collapse-btn:hover {
  background: rgba(108, 92, 231, 0.1);
  text-decoration: underline;
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