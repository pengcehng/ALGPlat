/**
 * 内容安全策略 (CSP) 配置
 * 用于限制iframe来源，防止恶意内容注入
 */

export interface CSPConfig {
  allowedDomains: string[];
  allowedProtocols: string[];
  strictMode: boolean;
  reportUri?: string;
}

export class ContentSecurityPolicy {
  private config: CSPConfig;
  private static instance: ContentSecurityPolicy;

  constructor(config: Partial<CSPConfig> = {}) {
    this.config = {
      allowedDomains: [
        'youtube.com',
        'www.youtube.com',
        'youtu.be',
        'bilibili.com',
        'www.bilibili.com',
        'player.bilibili.com',
        'vimeo.com',
        'player.vimeo.com',
        'dailymotion.com',
        'www.dailymotion.com',
        'localhost',
        '127.0.0.1'
      ],
      allowedProtocols: ['https:', 'http:'],
      strictMode: true,
      ...config
    };
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: Partial<CSPConfig>): ContentSecurityPolicy {
    if (!ContentSecurityPolicy.instance) {
      ContentSecurityPolicy.instance = new ContentSecurityPolicy(config);
    }
    return ContentSecurityPolicy.instance;
  }

  /**
   * 验证URL是否符合CSP策略
   */
  validateUrl(url: string): { isValid: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      
      // 检查协议
      if (!this.config.allowedProtocols.includes(urlObj.protocol)) {
        return {
          isValid: false,
          reason: `不允许的协议: ${urlObj.protocol}。仅允许: ${this.config.allowedProtocols.join(', ')}`
        };
      }

      // 检查域名
      const hostname = urlObj.hostname.toLowerCase();
      const isAllowedDomain = this.config.allowedDomains.some(domain => {
        const normalizedDomain = domain.toLowerCase();
        return hostname === normalizedDomain || hostname.endsWith('.' + normalizedDomain);
      });

      if (!isAllowedDomain) {
        return {
          isValid: false,
          reason: `不允许的域名: ${hostname}。仅允许: ${this.config.allowedDomains.join(', ')}`
        };
      }

      // 严格模式下的额外检查
      if (this.config.strictMode) {
        // 检查是否包含可疑参数
        const suspiciousParams = ['javascript:', 'data:', 'vbscript:', 'onload', 'onerror'];
        const urlString = url.toLowerCase();
        
        for (const param of suspiciousParams) {
          if (urlString.includes(param)) {
            return {
              isValid: false,
              reason: `URL包含可疑内容: ${param}`
            };
          }
        }

        // 检查路径是否包含可疑字符
        if (urlObj.pathname.includes('../') || urlObj.pathname.includes('..\\')) {
          return {
            isValid: false,
            reason: 'URL路径包含目录遍历字符'
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        reason: `无效的URL格式: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 生成CSP头部字符串
   */
  generateCSPHeader(): string {
    const directives = [];

    // frame-src 指令
    const frameSrc = this.config.allowedDomains
      .map(domain => {
        // 为每个域名添加协议前缀
        return this.config.allowedProtocols.map(protocol => `${protocol}//${domain}`).join(' ');
      })
      .join(' ');
    
    directives.push(`frame-src 'self' ${frameSrc}`);

    // 其他安全指令
    directives.push("default-src 'self'");
    directives.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    directives.push("style-src 'self' 'unsafe-inline'");
    directives.push("img-src 'self' data: https:");
    directives.push("connect-src 'self' https:");
    directives.push("font-src 'self' https:");
    directives.push("object-src 'none'");
    directives.push("base-uri 'self'");
    directives.push("form-action 'self'");

    // 报告URI
    if (this.config.reportUri) {
      directives.push(`report-uri ${this.config.reportUri}`);
    }

    return directives.join('; ');
  }

  /**
   * 应用CSP到当前页面
   */
  applyToPage(): void {
    // 检查是否已存在CSP meta标签
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (existingMeta) {
      existingMeta.setAttribute('content', this.generateCSPHeader());
    } else {
      // 创建新的CSP meta标签
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', this.generateCSPHeader());
      document.head.appendChild(meta);
    }
  }

  /**
   * 添加允许的域名
   */
  addAllowedDomain(domain: string): void {
    if (!this.config.allowedDomains.includes(domain)) {
      this.config.allowedDomains.push(domain);
    }
  }

  /**
   * 移除允许的域名
   */
  removeAllowedDomain(domain: string): void {
    const index = this.config.allowedDomains.indexOf(domain);
    if (index > -1) {
      this.config.allowedDomains.splice(index, 1);
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): CSPConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<CSPConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 检查iframe元素是否符合CSP
   */
  validateIframe(iframe: HTMLIFrameElement): { isValid: boolean; reason?: string } {
    const src = iframe.src;
    if (!src) {
      return { isValid: false, reason: 'iframe缺少src属性' };
    }

    const urlValidation = this.validateUrl(src);
    if (!urlValidation.isValid) {
      return urlValidation;
    }

    // 检查iframe的安全属性
    const requiredAttributes = {
      'sandbox': iframe.getAttribute('sandbox'),
      'referrerpolicy': iframe.getAttribute('referrerpolicy')
    };

    // 建议的sandbox属性
    const recommendedSandbox = [
      'allow-scripts',
      'allow-same-origin',
      'allow-presentation',
      'allow-forms'
    ];

    if (!requiredAttributes.sandbox) {
      return {
        isValid: false,
        reason: 'iframe缺少sandbox属性，建议添加安全限制'
      };
    }

    return { isValid: true };
  }

  /**
   * 为iframe添加安全属性
   */
  secureIframe(iframe: HTMLIFrameElement): void {
    // 添加sandbox属性
    if (!iframe.hasAttribute('sandbox')) {
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms');
    }

    // 添加referrerpolicy
    if (!iframe.hasAttribute('referrerpolicy')) {
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    }

    // 添加loading属性
    if (!iframe.hasAttribute('loading')) {
      iframe.setAttribute('loading', 'lazy');
    }

    // 移除潜在的危险属性
    iframe.removeAttribute('srcdoc');
    iframe.removeAttribute('onload');
    iframe.removeAttribute('onerror');
  }

  /**
   * 监听CSP违规报告
   */
  setupViolationReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('CSP违规报告:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber
      });

      // 可以发送到服务器进行分析
      if (this.config.reportUri) {
        this.sendViolationReport(event);
      }
    });
  }

  /**
   * 发送违规报告到服务器
   */
  private sendViolationReport(event: SecurityPolicyViolationEvent): void {
    const report = {
      'csp-report': {
        'blocked-uri': event.blockedURI,
        'violated-directive': event.violatedDirective,
        'original-policy': event.originalPolicy,
        'source-file': event.sourceFile,
        'line-number': event.lineNumber,
        'timestamp': new Date().toISOString()
      }
    };

    fetch(this.config.reportUri!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    }).catch(error => {
      console.error('发送CSP违规报告失败:', error);
    });
  }
}

// 创建默认CSP实例
export const defaultCSP = ContentSecurityPolicy.getInstance();

// 导出常用的CSP配置
export const CSPPresets = {
  // 严格模式：只允许知名视频平台
  strict: {
    allowedDomains: [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'bilibili.com',
      'www.bilibili.com',
      'player.bilibili.com'
    ],
    allowedProtocols: ['https:'],
    strictMode: true
  },
  
  // 开发模式：包含本地开发域名
  development: {
    allowedDomains: [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'bilibili.com',
      'www.bilibili.com',
      'player.bilibili.com',
      'vimeo.com',
      'player.vimeo.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    allowedProtocols: ['https:', 'http:'],
    strictMode: false
  },
  
  // 宽松模式：允许更多视频平台
  permissive: {
    allowedDomains: [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'bilibili.com',
      'www.bilibili.com',
      'player.bilibili.com',
      'vimeo.com',
      'player.vimeo.com',
      'dailymotion.com',
      'www.dailymotion.com',
      'twitch.tv',
      'www.twitch.tv',
      'player.twitch.tv'
    ],
    allowedProtocols: ['https:', 'http:'],
    strictMode: false
  }
};