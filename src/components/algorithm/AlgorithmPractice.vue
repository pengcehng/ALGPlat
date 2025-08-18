<script setup lang="ts">
import AlgorithmAnimation from './AlgorithmAnimation.vue';
import { useAlgorithmPractice } from './scripts/AlgorithmPracticeLogic';

// 使用组合式函数获取所有逻辑和状态
const {
  dataStructures,
  selectedStructure,
  selectDataStructure,
  algorithms,
  algorithmCategories,
  selectedCategory,
  selectedAlgorithm,
  currentCategoryAlgorithms,
  selectCategory,
  selectAlgorithm,
  pageMode,
  togglePageMode,
  userInput,
  userCode,
  inputMode,
  toggleInputMode,
  parseUserInput,
  animationData,
  animationSteps,
  isAnimating,
  animationSpeed,
  animationStep,
  totalSteps,
  startAnimation,
  pauseAnimation,
  resumeAnimation,
  resetAnimation,
  setAnimationSpeed,
  analysisResult,
  isLoading,
  submitCode,
  showDataStructureDropdown,
  showAlgorithmDropdown,
  toggleDataStructureDropdown,
  toggleAlgorithmDropdown,
  selectedOperation,
  executeAlgorithm,
  returnHome,
  getExampleData,
  useExampleData,
  addElement,
  deleteElement,
  traverseOperation,
  searchElement,
  currentAnimationData
} = useAlgorithmPractice();

// 所有逻辑已移至AlgorithmPracticeLogic.ts文件中
</script>

