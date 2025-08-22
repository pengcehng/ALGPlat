// 视频安全工具类

import { defaultCSP, type CSPConfig } from './contentSecurityPolicy';

/**
 * 视频URL验证和安全处理工具
 */
export class VideoSecurity {
  // 允许的视频域名白名单
  private static readonly ALLOWED_DOMAINS = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'bilibili.com',
    'qq.com',
    'iqiyi.com',
    'youku.com',
    'localhost',
    '127.0.0.1'
  ];

  // 允许的协议
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];

  /**
   * 验证视频URL是否安全
   * @param url 视频URL
   * @returns 验证结果
   */
  static validateVideoUrl(url: string): { isValid: boolean; error?: string; sanitizedUrl?: string } {
    try {
      // 基本格式检查
      if (!url || typeof url !== 'string') {
        return { isValid: false, error: '无效的URL格式' };
      }

      // 首先使用CSP策略验证
      const cspValidation = defaultCSP.validateUrl(url);
      if (!cspValidation.isValid) {
        return {
          isValid: false,
          error: `CSP验证失败: ${cspValidation.reason}`
        };
      }

      // 移除潜在的恶意字符
      const sanitizedUrl = this.sanitizeUrl(url);
      
      // 解析URL
      const parsedUrl = new URL(sanitizedUrl);
      
      // 检查协议
      if (!this.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return { isValid: false, error: '不支持的协议类型' };
      }

      // 检查域名
      const hostname = parsedUrl.hostname.toLowerCase();
      const isAllowedDomain = this.ALLOWED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isAllowedDomain) {
        return { isValid: false, error: '不受信任的视频源' };
      }

      // 检查是否包含恶意参数
      if (this.containsMaliciousParams(parsedUrl)) {
        return { isValid: false, error: '检测到潜在的恶意参数' };
      }

      return { isValid: true, sanitizedUrl };
    } catch (error) {
      return { isValid: false, error: 'URL解析失败' };
    }
  }

  /**
   * 清理URL中的潜在恶意字符
   * @param url 原始URL
   * @returns 清理后的URL
   */
  private static sanitizeUrl(url: string): string {
    return url
      .trim()
      .replace(/[<>"']/g, '') // 移除HTML特殊字符
      .replace(/javascript:/gi, '') // 移除javascript协议
      .replace(/data:/gi, '') // 移除data协议
      .replace(/vbscript:/gi, ''); // 移除vbscript协议
  }

  /**
   * 检查URL参数是否包含恶意内容
   * @param parsedUrl 解析后的URL对象
   * @returns 是否包含恶意参数
   */
  private static containsMaliciousParams(parsedUrl: URL): boolean {
    const maliciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i
    ];

    const searchParams = parsedUrl.search;
    return maliciousPatterns.some(pattern => pattern.test(searchParams));
  }

  /**
   * 生成安全的iframe属性
   * @param videoUrl 视频URL
   * @returns iframe属性对象
   */
  static generateSecureIframeProps(videoUrl: string): {
    src?: string;
    sandbox: string;
    allow: string;
    referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
    loading: 'eager' | 'lazy';
  } {
    const validation = this.validateVideoUrl(videoUrl);
    
    // 使用CSP验证iframe安全性
    const iframe = document.createElement('iframe');
    if (validation.isValid && validation.sanitizedUrl) {
      iframe.src = validation.sanitizedUrl;
    }
    defaultCSP.secureIframe(iframe);
    
    return {
      src: validation.isValid ? validation.sanitizedUrl : undefined,
      sandbox: iframe.getAttribute('sandbox') || 'allow-scripts allow-same-origin allow-presentation',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      referrerPolicy: (iframe.getAttribute('referrerpolicy') as 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url') || 'strict-origin-when-cross-origin',
      loading: (iframe.getAttribute('loading') as 'eager' | 'lazy') || 'lazy'
    };
  }

  /**
   * 检查视频URL是否为嵌入式链接
   * @param url 视频URL
   * @returns 是否为嵌入式链接
   */
  static isEmbedUrl(url: string): boolean {
    const embedPatterns = [
      /youtube\.com\/embed\//i,
      /youtu\.be\//i,
      /vimeo\.com\/video\//i,
      /bilibili\.com\/blackboard\/html5player\.html/i,
      /player\.bilibili\.com\/player\.html/i
    ];

    return embedPatterns.some(pattern => pattern.test(url));
  }

  /**
   * 转换普通视频链接为嵌入式链接
   * @param url 原始视频URL
   * @returns 嵌入式URL或原URL
   */
  static convertToEmbedUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();

      // YouTube转换
      if (hostname.includes('youtube.com')) {
        const videoId = parsedUrl.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // YouTube短链接转换
      if (hostname.includes('youtu.be')) {
        const videoId = parsedUrl.pathname.slice(1);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Vimeo转换
      if (hostname.includes('vimeo.com')) {
        const videoId = parsedUrl.pathname.split('/').pop();
        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }

      // 如果已经是嵌入式链接或无法转换，返回原URL
      return url;
    } catch (error) {
      console.warn('URL转换失败:', error);
      return url;
    }
  }
}

/**
 * 视频加载错误处理
 */
export class VideoErrorHandler {
  /**
   * 处理视频加载错误
   * @param error 错误信息
   * @param videoUrl 视频URL
   * @returns 用户友好的错误信息
   */
  static handleVideoError(error: any, videoUrl: string): string {
    console.error('视频加载失败:', error, '视频URL:', videoUrl);

    // 根据错误类型返回不同的提示信息
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return '网络连接异常，请检查网络后重试';
    }

    if (error?.message?.includes('404') || error?.status === 404) {
      return '视频资源不存在或已被删除';
    }

    if (error?.message?.includes('403') || error?.status === 403) {
      return '视频访问权限不足';
    }

    if (error?.message?.includes('timeout')) {
      return '视频加载超时，请稍后重试';
    }

    return '视频加载失败，请稍后重试';
  }

  /**
   * 生成备用视频源
   * @param originalUrl 原始视频URL
   * @returns 备用视频源列表
   */
  static generateFallbackSources(originalUrl: string): string[] {
    const fallbacks: string[] = [];
    
    // 如果不是嵌入式链接，尝试转换
    if (!VideoSecurity.isEmbedUrl(originalUrl)) {
      const embedUrl = VideoSecurity.convertToEmbedUrl(originalUrl);
      if (embedUrl !== originalUrl) {
        fallbacks.push(embedUrl);
      }
    }

    // 添加默认占位视频（如果有的话）
    // fallbacks.push('/default-video-placeholder.mp4');

    return fallbacks;
  }
}

export default VideoSecurity;