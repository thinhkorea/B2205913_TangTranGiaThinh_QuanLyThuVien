<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <Header 
      title="📚 Thư Viện Học Viên"
      subtitle="Hệ thống quản lý mượn sách"
      :userName="`${currentUser?.Ho_Lot} ${currentUser?.Ten}`"
      :hasBotMargin="true"
      @logout="$emit('logout')"
    />

    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Welcome Section -->
      <section class="welcome-card">
        <h2>Chào mừng, {{ currentUser?.Ho_Lot }} {{ currentUser?.Ten }}! 👋</h2>
        <p>{{ getGreeting() }}</p>
      </section>

      <!-- Quick Stats -->
      <section class="stats-section">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="stat-info">
            <h4>Sách Đang Mượn</h4>
            <p class="stat-value">{{ myBorrows.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-info">
            <h4>Quá Hạn</h4>
            <p class="stat-value">{{ overdueBooks }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe)">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="stat-info">
            <h4>Ngày Đăng Ký</h4>
            <p class="stat-value">{{ formatDate(currentUser?.Ngay_Dang_Ky) }}</p>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <section class="action-buttons">
        <button @click="$emit('navigate', 'borrow')" class="btn-action btn-primary">
          <i class="fas fa-plus-circle"></i>
          <span>Mượn Sách</span>
        </button>
        <button @click="$emit('navigate', 'history')" class="btn-action btn-secondary">
          <i class="fas fa-history"></i>
          <span>Lịch Sử Mượn</span>
        </button>
      </section>

      <!-- Profile Info -->
      <section class="profile-section">
        <h3>Thông Tin Cá Nhân</h3>
        <div class="profile-info">
          <div class="info-row">
            <span class="label">Mã Độc Giả:</span>
            <span class="value">{{ currentUser?.Ma_Doc_Gia || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ currentUser?.Email || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="label">Số Điện Thoại:</span>
            <span class="value">{{ currentUser?.Dien_Thoai || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="label">Địa Chỉ:</span>
            <span class="value">{{ currentUser?.Dia_Chi || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="label">Trạng Thái:</span>
            <span class="value" :class="{ 'status-active': currentUser?.Tinh_Trang === '1' }">
              {{ currentUser?.Tinh_Trang === '1' ? '✅ Hoạt động' : '❌ Vô hiệu' }}
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { useBorrowStore } from "../stores/borrowStore.js";
import Header from "./Header.vue";

export default {
  name: "Dashboard",
  components: {
    Header,
  },
  data() {
    return {
      currentUser: null,
      myBorrows: [],
    };
  },
  computed: {
    borrowStore() {
      return useBorrowStore();
    },
    overdueBooks() {
      return this.myBorrows.filter((borrow) => {
        const returnDate = new Date(borrow.Ngay_Tra);
        return returnDate < new Date() && borrow.trang_thai === "Đang mượn";
      }).length;
    },
  },
  async mounted() {
    const reader = localStorage.getItem("reader");
    if (reader) {
      this.currentUser = JSON.parse(reader);
    }
    await this.loadBorrowData();
  },
  methods: {
    async loadBorrowData() {
      try {
        const reader = JSON.parse(localStorage.getItem("reader"));
        const response = await axios.get(
          `http://localhost:5000/api/borrows?Ma_Doc_Gia=${reader._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.myBorrows = response.data || [];
      } catch (error) {
        console.error("Lỗi tải lịch sử mượn:", error);
      }
    },
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Chúc bạn một buổi sáng tốt lành! ☀️";
      if (hour < 18) return "Chúc bạn một buổi chiều tốt lành! 🌤️";
      return "Chúc bạn một buổi tối tốt lành! 🌙";
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

.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header *//* Content */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.welcome-card h2 {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.welcome-card p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.stat-info h4 {
  font-size: 0.85rem;
  color: #718096;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.btn-action {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.btn-action i {
  font-size: 1.5rem;
}

.btn-primary {
  border-color: #667eea;
  color: #667eea;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  border-color: #f093fb;
  color: #f093fb;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3);
}

/* Profile Section */
.profile-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-section h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.profile-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #718096;
  font-size: 0.9rem;
}

.value {
  color: #2d3748;
  font-weight: 500;
}

.status-active {
  color: #38a169 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-user {
    justify-content: center;
    width: 100%;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-card h2 {
    font-size: 1.5rem;
  }

  .stats-section,
  .action-buttons {
    grid-template-columns: 1fr;
  }

  .profile-info {
    grid-template-columns: 1fr;
  }

  .btn-action {
    flex-direction: column;
  }
}
</style>
