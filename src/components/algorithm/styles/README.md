# 算法学习组件样式文件说明

本目录包含了 `AlgorithmTutorial.vue` 组件的所有样式文件，按功能模块进行了拆分，便于维护和管理。

## 文件结构

```
styles/
├── index.css           # 样式索引文件，统一导入所有样式模块
├── layout.css          # 基础布局和视频网格样式
├── welcome.css         # 欢迎界面样式
├── video-display.css   # 视频展示区域样式
├── states.css          # 状态样式（加载、错误、空状态）
├── video-player.css    # 视频播放器样式
├── footer.css          # 页脚样式
├── animations.css      # 动画效果和响应式样式
└── README.md           # 本说明文件
```

## 样式模块说明

### 1. layout.css
- 组件主体布局
- 背景渐变和装饰效果
- 视频网格布局
- 视频卡片基础样式

### 2. welcome.css
- 欢迎界面布局
- 功能特色展示卡片
- 渐变文字效果

### 3. video-display.css
- 视频展示区域头部
- API视频网格
- 视频缩略图和播放按钮
- 视频元信息样式

### 4. states.css
- 加载状态动画
- 错误状态显示
- 空状态提示
- 重试按钮样式

### 5. video-player.css
- 视频播放器弹窗
- 播放器头部和控制按钮
- 视频容器样式

### 6. footer.css
- 页脚布局和背景
- 页脚链接样式
- 悬停效果

### 7. animations.css
- 淡入淡出动画
- 滑动动画
- 响应式媒体查询
- 移动端适配

## 使用方法

在 Vue 组件中通过 `index.css` 统一导入所有样式：

```vue
<style scoped>
@import './styles/index.css';
</style>
```

## 维护建议

1. **模块化原则**：每个文件只包含相关功能的样式
2. **命名规范**：使用语义化的 CSS 类名
3. **响应式设计**：在 `animations.css` 中统一管理媒体查询
4. **变量使用**：使用 CSS 自定义属性（CSS Variables）保持一致性
5. **性能优化**：避免过深的选择器嵌套

## 注意事项

- 所有样式文件都使用 `scoped` 作用域
- 修改样式时请确保不影响其他组件
- 新增样式模块时需要在 `index.css` 中添加对应的 `@import`
- 建议在修改前备份原始样式文件