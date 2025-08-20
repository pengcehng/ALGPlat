// 算法分析API服务

export interface AlgorithmInput {
  code: string;
  language: string;
  name: string;
}

export interface AlgorithmAnalysisRequest {
  algorithmA: AlgorithmInput;
  algorithmB: AlgorithmInput;
}

export interface AlgorithmAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  executionTime: number;
  memoryUsage: number;
  performanceData?: {
    dataSizes: number[];
    executionTimes: number[];
  };
}

export interface AlgorithmComparisonResponse {
  success: boolean;
  data?: {
    algorithmA: AlgorithmAnalysisResult;
    algorithmB: AlgorithmAnalysisResult;
    comparison: {
      timeComplexityComparison: string;
      spaceComplexityComparison: string;
      performanceComparison: string;
      recommendation: string;
    };
  };
  error?: string;
  message?: string;
}

// API基础配置
const API_BASE_URL = 'http://localhost:3000/api'; // 根据实际后端地址调整

// 算法分析API服务类
export class AlgorithmAnalysisService {
  /**
   * 发送算法分析请求
   * @param request 包含两个算法的请求数据
   * @returns Promise<AlgorithmComparisonResponse>
   */
  static async analyzeAlgorithms(request: AlgorithmAnalysisRequest): Promise<AlgorithmComparisonResponse> {
    // 输入验证
    const validation = this.validateRequest(request);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        message: validation.error
      };
    }

    try {
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      const response = await fetch(`${API_BASE_URL}/algorithm/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 检查HTTP状态码
      if (!response.ok) {
        let errorMessage = `服务器错误 (${response.status})`;
        
        switch (response.status) {
          case 400:
            errorMessage = '请求参数错误，请检查算法代码格式';
            break;
          case 401:
            errorMessage = '未授权访问，请重新登录';
            break;
          case 403:
            errorMessage = '访问被拒绝，权限不足';
            break;
          case 404:
            errorMessage = '分析服务不可用';
            break;
          case 429:
            errorMessage = '请求过于频繁，请稍后再试';
            break;
          case 500:
            errorMessage = '服务器内部错误，请稍后重试';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = '服务暂时不可用，请稍后重试';
            break;
        }
        
        throw new Error(errorMessage);
      }

      // 解析响应数据
      const data: AlgorithmComparisonResponse = await response.json();
      
      // 验证响应数据结构
      if (!data || typeof data.success !== 'boolean') {
        throw new Error('服务器返回数据格式错误');
      }

      return data;
    } catch (error) {
      console.error('算法分析请求失败:', error);
      
      // 处理不同类型的错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: '网络连接失败',
          message: '无法连接到分析服务器，请检查网络连接'
        };
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: '请求超时',
          message: '分析请求超时，请稍后重试或检查算法复杂度'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: error instanceof Error ? error.message : '算法分析失败，请重试'
      };
    }
  }

  /**
   * 验证算法输入数据
   * @param request 算法分析请求
   * @returns 验证结果
   */
  private static validateRequest(request: AlgorithmAnalysisRequest): { valid: boolean; error?: string } {
    if (!request.algorithmA || !request.algorithmB) {
      return { valid: false, error: '请提供两个算法进行对比' };
    }

    if (!request.algorithmA.code.trim() || !request.algorithmB.code.trim()) {
      return { valid: false, error: '算法代码不能为空' };
    }

    if (!request.algorithmA.name.trim() || !request.algorithmB.name.trim()) {
      return { valid: false, error: '算法名称不能为空' };
    }

    if (!request.algorithmA.language || !request.algorithmB.language) {
      return { valid: false, error: '请选择算法编程语言' };
    }

    // 检查代码长度限制
    const maxCodeLength = 10000;
    if (request.algorithmA.code.length > maxCodeLength || request.algorithmB.code.length > maxCodeLength) {
      return { valid: false, error: `算法代码长度不能超过${maxCodeLength}字符` };
    }

    return { valid: true };
  }
}

// 导出默认服务实例
export default AlgorithmAnalysisService;