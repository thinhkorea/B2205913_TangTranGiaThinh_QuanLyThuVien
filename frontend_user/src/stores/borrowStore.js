import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useBorrowStore = defineStore('borrows', () => {
  const myBorrows = ref([]);
  const totalBooks = ref(0);
  const overdueCount = ref(0);
  const isLoading = ref(false);

  const loadMyBorrows = async (readerId) => {
    try {
      isLoading.value = true;
      const response = await axios.get(`http://localhost:5000/api/borrows?Ma_Doc_Gia=${readerId}`);
      myBorrows.value = response.data;
      console.log('My borrows loaded:', myBorrows.value.length);
    } catch (error) {
      console.error('Error loading my borrows:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadTotalBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      totalBooks.value = response.data.length;
      console.log('Total books:', totalBooks.value);
    } catch (error) {
      console.error('Error loading total books:', error);
    }
  };

  const calculateOverdueCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    overdueCount.value = myBorrows.value.filter((borrow) => {
      if (borrow.trang_thai !== 'Đang mượn') return false;
      const returnDate = new Date(borrow.Ngay_Tra);
      return returnDate < today;
    }).length;
  };

  return {
    myBorrows,
    totalBooks,
    overdueCount,
    isLoading,
    loadMyBorrows,
    loadTotalBooks,
    calculateOverdueCount,
  };
});
