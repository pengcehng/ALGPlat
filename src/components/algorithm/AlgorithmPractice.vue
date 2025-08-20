<script setup lang="ts">
import { ref } from 'vue';
import AlgorithmAnimation from './AlgorithmAnimation.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';
import { useAlgorithmPractice } from './scripts/AlgorithmPracticeLogic';

const {
  // 数据结构与算法
  dataStructures,
  selectedStructure,
  selectDataStructure,
  algorithmCategories,
  selectedCategory,
  selectedAlgorithm,
  currentCategoryAlgorithms,
  selectAlgorithm,

  // 页面与输入/输出
  pageMode,
  userCode,
  userInputData,
  analysisResult,
  isLoading,

  // 动画
  isAnimating,
  animationSpeed,
  animationStep,
  totalSteps,
  currentAnimationData,

  // 控制
  startAnimation,
  pauseAnimation,
  resumeAnimation,
  resetAnimation,
  submitCode,

  // 下拉与交互
  showDataStructureDropdown,
  showAlgorithmDropdown,
  toggleDataStructureDropdown,
  toggleAlgorithmDropdown,

  // 其他
  selectedOperation,
  returnHome,
  useExampleData,
  addElement,
  deleteElement,
  traverseOperation,
  searchElement
} = useAlgorithmPractice();

// 全屏控制 - 初始化状态为关闭，不与模式绑定
const isVizFullscreen = ref(false); // 展示模式 - 左侧可视化
const isPracticeVizFullscreen = ref(false); // 练习模式 - 可视化
const isCodeFullscreen = ref(false); // 练习模式 - 程序输入
const isAnalysisFullscreen = ref(false); // 练习模式 - 算法分析

// Fullscreen 目标容器
const displayVizPanelRef = ref<HTMLElement | null>(null);
const practiceVizPanelRef = ref<HTMLElement | null>(null);
const codePanelRef = ref<HTMLElement | null>(null);
const analysisPanelRef = ref<HTMLElement | null>(null);

// 通用全屏切换 - 独立于模式切换
function toggleFullscreen(target: HTMLElement | null, stateRef: typeof isVizFullscreen) {
  if (!target) return;
  const isFs = !!document.fullscreenElement;
  if (!isFs) {
    target.requestFullscreen?.();
  } else if (document.fullscreenElement !== target) {
    document.exitFullscreen?.().then(() => target.requestFullscreen?.());
  } else {
    document.exitFullscreen?.();
  }
}

function handleDisplayVizFullscreen() {
  toggleFullscreen(displayVizPanelRef.value, isVizFullscreen);
}
function handlePracticeVizFullscreen() {
  toggleFullscreen(practiceVizPanelRef.value, isPracticeVizFullscreen);
}
function handleCodeFullscreen() {
  toggleFullscreen(codePanelRef.value, isCodeFullscreen);
}
function handleAnalysisFullscreen() {
  toggleFullscreen(analysisPanelRef.value, isAnalysisFullscreen);
}

// 同步全屏状态 - 独立管理，不受模式切换影响
document.addEventListener('fullscreenchange', () => {
  const el = document.fullscreenElement;
  isVizFullscreen.value = el === displayVizPanelRef.value;
  isPracticeVizFullscreen.value = el === practiceVizPanelRef.value;
  isCodeFullscreen.value = el === codePanelRef.value;
  isAnalysisFullscreen.value = el === analysisPanelRef.value;
});
</script>

