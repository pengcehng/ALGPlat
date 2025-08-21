<template>
  <div class="bottom-input-container">
    <div class="input-wrapper">
      <textarea 
        v-model="inputValue"
        :placeholder="placeholder"
        class="message-input"
        ref="bottomTextarea"
        @input="adjustTextareaHeight"
        @focus="adjustTextareaHeight"
        @keydown.enter.prevent="handleSend"
      ></textarea>
      
      <!-- 功能按钮区域 -->
      <div class="feature-buttons-container">
        <div class="feature-buttons-row">
          <div class="feature-buttons-left">
            <button class="feature-btn file-btn" @click="$emit('file-upload')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </button>
            
            <button class="feature-btn image-btn" @click="$emit('image-upload')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
            
            <button class="feature-btn reset-btn" @click="$emit('clear-conversation')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="m19 6-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
                <path d="m8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          
          <div class="feature-buttons-right">
            <button class="feature-btn send-btn" @click="handleSend" :disabled="!inputValue.trim()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'

interface Props {
  placeholder?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入您的下一个问题...',
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': [message: string]
  'file-upload': []
  'image-upload': []
  'clear-conversation': []
}>()

const inputValue = ref(props.modelValue)
const bottomTextarea = ref<HTMLTextAreaElement | null>(null)

// 输入框高度调整方法
const adjustTextareaHeight = () => {
  if (bottomTextarea.value) {
    bottomTextarea.value.style.height = 'auto'
    const scrollHeight = bottomTextarea.value.scrollHeight
    const maxHeight = 200 // 最大高度
    const minHeight = 60 // 最小高度
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
    bottomTextarea.value.style.height = newHeight + 'px'
  }
}

const resetTextareaHeight = () => {
  if (bottomTextarea.value) {
    bottomTextarea.value.style.height = '60px' // 恢复原始高度
  }
}

const handleSend = () => {
  if (inputValue.value.trim()) {
    emit('send', inputValue.value.trim())
    emit('update:modelValue', '')
    inputValue.value = ''
    resetTextareaHeight() // 发送后重置高度
  }
}
</script>

<style scoped>
.bottom-input-container {
  position: fixed;
  bottom: 60px;
  left: calc(280px + (100vw - 280px) / 2);
  transform: translateX(-50%);
  z-index: 100;
  max-width: 800px;
  width: calc(95% - 280px);
  margin: 0 auto;
  padding: 10px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: var(--dark-card-bg);
  border: 1px solid var(--dark-border);
}

.message-input {
  width: 100%;
  min-height: 60px;
  padding: 12px;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--text-primary);
  font-size: 14px;
  resize: none;
  font-family: inherit;
}

.message-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.feature-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-top: 1px solid var(--dark-border);
  background-color: var(--dark-surface);
}

.feature-buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.feature-buttons-left {
  display: flex;
  gap: 8px;
  flex: 1;
}

.feature-buttons-right {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.feature-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--primary-gradient);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feature-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.feature-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.feature-btn.reset-btn {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.feature-btn.send-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.feature-btn.file-btn,
.feature-btn.image-btn {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
}
</style>