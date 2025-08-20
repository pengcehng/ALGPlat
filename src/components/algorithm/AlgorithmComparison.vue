<script setup lang="ts">
import AlgorithmChart from './AlgorithmChart.vue';
import AlgorithmHeaderNav from './AlgorithmHeaderNav.vue';
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
  runAnalysis,
  resetAnalysis,
  comparisonResult,
  loadSampleCode
} = useAlgorithmComparison();
</script>

<template>
  <div class="algorithm-comparison-container">
    <!-- 头部导航栏 -->
    <AlgorithmHeaderNav 
      page-mode="comparison"
      @return-home="goToHome"
    />
    
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
        
        <div class="sample-buttons">
          <button @click="loadSampleCode('left', 'quickSort')" class="sample-btn">加载快速排序</button>
          <button @click="loadSampleCode('left', 'bubbleSort')" class="sample-btn">加载冒泡排序</button>
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
        
        <div class="analysis-content" v-if="!isAnalyzing">
          <div v-if="!analysisComplete" class="empty-analysis">
            <p>请输入两个算法代码并点击"运行分析"按钮</p>
          </div>
          
          <div v-else class="analysis-data">
            <div class="comparison-table">
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
            
            <div class="comparison-charts">
              <AlgorithmChart 
                :leftAlgorithm="leftAlgorithm" 
                :rightAlgorithm="rightAlgorithm"
                :leftAnalysis="leftAnalysis"
                :rightAnalysis="rightAnalysis"
              />
            </div>
            
            <div class="comparison-conclusion">
              <h3>分析结论</h3>
              <p>{{ comparisonResult?.timeComparison }}</p>
              <p>{{ comparisonResult?.memoryComparison }}</p>
              <p class="recommendation">{{ comparisonResult?.recommendation }}</p>
            </div>
            
            <!-- 个性化推荐已移除 -->
          </div>
        </div>
        
        <div v-else class="analyzing-indicator">
          <div class="spinner"></div>
          <p>正在分析中，请稍候...</p>
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
        
        <div class="sample-buttons">
          <button @click="loadSampleCode('right', 'quickSort')" class="sample-btn">加载快速排序</button>
          <button @click="loadSampleCode('right', 'bubbleSort')" class="sample-btn">加载冒泡排序</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import './styles/AlgorithmComparison.css';
</style>