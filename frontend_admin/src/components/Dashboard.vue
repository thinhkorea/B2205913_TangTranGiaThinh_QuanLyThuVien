<template>
  <div class="dashboard-wrapper">
    <!-- Main Header -->
    <header class="main-header">
      <div class="header-container">
        <div class="header-left">
          <div class="brand">
            <i class="fas fa-book-reader"></i>
            <div class="brand-text">
              <h1>Quản Lý Thư Viện</h1>
              <p>Khu Vực Quản Trị Viên</p>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">{{ currentUser?.Ho_Ten || "Admin" }}</span>
              <span class="user-role">Quản trị viên</span>
            </div>
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-notification">
              <i class="fas fa-bell"></i>
            </button>
            <button @click="handleLogout" class="btn-logout">
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Navigation -->
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-items">
          <button 
            @click="setActiveView('dashboard')"
            :class="['nav-item', { active: activeView === 'dashboard' }]">
            <i class="fas fa-home"></i>
            <span>Tổng quan</span>
          </button>
          <button 
            @click="setActiveView('books')"
            :class="['nav-item', { active: activeView === 'books' }]">
            <i class="fas fa-book"></i>
            <span>Quản lý sách</span>
          </button>
          <button 
            @click="setActiveView('readers')"
            :class="['nav-item', { active: activeView === 'readers' }]">
            <i class="fas fa-users"></i>
            <span>Quản lý độc giả</span>
          </button>
          <button 
            @click="setActiveView('borrows')"
            :class="['nav-item', { active: activeView === 'borrows' }]">
            <i class="fas fa-book-open"></i>
            <span>Mượn trả sách</span>
          </button>
          <button 
            @click="setActiveView('publishers')"
            :class="['nav-item', { active: activeView === 'publishers' }]">
            <i class="fas fa-building"></i>
            <span>Nhà xuất bản</span>
          </button>
          <button 
            @click="setActiveView('staff')"
            :class="['nav-item', { active: activeView === 'staff' }]">
            <i class="fas fa-user-tie"></i>
            <span>Nhân viên</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="dashboard-content">

    <div class="content-area">
      <!-- Dashboard Overview -->
      <div v-if="activeView === 'dashboard'" class="view-content">
        <div class="welcome-section">
          <h1 class="welcome-title">
            Chào mừng, {{ currentUser?.Ho_Ten || "Quản trị viên" }} 👋
          </h1>
          <p class="welcome-date">{{ getCurrentDate() }}</p>
        </div>

      <!-- Stats Cards Grid -->
      <div class="row g-3 mb-3">
        <!-- Total Books Card -->
        <div class="col-md-6 col-lg-3">
          <div
            class="card border-0 shadow-sm h-100"
            style="
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.1),
                rgba(139, 92, 246, 0.1)
              );
              backdrop-filter: blur(10px);
            "
          >
            <div class="card-body p-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <h6
                  class="card-title mb-0"
                  style="
                    color: #a0a0b0;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                  "
                >
                  Tổng Sách
                </h6>
                <div
                  class="rounded p-1"
                  style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
                >
                  <i
                    class="fas fa-book"
                    style="color: #ffffff; font-size: 1rem"
                  ></i>
                </div>
              </div>
              <h3
                class="fw-bold mb-2"
                style="color: #ffffff; font-size: 1.5rem"
              >
                2,456
              </h3>
              <small style="color: #10b981">
                <i class="fas fa-arrow-up"></i> +12%
              </small>
            </div>
          </div>
        </div>

        <!-- Total Readers Card -->
        <div class="col-md-6 col-lg-3">
          <div
            class="card border-0 shadow-sm h-100"
            style="
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.1),
                rgba(139, 92, 246, 0.1)
              );
              backdrop-filter: blur(10px);
            "
          >
            <div class="card-body p-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <h6
                  class="card-title mb-0"
                  style="
                    color: #a0a0b0;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                  "
                >
                  Tổng Độc Giả
                </h6>
                <div
                  class="rounded p-1"
                  style="background: linear-gradient(135deg, #a78bfa, #c4b5fd)"
                >
                  <i
                    class="fas fa-users"
                    style="color: #ffffff; font-size: 1rem"
                  ></i>
                </div>
              </div>
              <h3
                class="fw-bold mb-2"
                style="color: #ffffff; font-size: 1.5rem"
              >
                1,832
              </h3>
              <small style="color: #10b981">
                <i class="fas fa-arrow-up"></i> +8%
              </small>
            </div>
          </div>
        </div>

        <!-- Currently Borrowed Card -->
        <div class="col-md-6 col-lg-3">
          <div
            class="card border-0 shadow-sm h-100"
            style="
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.1),
                rgba(139, 92, 246, 0.1)
              );
              backdrop-filter: blur(10px);
            "
          >
            <div class="card-body p-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <h6
                  class="card-title mb-0"
                  style="
                    color: #a0a0b0;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                  "
                >
                  Đang Mượn
                </h6>
                <div
                  class="rounded p-1"
                  style="background: linear-gradient(135deg, #f59e0b, #fbbf24)"
                >
                  <i
                    class="fas fa-book-open"
                    style="color: #ffffff; font-size: 1rem"
                  ></i>
                </div>
              </div>
              <h3
                class="fw-bold mb-2"
                style="color: #ffffff; font-size: 1.5rem"
              >
                542
              </h3>
              <small style="color: #f59e0b">
                <i class="fas fa-minus"></i> -2%
              </small>
            </div>
          </div>
        </div>

        <!-- Staff Card -->
        <div class="col-md-6 col-lg-3">
          <div
            class="card border-0 shadow-sm h-100"
            style="
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.1),
                rgba(139, 92, 246, 0.1)
              );
              backdrop-filter: blur(10px);
            "
          >
            <div class="card-body p-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <h6
                  class="card-title mb-0"
                  style="
                    color: #a0a0b0;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                  "
                >
                  Nhân Viên
                </h6>
                <div
                  class="rounded p-1"
                  style="background: linear-gradient(135deg, #10b981, #34d399)"
                >
                  <i
                    class="fas fa-user-tie"
                    style="color: #ffffff; font-size: 1rem"
                  ></i>
                </div>
              </div>
              <h3
                class="fw-bold mb-2"
                style="color: #ffffff; font-size: 1.5rem"
              >
                12
              </h3>
              <small style="color: #10b981">
                <i class="fas fa-plus"></i> +1
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Row -->
      <div class="row g-3">
        <!-- Activity Timeline -->
        <div class="col-lg-8">
          <div
            class="card border-0 shadow-sm"
            style="
              background: rgba(26, 26, 46, 0.8);
              backdrop-filter: blur(10px);
            "
          >
            <div
              class="card-header border-0 px-3 py-2"
              style="
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-bottom: 1px solid #2a2a3e;
              "
            >
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-white" style="font-size: 1rem">
                  <i class="fas fa-chart-line me-2"></i>Hoạt Động Gần Đây
                </h5>
                <a
                  href="#"
                  style="
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 0.8rem;
                  "
                  >Xem tất cả</a
                >
              </div>
            </div>
            <div class="card-body p-3">
              <!-- Timeline Item 1 -->
              <div
                class="d-flex gap-2 mb-3 pb-3"
                style="border-bottom: 1px solid #2a2a3e"
              >
                <div
                  class="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
                  style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: white;
                    font-size: 1rem;
                  "
                >
                  <i class="fas fa-plus-circle"></i>
                </div>
                <div style="flex: 1">
                  <h6
                    class="fw-semibold mb-1"
                    style="color: #ffffff; font-size: 0.95rem"
                  >
                    Sách mới được thêm
                  </h6>
                  <p class="mb-1" style="color: #a0a0b0; font-size: 0.8rem">
                    "Lập trình Web với Node.js" được thêm
                  </p>
                  <small style="color: #6b7280; font-size: 0.75rem">
                    <i class="far fa-clock"></i> 10 phút trước
                  </small>
                </div>
              </div>

              <!-- Timeline Item 2 -->
              <div
                class="d-flex gap-2 mb-3 pb-3"
                style="border-bottom: 1px solid #2a2a3e"
              >
                <div
                  class="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
                  style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    font-size: 1rem;
                  "
                >
                  <i class="fas fa-user-plus"></i>
                </div>
                <div style="flex: 1">
                  <h6
                    class="fw-semibold mb-1"
                    style="color: #ffffff; font-size: 0.95rem"
                  >
                    Độc giả mới đăng ký
                  </h6>
                  <p class="mb-1" style="color: #a0a0b0; font-size: 0.8rem">
                    Nguyễn Văn An đã đăng ký thành viên
                  </p>
                  <small style="color: #6b7280; font-size: 0.75rem">
                    <i class="far fa-clock"></i> 25 phút trước
                  </small>
                </div>
              </div>

              <!-- Timeline Item 3 -->
              <div class="d-flex gap-2">
                <div
                  class="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
                  style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: white;
                    font-size: 1rem;
                  "
                >
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div style="flex: 1">
                  <h6
                    class="fw-semibold mb-1"
                    style="color: #ffffff; font-size: 0.95rem"
                  >
                    Sách quá hạn trả
                  </h6>
                  <p class="mb-1" style="color: #a0a0b0; font-size: 0.8rem">
                    5 cuốn sách đã quá hạn, cần liên hệ độc giả
                  </p>
                  <small style="color: #6b7280; font-size: 0.75rem">
                    <i class="far fa-clock"></i> 1 giờ trước
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-lg-4">
          <!-- Profile Card -->
          <div
            class="card border-0 shadow-sm mb-3"
            style="
              background: rgba(26, 26, 46, 0.8);
              backdrop-filter: blur(10px);
            "
          >
            <div
              class="card-header border-0 px-3 py-2"
              style="
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-bottom: 1px solid #2a2a3e;
              "
            >
              <h5 class="mb-0 fw-bold text-white" style="font-size: 1rem">
                <i class="fas fa-user-circle me-2"></i>Thông Tin Tài Khoản
              </h5>
            </div>
            <div class="card-body p-3 text-center">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style="
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #6366f1, #8b5cf6);
                  color: white;
                  font-size: 2rem;
                  font-weight: bold;
                "
              >
                <i class="fas fa-user"></i>
              </div>
              <h5 class="fw-bold mb-1" style="color: #ffffff">
                {{ currentUser?.Ho_Ten || "Quản trị viên" }}
              </h5>
              <p class="mb-3" style="color: #a0a0b0; font-size: 0.9rem">
                Administrator
              </p>
              <div class="row text-start">
                <div class="col-12 mb-2">
                  <small style="color: #a0a0b0">Mã nhân viên:</small>
                  <div style="color: #ffffff; font-weight: 600">
                    {{ currentUser?.Ma_Nhan_Vien || "NV001" }}
                  </div>
                </div>
                <div class="col-12 mb-2">
                  <small style="color: #a0a0b0">Trạng thái:</small>
                  <div style="color: #10b981; font-weight: 600">
                    <i class="fas fa-circle" style="font-size: 0.5rem"></i> Đang hoạt động
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="card border-0 shadow-sm"
            style="
              background: rgba(26, 26, 46, 0.8);
              backdrop-filter: blur(10px);
            "
          >
            <div
              class="card-header border-0 px-3 py-2"
              style="
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-bottom: 1px solid #2a2a3e;
              "
            >
              <h5 class="mb-0 fw-bold text-white" style="font-size: 1rem">
                <i class="fas fa-bolt me-2"></i>Thao Tác Nhanh
              </h5>
            </div>
            <div class="card-body p-3">
              <div class="row g-2">
                <div class="col-6">
                  <button
                    class="btn w-100 text-white d-flex flex-column align-items-center py-3"
                    style="
                      background: linear-gradient(135deg, #10b981, #34d399);
                      border: none;
                      border-radius: 8px;
                    "
                  >
                    <i class="fas fa-plus-circle mb-1" style="font-size: 1.2rem"></i>
                    <span style="font-size: 0.8rem">Thêm Sách</span>
                  </button>
                </div>
                <div class="col-6">
                  <button
                    class="btn w-100 text-white d-flex flex-column align-items-center py-3"
                    style="
                      background: linear-gradient(135deg, #a78bfa, #c4b5fd);
                      border: none;
                      border-radius: 8px;
                    "
                  >
                    <i class="fas fa-user-plus mb-1" style="font-size: 1.2rem"></i>
                    <span style="font-size: 0.8rem">Thêm Độc Giả</span>
                  </button>
                </div>
                <div class="col-6">
                  <button
                    class="btn w-100 text-white d-flex flex-column align-items-center py-3"
                    style="
                      background: linear-gradient(135deg, #f59e0b, #fbbf24);
                      border: none;
                      border-radius: 8px;
                    "
                  >
                    <i class="fas fa-book-open mb-1" style="font-size: 1.2rem"></i>
                    <span style="font-size: 0.8rem">Mượn Sách</span>
                  </button>
                </div>
                <div class="col-6">
                  <button
                    class="btn w-100 text-white d-flex flex-column align-items-center py-3"
                    style="
                      background: linear-gradient(135deg, #ef4444, #f87171);
                      border: none;
                      border-radius: 8px;
                    "
                  >
                    <i class="fas fa-undo-alt mb-1" style="font-size: 1.2rem"></i>
                    <span style="font-size: 0.8rem">Trả Sách</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- Books Management -->
      <BookList v-else-if="activeView === 'books'" />
      
      <!-- Readers Management -->
      <ReaderList v-else-if="activeView === 'readers'" />
      
      <!-- Borrow Management -->
      <BorrowList v-else-if="activeView === 'borrows'" />
      
      <!-- Publishers Management -->
      <PublisherList v-else-if="activeView === 'publishers'" />
      
      <!-- Staff Management -->
      <StaffList v-else-if="activeView === 'staff'" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BookList from './BookList.vue';
import ReaderList from './ReaderList.vue';
import BorrowList from './BorrowList.vue';
import PublisherList from './PublisherList.vue';
import StaffList from './StaffList.vue';

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['logout']);

const activeView = ref('dashboard');

const setActiveView = (view) => {
  activeView.value = view;
};

const getCurrentDate = () => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("vi-VN", options);
};

const handleLogout = () => {
  if (confirm("Bạn chắc chắn muốn đăng xuất?")) {
    emit('logout');
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  margin: 0;
  padding: 0;
  width: 100%;
}

/* Main Header */
.main-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand i {
  font-size: 2.5rem;
  color: #ffd700;
}

.brand-text h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.brand-text p {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-details {
  text-align: right;
}

.user-name {
  display: block;
  font-weight: 600;
  font-size: 1rem;
}

.user-role {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.25rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-notification {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-notification:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-logout {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-logout:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Main Navigation */
.main-nav {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2a2a3e;
  padding: 0;
}

.nav-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-items {
  display: flex;
  gap: 0;
  overflow-x: auto;
}

.nav-item {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  border-bottom-color: #6366f1;
}

.nav-item i {
  font-size: 1.1rem;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
}

.view-content {
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.welcome-date {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Dashboard Content */
.dashboard-content {
  padding: 0;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0f0f1e;
}

::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8b5cf6;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2) !important;
}

.btn:hover {
  transform: translateY(-2px);
}

.fw-500 {
  font-weight: 500;
}

.container-fluid {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  max-width: 100% !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-right {
    gap: 1rem;
  }

  .user-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .user-details {
    text-align: center;
  }

  .brand-text h1 {
    font-size: 1.5rem;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .container-fluid {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>
