<template>
  <div class="borrow-management">
    <div class="page-header">
      <h2><i class="fas fa-book-open"></i> Quản Lý Mượn Trả Sách</h2>
      <button @click="showBorrowForm = true" class="btn-primary">
        <i class="fas fa-plus"></i> Tạo phiếu mượn mới
      </button>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchTerm"
          type="text" 
          placeholder="Tìm kiếm theo mã phiếu, mã độc giả, mã sách..."
          @input="searchBorrows"
        >
      </div>
      <select v-model="statusFilter" @change="filterBorrows" class="filter-select">
        <option value="">Tất cả trạng thái</option>
        <option value="Đang mượn">Đang mượn</option>
        <option value="Đã trả">Đã trả</option>
        <option value="Quá hạn">Quá hạn</option>
      </select>
    </div>

    <!-- Borrows Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Mã phiếu mượn</th>
            <th>Mã độc giả</th>
            <th>Tên độc giả</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in filteredBorrows" :key="borrow.Ma_Phieu_Muon">
            <td class="borrow-id">{{ borrow.Ma_Phieu_Muon }}</td>
            <td>{{ borrow.Ma_Doc_Gia }}</td>
            <td class="reader-name">{{ getReaderName(borrow.Ma_Doc_Gia) }}</td>
            <td>{{ borrow.Ma_Sach }}</td>
            <td class="book-title">{{ getBookTitle(borrow.Ma_Sach) }}</td>
            <td>{{ formatDate(borrow.Ngay_Muon) }}</td>
            <td>{{ formatDate(borrow.Ngay_Hen_Tra) }}</td>
            <td>{{ borrow.Ngay_Tra ? formatDate(borrow.Ngay_Tra) : '-' }}</td>
            <td>
              <span :class="['status', getStatusClass(borrow)]">
                {{ getStatus(borrow) }}
              </span>
            </td>
            <td class="actions">
              <button 
                v-if="!borrow.Ngay_Tra" 
                @click="returnBook(borrow)" 
                class="btn-return"
              >
                <i class="fas fa-undo"></i>
              </button>
              <button @click="editBorrow(borrow)" class="btn-edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteBorrow(borrow.Ma_Phieu_Muon)" class="btn-delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Borrow Modal -->
    <div v-if="showBorrowForm || editingBorrow" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingBorrow ? 'Chỉnh sửa phiếu mượn' : 'Tạo phiếu mượn mới' }}</h3>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Mã phiếu mượn</label>
              <input 
                v-model="borrowForm.Ma_Phieu_Muon" 
                type="text" 
                :disabled="editingBorrow"
                required
              >
            </div>
            <div class="form-group">
              <label>Mã độc giả</label>
              <select v-model="borrowForm.Ma_Doc_Gia" required>
                <option value="">Chọn độc giả</option>
                <option v-for="reader in readers" :key="reader.Ma_Doc_Gia" :value="reader.Ma_Doc_Gia">
                  {{ reader.Ma_Doc_Gia }} - {{ reader.Ho_Lot }} {{ reader.Ten }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Mã sách</label>
              <select v-model="borrowForm.Ma_Sach" required>
                <option value="">Chọn sách</option>
                <option v-for="book in availableBooks" :key="book.Ma_Sach" :value="book.Ma_Sach">
                  {{ book.Ma_Sach }} - {{ book.Ten_Sach }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Ngày mượn</label>
              <input v-model="borrowForm.Ngay_Muon" type="date" required>
            </div>
            <div class="form-group">
              <label>Ngày hẹn trả</label>
              <input v-model="borrowForm.Ngay_Hen_Tra" type="date" required>
            </div>
          </div>
          
          <div v-if="editingBorrow" class="form-row">
            <div class="form-group">
              <label>Ngày trả</label>
              <input v-model="borrowForm.Ngay_Tra" type="date">
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Hủy</button>
            <button type="submit" class="btn-primary">
              {{ editingBorrow ? 'Cập nhật' : 'Tạo phiếu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BorrowList',
  data() {
    return {
      borrows: [],
      filteredBorrows: [],
      readers: [],
      books: [],
      searchTerm: '',
      statusFilter: '',
      showBorrowForm: false,
      editingBorrow: null,
      borrowForm: {
        Ma_Phieu_Muon: '',
        Ma_Doc_Gia: '',
        Ma_Sach: '',
        Ngay_Muon: new Date().toISOString().split('T')[0],
        Ngay_Hen_Tra: '',
        Ngay_Tra: ''
      }
    };
  },
  computed: {
    availableBooks() {
      return this.books.filter(book => book.So_Luong > 0);
    }
  },
  async mounted() {
    await this.loadData();
    this.setDefaultReturnDate();
  },
  methods: {
    async loadData() {
      await Promise.all([
        this.loadBorrows(),
        this.loadReaders(),
        this.loadBooks()
      ]);
    },
    
    async loadBorrows() {
      try {
        const response = await axios.get('http://localhost:3000/api/borrows');
        this.borrows = response.data;
        this.filteredBorrows = [...this.borrows];
      } catch (error) {
        console.error('Lỗi tải danh sách mượn trả:', error);
        // Mock data
        this.borrows = [
          {
            Ma_Phieu_Muon: 'PM001',
            Ma_Doc_Gia: 'DG001',
            Ma_Sach: 'S001',
            Ngay_Muon: '2024-11-01',
            Ngay_Hen_Tra: '2024-11-15',
            Ngay_Tra: null
          },
          {
            Ma_Phieu_Muon: 'PM002',
            Ma_Doc_Gia: 'DG002',
            Ma_Sach: 'S002',
            Ngay_Muon: '2024-10-20',
            Ngay_Hen_Tra: '2024-11-03',
            Ngay_Tra: '2024-11-02'
          }
        ];
        this.filteredBorrows = [...this.borrows];
      }
    },
    
    async loadReaders() {
      try {
        const response = await axios.get('http://localhost:3000/api/readers');
        this.readers = response.data;
      } catch (error) {
        this.readers = [
          { Ma_Doc_Gia: 'DG001', Ho_Lot: 'Nguyễn Văn', Ten: 'An' },
          { Ma_Doc_Gia: 'DG002', Ho_Lot: 'Trần Thị', Ten: 'Bình' }
        ];
      }
    },
    
    async loadBooks() {
      try {
        const response = await axios.get('http://localhost:3000/api/books');
        this.books = response.data;
      } catch (error) {
        this.books = [
          { Ma_Sach: 'S001', Ten_Sach: 'Lập trình JavaScript', So_Luong: 10 },
          { Ma_Sach: 'S002', Ten_Sach: 'Cơ sở dữ liệu', So_Luong: 3 }
        ];
      }
    },
    
    setDefaultReturnDate() {
      const today = new Date();
      const returnDate = new Date(today);
      returnDate.setDate(today.getDate() + 14); // 2 weeks later
      this.borrowForm.Ngay_Hen_Tra = returnDate.toISOString().split('T')[0];
    },
    
    searchBorrows() {
      this.filterBorrows();
    },
    
    filterBorrows() {
      let filtered = [...this.borrows];
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(borrow => 
          borrow.Ma_Phieu_Muon.toLowerCase().includes(term) ||
          borrow.Ma_Doc_Gia.toLowerCase().includes(term) ||
          borrow.Ma_Sach.toLowerCase().includes(term)
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(borrow => {
          const status = this.getStatus(borrow);
          return status === this.statusFilter;
        });
      }
      
      this.filteredBorrows = filtered;
    },
    
    getReaderName(maDocGia) {
      const reader = this.readers.find(r => r.Ma_Doc_Gia === maDocGia);
      return reader ? `${reader.Ho_Lot} ${reader.Ten}` : 'N/A';
    },
    
    getBookTitle(maSach) {
      const book = this.books.find(b => b.Ma_Sach === maSach);
      return book ? book.Ten_Sach : 'N/A';
    },
    
    getStatus(borrow) {
      if (borrow.Ngay_Tra) return 'Đã trả';
      
      const today = new Date();
      const dueDate = new Date(borrow.Ngay_Hen_Tra);
      
      if (today > dueDate) return 'Quá hạn';
      return 'Đang mượn';
    },
    
    getStatusClass(borrow) {
      const status = this.getStatus(borrow);
      switch (status) {
        case 'Đã trả': return 'returned';
        case 'Quá hạn': return 'overdue';
        case 'Đang mượn': return 'borrowed';
        default: return '';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    
    async returnBook(borrow) {
      if (!confirm('Xác nhận trả sách này?')) return;
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const updatedBorrow = { ...borrow, Ngay_Tra: today };
        
        await axios.put(`http://localhost:3000/api/borrows/${borrow.Ma_Phieu_Muon}`, updatedBorrow);
        
        const index = this.borrows.findIndex(b => b.Ma_Phieu_Muon === borrow.Ma_Phieu_Muon);
        this.borrows[index] = updatedBorrow;
        
        this.filterBorrows();
        alert('Trả sách thành công!');
      } catch (error) {
        console.error('Lỗi trả sách:', error);
        alert('Có lỗi xảy ra khi trả sách!');
      }
    },
    
    editBorrow(borrow) {
      this.editingBorrow = borrow;
      this.borrowForm = { ...borrow };
    },
    
    async deleteBorrow(maPhieuMuon) {
      if (!confirm('Bạn có chắc chắn muốn xóa phiếu mượn này?')) return;
      
      try {
        await axios.delete(`http://localhost:3000/api/borrows/${maPhieuMuon}`);
        this.borrows = this.borrows.filter(b => b.Ma_Phieu_Muon !== maPhieuMuon);
        this.filterBorrows();
        alert('Xóa phiếu mượn thành công!');
      } catch (error) {
        console.error('Lỗi xóa phiếu mượn:', error);
        alert('Có lỗi xảy ra khi xóa phiếu mượn!');
      }
    },
    
    async submitForm() {
      try {
        if (this.editingBorrow) {
          await axios.put(`http://localhost:3000/api/borrows/${this.borrowForm.Ma_Phieu_Muon}`, this.borrowForm);
          const index = this.borrows.findIndex(b => b.Ma_Phieu_Muon === this.borrowForm.Ma_Phieu_Muon);
          this.borrows[index] = { ...this.borrowForm };
        } else {
          await axios.post('http://localhost:3000/api/borrows', this.borrowForm);
          this.borrows.push({ ...this.borrowForm });
        }
        
        this.filterBorrows();
        this.closeModal();
        alert(this.editingBorrow ? 'Cập nhật phiếu mượn thành công!' : 'Tạo phiếu mượn thành công!');
      } catch (error) {
        console.error('Lỗi lưu phiếu mượn:', error);
        alert('Có lỗi xảy ra khi lưu phiếu mượn!');
      }
    },
    
    closeModal() {
      this.showBorrowForm = false;
      this.editingBorrow = null;
      this.borrowForm = {
        Ma_Phieu_Muon: '',
        Ma_Doc_Gia: '',
        Ma_Sach: '',
        Ngay_Muon: new Date().toISOString().split('T')[0],
        Ngay_Hen_Tra: '',
        Ngay_Tra: ''
      };
      this.setDefaultReturnDate();
    }
  }
};
</script>

<style scoped>
.borrow-management {
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.page-header i {
  margin-right: 0.5rem;
  color: #f59e0b;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0a0b0;
}

.search-box input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  background: rgba(26, 26, 46, 0.8);
  color: white;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.875rem 1rem;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  background: rgba(26, 26, 46, 0.8);
  color: white;
  font-size: 0.9rem;
  min-width: 180px;
}

.table-container {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid #2a2a3e;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #2a2a3e;
  font-size: 0.9rem;
}

.data-table tbody tr:hover {
  background: rgba(245, 158, 11, 0.1);
}

.borrow-id {
  font-weight: 600;
  color: #f59e0b;
}

.reader-name, .book-title {
  font-weight: 600;
  color: white;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
}

.status.borrowed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status.returned {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status.overdue {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-return, .btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-return {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.btn-return:hover {
  background: #10b981;
  color: white;
}

.btn-edit {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.btn-edit:hover {
  background: #f59e0b;
  color: white;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #2a2a3e;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #2a2a3e;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #a0a0b0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: white;
}

.modal-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a0a0b0;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  background: rgba(26, 26, 46, 0.6);
  color: white;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  border: 1px solid #374151;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.3);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .borrow-management {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filter-section {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 1200px;
  }
}
</style>