<template>
  <div class="algorithm-practice">
    <!-- 移除了页面头部的标题区域 -->
    
    <div class="layout-container" :class="{ 'practice': pageMode === 'practice' }">
      <!-- 移除了左侧控制面板，将内容整合到顶部 -->
      
      <!-- 主要动画展示区域 - 占据整个页面宽度 -->
      <div class="animation-main-container full-width">
        <div class="animation-header">
          <div class="header-left" style="display: flex; align-items: center; gap: 15px;">
            <h2 class="section-title">{{ pageMode === 'display' ? '算法演示' : '算法练习' }}</h2>
            <button class="return-home-btn" @click="returnHome">
              <i class="fas fa-home"></i> 返回主页
            </button>
          
            <!-- 数据结构选择 -->
            <div class="header-dropdown data-structure-dropdown">
              <button class="header-dropdown-btn" @click.stop="toggleDataStructureDropdown">
                <span class="structure-name">{{ selectedStructure?.name || '选择数据结构' }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>
              <div class="dropdown-content" v-if="showDataStructureDropdown">
                <button 
                  v-for="structure in dataStructures" 
                  :key="structure.id"
                  class="structure-btn" 
                  :class="{ active: selectedStructure?.id === structure.id }"
                  @click.stop="selectDataStructure(structure)"
                >
                  <span class="structure-icon">{{ structure.icon }}</span>
                  <span class="structure-name">{{ structure.name }}</span>
                </button>
              </div>
            </div>
            
            <!-- 算法选择 -->
            <div class="header-dropdown algorithm-dropdown">
              <button class="header-dropdown-btn" @click.stop="toggleAlgorithmDropdown">
                <span class="algorithm-name">{{ selectedAlgorithm?.name || '选择算法' }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>
              <div class="dropdown-content" v-if="showAlgorithmDropdown">
                <!-- 算法分类选项 -->
                <div class="category-selector">
                  <button 
                    v-for="category in algorithmCategories" 
                    :key="category.id"
                    class="category-btn"
                    :class="{ active: selectedCategory === category.id }"
                    @click.stop="selectedCategory = category.id"
                  >
                    {{ category.name }}
                  </button>
                </div>
                
                <!-- 算法列表 -->
                <div class="algorithm-list">
                  <div 
                    v-for="algorithm in currentCategoryAlgorithms" 
                    :key="algorithm.id"
                    class="algorithm-card"
                    :class="{ active: selectedAlgorithm?.id === algorithm.id }"
                    @click.stop="selectAlgorithm(algorithm)"
                  >
                    <div class="algorithm-name">{{ algorithm.name }}</div>
                    <div class="algorithm-complexity">{{ algorithm.complexity }}</div>
                    <div class="algorithm-desc">{{ algorithm.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 页面模式切换 -->
            <div class="mode-toggle">
              <button 
                class="mode-btn" 
                :class="{ active: pageMode === 'display' }"
                @click="pageMode = 'display'"
              >
                <span class="mode-icon">👁️</span>
                <span class="mode-name">展示模式</span>
              </button>
              <button 
                class="mode-btn" 
                :class="{ active: pageMode === 'practice' }"
                @click="pageMode = 'practice'"
              >
                <span class="mode-icon">✏️</span>
                <span class="mode-name">练习模式</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 动画控制按钮 -->
        <div class="animation-controls">
          <!-- 展示模式下的控制按钮 -->
          <template v-if="pageMode === 'display'">
            <!-- 动画控制按钮 -->
            <div class="animation-control-group">
              <button 
                class="control-btn start-btn" 
                @click="startAnimation" 
                :disabled="isAnimating || isLoading"
              >
                {{ isLoading ? '处理中...' : '开始演示' }}
              </button>
              <button 
                class="control-btn resume-btn" 
                @click="resumeAnimation" 
                :disabled="isAnimating || animationStep === 0 || animationStep === totalSteps"
              >
                继续
              </button>
              <button 
                class="control-btn reset-btn" 
                @click="resetAnimation" 
                :disabled="animationStep === 0"
              >
                重置
              </button>
            </div>
            
            <!-- 数据结构操作按钮 -->
            <div class="data-operation-group">
              <h4 class="operation-title">数据操作:</h4>
              <div class="operation-buttons">
                <button 
                  class="operation-btn add-btn" 
                  @click="addElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">➕</span>
                  <span class="operation-name">增加</span>
                </button>
                <button 
                  class="operation-btn delete-btn" 
                  @click="deleteElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">➖</span>
                  <span class="operation-name">删除</span>
                </button>
                <button 
                  class="operation-btn traverse-btn" 
                  @click="traverseOperation"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">🔄</span>
                  <span class="operation-name">遍历</span>
                </button>
                <button 
                  class="operation-btn search-btn" 
                  @click="searchElement"
                  :disabled="isAnimating"
                >
                  <span class="operation-icon">🔍</span>
                  <span class="operation-name">查找</span>
                </button>
              </div>
            </div>
          </template>
          
          <!-- 练习模式下不需要控制按钮 -->
          <template v-else>
            <!-- 控制按钮已移除 -->
          </template>
        </div>
        
        <!-- 进度指示器 -->
        <div class="animation-progress" v-if="totalSteps > 0">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(animationStep / totalSteps) * 100}%` }"
            ></div>
          </div>
          <div class="step-indicator">
            步骤: {{ animationStep }} / {{ totalSteps }}
          </div>
        </div>
        
        <!-- 练习模式功能区 -->
        <div class="practice-features" v-if="pageMode === 'practice'">
          <!-- 上部分：左侧程序输入和右侧算法分析 -->
          <div class="practice-top-section">
            <!-- 左侧：程序输入区域 -->
            <div class="feature-section code-input-section">
              <h3 class="section-subtitle">程序输入</h3>
              <div class="input-guide">
                  请在此输入您的算法代码
              </div>
              
              <div class="input-container">
                <textarea 
                  v-model="userCode" 
                  class="code-input" 
                  placeholder="请输入您的算法代码..."
                  :disabled="isAnimating"
                ></textarea>
              </div>
              <button 
                class="run-code-btn" 
                @click="submitCode"
                :disabled="isAnimating || isLoading"
              >
                运行算法
              </button>
            </div>
            
            <!-- 右侧：算法分析结果 -->
            <div class="feature-section analysis-section">
              <h3 class="section-subtitle">算法分析</h3>
              <div class="analysis-tabs">
                <button class="tab-btn active">算法分析</button>
                <button class="tab-btn">性能分析</button>
              </div>
              <div class="analysis-content" v-if="analysisResult">
                <pre>{{ analysisResult }}</pre>
              </div>
              <div class="analysis-content" v-else>
                <div class="analysis-placeholder">
                  <p>算法分析结果将在此显示...</p>
                  <p>包括时间复杂度、空间复杂度和优化建议</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 底部：算法可视化动画 -->
          <div class="feature-section animation-section full-width">
            <h3 class="section-subtitle animation-title">算法可视化动画</h3>
            <div class="animation-display-container">
              <AlgorithmAnimation
                v-if="currentAnimationData"
                :algorithm-type="selectedAlgorithm?.id || ''"
                :data="currentAnimationData"
                :step="animationStep"
                :total-steps="totalSteps"
                :speed="animationSpeed"
                :operation-type="selectedOperation?.id || ''"
              />
              <div class="animation-placeholder" v-else>
                <div class="placeholder-icon"></div>
                <p>运行算法后将在此处显示动画</p>
                <p class="placeholder-hint">请在上方输入您的代码并点击"运行算法"按钮</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 展示模式下显示数据示例 -->
        <div class="data-examples-container" v-if="pageMode === 'display'">
          <h3 class="section-subtitle">数据示例</h3>
          <div class="display-examples">
            <div class="example-data">
              <p v-if="selectedStructure">当前展示的{{ selectedStructure.name }}示例：</p>
              <div class="data-preview">
                <pre v-if="selectedStructure?.id === 'array'">[1, 3, 5, 7, 9, 2, 4, 6, 8]</pre>
                <pre v-if="selectedStructure?.id === 'linkedList'">1->3->5->7->9->2->4->6->8</pre>
                <pre v-if="selectedStructure?.id === 'tree'">[1,2,3,4,5,null,6,null,null,7,8]</pre>
                <pre v-if="selectedStructure?.id === 'graph'">A-B,B-C,C-D,A-D,B-D</pre>
                <pre v-if="selectedStructure?.id === 'stack'">1,3,5,7,9 (底->顶)</pre>
                <pre v-if="selectedStructure?.id === 'queue'">1,3,5,7,9 (前->后)</pre>
                <pre v-if="selectedStructure?.id === 'hashTable'">a:1,b:3,c:5,d:7,e:9</pre>
              </div>
            </div>
            <div class="algorithm-description">
              <p v-if="selectedStructure">{{ selectedStructure.name }}的遍历过程：</p>
              <ul>
                <li v-if="selectedStructure && selectedStructure.id === 'array'">从第一个元素开始，依次访问每个元素</li>
                <li v-if="selectedStructure && selectedStructure.id === 'linkedList'">从头节点开始，沿着next指针访问每个节点</li>
                <li v-if="selectedStructure && selectedStructure.id === 'tree'">可以采用前序、中序或后序遍历</li>
                <li v-if="selectedStructure && selectedStructure.id === 'graph'">可以采用深度优先或广度优先遍历</li>
                <li v-if="selectedStructure && selectedStructure.id === 'stack'">从栈顶开始，依次弹出元素</li>
                <li v-if="selectedStructure && selectedStructure.id === 'queue'">从队首开始，依次出队元素</li>
                <li v-if="selectedStructure && selectedStructure.id === 'hashTable'">遍历所有键值对</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 使用AlgorithmAnimation组件 -->
        <div class="animation-main-area">
          <AlgorithmAnimation
            :algorithm-type="selectedStructure?.id || ''"
            :data="currentAnimationData || {}"
            :step="animationStep"
            :total-steps="totalSteps"
            :speed="animationSpeed"
            :operation-type="selectedOperation?.id || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./styles/AlgorithmPractice.css">
</style>
