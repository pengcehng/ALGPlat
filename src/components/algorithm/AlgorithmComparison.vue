<script setup lang="ts">
import AlgorithmChart from './AlgorithmChart.vue';
import AlgorithmPerformanceCurve from './AlgorithmPerformanceCurve.vue';
import { useAlgorithmComparison } from './scripts/AlgorithmComparisonLogic';

const {
  goToHome,
  leftAlgorithm,
  rightAlgorithm,
  supportedLanguages,
  leftAnalysis,
  rightAnalysis,
  isAnalyzing,
  analysisComplete,
  analysisError,
  runAnalysis,
  resetAnalysis,
  comparisonResult,
  loadSampleCode
} = useAlgorithmComparison();
</script>

<template>
  <div class="algorithm-comparison-container">
    <div class="header-with-back">
      <button class="back-btn" @click="goToHome">
        返回主页
      </button>
      <h1 class="comparison-title">算法性能对比分析</h1>
    </div>
    
    <div class="comparison-layout">
      <!-- 左侧算法输入 -->
      <div class="algorithm-input left-algorithm">
        <div class="input-header">
          <input v-model="leftAlgorithm.name" class="algorithm-name-input" placeholder="算法名称">
          <select v-model="leftAlgorithm.language" class="language-select">
            <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
        
        <div class="code-editor-container">
          <textarea 
            v-model="leftAlgorithm.code" 
            class="code-editor enhanced" 
            placeholder="在此输入算法代码..."
          ></textarea>
        </div>
        

      </div>
      
      <!-- 中间分析结果 -->
      <div class="analysis-result">
        <div class="analysis-header">
          <h2>性能分析</h2>
          <div class="action-buttons">
            <button @click="runAnalysis" class="primary-btn" :disabled="isAnalyzing">
              {{ isAnalyzing ? '分析中...' : '运行分析' }}
            </button>
            <button @click="resetAnalysis" class="secondary-btn">重置</button>
          </div>
        </div>
        
        <div v-if="!isAnalyzing && !analysisComplete && !analysisError" class="empty-analysis">
          <div class="operation-tips">
            <h3>🚀 开始算法性能对比分析</h3>
            <div class="tips-content">
              <div class="tip-item">
                <span class="tip-number">1</span>
                <p>在左右两侧输入框中输入算法代码</p>
              </div>
              <div class="tip-item">
                <span class="tip-number">2</span>
                <p>为算法设置合适的名称，选择对应的编程语言</p>
              </div>
              <div class="tip-item">
                <span class="tip-number">3</span>
                <p>点击"运行分析"按钮开始性能对比分析</p>
              </div>
              <div class="tip-item">
                <span class="tip-number">4</span>
                <p>查看详细的性能对比结果，包括时间复杂度、空间复杂度和性能曲线</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误状态显示 -->
        <div v-if="analysisError && !isAnalyzing" class="error-display">
          <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h3>分析失败</h3>
            <p class="error-message">{{ analysisError }}</p>
            <div class="error-actions">
              <button @click="runAnalysis" class="retry-btn">重试分析</button>
              <button @click="resetAnalysis" class="reset-btn">重置</button>
            </div>
          </div>
        </div>
        
        <div v-if="!isAnalyzing && analysisComplete" class="results-layout">
            <div class="comparison-table-block">
              <table>
                <thead>
                  <tr>
                    <th>指标</th>
                    <th>{{ leftAlgorithm.name }}</th>
                    <th>{{ rightAlgorithm.name }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>时间复杂度</td>
                    <td>{{ leftAnalysis.timeComplexity }}</td>
                    <td>{{ rightAnalysis.timeComplexity }}</td>
                  </tr>
                  <tr>
                    <td>空间复杂度</td>
                    <td>{{ leftAnalysis.spaceComplexity }}</td>
                    <td>{{ rightAnalysis.spaceComplexity }}</td>
                  </tr>
                  <tr>
                    <td>执行时间</td>
                    <td>{{ leftAnalysis.executionTime }}ms</td>
                    <td>{{ rightAnalysis.executionTime }}ms</td>
                  </tr>
                  <tr>
                    <td>内存使用</td>
                    <td>{{ leftAnalysis.memoryUsage }}MB</td>
                    <td>{{ rightAnalysis.memoryUsage }}MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="comparison-charts-block">
              <AlgorithmChart 
                :leftAlgorithm="leftAlgorithm" 
                :rightAlgorithm="rightAlgorithm"
                :leftAnalysis="leftAnalysis"
                :rightAnalysis="rightAnalysis"
              />
            </div>
            
            <div class="performance-curve-block">
              <AlgorithmPerformanceCurve 
                :leftAlgorithm="leftAlgorithm" 
                :rightAlgorithm="rightAlgorithm"
                :leftAnalysis="leftAnalysis"
                :rightAnalysis="rightAnalysis"
              />
            </div>
            
            <div class="comparison-conclusion-block">
              <h3>分析结论</h3>
              <p>{{ comparisonResult?.timeComparison }}</p>
              <p>{{ comparisonResult?.memoryComparison }}</p>
              {{ comparisonResult?.recommendation }}
            </div>
        </div>
        
        <div v-if="isAnalyzing" class="analyzing-indicator">
          <div class="loading-animation">
            <div class="spinner-container">
              <div class="spinner"></div>
              <div class="spinner-inner"></div>
            </div>
            <div class="loading-content">
              <h3>🔍 正在进行算法性能分析</h3>
              <div class="loading-steps">
                <div class="step-item active">
                  <span class="step-icon">⚡</span>
                  <span class="step-text">解析算法代码结构</span>
                </div>
                <div class="step-item active">
                  <span class="step-icon">📊</span>
                  <span class="step-text">计算时间复杂度</span>
                </div>
                <div class="step-item active">
                  <span class="step-icon">💾</span>
                  <span class="step-text">分析空间复杂度</span>
                </div>
                <div class="step-item active">
                  <span class="step-icon">📈</span>
                  <span class="step-text">生成性能曲线</span>
                </div>
              </div>
              <p class="loading-tip">请稍候，分析过程可能需要几秒钟...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧算法输入 -->
      <div class="algorithm-input right-algorithm">
        <div class="input-header">
          <input v-model="rightAlgorithm.name" class="algorithm-name-input" placeholder="算法名称">
          <select v-model="rightAlgorithm.language" class="language-select">
            <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
        
        <div class="code-editor-container">
          <textarea 
            v-model="rightAlgorithm.code" 
            class="code-editor enhanced" 
            placeholder="在此输入算法代码..."
          ></textarea>
        </div>
        

      </div>
    </div>
  </div>
</template>

<style>
@import './styles/AlgorithmComparison.css';
</style>