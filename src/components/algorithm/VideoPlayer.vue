<template>
  <div v-if="isVisible && video" class="video-player-modal" @click="$emit('close')">
    <div class="video-player-container" @click.stop>
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="video-player">
        <!-- Video.js 播放器容器 -->
        <div 
          ref="videoContainer" 
          class="video-js-container"
          v-show="video.videoUrl"
        >
          <video
            ref="videoElement"
            class="video-js vjs-default-skin"
            controls
            preload="auto"
            data-setup="{}"
          >
            <p class="vjs-no-js">
              要查看此视频，请启用 JavaScript，并考虑升级到
              <a href="https://videojs.com/html5-video-support/" target="_blank">
                支持HTML5视频的网络浏览器
              </a>。
            </p>
          </video>
        </div>
        
        <!-- 视频加载失败时的错误提示 -->
        <div v-if="videoError" class="video-error">
          <div class="error-icon">⚠️</div>
          <h4>视频加载失败</h4>
          <p>{{ videoError }}</p>
          <button @click="retryVideo" class="retry-btn">重试</button>
        </div>
        
        <!-- 无视频URL时的提示 -->
        <div v-if="!video.videoUrl && !videoError" class="video-loading">
          <div class="loading-spinner"></div>
          <p>正在加载视频...</p>
        </div>
      </div>
      <div class="video-details">
        <h3>{{ video.title }}</h3>
        <p>{{ video.description }}</p>
        
        <!-- 视频信息显示 -->
        <div v-if="videoInfo" class="video-info">
          <span class="info-item">分辨率: {{ videoInfo.resolution }}</span>
          <span class="info-item">时长: {{ videoInfo.duration }}</span>
          <span class="info-item">当前画质: {{ currentQuality }}</span>
        </div>
        
        <!-- 画质选择器 -->
        <div class="quality-selector">
          <label>画质选择:</label>
          <select v-model="selectedQuality" @change="changeQuality" class="quality-select">
            <option value="原始画质">原始画质 (自适应)</option>
            <option value="720p">720p (高清 - 2.5Mbps)</option>
            <option value="480p">480p (标清 - 1.2Mbps)</option>
            <option value="360p">360p (流畅 - 0.8Mbps)</option>
            <option value="240p">240p (省流 - 0.4Mbps)</option>
          </select>
        </div>
        
        <!-- 网络状况显示 -->
        <div class="network-info">
          <span class="info-item">网络状况: {{ networkQuality === 'fast' ? '优秀' : networkQuality === 'medium' ? '良好' : '较慢' }}</span>
          <span class="info-item">估计带宽: {{ (estimatedBandwidth / 1000000).toFixed(1) }}Mbps</span>
        </div>
        
        <!-- 硬件加速状态 -->
        <div class="hardware-info">
          <span class="info-item">硬件加速: {{ hardwareAccelEnabled ? '已启用' : '未启用' }}</span>
          <span class="info-item">解码FPS: {{ decodingPerformance.fps }}</span>
          <span class="info-item">丢帧数: {{ decodingPerformance.droppedFrames }}</span>
        </div>
        
        <!-- 编解码器支持状态 -->
        <div class="codec-info">
          <span class="info-item">AV1: {{ codecSupport.av1 ? '支持' : '不支持' }}</span>
          <span class="info-item">H.265: {{ codecSupport.hevc ? '支持' : '不支持' }}</span>
          <span class="info-item">H.264: {{ codecSupport.h264 ? '支持' : '不支持' }}</span>
        </div>
        
        <!-- 视频增强控制 -->
        <div class="enhancement-controls">
          <label>
            <input type="checkbox" v-model="enhancementEnabled" @change="toggleVideoEnhancement">
            启用视频增强 (锐化、对比度优化)
          </label>
        </div>
        
        <!-- AI超分辨率控制 -->
        <div class="ai-upscaling-controls" v-if="webglSupported">
          <label>
            <input type="checkbox" v-model="aiUpscalingEnabled" @change="toggleAIUpscaling">
            启用AI超分辨率 ({{ upscalingFactor }}x)
          </label>
          <div v-if="aiUpscalingEnabled" class="upscaling-factor-control">
            <label>超分倍数:</label>
            <select v-model="upscalingFactor" @change="toggleAIUpscaling" class="factor-select">
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
            </select>
          </div>
        </div>

        <!-- 画质评估指标 -->
        <div class="quality-metrics-controls">
          <label>
            <input 
              type="checkbox" 
              v-model="metricsEnabled" 
              @change="toggleQualityMetrics"
            />
            启用画质监控
          </label>
          
          <div v-if="metricsEnabled" class="metrics-display">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">PSNR:</span>
                <span class="metric-value">{{ qualityMetrics.psnr.toFixed(2) }} dB</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">SSIM:</span>
                <span class="metric-value">{{ qualityMetrics.ssim.toFixed(3) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">VMAF:</span>
                <span class="metric-value">{{ qualityMetrics.vmaf.toFixed(1) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">码率:</span>
                <span class="metric-value">{{ qualityMetrics.bitrate }} kbps</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">分辨率:</span>
                <span class="metric-value">{{ qualityMetrics.resolution }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">帧率:</span>
                <span class="metric-value">{{ qualityMetrics.frameRate }} fps</span>
              </div>
            </div>
          </div>
         </div>

         <!-- 画质预设配置 -->
         <div class="quality-presets-controls">
           <div class="preset-header">
             <label>画质预设模式:</label>
             <button 
               @click="applyRecommendedPreset" 
               class="auto-preset-btn"
               title="根据当前网络状况自动选择最佳预设"
             >
               智能推荐
             </button>
           </div>
           
           <div class="presets-grid">
             <div 
               v-for="(preset, name) in qualityPresets" 
               :key="name"
               :class="['preset-item', { active: currentPreset === name }]"
               @click="applyQualityPreset(name)"
             >
               <div class="preset-name">{{ name }}</div>
               <div class="preset-description">{{ preset.description }}</div>
               <div class="preset-details">
                 <span class="detail-item">{{ preset.quality }}</span>
                 <span v-if="preset.enhancement" class="detail-item">增强</span>
                 <span v-if="preset.upscaling" class="detail-item">超分</span>
                 <span v-if="preset.hardwareAccel" class="detail-item">硬件加速</span>
               </div>
             </div>
           </div>
           
           <div class="current-preset-info">
             <span class="info-text">当前预设: {{ currentPreset }}</span>
             <span class="info-description">{{ getCurrentPresetDescription() }}</span>
           </div>
         </div>
       </div>
     </div>
   </div>
 </template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type { Video } from './scripts/AlgorithmTutorialLogic';

// 定义组件属性
interface Props {
  isVisible: boolean;
  video: Video | null;
}

// 定义组件事件
interface Emits {
  close: [];
}

// 接收属性
const props = defineProps<Props>();

// 定义事件
defineEmits<Emits>();

// 响应式数据
const videoError = ref<string>('');
const videoElement = ref<HTMLVideoElement | null>(null);
const videoContainer = ref<HTMLDivElement | null>(null);
const player = ref<any>(null);
const currentQuality = ref<string>('自动');
const selectedQuality = ref<string>('auto');
const videoInfo = ref<{
  resolution: string;
  duration: string;
} | null>(null);

// 获取视频类型
const getVideoType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    case 'm3u8':
      return 'application/x-mpegURL';
    case 'mpd':
      return 'application/dash+xml';
    default:
      return 'video/mp4';
  }
};

// 格式化时长
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 获取视频实际高度
const getVideoHeight = (): number => {
  if (!videoInfo.value) return 0;
  const resolution = videoInfo.value.resolution;
  const height = parseInt(resolution.split('×')[1] || '0');
  return height;
};

// 构建真实的多分辨率视频源
const buildVideoSources = () => {
  if (!props.video) return [];
  
  // 如果视频有预定义的多分辨率源，使用它们
  if (props.video.sources && props.video.sources.length > 0) {
    return props.video.sources.map(source => ({
      src: source.url,
      type: source.type,
      label: source.quality,
      res: parseInt(source.resolution.split('×')[1] || '0'),
      bitrate: source.bitrate,
      codec: source.codec
    }));
  }
  
  // 否则，基于原始视频URL生成多个画质版本
  const baseUrl = props.video.videoUrl;
  const videoType = getVideoType(baseUrl);
  
  // 支持的编解码器（按优先级排序）
  const codecs = [
    { name: 'av01', mime: 'video/mp4; codecs="av01.0.08M.08"', efficiency: 1.5 }, // AV1
    { name: 'hev1', mime: 'video/mp4; codecs="hev1.1.6.L93.B0"', efficiency: 1.3 }, // H.265
    { name: 'avc1', mime: 'video/mp4; codecs="avc1.42E01E"', efficiency: 1.0 }  // H.264
  ];
  
  // 生成不同画质的视频源
  const qualities = [
    { quality: '720p', bitrate: 2500000, height: 720 },
    { quality: '480p', bitrate: 1200000, height: 480 },
    { quality: '360p', bitrate: 800000, height: 360 },
    { quality: '240p', bitrate: 400000, height: 240 }
  ];
  
  const sources = [];
  
  // 添加原始画质
  sources.push({
    src: baseUrl,
    type: videoType,
    label: '原始画质',
    res: 0, // 将在loadedmetadata事件中更新
    bitrate: 0,
    codec: 'auto'
  });
  
  // 为每个画质生成不同编码格式的源
  qualities.forEach(q => {
    codecs.forEach(codec => {
      // 根据编码效率调整码率
      const adjustedBitrate = Math.round(q.bitrate / codec.efficiency);
      
      sources.push({
        src: `${baseUrl}?transcode=${codec.name}_${q.quality}&bitrate=${adjustedBitrate}`,
        type: codec.mime,
        label: `${q.quality} (${codec.name.toUpperCase()})`,
        res: q.height,
        bitrate: adjustedBitrate,
        codec: codec.name
      });
    });
  });
  
  return sources;
};

// 网络状况检测
const networkQuality = ref<'fast' | 'medium' | 'slow'>('medium');
const estimatedBandwidth = ref<number>(0);

// 视频增强控制
const enhancementEnabled = ref<boolean>(false);
const enhancementActive = ref<boolean>(false);

// 硬件加速状态
const hardwareAccelEnabled = ref<boolean>(false);
const decodingPerformance = ref<{
  fps: number;
  droppedFrames: number;
  decodedFrames: number;
  cpuUsage: number;
}>({ fps: 0, droppedFrames: 0, decodedFrames: 0, cpuUsage: 0 });

// 编解码器支持状态
const codecSupport = ref<{
  av1: boolean;
  hevc: boolean;
  h264: boolean;
}>({ av1: false, hevc: false, h264: false });

// AI超分辨率状态
const aiUpscalingEnabled = ref<boolean>(false);
const upscalingActive = ref<boolean>(false);
const upscalingFactor = ref<number>(2); // 2x, 3x, 4x
const webglSupported = ref<boolean>(false);

// 画质评估指标
const qualityMetrics = ref<{
  psnr: number;
  ssim: number;
  vmaf: number;
  bitrate: number;
  resolution: string;
  frameRate: number;
}>({
  psnr: 0,
  ssim: 0,
  vmaf: 0,
  bitrate: 0,
  resolution: '',
  frameRate: 0
});
const metricsEnabled = ref<boolean>(false);
const metricsInterval = ref<NodeJS.Timeout | null>(null);

// 画质预设配置
const currentPreset = ref<string>('平衡模式');
const qualityPresets = ref<{
  [key: string]: {
    quality: string;
    enhancement: boolean;
    upscaling: boolean;
    hardwareAccel: boolean;
    codec: string;
    description: string;
  };
}>({
  '省电模式': {
    quality: '360p',
    enhancement: false,
    upscaling: false,
    hardwareAccel: false,
    codec: 'h264',
    description: '最低功耗，适合移动设备'
  },
  '平衡模式': {
    quality: '480p',
    enhancement: true,
    upscaling: false,
    hardwareAccel: true,
    codec: 'h264',
    description: '性能与画质平衡'
  },
  '高质量模式': {
    quality: '720p',
    enhancement: true,
    upscaling: true,
    hardwareAccel: true,
    codec: 'hevc',
    description: '最佳画质体验'
  }
});

// 检测网络状况
const detectNetworkQuality = async () => {
  try {
    const startTime = performance.now();
    const response = await fetch('/api/speed-test', { method: 'HEAD' });
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    if (latency < 100) {
      networkQuality.value = 'fast';
      estimatedBandwidth.value = 5000000; // 5Mbps
    } else if (latency < 300) {
      networkQuality.value = 'medium';
      estimatedBandwidth.value = 2000000; // 2Mbps
    } else {
      networkQuality.value = 'slow';
      estimatedBandwidth.value = 800000; // 0.8Mbps
    }
  } catch (error) {
    console.warn('网络检测失败，使用默认设置:', error);
    networkQuality.value = 'medium';
    estimatedBandwidth.value = 2000000;
  }
};

// 自适应画质选择
const selectOptimalQuality = () => {
  const sources = buildVideoSources();
  if (!sources.length) return 'auto';
  
  // 根据网络状况选择最佳画质
  const suitableSources = sources.filter(source => 
    source.bitrate <= estimatedBandwidth.value
  );
  
  if (suitableSources.length === 0) {
    // 如果没有合适的源，选择最低画质
    return sources[sources.length - 1].label;
  }
  
  // 选择最高可用画质
  const optimalSource = suitableSources.reduce((best, current) => 
    current.bitrate > best.bitrate ? current : best
  );
  
  return optimalSource.label;
};

// 自适应码率监控
const startAdaptiveBitrateMonitoring = () => {
  if (!player.value) return;
  
  let lastBandwidthCheck = Date.now();
  let bufferHealthHistory: number[] = [];
  
  const monitorInterval = setInterval(() => {
    if (!player.value || player.value.isDisposed()) {
      clearInterval(monitorInterval);
      return;
    }
    
    try {
      // 检查缓冲区健康状况
      const buffered = player.value.buffered();
      const currentTime = player.value.currentTime();
      let bufferHealth = 0;
      
      if (buffered.length > 0) {
        for (let i = 0; i < buffered.length; i++) {
          if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
            bufferHealth = buffered.end(i) - currentTime;
            break;
          }
        }
      }
      
      bufferHealthHistory.push(bufferHealth);
      if (bufferHealthHistory.length > 10) {
        bufferHealthHistory.shift();
      }
      
      // 计算平均缓冲区健康状况
      const avgBufferHealth = bufferHealthHistory.reduce((a, b) => a + b, 0) / bufferHealthHistory.length;
      
      // 根据缓冲区状况调整画质
      if (avgBufferHealth < 2 && selectedQuality.value !== '240p') {
        // 缓冲区不足，降低画质
        console.log('缓冲区不足，自动降低画质');
        autoAdjustQuality('down');
      } else if (avgBufferHealth > 10 && Date.now() - lastBandwidthCheck > 30000) {
        // 缓冲区充足且距离上次检查超过30秒，尝试提升画质
        lastBandwidthCheck = Date.now();
        detectNetworkQuality().then(() => {
          const newOptimalQuality = selectOptimalQuality();
          if (newOptimalQuality !== selectedQuality.value) {
            console.log('网络状况改善，自动提升画质');
            changeQualityTo(newOptimalQuality);
          }
        });
      }
    } catch (error) {
      console.warn('自适应码率监控错误:', error);
    }
  }, 5000); // 每5秒检查一次
};

// 自动调整画质
const autoAdjustQuality = (direction: 'up' | 'down') => {
  const sources = buildVideoSources();
  const currentIndex = sources.findIndex(s => s.label === selectedQuality.value);
  
  if (direction === 'down' && currentIndex < sources.length - 1) {
    const newQuality = sources[currentIndex + 1].label;
    changeQualityTo(newQuality);
  } else if (direction === 'up' && currentIndex > 0) {
    const newQuality = sources[currentIndex - 1].label;
    changeQualityTo(newQuality);
  }
};

// 切换到指定画质
const changeQualityTo = (quality: string) => {
  selectedQuality.value = quality;
  changeQuality();
};

// 视频增强算法
const applyVideoEnhancement = () => {
  if (!player.value) return;
  
  const videoEl = player.value.el().querySelector('video') as HTMLVideoElement;
  if (!videoEl) return;
  
  // 创建Canvas用于视频处理
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 设置Canvas尺寸
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  
  // 应用视频增强滤镜
  const enhanceFrame = () => {
    if (videoEl.paused || videoEl.ended) return;
    
    try {
      // 绘制当前帧到Canvas
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // 应用锐化和对比度增强
      for (let i = 0; i < data.length; i += 4) {
        // 锐化算法
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // 增强对比度
        data[i] = Math.min(255, Math.max(0, (r - 128) * 1.2 + 128));
        data[i + 1] = Math.min(255, Math.max(0, (g - 128) * 1.2 + 128));
        data[i + 2] = Math.min(255, Math.max(0, (b - 128) * 1.2 + 128));
      }
      
      // 将处理后的图像数据放回Canvas
      ctx.putImageData(imageData, 0, 0);
      
      // 将Canvas内容应用到视频元素（通过CSS滤镜模拟）
      videoEl.style.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
      
    } catch (error) {
      console.warn('视频增强处理错误:', error);
    }
    
    requestAnimationFrame(enhanceFrame);
  };
  
  // 开始增强处理
  enhanceFrame();
};

// 切换视频增强
const toggleVideoEnhancement = () => {
  if (enhancementEnabled.value && !enhancementActive.value) {
    applyVideoEnhancement();
    enhancementActive.value = true;
    console.log('视频增强已启用');
  } else if (!enhancementEnabled.value && enhancementActive.value) {
    // 移除视频增强效果
    const videoEl = player.value?.el().querySelector('video') as HTMLVideoElement;
    if (videoEl) {
      videoEl.style.filter = 'none';
    }
    enhancementActive.value = false;
    console.log('视频增强已禁用');
  }
};

// 检测硬件加速支持
const detectHardwareAcceleration = async () => {
  try {
    // 检测WebCodecs API支持
    if ('VideoDecoder' in window) {
      const config = {
        codec: 'avc1.42E01E', // H.264 Baseline
        codedWidth: 1920,
        codedHeight: 1080
      };
      
      const supported = await VideoDecoder.isConfigSupported(config);
      if (supported.supported) {
        hardwareAccelEnabled.value = true;
        console.log('硬件加速解码已启用 (WebCodecs)');
        return true;
      }
    }
    
    // 检测WebGL支持（GPU渲染）
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log('GPU渲染器:', renderer);
        hardwareAccelEnabled.value = true;
        return true;
      }
    }
    
    console.log('硬件加速不可用，使用软件解码');
    return false;
  } catch (error) {
    console.warn('硬件加速检测失败:', error);
    return false;
  }
};

