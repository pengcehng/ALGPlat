<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// 首先加载核心语言
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
// 然后加载特定语言
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-cpp';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  placeholder: {
    type: String,
    default: '在此输入代码...'
  }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref<HTMLElement | null>(null);
const code = ref(props.modelValue);

const updateCode = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  code.value = target.value;
  emit('update:modelValue', code.value);
};

const highlightCode = () => {
  if (editorRef.value) {
    Prism.highlightElement(editorRef.value);
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== code.value) {
    code.value = newVal;
    setTimeout(highlightCode, 0);
  }
});

watch(() => props.language, () => {
  setTimeout(highlightCode, 0);
});

onMounted(() => {
  highlightCode();
});
</script>

<template>
  <div class="code-editor-wrapper">
    <textarea
      class="code-input"
      :value="modelValue"
      @input="updateCode"
      :placeholder="placeholder"
      spellcheck="false"
    ></textarea>
    <pre class="code-output"><code :class="`language-${language}`" ref="editorRef">{{ modelValue }}</code></pre>
  </div>
</template>

<style scoped>
.code-editor-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--dark-bg, #121212);
}

.code-input, .code-output {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 12px;
  border: none;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 2;
  overflow: auto;
  white-space: pre;
  box-sizing: border-box;
}

.code-input {
  color: transparent;
  background: transparent;
  caret-color: white;
  resize: none;
  z-index: 2;
}

.code-output {
  pointer-events: none;
  z-index: 1;
  margin: 0;
  background-color: var(--dark-bg, #121212);
}

.code-output code {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 自定义滚动条 */
.code-input::-webkit-scrollbar,
.code-output::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-input::-webkit-scrollbar-track,
.code-output::-webkit-scrollbar-track {
  background: var(--dark-bg, #121212);
}

.code-input::-webkit-scrollbar-thumb,
.code-output::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.code-input::-webkit-scrollbar-thumb:hover,
.code-output::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>