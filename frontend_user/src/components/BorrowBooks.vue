<template>
  <div class="borrow-books-container">
    <!-- Header -->
    <Header 
      title="📚 Mượn Sách"
      subtitle="Chọn sách để mượn từ thư viện"
      :userName="`${currentUser?.Ho_Lot} ${currentUser?.Ten}`"
      :showBack="true"
      @back="$emit('back')"
      @logout="handleLogout"
    />

    <!-- Content Wrapper -->
    <div class="content-wrapper">

    <!-- Filter Section -->
    <div class="filter-row">
      <input 
        v-model="searchTerm"
        type="text"
        placeholder="Tìm kiếm theo tên sách, mã sách..."
        class="search-input"
        @input="performSearch"
      />
      <select v-model="selectedAuthor" @change="performSearch" class="filter-select">
        <option value="">Tất cả tác giả</option>
        <option v-for="author in authors" :key="author._id" :value="author._id" :title="author.Ten_Tac_Gia">
          {{ author.Ten_Tac_Gia.length > 30 ? author.Ten_Tac_Gia.substring(0, 30) + '...' : author.Ten_Tac_Gia }}
        </option>
      </select>
      <select v-model="selectedPublisher" @change="performSearch" class="filter-select">
        <option value="">Tất cả nhà xuất bản</option>
        <option v-for="pub in publishers" :key="pub._id" :value="pub._id" :title="pub.Ten_Nha_Xuat_Ban || pub.Ten_NXB">
          {{ (pub.Ten_Nha_Xuat_Ban || pub.Ten_NXB).length > 30 ? (pub.Ten_Nha_Xuat_Ban || pub.Ten_NXB).substring(0, 30) + '...' : (pub.Ten_Nha_Xuat_Ban || pub.Ten_NXB) }}
        </option>
      </select>
    </div>

    <!-- Books Gallery -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải sách...</p>
    </div>

    <div v-else-if="filteredBooks.length > 0" class="books-gallery">
      <div v-for="book in filteredBooks" :key="book._id" class="book-card">
        <div class="book-image-container">
          <div class="book-image">
            <img 
              v-if="book.Hinh_Anh" 
              :src="book.Hinh_Anh" 
              :alt="book.Ten_Sach"
              class="book-cover"
            />
            <div v-else class="book-placeholder">
              <i class="fas fa-book"></i>
            </div>
          </div>
          <div :class="['stock-badge', book.So_Quyen > 0 ? 'in-stock' : 'out-of-stock']">
            {{ book.So_Quyen }} bản
          </div>
        </div>

        <div class="card-content">
          <div class="book-header">
            <div class="book-info">
              <p class="book-id">{{ book.Ma_Sach }}</p>
              <h3 class="book-name">{{ book.Ten_Sach }}</h3>
            </div>
          </div>

          <div class="book-details">
            <div class="detail-item">
              <span class="detail-label">Tác giả:</span>
              <span class="detail-value">{{ getAuthorName(book.Tac_Gia) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">NXB:</span>
              <span class="detail-value">{{ getPublisherName(book.Ma_NXB) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Năm:</span>
              <span class="detail-value">{{ book.Nam_Xuat_Ban || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Giá:</span>
              <span class="detail-value price">{{ formatPrice(book.Don_Gia) }}</span>
            </div>
          </div>

          <button 
            v-if="book.So_Quyen > 0"
            @click="openBorrowModal(book)" 
            class="btn-borrow"
            :disabled="borrowLoading"
          >
            <i class="fas fa-book"></i> Mượn sách
          </button>
          <button v-else class="btn-unavailable" disabled>
            <i class="fas fa-ban"></i> Hết sách
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-books">
      <i class="fas fa-search"></i>
      <h3>Không tìm thấy sách nào</h3>
      <p>Hãy thử thay đổi bộ lọc tìm kiếm</p>
    </div>

    <!-- Borrow Modal -->
    <div v-if="showBorrowModal" class="modal-overlay" @click.self="closeBorrowModal">
      <div class="form-modal">
        <div class="form-header">
          <h3>Mượn Sách</h3>
          <button @click="closeBorrowModal" class="btn-close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleBorrow" class="borrow-form">
          <div class="form-group">
            <label>Tên sách</label>
            <input type="text" :value="selectedBook?.Ten_Sach" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Mã sách</label>
            <input type="text" :value="selectedBook?.Ma_Sach" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Ngày mượn</label>
            <input type="date" :value="today" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Ngày hẹn trả <span class="required">*</span></label>
            <input 
              v-model="borrowForm.returnDate" 
              type="date" 
              :min="today"
              :max="maxReturnDate"
              class="form-input"
              required
            />
            <small class="form-hint">Tối đa 14 ngày ({{ maxReturnDate }})</small>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeBorrowModal" class="btn-cancel">Hủy</button>
            <button type="submit" class="btn-submit" :disabled="borrowLoading">
              <span v-if="borrowLoading">
                <i class="fas fa-spinner fa-spin"></i> Đang xử lý...
              </span>
              <span v-else>
                <i class="fas fa-check"></i> Xác nhận mượn
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="toast toast-success">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="toast toast-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ errorMessage }}
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useBookStore } from '@/stores/bookStore';
import { useBorrowStore } from '@/stores/borrowStore';
import Header from './Header.vue';

export default {
  name: "BorrowBooks",
  components: {
    Header,
  },
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const bookStore = useBookStore();
    const borrowStore = useBorrowStore();
    return { bookStore, borrowStore };
  },
  data() {
    return {
      searchTerm: '',
      selectedAuthor: '',
      selectedPublisher: '',
      borrowLoading: false,
      showBorrowModal: false,
      selectedBook: null,
      borrowForm: {
        returnDate: ""
      },
      successMessage: '',
      errorMessage: '',
      today: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    books() {
      return this.bookStore.books;
    },
    authors() {
      return this.bookStore.authors;
    },
    publishers() {
      return this.bookStore.publishers;
    },
    isLoading() {
      return this.bookStore.isLoading;
    },
    filteredBooks() {
      return this.books.filter(book => {
        const matchSearch = !this.searchTerm || 
          book.Ten_Sach.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          book.Ma_Sach.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        // Tác giả có thể là object populated hoặc ID string
        const authorId = typeof book.Tac_Gia === 'object' ? book.Tac_Gia._id : book.Tac_Gia;
        const matchAuthor = !this.selectedAuthor || authorId === this.selectedAuthor;
        
        // Nhà xuất bản có thể là object populated hoặc ID string
        const publisherId = typeof book.Ma_NXB === 'object' ? book.Ma_NXB._id : book.Ma_NXB;
        const matchPublisher = !this.selectedPublisher || publisherId === this.selectedPublisher;
        
        return matchSearch && matchAuthor && matchPublisher;
      });
    },
    maxReturnDate() {
      const date = new Date();
      date.setDate(date.getDate() + 14); // Maximum 14 days
      return date.toISOString().split('T')[0];
    },
  },
  async mounted() {
    await this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        await Promise.all([
          this.bookStore.loadBooks(),
          this.bookStore.loadAuthors(),
          this.bookStore.loadPublishers(),
        ]);
      } catch (error) {
        console.error('Error during mount:', error);
        this.showError('Lỗi khi tải dữ liệu');
      }
    },
    getAuthorName(author) {
      // Author có thể là object đã populate hoặc ID string
      if (!author) return 'Không rõ';
      
      // Nếu là object, trả về Ten_Tac_Gia
      if (typeof author === 'object' && author.Ten_Tac_Gia) {
        return author.Ten_Tac_Gia;
      }
      
      // Nếu là string ID, tìm trong authors array
      if (typeof author === 'string') {
        const found = this.authors.find(a => a._id === author || a.Ma_Tac_Gia === author);
        return found ? found.Ten_Tac_Gia : 'Không rõ';
      }
      
      return 'Không rõ';
    },
    getPublisherName(publisher) {
      // Publisher có thể là object đã populate hoặc ID string
      if (!publisher) return 'Không rõ';
      
      // Nếu là object, trả về Ten_Nha_Xuat_Ban
      if (typeof publisher === 'object' && publisher.Ten_Nha_Xuat_Ban) {
        return publisher.Ten_Nha_Xuat_Ban;
      }
      
      // Nếu là string ID, tìm trong publishers array
      if (typeof publisher === 'string') {
        const found = this.publishers.find(p => p._id === publisher || p.Ma_Nha_Xuat_Ban === publisher);
        return found ? found.Ten_Nha_Xuat_Ban : 'Không rõ';
      }
      
      return 'Không rõ';
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price || 0);
    },
    openBorrowModal(book) {
      this.selectedBook = book;
      this.borrowForm = {
        returnDate: this.getDefaultReturnDate()
      };
      this.showBorrowModal = true;
    },
    closeBorrowModal() {
      this.showBorrowModal = false;
      this.selectedBook = null;
      this.borrowForm = {
        returnDate: '',
      };
    },
    getDefaultReturnDate() {
      const date = new Date();
      date.setDate(date.getDate() + 14); // 14 days from now
      return date.toISOString().split('T')[0];
    },
    async handleBorrow() {
      if (!this.borrowForm.returnDate) {
        this.showError('Vui lòng chọn ngày hẹn trả');
        return;
      }

      // Check xem sách còn lượng không
      if (this.selectedBook.So_Quyen <= 0) {
        this.showError('Sách này hết hàng rồi');
        return;
      }

      // Check xem reader đã mượn cuốn này chưa (chưa trả)
      const alreadyBorrowed = this.borrowStore.myBorrows.some(borrow => 
        borrow.Ma_Sach._id === this.selectedBook._id && 
        borrow.trang_thai === 'Đang mượn'
      );
      
      if (alreadyBorrowed) {
        this.showError('Bạn đã mượn sách này rồi, vui lòng trả trước khi mượn lại');
        return;
      }

      // Check xem số lượng sách chưa trả có vượt quá 3 cuốn không
      const unreturned = this.borrowStore.myBorrows.filter(borrow => 
        borrow.trang_thai === 'Đang mượn'
      ).length;

      if (unreturned >= 3) {
        this.showError('Bạn đã mượn 3 cuốn sách. Vui lòng trả sách trước khi mượn thêm.');
        return;
      }

      // Validate return date không vượt quá 14 ngày
      const borrowDate = new Date(this.today);
      const returnDate = new Date(this.borrowForm.returnDate);
      const maxDate = new Date(this.today);
      maxDate.setDate(maxDate.getDate() + 14);

      if (returnDate > maxDate) {
        this.showError('Ngày trả sách không được vượt quá 14 ngày');
        return;
      }

      if (returnDate < borrowDate) {
        this.showError('Ngày trả sách phải sau ngày mượn');
        return;
      }

      this.borrowLoading = true;
      try {
        const borrowData = {
          Ma_Doc_Gia: this.currentUser._id,
          Ma_Sach: this.selectedBook._id,
          Ngay_Muon: this.today,
          Ngay_Tra: this.borrowForm.returnDate, // Gửi ngày hẹn trả
          trang_thai: "Đang mượn",
        };

        await axios.post('http://localhost:5000/api/borrows', borrowData);
        
        this.showSuccess(`Mượn sách "${this.selectedBook.Ten_Sach}" thành công! Hạn trả: ${this.borrowForm.returnDate}`);
        this.closeBorrowModal();
        
        // Reload books to update stock
        await this.bookStore.loadBooks();
        
        // Emit event để Dashboard cập nhật myBorrows
        this.$emit('book-borrowed');
      } catch (error) {
        console.error('Error borrowing book:', error);
        console.error('Error response:', error.response?.data);
        this.showError(error.response?.data?.message || 'Không thể mượn sách. Vui lòng thử lại');
      } finally {
        this.borrowLoading = false;
      }
    },
    performSearch() {
      // This is triggered by filter changes, computed property handles the filtering
    },
    showSuccess(message) {
      this.successMessage = message;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },
    showError(message) {
      this.errorMessage = message;
      this.successMessage = '';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    },
    handleLogout() {
      localStorage.clear();
      this.$emit('logout');
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

.borrow-books-container {
  width: 100%;
  background: #f5f5f7;
  color: #1a1a1a;
  padding: 0;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Content Wrapper */
.content-wrapper {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

.content-wrapper > * {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
}

/* Filter Section */
.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(363px, 1fr));
  gap: 1.25rem;
  max-width: 1200px;
  margin: 2rem auto 1.5rem auto;
  padding: 0 2rem;
}

.search-input,
.filter-select {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-weight: 500;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.search-input:hover,
.filter-select:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.filter-select {
  cursor: pointer;
  max-width: 100%;
}

.filter-select option {
  color: #1a1a1a;
  padding: 0.5rem;
  line-height: 1.5;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Style dropdown list */
select {
  position: relative;
}

select optgroup {
  font-weight: bold;
  color: #1a1a1a;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #a0a0b0;
  font-size: 0.95rem;
}

/* Books Gallery */
.books-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(363px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
  justify-content: space-between;
}

.book-card {
  background: #ffffff;
  backdrop-filter: blur(10px);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.book-card:hover {
  background: #ffffff;
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.book-image-container {
  position: relative;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f5f7, #e8e8f0);
}

.book-image {
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
  background: white;
  border-radius: 8px;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 3rem;
}

.stock-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

.stock-badge.in-stock {
  background: rgba(16, 185, 129, 0.9);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.stock-badge.out-of-stock {
  background: rgba(248, 113, 113, 0.9);
  color: white;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.book-info {
  flex: 1;
}

.book-id {
  color: #667eea;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 0.4rem 0;
  font-weight: 700;
}

.book-name {
  color: #1a1a1a;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  min-height: 2.8rem;
  max-height: 2.8rem;
}

.stock-badge {
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.stock-badge.in-stock {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.stock-badge.out-of-stock {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

/* Book Details */
.book-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  padding: 0.75rem 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.detail-label {
  color: #666;
  font-weight: 600;
  min-width: 80px;
}

.detail-value {
  color: #1a1a1a;
  text-align: right;
  flex: 1;
  font-weight: 500;
}

.detail-value.in-stock {
  color: #10b981;
}

.detail-value.out-of-stock {
  color: #f87171;
}

.price {
  color: #667eea;
  font-weight: 600;
}

/* Buttons */
.btn-borrow,
.btn-unavailable {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.95rem;
}

.btn-borrow {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-top: auto;
}

.btn-borrow:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-borrow:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-unavailable {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
  margin-top: auto;
  cursor: not-allowed;
}

/* No Books Message */
.no-books {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.no-books i {
  font-size: 4rem;
  color: #667eea;
  opacity: 0.3;
  margin-bottom: 1.5rem;
  display: block;
}

.no-books h3 {
  color: #1a1a1a;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.form-modal {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.form-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.btn-close-modal {
  background: none;
  border: none;
  color: #999;
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-close-modal:hover {
  color: #1a1a1a;
}

/* Borrow Form */
.borrow-form {
  padding: 1rem;
  display: flex;
  flex-direction: column;
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
  font-size: 0.9rem;
}

.required {
  color: #f87171;
}

.form-input {
  background: #ffffff;
  border: 1px solid #ddd;
  color: #1a1a1a;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f5f5f7;
  color: #999;
  cursor: not-allowed;
}

.form-hint {
  color: #999;
  font-size: 0.8rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-cancel {
  background: #f5f5f7;
  color: #1a1a1a;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e8e8eb;
  border-color: #ccc;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toast Messages */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  max-width: 350px;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-success {
  background: rgba(34, 197, 94, 0.95);
  border: 1px solid rgba(34, 197, 94, 1);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

.toast-error {
  background: rgba(239, 68, 68, 0.95);
  border: 1px solid rgba(239, 68, 68, 1);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .books-gallery {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .header-section h2 {
    font-size: 1.75rem;
  }

  .header-section {
    padding: 1.5rem 1rem;
    flex-direction: column;
    text-align: center;
  }

  .header-title {
    text-align: center;
  }

  .btn-back {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .toast {
    bottom: 1rem;
    right: 1rem;
    max-width: calc(100% - 2rem);
  }

  .form-modal {
    max-width: calc(100% - 2rem);
  }

  @media (max-width: 480px) {
    .header-section {
      padding: 1rem;
    }

    .btn-back {
      width: 35px;
      height: 35px;
      font-size: 0.9rem;
    }

    .header-section h2 {
      font-size: 1.5rem;
    }
  }
}
</style>