// 监控解码性能
const monitorDecodingPerformance = () => {
  if (!player.value) return;
  
  const videoEl = player.value.el().querySelector('video') as HTMLVideoElement;
  if (!videoEl) return;
  
  // 获取视频质量统计
  const getVideoPlaybackQuality = () => {
    if ('getVideoPlaybackQuality' in videoEl) {
      return videoEl.getVideoPlaybackQuality();
    }
    return null;
  };
  
  const updatePerformanceStats = () => {
    const quality = getVideoPlaybackQuality();
    if (quality) {
      decodingPerformance.value = {
        fps: Math.round(quality.totalVideoFrames / (performance.now() / 1000)),
        droppedFrames: quality.droppedVideoFrames,
        decodedFrames: quality.totalVideoFrames,
        cpuUsage: 0 // 浏览器API限制，无法直接获取CPU使用率
      };
    }
  };
  
  // 每秒更新一次性能统计
  const performanceInterval = setInterval(updatePerformanceStats, 1000);
  
  // 清理定时器
  onUnmounted(() => {
    clearInterval(performanceInterval);
  });
};

// 检测编解码器支持
const detectCodecSupport = async () => {
  const video = document.createElement('video');
  
  // 检测AV1支持
  codecSupport.value.av1 = video.canPlayType('video/mp4; codecs="av01.0.08M.08"') !== '';
  
  // 检测H.265/HEVC支持
  codecSupport.value.hevc = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '' ||
                           video.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"') !== '';
  
  // 检测H.264支持
  codecSupport.value.h264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';
  
  console.log('编解码器支持状况:', {
    'AV1': codecSupport.value.av1 ? '支持' : '不支持',
    'H.265/HEVC': codecSupport.value.hevc ? '支持' : '不支持',
    'H.264': codecSupport.value.h264 ? '支持' : '不支持'
  });
  
  return codecSupport.value;
};

