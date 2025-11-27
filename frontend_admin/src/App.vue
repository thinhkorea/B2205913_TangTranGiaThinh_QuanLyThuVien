<template>
  <div v-if="isLoggedIn" class="admin-dashboard">
    <header class="admin-header">
      <div class="header-left">
        <h1>📚 Quản Lý Thư Viện</h1>
        <p class="header-subtitle">Khu Vực Quản Trị Viên</p>
      </div>
      <div class="user-info">
        <div class="user-details">
          <span class="user-name">👤 {{ currentUser?.Ho_Ten }}</span>
          <span class="user-role">Admin</span>
        </div>
        <button @click="handleLogout" class="logout-btn">🚪 Đăng Xuất</button>
      </div>
    </header>
    <main>
      <HelloWorld msg="Welcome to Admin Dashboard" />
    </main>
  </div>
  <Login v-else @login-success="handleLoginSuccess" />
</template>

<script>
import Login from "./components/Login.vue";
import HelloWorld from "./components/HelloWorld.vue";

export default {
  components: {
    Login,
    HelloWorld,
  },
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
    };
  },
  mounted() {
    const staff = localStorage.getItem("staff");
    if (staff) {
      this.currentUser = JSON.parse(staff);
      this.isLoggedIn = true;
    }
  },
  methods: {
    handleLoginSuccess() {
      const staff = localStorage.getItem("staff");
      this.currentUser = JSON.parse(staff);
      this.isLoggedIn = true;
    },
    handleLogout() {
      if (confirm("Bạn chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("staff");
        this.isLoggedIn = false;
        this.currentUser = null;
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

.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #e9ecf1 100%);
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 8px;
  border-radius: 12px;
}

.logout-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

main {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .user-details {
    align-items: center;
  }

  .header-left h1 {
    font-size: 22px;
  }

  main {
    padding: 20px;
  }
}
</style>