<template>
  <div class="algorithm-practice">
    <div class="layout-container" :class="{ 'practice': pageMode === 'practice' }">
      <div class="animation-main-container full-width">
        <!-- 顶部头部区域 -->
        <AlgorithmHeaderNav 
          :page-mode="pageMode"
          :selected-structure="selectedStructure"
          :selected-algorithm="selectedAlgorithm"
          @select-data-structure="selectDataStructure"
          @select-algorithm="selectAlgorithm"
          @return-home="returnHome"
        />

        <!-- 展示模式 -->
        <div v-if="pageMode === 'display'" class="display-layout">
          <div class="display-left" :class="{ 'viz-fullscreen': isVizFullscreen }">
            <div class="viz-panel" ref="displayVizPanelRef">
              <div class="viz-header">
                <h3 class="viz-title">算法可视化动画</h3>
                <div class="viz-actions">
                  <button class="mode-btn" @click="handleDisplayVizFullscreen">{{ isVizFullscreen ? '退出全屏' : '全屏显示' }}</button>
                </div>
              </div>
              <div class="viz-body">
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

            <!-- 进度条（全屏时隐藏） -->
            <div class="animation-progress" v-if="totalSteps > 0 && !isVizFullscreen">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${(animationStep / totalSteps) * 100}%` }"></div>
              </div>
              <div class="step-indicator">步骤: {{ animationStep }} / {{ totalSteps }}</div>
            </div>
          </div>

          <div class="display-right">
            <div class="panel control-panel">
              <div class="animation-controls">
                <div class="animation-control-group">
                  <button class="control-btn start-btn" @click="startAnimation" :disabled="isAnimating || isLoading">{{ isLoading ? '处理中...' : '开始演示' }}</button>
                  <button class="control-btn resume-btn" @click="resumeAnimation" :disabled="isAnimating || animationStep === 0 || animationStep === totalSteps">继续</button>
                  <button class="control-btn pause-btn" @click="pauseAnimation" :disabled="!isAnimating">暂停</button>
                  <button class="control-btn reset-btn" @click="resetAnimation" :disabled="animationStep === 0">重置</button>
                </div>

                <div class="data-operation-group">
                  <h4 class="operation-title">数据操作:</h4>
                  <div class="operation-buttons">
                    <button class="operation-btn add-btn" @click="addElement" :disabled="isAnimating"><span class="operation-icon">➕</span><span class="operation-name">增加</span></button>
                    <button class="operation-btn delete-btn" @click="deleteElement" :disabled="isAnimating"><span class="operation-icon">➖</span><span class="operation-name">删除</span></button>
                    <button class="operation-btn traverse-btn" @click="traverseOperation" :disabled="isAnimating"><span class="operation-icon">🔄</span><span class="operation-name">遍历</span></button>
                    <button class="operation-btn search-btn" @click="searchElement" :disabled="isAnimating"><span class="operation-icon">🔍</span><span class="operation-name">查找</span></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 数据示例与自定义数据（可按需补充） -->
            <div class="panel examples-panel">
              <div class="data-examples-container">
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 练习模式 -->
        <div class="practice-features" v-else>
          <div class="practice-top-section">
            <!-- 程序输入（带全屏） -->
            <div class="feature-section code-input-section" :class="{ 'feature-fullscreen': isCodeFullscreen }" ref="codePanelRef">
              <h3 class="section-subtitle">程序输入</h3>
              <div class="panel-actions">
                <button class="mode-btn" @click="handleCodeFullscreen">{{ isCodeFullscreen ? '退出全屏' : '全屏显示' }}</button>
              </div>
              <div class="input-guide">请在此输入您的算法代码</div>
              <div class="input-container">
                <textarea v-model="userCode" class="code-input" placeholder="请输入您的算法代码..." :disabled="isAnimating"></textarea>
              </div>
              <button class="run-code-btn" @click="submitCode" :disabled="isAnimating || isLoading">运行算法</button>
            </div>

            <!-- 算法分析（带全屏，去掉性能分析标签） -->
            <div class="feature-section analysis-section" :class="{ 'feature-fullscreen': isAnalysisFullscreen }" ref="analysisPanelRef">
              <h3 class="section-subtitle">算法分析</h3>
              <div class="panel-actions">
                <button class="mode-btn" @click="handleAnalysisFullscreen">{{ isAnalysisFullscreen ? '退出全屏' : '全屏显示' }}</button>
              </div>
              <div class="analysis-content" v-if="analysisResult"><pre>{{ analysisResult }}</pre></div>
              <div class="analysis-content" v-else>
                <div class="analysis-placeholder">
                  <p>算法分析结果将在此显示...</p>
                  <p>包括时间复杂度、空间复杂度和优化建议</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 算法可视化（带全屏 + 滚动） -->
          <div class="feature-section animation-section full-width" :class="{ 'feature-fullscreen': isPracticeVizFullscreen }" ref="practiceVizPanelRef">
            <h3 class="section-subtitle animation-title">算法可视化动画</h3>
            <div class="panel-actions">
              <button class="mode-btn" @click="handlePracticeVizFullscreen">{{ isPracticeVizFullscreen ? '退出全屏' : '全屏显示' }}</button>
            </div>
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
      </div>
    </div>
  </div>
</template>

<style src="./styles/AlgorithmPractice.css"></style>
<!-- 触发热更新 - 最大化动画区域空间 -->