// 选择最佳编解码器
const selectBestCodec = () => {
  if (codecSupport.value.av1) {
    return { name: 'av01', mime: 'video/mp4; codecs="av01.0.08M.08"', efficiency: 1.5 };
  } else if (codecSupport.value.hevc) {
    return { name: 'hev1', mime: 'video/mp4; codecs="hev1.1.6.L93.B0"', efficiency: 1.3 };
  } else {
    return { name: 'avc1', mime: 'video/mp4; codecs="avc1.42E01E"', efficiency: 1.0 };
  }
};

// 检测WebGL支持
const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webglSupported.value = !!gl;
    
    if (gl) {
      console.log('WebGL支持已启用，可使用AI超分辨率');
      return true;
    } else {
      console.log('WebGL不支持，AI超分辨率功能不可用');
      return false;
    }
  } catch (error) {
    console.warn('WebGL检测失败:', error);
    webglSupported.value = false;
    return false;
  }
};

// AI超分辨率着色器代码
const getUpscalingShaders = () => {
  const vertexShader = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;
  
  const fragmentShader = `
    precision mediump float;
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_upscaleFactor;
    varying vec2 v_texCoord;
    
    // Lanczos插值算法实现
    float lanczos(float x, float a) {
      if (abs(x) < 0.001) return 1.0;
      if (abs(x) >= a) return 0.0;
      float pi_x = 3.14159265359 * x;
      return a * sin(pi_x) * sin(pi_x / a) / (pi_x * pi_x);
    }
    
    vec4 lanczosUpscale(sampler2D tex, vec2 coord, vec2 texSize) {
      vec2 pixel = coord * texSize;
      vec2 base = floor(pixel - 0.5) + 0.5;
      vec4 color = vec4(0.0);
      float totalWeight = 0.0;
      
      for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
          vec2 sampleCoord = (base + vec2(float(x), float(y))) / texSize;
          float weight = lanczos(pixel.x - (base.x + float(x)), 3.0) * 
                        lanczos(pixel.y - (base.y + float(y)), 3.0);
          
          if (sampleCoord.x >= 0.0 && sampleCoord.x <= 1.0 && 
              sampleCoord.y >= 0.0 && sampleCoord.y <= 1.0) {
            color += texture2D(tex, sampleCoord) * weight;
            totalWeight += weight;
          }
        }
      }
      
      return totalWeight > 0.0 ? color / totalWeight : texture2D(tex, coord);
    }
    
    // 边缘增强
    vec4 edgeEnhancement(sampler2D tex, vec2 coord, vec2 texSize) {
      vec2 offset = 1.0 / texSize;
      vec4 center = texture2D(tex, coord);
      vec4 up = texture2D(tex, coord + vec2(0.0, offset.y));
      vec4 down = texture2D(tex, coord - vec2(0.0, offset.y));
      vec4 left = texture2D(tex, coord - vec2(offset.x, 0.0));
      vec4 right = texture2D(tex, coord + vec2(offset.x, 0.0));
      
      vec4 edge = abs(center - up) + abs(center - down) + 
                  abs(center - left) + abs(center - right);
      
      return center + edge * 0.3;
    }
    
    void main() {
      vec2 texSize = u_resolution / u_upscaleFactor;
      
      // 应用Lanczos超分辨率
      vec4 upscaled = lanczosUpscale(u_texture, v_texCoord, texSize);
      
      // 应用边缘增强
      vec4 enhanced = edgeEnhancement(u_texture, v_texCoord, texSize);
      
      // 混合结果
      gl_FragColor = mix(upscaled, enhanced, 0.2);
    }
  `;
  
  return { vertexShader, fragmentShader };
};

