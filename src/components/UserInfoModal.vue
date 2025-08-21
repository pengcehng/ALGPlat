<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  type: String, // 'info' 或 'password'
  userInfo: Object
});

const emit = defineEmits(['close', 'update']);

// 表单数据
const formData = ref({
  name: props.userInfo?.name || '',
  phone: props.userInfo?.phone || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  verificationCode: ''
});

// 验证码倒计时
const countdown = ref(0);
const isSendingCode = ref(false);

// 获取验证码
function getVerificationCode() {
  if (countdown.value > 0 || isSendingCode.value) return;
  
  isSendingCode.value = true;
  
  // 模拟发送验证码
  setTimeout(() => {
    isSendingCode.value = false;
    countdown.value = 60;
    
    // 倒计时
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    console.log(`验证码已发送到 ${formData.value.phone}`);
  }, 1000);
}

// 移除头像上传功能，使用固定的头像图标

// 保存用户信息
function saveUserInfo() {
  // 这里添加保存用户信息的逻辑
  console.log('保存用户信息', formData.value);
  emit('update', { type: 'info', data: formData.value });
  emit('close');
}

// 修改密码
function changePassword() {
  // 验证密码
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    alert('两次输入的密码不一致');
    return;
  }
  
  if (!formData.value.verificationCode) {
    alert('请输入验证码');
    return;
  }
  
  // 这里添加修改密码的逻辑
  console.log('修改密码', formData.value);
  emit('update', { type: 'password', data: formData.value });
  emit('close');
}

// 关闭模态框
function closeModal() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 修改个人信息 -->
      <div v-if="type === 'info'">
        <div class="modal-header">
          <h3>修改个人信息</h3>
          <span class="close-btn" @click="closeModal">×</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" v-model="formData.name" />
          </div>
          <div class="form-group">
            <label>头像</label>
            <div class="avatar-display">
              <div class="avatar-icon">
                <i class="fas fa-user"></i>
              </div>
              <span class="avatar-text">使用默认头像图标</span>
            </div>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input type="text" v-model="formData.phone" disabled />
            <small>手机号不可修改</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveUserInfo">保存</button>
        </div>
      </div>
      
      <!-- 修改密码 -->
      <div v-if="type === 'password'">
        <div class="modal-header">
          <h3>修改密码</h3>
          <span class="close-btn" @click="closeModal">×</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>当前密码</label>
            <input type="password" v-model="formData.currentPassword" placeholder="请输入当前密码" />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input type="password" v-model="formData.newPassword" placeholder="请输入新密码" />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input type="password" v-model="formData.confirmPassword" placeholder="请再次输入新密码" />
          </div>
          <div class="form-group">
            <label>手机验证码</label>
            <div class="verification-code">
              <input type="text" v-model="formData.verificationCode" placeholder="请输入验证码" />
              <button 
                class="code-btn" 
                @click="getVerificationCode" 
                :disabled="countdown > 0 || isSendingCode"
              >
                {{ isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </button>
            </div>
            <small>将发送验证码至 {{ formData.phone }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="changePassword">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  width: 400px;
  background: var(--dark-surface);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--dark-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2em;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  font-size: 1.5em;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.9em;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--dark-border);
  border-radius: 5px;
  background: var(--dark-bg);
  color: var(--text-color);
  font-size: 0.9em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  outline: none;
}

.form-group input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 5px;
  font-size: 0.8em;
  opacity: 0.7;
}

.avatar-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
}

.avatar-icon i {
  font-size: 24px;
  color: white;
}

.avatar-text {
  color: var(--text-color);
  font-size: 0.9em;
  opacity: 0.8;
}

.verification-code {
  display: flex;
  gap: 10px;
}

.verification-code input {
  flex: 1;
}

.code-btn {
  padding: 0 15px;
  background: var(--primary-gradient);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
}

.code-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid var(--dark-border);
}

.cancel-btn, .save-btn {
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cancel-btn {
  background: var(--dark-bg);
  border: 1px solid var(--dark-border);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.save-btn {
  background: var(--primary-gradient);
  border: none;
  color: white;
}

.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>