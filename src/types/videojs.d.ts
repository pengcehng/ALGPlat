declare module 'video.js' {
  interface VideoJsPlayer {
    qualityLevels?: () => QualityLevelList;
    hlsQualitySelector?: (options?: any) => void;
  }

  interface QualityLevel {
    enabled: boolean;
    height: number;
    width: number;
    bitrate: number;
    id: string;
    label?: string;
  }

  interface QualityLevelList {
    length: number;
    selectedIndex: number;
    [index: number]: QualityLevel;
    addQualityLevel(qualityLevel: QualityLevel): QualityLevel;
    removeQualityLevel(qualityLevel: QualityLevel): QualityLevel | null;
    getQualityLevelById(id: string): QualityLevel | null;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    trigger(event: string, data?: any): void;
  }
}

declare module 'videojs-contrib-quality-levels' {
  const qualityLevels: any;
  export = qualityLevels;
}

declare module 'videojs-hls-quality-selector' {
  const hlsQualitySelector: any;
  export = hlsQualitySelector;
}

export {};