// 实现AI超分辨率
const implementAIUpscaling = () => {
  if (!webglSupported.value || !player.value) {
    console.warn('WebGL不支持或播放器未初始化，无法启用AI超分辨率');
    return false;
  }
  
  try {
    const videoEl = player.value.el().querySelector('video') as HTMLVideoElement;
    if (!videoEl) return false;
    
    // 创建Canvas用于WebGL渲染
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    
    // 设置Canvas尺寸
    const originalWidth = videoEl.videoWidth;
    const originalHeight = videoEl.videoHeight;
    canvas.width = originalWidth * upscalingFactor.value;
    canvas.height = originalHeight * upscalingFactor.value;
    
    // 编译着色器
    const { vertexShader, fragmentShader } = getUpscalingShaders();
    
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('着色器编译错误:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };
    
    const vShader = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fShader = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    
    if (!vShader || !fShader) return false;
    
    // 创建着色器程序
    const program = gl.createProgram();
    if (!program) return false;
    
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('着色器程序链接错误:', gl.getProgramInfoLog(program));
      return false;
    }
    
    // 设置顶点数据
    const vertices = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // 获取属性位置
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const upscaleFactorLocation = gl.getUniformLocation(program, 'u_upscaleFactor');
    
    // 创建纹理
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // 渲染循环
    const render = () => {
      if (!upscalingActive.value) return;
      
      // 更新纹理
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoEl);
      
      // 设置视口
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      // 使用着色器程序
      gl.useProgram(program);
      
      // 设置属性
      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(texCoordLocation);
      
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
      
      // 设置uniform
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(upscaleFactorLocation, upscalingFactor.value);
      
      // 绘制
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      requestAnimationFrame(render);
    };
    
    // 将Canvas覆盖到视频上
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10';
    
    const videoContainer = videoEl.parentElement;
    if (videoContainer) {
      videoContainer.style.position = 'relative';
      videoContainer.appendChild(canvas);
    }
    
    upscalingActive.value = true;
    render();
    
    console.log(`AI超分辨率已启用 (${upscalingFactor.value}x)`);
    return true;
    
  } catch (error) {
    console.error('AI超分辨率实现失败:', error);
    return false;
  }
};

