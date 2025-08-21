<script setup lang="ts">
// 页脚组件
</script>

<template>
  <footer class="footer">
    <div class="footer-bottom">
      <p>
        <span class="copyright">&copy; 2023 算法讲解平台 | 版权所有</span>
        <span class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
        </span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: rgba(18, 18, 18, 0.8); /* 使用半透明背景，与主背景更好融合 */
  backdrop-filter: blur(10px); /* 添加模糊效果 */
  color: var(--text-light, #e0e0e0);
  padding: 0.8rem 0;
  width: 100%;
  border-top: 1px solid rgba(51, 51, 51, 0.5); /* 使边框也半透明 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  margin-top: auto;
}

.footer-bottom {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary, #aaa);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-bottom p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
}

.copyright {
  margin-right: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.footer-links {
  display: flex;
  gap: 25px;
}

.footer-links a {
  color: var(--text-secondary, #aaa);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 2px 0;
}

.footer-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: var(--primary-color, #4a90e2);
  transition: width 0.3s ease;
}

.footer-links a:hover {
  color: var(--text-light, #e0e0e0);
}

.footer-links a:hover::after {
  width: 100%;
}
</style>