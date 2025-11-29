<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-box">
        <div class="register-header">
          <h1>📚 Quản Lý Thư Viện</h1>
          <p>Đăng Ký Tài Khoản Độc Giả</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Hàng 1: Họ, Tên -->
          <div class="form-row">
            <div class="form-group">
              <label>
                <span class="label-icon">👤</span>
                <span>Họ <span class="required">*</span></span>
              </label>
              <input
                v-model="formData.Ho_Lot"
                type="text"
                placeholder="Nhập họ"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <span class="label-icon">👤</span>
                <span>Tên <span class="required">*</span></span>
              </label>
              <input
                v-model="formData.Ten"
                type="text"
                placeholder="Nhập tên"
                required
                class="form-input"
              />
            </div>
          </div>

          <!-- Hàng 2: Email, Số điện thoại -->
          <div class="form-row">
            <div class="form-group">
              <label>
                <span class="label-icon">✉️</span>
                <span>Email <span class="required">*</span></span>
              </label>
              <input
                v-model="formData.Email"
                type="email"
                placeholder="example@gmail.com"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <span class="label-icon">📱</span>
                <span>Số Điện Thoại</span>
              </label>
              <input
                v-model="formData.Dien_Thoai"
                type="tel"
                placeholder="0912345678"
                class="form-input"
              />
            </div>
          </div>

          <!-- Hàng 3: Địa chỉ -->
          <div class="form-row">
            <div class="form-group">
              <label>
                <span class="label-icon">📍</span>
                <span>Địa Chỉ</span>
              </label>
              <input
                v-model="formData.Dia_Chi"
                type="text"
                placeholder="Nhập địa chỉ"
                class="form-input"
              />
            </div>
            <div class="form-group">
            </div>
          </div>

          <!-- Hàng 4: Mật khẩu, Xác nhận mật khẩu -->
          <div class="form-row">
            <div class="form-group">
              <label>
                <span class="label-icon">🔐</span>
                <span>Mật Khẩu <span class="required">*</span></span>
              </label>
              <input
                v-model="formData.Password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <span class="label-icon">🔐</span>
                <span>Xác Nhận Mật Khẩu <span class="required">*</span></span>
              </label>
              <input
                v-model="formData.ConfirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu"
                required
                class="form-input"
              />
            </div>
          </div>

          <button type="submit" :disabled="loading" class="register-btn">
            <span v-if="!loading">Đăng Ký</span>
            <span v-else>⏳ Đang xử lý...</span>
          </button>

          <div v-if="error" class="error-alert">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div v-if="success" class="success-alert">
            <span class="success-icon">✅</span>
            {{ success }}
          </div>

          <div class="register-footer">
            <p>
              Đã có tài khoản?
              <a href="#" @click.prevent="$emit('switch-to-login')" class="login-link">
                Đăng nhập tại đây
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      formData: {
        Ho_Lot: "",
        Ten: "",
        Dien_Thoai: "",
        Email: "",
        Dia_Chi: "",
        Password: "",
        ConfirmPassword: "",
      },
      loading: false,
      error: "",
      success: "",
    };
  },
  methods: {
    async handleRegister() {
      // Kiểm tra mật khẩu trùng khớp
      if (this.formData.Password !== this.formData.ConfirmPassword) {
        this.error = "❌ Mật khẩu không trùng khớp";
        this.success = "";
        return;
      }

      // Kiểm tra độ dài mật khẩu
      if (this.formData.Password.length < 6) {
        this.error = "❌ Mật khẩu phải có ít nhất 6 ký tự";
        this.success = "";
        return;
      }

      this.loading = true;
      this.error = "";
      this.success = "";

      try {
        const { ConfirmPassword, ...dataToSend } = this.formData;
        
        const response = await axios.post(
          "http://localhost:5000/api/auth/reader/register",
          dataToSend
        );

        this.success = "✅ Đăng ký thành công! Vui lòng đăng nhập.";
        this.formData = {
          Ma_Doc_Gia: "",
          Ho_Lot: "",
          Ten: "",
          Dien_Thoai: "",
          Email: "",
          Dia_Chi: "",
          Password: "",
          ConfirmPassword: "",
        };

        setTimeout(() => {
          this.$emit("register-success");
        }, 2000);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          "❌ Đăng ký thất bại. Vui lòng thử lại.";
        this.success = "";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.register-container {
  width: 100%;
  max-width: 900px;
}

.register-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  color: #667eea;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  font-size: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  font-size: 1.2rem;
}

.required {
  color: #ef4444;
  font-weight: bold;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #fafafa;
}

.register-btn {
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1.2rem;
}

.success-alert {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #86efac;
  color: #16a34a;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.success-icon {
  font-size: 1.2rem;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.register-footer p {
  color: #666;
  font-size: 0.95rem;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-box {
    padding: 1.5rem;
  }

  .register-header h1 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .register-form {
    gap: 0.75rem;
  }
}
</style>