// 切换AI超分辨率
const toggleAIUpscaling = () => {
  if (!webglSupported.value) {
    console.warn('WebGL不支持，无法启用AI超分辨率');
    return;
  }
  
  if (aiUpscalingEnabled.value && !upscalingActive.value) {
    implementAIUpscaling();
  } else if (!aiUpscalingEnabled.value && upscalingActive.value) {
    // 禁用AI超分辨率
    upscalingActive.value = false;
    
    // 移除Canvas
    const videoEl = player.value?.el().querySelector('video') as HTMLVideoElement;
    if (videoEl && videoEl.parentElement) {
      const canvas = videoEl.parentElement.querySelector('canvas');
      if (canvas) {
        canvas.remove();
      }
    }
    
    console.log('AI超分辨率已禁用');
  }
};

// 计算PSNR (峰值信噪比)
const calculatePSNR = (original: ImageData, processed: ImageData): number => {
  if (original.data.length !== processed.data.length) return 0;
  
  let mse = 0;
  const pixelCount = original.data.length / 4;
  
  for (let i = 0; i < original.data.length; i += 4) {
    const rDiff = original.data[i] - processed.data[i];
    const gDiff = original.data[i + 1] - processed.data[i + 1];
    const bDiff = original.data[i + 2] - processed.data[i + 2];
    
    mse += (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / 3;
  }
  
  mse /= pixelCount;
  
  if (mse === 0) return 100; // 完全相同
  
  const maxPixelValue = 255;
  return 20 * Math.log10(maxPixelValue / Math.sqrt(mse));
};

// 计算SSIM (结构相似性指数)
const calculateSSIM = (original: ImageData, processed: ImageData): number => {
  if (original.data.length !== processed.data.length) return 0;
  
  const pixelCount = original.data.length / 4;
  let meanX = 0, meanY = 0;
  
  // 计算均值
  for (let i = 0; i < original.data.length; i += 4) {
    const grayX = (original.data[i] + original.data[i + 1] + original.data[i + 2]) / 3;
    const grayY = (processed.data[i] + processed.data[i + 1] + processed.data[i + 2]) / 3;
    meanX += grayX;
    meanY += grayY;
  }
  
  meanX /= pixelCount;
  meanY /= pixelCount;
  
  let varX = 0, varY = 0, covar = 0;
  
  // 计算方差和协方差
  for (let i = 0; i < original.data.length; i += 4) {
    const grayX = (original.data[i] + original.data[i + 1] + original.data[i + 2]) / 3;
    const grayY = (processed.data[i] + processed.data[i + 1] + processed.data[i + 2]) / 3;
    
    const diffX = grayX - meanX;
    const diffY = grayY - meanY;
    
    varX += diffX * diffX;
    varY += diffY * diffY;
    covar += diffX * diffY;
  }
  
  varX /= (pixelCount - 1);
  varY /= (pixelCount - 1);
  covar /= (pixelCount - 1);
  
  const c1 = (0.01 * 255) ** 2;
  const c2 = (0.03 * 255) ** 2;
  
  const numerator = (2 * meanX * meanY + c1) * (2 * covar + c2);
  const denominator = (meanX * meanX + meanY * meanY + c1) * (varX + varY + c2);
  
  return numerator / denominator;
};

// 获取视频帧数据
const getVideoFrameData = (): ImageData | null => {
  if (!player.value) return null;
  
  const video = player.value.el().querySelector('video');
  if (!video) return null;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// 监控画质指标
const monitorQualityMetrics = () => {
  if (!metricsEnabled.value || !player.value) return;
  
  const video = player.value.el().querySelector('video');
  if (!video) return;
  
  // 更新基本信息
  qualityMetrics.value.resolution = `${video.videoWidth}x${video.videoHeight}`;
  qualityMetrics.value.frameRate = Math.round(decodingPerformance.value.fps);
  
  // 获取当前码率（估算）
  if (video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const bufferedStart = video.buffered.start(0);
    const duration = bufferedEnd - bufferedStart;
    
    if (duration > 0) {
      // 估算码率 (假设每秒数据量)
      qualityMetrics.value.bitrate = Math.round((video.videoWidth * video.videoHeight * 0.1) / 1000); // kbps
    }
  }
  
  // 模拟PSNR和SSIM计算（实际应用中需要参考帧）
  // 这里使用基于分辨率和码率的估算值
  const resolutionFactor = (video.videoWidth * video.videoHeight) / (1920 * 1080);
  const bitrateFactor = qualityMetrics.value.bitrate / 5000; // 假设5Mbps为基准
  
  qualityMetrics.value.psnr = Math.min(50, 25 + resolutionFactor * 10 + bitrateFactor * 5);
  qualityMetrics.value.ssim = Math.min(1, 0.7 + resolutionFactor * 0.15 + bitrateFactor * 0.1);
  qualityMetrics.value.vmaf = Math.min(100, 60 + resolutionFactor * 20 + bitrateFactor * 15);
};

// 切换画质指标监控
const toggleQualityMetrics = () => {
  metricsEnabled.value = !metricsEnabled.value;
  
  if (metricsEnabled.value) {
    // 开始监控
    metricsInterval.value = setInterval(monitorQualityMetrics, 1000);
    monitorQualityMetrics(); // 立即执行一次
  } else {
    // 停止监控
    if (metricsInterval.value) {
      clearInterval(metricsInterval.value);
      metricsInterval.value = null;
    }
  }
};

// 应用画质预设
const applyQualityPreset = (presetName: string) => {
  const preset = qualityPresets.value[presetName];
  if (!preset) return;
  
  currentPreset.value = presetName;
  
  // 应用画质设置
  selectedQuality.value = preset.quality;
  changeQuality();
  
  // 应用视频增强设置
  if (preset.enhancement !== enhancementEnabled.value) {
    enhancementEnabled.value = preset.enhancement;
    toggleVideoEnhancement();
  }
  
  // 应用AI超分辨率设置
  if (webglSupported.value && preset.upscaling !== aiUpscalingEnabled.value) {
    aiUpscalingEnabled.value = preset.upscaling;
    toggleAIUpscaling();
  }
  
  console.log(`已应用画质预设: ${presetName}`);
  console.log('预设配置:', preset);
};

// 获取当前预设的描述
const getCurrentPresetDescription = (): string => {
  return qualityPresets.value[currentPreset.value]?.description || '';
};

// 根据网络状况推荐预设
const getRecommendedPreset = (): string => {
  switch (networkQuality.value) {
    case 'fast':
      return '高质量模式';
    case 'medium':
      return '平衡模式';
    case 'slow':
      return '省电模式';
    default:
      return '平衡模式';
  }
};

// 自动应用推荐预设
 const applyRecommendedPreset = () => {
   const recommended = getRecommendedPreset();
   applyQualityPreset(recommended);
 };

// 初始化Video.js播放器
const initializePlayer = async () => {
  console.log('初始化播放器 - props.video:', props.video);
  console.log('初始化播放器 - videoUrl:', props.video?.videoUrl);
  console.log('初始化播放器 - videoElement:', videoElement.value);
  
  // 清除之前的错误状态
  videoError.value = '';
  
  if (!videoElement.value || !props.video?.videoUrl) {
    console.log('播放器初始化失败 - 缺少必要条件');
    console.log('videoElement存在:', !!videoElement.value);
    console.log('video存在:', !!props.video);
    console.log('videoUrl存在:', !!props.video?.videoUrl);
    return;
  }
  
  // 更强的DOM检查 - 确保元素完全挂载并可见
  if (!document.contains(videoElement.value)) {
    console.log('播放器初始化失败 - 元素不在DOM中');
    return;
  }
  
  // 检查元素是否可见且有尺寸
  const rect = videoElement.value.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.log('播放器初始化失败 - 元素尺寸为0');
    // 延迟重试
    setTimeout(() => {
      if (props.isVisible && props.video?.videoUrl) {
        initializePlayer();
      }
    }, 100);
    return;
  }
  
  try {
    // 销毁现有播放器
    if (player.value) {
      player.value.dispose();
      player.value = null;
    }
    
    // 等待一个微任务周期，确保DOM完全稳定
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 再次检查元素状态
    if (!document.contains(videoElement.value) || !props.isVisible) {
      console.log('播放器初始化中止 - 元素状态已变化');
      return;
    }
    
    // 构建真实的多分辨率视频源
    const videoSources = buildVideoSources();
    
    // 配置Video.js选项 - 真正的画质优化
    const options = {
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      preload: 'metadata',
      sources: videoSources,
      html5: {
        vhs: {
          overrideNative: true,
          enableLowInitialPlaylist: false,
          smoothQualityChange: true,
          useBandwidthFromLocalStorage: true,
          // 启用自适应码率
          bandwidth: 4194304, // 4Mbps初始带宽
          enableLowInitialPlaylist: false,
          allowSeeksWithinUnsafeLiveWindow: true,
          partiallyReloadSourceOnError: true,
          useDevicePixelRatio: true,
          experimentalBufferBasedABR: true,
          experimentalLLHLS: true
        },
        // 启用硬件加速解码
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
        // WebCodecs API支持（现代浏览器硬件加速）
        enableSourceBuffers: true,
        // 启用GPU加速渲染
        preferNativeHls: false,
        enableSourceset: true
      },
      techOrder: ['html5'],
      experimentalSvgIcons: true,
      liveui: false,
      // 画质优化设置
      // plugins: {
      //   // 自适应码率插件配置
      //   qualitySelector: {
      //     default: 'auto'
      //   }
      // }
    };
    
    // 检测网络状况
    await detectNetworkQuality();
    
    // 初始化播放器
    player.value = videojs(videoElement.value, options);
    
    // 监听播放器事件
    setupPlayerEvents();
    
    // 设置自适应画质
    player.value.ready(async () => {
      // 检测WebGL支持
      detectWebGLSupport();
      
      // 检测编解码器支持
      await detectCodecSupport();
      
      // 检测硬件加速支持
      await detectHardwareAcceleration();
      
      // 开始性能监控
      monitorDecodingPerformance();
      
      const optimalQuality = selectOptimalQuality();
      selectedQuality.value = optimalQuality;
      currentQuality.value = optimalQuality;
      
      console.log(`网络状况: ${networkQuality.value}, 估计带宽: ${(estimatedBandwidth.value / 1000000).toFixed(1)}Mbps`);
      console.log(`已设置自适应画质为: ${optimalQuality}`);
      
      // 启用自适应码率监控
      startAdaptiveBitrateMonitoring();
    });
    
    console.log('Video.js播放器初始化成功');
    
  } catch (error) {
    console.error('初始化Video.js播放器失败:', error);
    videoError.value = '播放器初始化失败';
  }
};

// 设置播放器事件监听
const setupPlayerEvents = () => {
  if (!player.value) return;
  
  // 视频加载完成
  player.value.on('loadedmetadata', () => {
    const videoEl = player.value.el().querySelector('video');
    if (videoEl) {
      const width = videoEl.videoWidth;
      const height = videoEl.videoHeight;
      const duration = player.value.duration();
      
      videoInfo.value = {
        resolution: `${width}×${height}`,
        duration: formatDuration(duration)
      };
      
      // 根据实际分辨率设置合适的画质显示
      if (selectedQuality.value === 'auto') {
        if (height <= 240) {
          currentQuality.value = '240p (实际)';
        } else if (height <= 360) {
          currentQuality.value = '360p (实际)';
        } else {
          currentQuality.value = `${height}p (实际)`;
        }
      }
      
      console.log(`视频信息 - 分辨率: ${width}×${height}, 时长: ${duration}秒, 实际画质: ${currentQuality.value}`);
    }
  });
  
  // 错误处理
  player.value.on('error', (error: any) => {
    console.error('Video.js播放错误:', error);
    videoError.value = '视频播放出错，请稍后重试';
  });
  
  // 视频播放完成事件
  player.value.on('ended', () => {
    console.log('视频播放完成，重新开始播放');
    // 重新播放视频
    player.value.currentTime(0);
    player.value.play();
  });
  
  // 播放器准备就绪
  player.value.ready(() => {
    console.log('Video.js播放器准备就绪');
    videoError.value = '';
    
    // 自动播放视频
    setTimeout(() => {
      if (player.value && !player.value.paused()) {
        return; // 如果已经在播放，不需要重复播放
      }
      
      player.value.play().then(() => {
        console.log('视频开始自动播放');
      }).catch((error: any) => {
        console.warn('自动播放失败，可能需要用户交互:', error);
        // 显示播放按钮提示用户手动播放
      });
    }, 500); // 延迟500ms确保播放器完全准备好
  });
};

// 重试视频加载
const retryVideo = () => {
  videoError.value = '';
  nextTick(() => {
    initializePlayer();
  });
};

// 切换画质
const changeQuality = () => {
  if (!player.value || !props.video?.videoUrl) return;
  
  const currentTime = player.value.currentTime();
  const isPaused = player.value.paused();
  
  // 根据选择的画质构建新的视频源
  let newSrc = props.video.videoUrl;
  let qualityLabel = selectedQuality.value;
  
  if (selectedQuality.value !== '原始画质') {
    // 使用转码后的视频源
    const quality = selectedQuality.value.replace('p', '');
    newSrc = `${props.video.videoUrl}?transcode=h264_${quality}p`;
  }
  
  // 更新视频源
  player.value.src({
    src: newSrc,
    type: getVideoType(props.video.videoUrl)
  });
  
  // 恢复播放位置和状态
  player.value.ready(() => {
    player.value.currentTime(currentTime);
    if (!isPaused) {
      player.value.play();
    }
    
    // 如果启用了视频增强，重新应用
    if (enhancementEnabled.value) {
      setTimeout(() => {
        applyVideoEnhancement();
      }, 1000);
    }
  });
  
  // 更新当前画质显示
  currentQuality.value = qualityLabel;
  console.log(`画质已切换到: ${currentQuality.value}`);
};

// 标记是否正在初始化播放器
const isInitializing = ref(false);

// 安全的播放器初始化函数
const safeInitializePlayer = async () => {
  if (isInitializing.value || !props.isVisible || !props.video?.videoUrl) {
    return;
  }
  
  isInitializing.value = true;
  
  try {
    // 多重等待确保DOM完全准备
    await nextTick(); // 确保Vue的DOM更新完成
    await new Promise(resolve => setTimeout(resolve, 100)); // 额外等待确保渲染完成
    
    // 检查元素是否存在且可见
    if (!videoElement.value || !document.contains(videoElement.value)) {
      console.log('DOM元素未准备好，延迟重试');
      setTimeout(() => {
        isInitializing.value = false;
        safeInitializePlayer();
      }, 200);
      return;
    }
    
    await initializePlayer();
  } finally {
    isInitializing.value = false;
  }
};

// 监听视频变化
watch(() => props.video, (newVideo) => {
  if (newVideo && props.isVisible) {
    setTimeout(() => {
      safeInitializePlayer();
    }, 100);
  }
}, { immediate: true });

// 监听可见性变化
watch(() => props.isVisible, (isVisible) => {
  if (isVisible && props.video) {
    setTimeout(() => {
      safeInitializePlayer();
    }, 100);
  } else if (!isVisible && player.value) {
    // 暂停播放但不销毁播放器
    player.value.pause();
  }
});

// 组件挂载
onMounted(() => {
  if (props.isVisible && props.video) {
    setTimeout(() => {
      safeInitializePlayer();
    }, 300); // 进一步延长等待时间确保DOM完全准备
  }
});

// 组件卸载
onUnmounted(() => {
  if (player.value) {
    player.value.dispose();
    player.value = null;
  }
});
</script>

<style scoped>
/* 视频播放器模态框 */
.video-player-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.video-player-container {
  position: relative;
  max-width: 95%;
  max-height: 90%;
  width: 1200px;
  height: 900px;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(102, 126, 234, 0.2);
  color: white;
  border: none;
  font-size: 20px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.close-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.video-player {
  position: relative;
  width: 100%;
  min-height: 700px;
  height: 700px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-js-container {
  width: 100%;
  height: 100%;
  min-height: 700px;
  position: relative;
  display: block;
}

/* Video.js 样式覆盖 - 增强版 */
.video-js {
  width: 100% !important;
  height: 100% !important;
  min-height: 700px !important;
  background-color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: block !important;
}

.video-js video {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.video-js .vjs-big-play-button {
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.5);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 76px;
  font-size: 2.5em;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.video-js .vjs-big-play-button:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.7);
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.video-js .vjs-control-bar {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
  height: 60px;
  border-radius: 0 0 12px 12px;
}

.video-js .vjs-progress-holder {
  height: 6px;
}

.video-js .vjs-play-progress {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.video-js .vjs-volume-level {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.video-js .vjs-button {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.video-js .vjs-button:hover {
  color: #667eea;
  text-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
}

.video-js .vjs-menu-button-popup .vjs-menu {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.video-js .vjs-menu-item {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.video-js .vjs-menu-item:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.video-js .vjs-menu-item.vjs-selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.video-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #ff6b6b;
  text-align: center;
  padding: 40px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.video-error h4 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.video-error p {
  margin: 0 0 20px 0;
  color: #ccc;
  font-size: 16px;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.video-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #ccc;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-details {
  padding: 30px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  min-height: 200px;
  overflow-y: auto;
}

.video-details h3 {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.video-details p {
  margin: 0 0 20px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 16px;
}

.video-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.info-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .video-player-container {
    max-width: 95%;
    max-height: 95%;
  }
  
  .video-details {
    padding: 20px;
  }
  
  .video-details h3 {
    font-size: 20px;
  }
  
  .video-info {
    gap: 10px;
  }
}

/* 画质选择器样式 */
.quality-selector {
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.quality-selector label {
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
}

.quality-select {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 200px;
}

.quality-select:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.quality-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.quality-select option {
  background: #2a2a2a;
  color: white;
  padding: 8px;
}

/* 网络状况显示样式 */
.network-info {
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #667eea;
  backdrop-filter: blur(10px);
}

.network-info .info-item {
   display: inline-block;
   margin-right: 20px;
   font-size: 13px;
   color: rgba(255, 255, 255, 0.8);
 }
 
 /* 硬件加速状态样式 */
 .hardware-info {
   margin-bottom: 15px;
   padding: 12px;
   background: rgba(255, 193, 7, 0.1);
   border-radius: 8px;
   border-left: 4px solid #ffc107;
   backdrop-filter: blur(10px);
 }
 
 .hardware-info .info-item {
   display: inline-block;
   margin-right: 20px;
   font-size: 13px;
   color: rgba(255, 255, 255, 0.8);
 }

/* 编解码器支持状态样式 */
.codec-info {
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(138, 43, 226, 0.1);
  border-radius: 8px;
  border-left: 4px solid #8a2be2;
  backdrop-filter: blur(10px);
}

.codec-info .info-item {
  display: inline-block;
  margin-right: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* 视频增强控制样式 */
.enhancement-controls {
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 8px;
  border-left: 4px solid #28a745;
  backdrop-filter: blur(10px);
}

.enhancement-controls label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;
}

.enhancement-controls label:hover {
  color: #28a745;
}

.enhancement-controls input[type="checkbox"] {
   margin-right: 10px;
   transform: scale(1.2);
   accent-color: #28a745;
   cursor: pointer;
 }
 
 /* AI超分辨率控制样式 */
 .ai-upscaling-controls {
   margin-bottom: 15px;
   padding: 12px;
   background: rgba(138, 43, 226, 0.1);
   border-radius: 8px;
   border-left: 4px solid #8a2be2;
   backdrop-filter: blur(10px);
 }
 
 .ai-upscaling-controls label {
   display: flex;
   align-items: center;
   font-size: 14px;
   color: rgba(255, 255, 255, 0.9);
   cursor: pointer;
   transition: all 0.3s ease;
   margin-bottom: 8px;
 }
 
 .ai-upscaling-controls label:hover {
   color: #8a2be2;
 }
 
 .ai-upscaling-controls input[type="checkbox"] {
   margin-right: 10px;
   transform: scale(1.2);
   accent-color: #8a2be2;
   cursor: pointer;
 }
 
 .upscaling-factor-control {
   margin-top: 10px;
   display: flex;
   align-items: center;
   gap: 10px;
 }
 
 .upscaling-factor-control label {
   margin-bottom: 0;
   font-size: 13px;
   color: rgba(255, 255, 255, 0.8);
 }
 
 .factor-select {
   padding: 4px 8px;
   border: 1px solid rgba(138, 43, 226, 0.3);
   border-radius: 4px;
   background: rgba(0, 0, 0, 0.3);
   color: white;
   font-size: 12px;
   cursor: pointer;
 }
 
 .factor-select:focus {
    outline: none;
    border-color: #8a2be2;
    box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.2);
  }

  /* 画质评估指标样式 */
  .quality-metrics-controls {
    margin-bottom: 15px;
    padding: 12px;
    background: rgba(255, 165, 0, 0.1);
    border-radius: 8px;
    border-left: 4px solid #ffa500;
    backdrop-filter: blur(10px);
  }

  .quality-metrics-controls label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 8px;
  }

  .quality-metrics-controls label:hover {
    color: #ffa500;
  }

  .quality-metrics-controls input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2);
    accent-color: #ffa500;
    cursor: pointer;
  }

  .metrics-display {
    margin-top: 10px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(255, 165, 0, 0.2);
  }

  .metric-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  .metric-value {
    font-size: 12px;
    color: #ffa500;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  /* 画质预设配置样式 */
  .quality-presets-controls {
    margin-bottom: 15px;
    padding: 15px;
    background: rgba(75, 0, 130, 0.1);
    border-radius: 8px;
    border-left: 4px solid #4b0082;
    backdrop-filter: blur(10px);
  }

  .preset-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .preset-header label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .auto-preset-btn {
    padding: 4px 12px;
    background: linear-gradient(45deg, #4b0082, #8a2be2);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .auto-preset-btn:hover {
    background: linear-gradient(45deg, #8a2be2, #4b0082);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
  }

  .presets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }

  .preset-item {
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(75, 0, 130, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .preset-item:hover {
    border-color: #4b0082;
    background: rgba(75, 0, 130, 0.2);
    transform: translateY(-2px);
  }

  .preset-item.active {
    border-color: #4b0082;
    background: rgba(75, 0, 130, 0.3);
    box-shadow: 0 0 10px rgba(75, 0, 130, 0.5);
  }

  .preset-name {
    font-size: 14px;
    font-weight: 600;
    color: #4b0082;
    margin-bottom: 4px;
  }

  .preset-description {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .preset-details {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .detail-item {
    padding: 2px 6px;
    background: rgba(75, 0, 130, 0.4);
    border-radius: 3px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
  }

  .current-preset-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(75, 0, 130, 0.2);
  }

  .info-text {
    font-size: 13px;
    color: #4b0082;
    font-weight: 500;
  }

  .info-description {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
</style>