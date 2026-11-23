/**
 * Hệ Thống Quản Lý Thư Viện - SmartLib AI (Master/Detail Architecture)
 * Sinh viên: Trần Thị Ngọc Anh - MSSV: 29209243814
 * Thiết kế chuẩn hóa theo đặc tả Business Analyst & Senior Developer:
 * - Master/Detail: borrow_slips & borrow_details
 * - Đáp ứng toàn diện quy tắc BR-01 đến BR-04
 */

// Hàm sinh ngày lùi/tiến so với ngày hiện tại (YYYY-MM-DD)
function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const TODAY = new Date().toISOString().split('T')[0];

// ================= 1. DỮ LIỆU KHỞI TẠO CHUẨN SCHEMA =================

const DEFAULT_BOOKS = [
  {
    id: 'B001',
    isbn: '978-0132350884',
    title: 'Clean Code - Nghệ Thuật Viết Mã Sạch',
    author: 'Robert C. Martin',
    category: 'CNTT & Lập trình',
    published_year: 2020,
    total_quantity: 5,
    available_quantity: 4,
    status: 'ACTIVE',
    created_at: '2026-01-10 08:30:00'
  },
  {
    id: 'B002',
    isbn: '978-0201633610',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma et al.',
    category: 'CNTT & Lập trình',
    published_year: 2019,
    total_quantity: 3,
    available_quantity: 2,
    status: 'ACTIVE',
    created_at: '2026-01-12 09:15:00'
  },
  {
    id: 'B003',
    isbn: '978-0262035613',
    title: 'Trí Tuệ Nhân Tạo & Machine Learning Hiện Đại',
    author: 'Andrew Ng',
    category: 'Trí tuệ nhân tạo',
    published_year: 2023,
    total_quantity: 4,
    available_quantity: 3,
    status: 'ACTIVE',
    created_at: '2026-02-01 10:00:00'
  },
  {
    id: 'B004',
    isbn: '978-0060731328',
    title: 'Kinh Tế Học Dành Cho Nhà Quản Trị',
    author: 'Steven Levitt',
    category: 'Kinh tế & Quản trị',
    published_year: 2021,
    total_quantity: 6,
    available_quantity: 5,
    status: 'ACTIVE',
    created_at: '2026-02-15 14:20:00'
  },
  {
    id: 'B005',
    isbn: '978-0671027032',
    title: 'Kỹ Năng Giao Tiếp & Thuyết Phục Đỉnh Cao',
    author: 'Dale Carnegie',
    category: 'Kỹ năng sống',
    published_year: 2022,
    total_quantity: 8,
    available_quantity: 7,
    status: 'ACTIVE',
    created_at: '2026-03-01 11:10:00'
  },
  {
    id: 'B006',
    isbn: '978-0262035612',
    title: 'Deep Learning & Thị Giác Máy Tính',
    author: 'Ian Goodfellow',
    category: 'Trí tuệ nhân tạo',
    published_year: 2022,
    total_quantity: 2,
    available_quantity: 0, // Hết sách để test ràng buộc tồn kho
    status: 'ACTIVE',
    created_at: '2026-03-05 16:45:00'
  }
];

const DEFAULT_READERS = [
  {
    id: 'R001',
    card_code: 'DG001',
    full_name: 'Trần Thị Ngọc Anh',
    phone: '0912345678',
    email: 'ngocanh.tran@gmail.com',
    status: 'ACTIVE',
    expired_at: getDateOffset(180), // Còn hạn 180 ngày
    created_at: '2026-01-01 08:00:00'
  },
  {
    id: 'R002',
    card_code: 'DG002',
    full_name: 'Nguyễn Văn Bình',
    phone: '0987654321',
    email: 'binh.nguyen@gmail.com',
    status: 'ACTIVE',
    expired_at: getDateOffset(90),
    created_at: '2026-01-05 09:30:00'
  },
  {
    id: 'R003',
    card_code: 'DG003',
    full_name: 'Lê Thị Hoa',
    phone: '0933221100',
    email: 'hoa.le@gmail.com',
    status: 'LOCKED', // Khóa thẻ để test BR-03
    expired_at: getDateOffset(60),
    created_at: '2026-01-10 10:20:00'
  },
  {
    id: 'R004',
    card_code: 'DG004',
    full_name: 'Phạm Minh Đức',
    phone: '0944556677',
    email: 'duc.pham@gmail.com',
    status: 'EXPIRED', // Hết hạn thẻ để test BR-03
    expired_at: getDateOffset(-10), // Hết hạn 10 ngày trước
    created_at: '2025-01-01 08:00:00'
  }
];

// Phiếu mượn Master
const DEFAULT_BORROW_SLIPS = [
  {
    id: 'SLIP001',
    slip_code: 'PM-20261110-001',
    reader_id: 'R001',
    borrow_date: getDateOffset(-10),
    due_date: getDateOffset(4),
    status: 'BORROWING',
    note: 'Độc giả mượn giáo trình học kỳ'
  },
  {
    id: 'SLIP002',
    slip_code: 'PM-20261101-002',
    reader_id: 'R002',
    borrow_date: getDateOffset(-22),
    due_date: getDateOffset(-8), // Quá hạn 8 ngày để test BR-03 và tính phạt
    status: 'OVERDUE',
    note: 'Đã gửi email nhắc hạn lần 1'
  },
  {
    id: 'SLIP003',
    slip_code: 'PM-20261015-003',
    reader_id: 'R001',
    borrow_date: getDateOffset(-40),
    due_date: getDateOffset(-26),
    status: 'COMPLETED',
    note: 'Đã hoàn tất trả đầy đủ'
  }
];

// Chi tiết phiếu mượn Detail (Cho phép nhiều sách và trả lẻ BR-04)
const DEFAULT_BORROW_DETAILS = [
  // Phiếu SLIP001 mượn 2 cuốn: B001 & B003
  {
    id: 'DET001',
    borrow_slip_id: 'SLIP001',
    book_id: 'B001',
    return_date: null,
    return_condition: null,
    fine_amount: 0,
    status: 'BORROWING'
  },
  {
    id: 'DET002',
    borrow_slip_id: 'SLIP001',
    book_id: 'B003',
    return_date: null,
    return_condition: null,
    fine_amount: 0,
    status: 'BORROWING'
  },
  // Phiếu SLIP002 mượn 1 cuốn: B002 (quá hạn)
  {
    id: 'DET003',
    borrow_slip_id: 'SLIP002',
    book_id: 'B002',
    return_date: null,
    return_condition: null,
    fine_amount: 0,
    status: 'BORROWING'
  },
  // Phiếu SLIP003 mượn 1 cuốn: B004 (đã trả)
  {
    id: 'DET004',
    borrow_slip_id: 'SLIP003',
    book_id: 'B004',
    return_date: getDateOffset(-27),
    return_condition: 'GOOD',
    fine_amount: 0,
    status: 'RETURNED'
  }
];

// ================= 2. QUẢN LÝ TRẠNG THÁI (LOCALSTORAGE) =================
let books = [];
let readers = [];
let borrowSlips = [];
let borrowDetails = [];
let currentCirculationFilter = 'all';

function loadData() {
  const sBooks = localStorage.getItem('smartlib_books_v2');
  const sReaders = localStorage.getItem('smartlib_readers_v2');
  const sSlips = localStorage.getItem('smartlib_slips_v2');
  const sDetails = localStorage.getItem('smartlib_details_v2');

  books = sBooks ? JSON.parse(sBooks) : JSON.parse(JSON.stringify(DEFAULT_BOOKS));
  readers = sReaders ? JSON.parse(sReaders) : JSON.parse(JSON.stringify(DEFAULT_READERS));
  borrowSlips = sSlips ? JSON.parse(sSlips) : JSON.parse(JSON.stringify(DEFAULT_BORROW_SLIPS));
  borrowDetails = sDetails ? JSON.parse(sDetails) : JSON.parse(JSON.stringify(DEFAULT_BORROW_DETAILS));

  // Tự động quét cập nhật trạng thái OVERDUE (Mô phỏng Cronjob 00:05 của Senior Dev)
  syncOverdueStatus();
  saveData();
}

function saveData() {
  localStorage.setItem('smartlib_books_v2', JSON.stringify(books));
  localStorage.setItem('smartlib_readers_v2', JSON.stringify(readers));
  localStorage.setItem('smartlib_slips_v2', JSON.stringify(borrowSlips));
  localStorage.setItem('smartlib_details_v2', JSON.stringify(borrowDetails));
}

function resetToDefault() {
  if (confirm('Khôi phục toàn bộ cơ sở dữ liệu mẫu ban đầu (Master/Detail)?')) {
    books = JSON.parse(JSON.stringify(DEFAULT_BOOKS));
    readers = JSON.parse(JSON.stringify(DEFAULT_READERS));
    borrowSlips = JSON.parse(JSON.stringify(DEFAULT_BORROW_SLIPS));
    borrowDetails = JSON.parse(JSON.stringify(DEFAULT_BORROW_DETAILS));
    syncOverdueStatus();
    saveData();
    renderAll();
    showToast('Đã khôi phục dữ liệu mẫu thành công!', 'success');
  }
}

// Mô phỏng Cronjob kiểm tra quá hạn
function syncOverdueStatus() {
  const today = new Date().toISOString().split('T')[0];
  borrowSlips.forEach(slip => {
    if (slip.status === 'COMPLETED') return;
    const slipDetails = borrowDetails.filter(d => d.borrow_slip_id === slip.id);
    const hasUnreturned = slipDetails.some(d => d.status === 'BORROWING');

    if (hasUnreturned && slip.due_date < today) {
      slip.status = 'OVERDUE';
    }
  });
}

// ================= 3. ĐIỀU HƯỚNG TABS =================
function switchTab(tabName) {
  const tabs = ['dashboard', 'books', 'readers', 'circulation', 'ai'];
  tabs.forEach(t => {
    const sec = document.getElementById(`section-${t}`);
    const btn = document.getElementById(`tab-${t}`);
    if (t === tabName) {
      sec?.classList.remove('hidden');
      btn?.classList.remove('text-slate-600', 'hover:bg-slate-50');
      btn?.classList.add('text-sky-600', 'bg-sky-50');
    } else {
      sec?.classList.add('hidden');
      btn?.classList.remove('text-sky-600', 'bg-sky-50');
      btn?.classList.add('text-slate-600', 'hover:bg-slate-50');
    }
  });
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderBooks();
  renderReaders();
  renderCirculation();
}

// ================= 4. DASHBOARD =================
function renderDashboard() {
  const totalBooks = books.length;
  const totalCopies = books.reduce((s, b) => s + Number(b.total_quantity), 0);
  const availableCopies = books.reduce((s, b) => s + Number(b.available_quantity), 0);

  const activeSlips = borrowSlips.filter(s => s.status === 'BORROWING' || s.status === 'PARTIAL_RETURNED' || s.status === 'OVERDUE');
  const borrowingDetails = borrowDetails.filter(d => d.status === 'BORROWING');
  const overdueSlips = borrowSlips.filter(s => s.status === 'OVERDUE');

  document.getElementById('statTotalBooks').textContent = totalBooks;
  document.getElementById('statTotalCopies').textContent = `${totalCopies} bản in lưu kho`;
  document.getElementById('statAvailableBooks').textContent = availableCopies;
  document.getElementById('statBorrowingSlips').textContent = activeSlips.length;
  document.getElementById('statBorrowingBooks').textContent = `${borrowingDetails.length} cuốn sách chưa trả`;
  document.getElementById('statOverdueSlips').textContent = overdueSlips.length;

  // Recent slips table preview
  const tbody = document.getElementById('dashboardRecentBorrows');
  tbody.innerHTML = '';
  const recent = [...borrowSlips].reverse().slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-400 text-xs">Chưa có phiếu mượn nào</td></tr>`;
    return;
  }

  recent.forEach(slip => {
    const reader = readers.find(r => r.id === slip.reader_id) || { full_name: slip.reader_id };
    const details = borrowDetails.filter(d => d.borrow_slip_id === slip.id);
    const returnedCount = details.filter(d => d.status === 'RETURNED').length;

    let statusBadge = getSlipStatusBadge(slip.status);

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition text-xs';
    tr.innerHTML = `
      <td class="px-3 py-2.5 font-semibold text-slate-700">${slip.slip_code}</td>
      <td class="px-3 py-2.5 text-slate-800 font-medium">${reader.full_name}</td>
      <td class="px-3 py-2.5 text-center text-slate-600">${returnedCount}/${details.length} cuốn</td>
      <td class="px-3 py-2.5 text-slate-500">${slip.due_date}</td>
      <td class="px-3 py-2.5">${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

function getSlipStatusBadge(status) {
  switch (status) {
    case 'COMPLETED':
      return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i> Đã trả hết</span>`;
    case 'PARTIAL_RETURNED':
      return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700"><i class="fa-solid fa-arrow-turn-down"></i> Trả một phần</span>`;
    case 'OVERDUE':
      return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i> Quá hạn</span>`;
    case 'BORROWING':
    default:
      return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700"><i class="fa-regular fa-clock"></i> Đang mượn</span>`;
  }
}

// ================= 5. QUẢN LÝ SÁCH (BOOK MANAGEMENT) =================
function renderBooks() {
  const tbody = document.getElementById('booksTableBody');
  const kw = (document.getElementById('searchBookInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('filterCategory')?.value || '';

  const filtered = books.filter(b => {
    const match = b.title.toLowerCase().includes(kw) ||
                  b.author.toLowerCase().includes(kw) ||
                  b.isbn.toLowerCase().includes(kw) ||
                  b.category.toLowerCase().includes(kw);
    const matchCat = cat ? b.category === cat : true;
    return match && matchCat;
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Không tìm thấy đầu sách phù hợp</td></tr>`;
    return;
  }

  filtered.forEach(b => {
    const stockBadge = b.available_quantity > 0
      ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">${b.available_quantity} / ${b.total_quantity}</span>`
      : `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Hết sách (0/${b.total_quantity})</span>`;

    const statusBadge = b.status === 'ACTIVE'
      ? `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-600">Lưu hành</span>`
      : `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500">Ngừng lưu hành</span>`;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/70 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold text-sky-600 text-xs">${b.isbn}</td>
      <td class="px-4 py-3 font-medium text-slate-900">${b.title}</td>
      <td class="px-4 py-3 text-slate-600">${b.author}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-lg text-xs bg-slate-100 text-slate-600">${b.category}</span></td>
      <td class="px-4 py-3 text-center text-slate-500">${b.published_year || '-'}</td>
      <td class="px-4 py-3 text-center">${stockBadge}</td>
      <td class="px-4 py-3 text-center">${statusBadge}</td>
      <td class="px-4 py-3 text-center space-x-1">
        <button onclick="editBook('${b.id}')" class="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition" title="Sửa sách"><i class="fa-solid fa-pen-to-square"></i></button>
        <button onclick="toggleBookStatus('${b.id}')" class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Đổi trạng thái lưu hành"><i class="fa-solid fa-box-archive"></i></button>
        <button onclick="deleteBook('${b.id}')" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Xóa sách"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openBookModal(isEdit = false) {
  document.getElementById('bookModalTitle').textContent = isEdit ? 'Chỉnh sửa đầu sách' : 'Thêm đầu sách mới';
  document.getElementById('bookModal').classList.remove('hidden');
}

function closeBookModal() {
  document.getElementById('bookModal').classList.add('hidden');
  document.getElementById('bookForm').reset();
  document.getElementById('bookFormId').value = '';
}

function editBook(id) {
  const b = books.find(x => x.id === id);
  if (!b) return;

  document.getElementById('bookFormId').value = b.id;
  document.getElementById('bookFormIsbn').value = b.isbn;
  document.getElementById('bookFormStatus').value = b.status;
  document.getElementById('bookFormTitle').value = b.title;
  document.getElementById('bookFormAuthor').value = b.author;
  document.getElementById('bookFormCategory').value = b.category;
  document.getElementById('bookFormYear').value = b.published_year || 2023;
  document.getElementById('bookFormTotalQty').value = b.total_quantity;

  openBookModal(true);
}

function toggleBookStatus(id) {
  const b = books.find(x => x.id === id);
  if (!b) return;
  b.status = b.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
  saveData();
  renderAll();
  showToast(`Đã chuyển trạng thái sách [${b.title}] sang: ${b.status}`, 'info');
}

function handleSaveBook(e) {
  e.preventDefault();
  const id = document.getElementById('bookFormId').value;
  const isbn = document.getElementById('bookFormIsbn').value.trim();
  const status = document.getElementById('bookFormStatus').value;
  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const category = document.getElementById('bookFormCategory').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const totalQty = Number(document.getElementById('bookFormTotalQty').value);

  if (id) {
    const idx = books.findIndex(b => b.id === id);
    if (idx !== -1) {
      const diff = totalQty - books[idx].total_quantity;
      books[idx].isbn = isbn;
      books[idx].status = status;
      books[idx].title = title;
      books[idx].author = author;
      books[idx].category = category;
      books[idx].published_year = year;
      books[idx].total_quantity = totalQty;
      books[idx].available_quantity = Math.max(0, books[idx].available_quantity + diff);
      showToast('Cập nhật sách thành công!', 'success');
    }
  } else {
    if (books.some(b => b.isbn.toLowerCase() === isbn.toLowerCase())) {
      showToast(`Mã ISBN "${isbn}" đã tồn tại! Vui lòng kiểm tra lại.`, 'error');
      return;
    }
    const newId = 'B' + String(books.length + 1).padStart(3, '0');
    books.push({
      id: newId,
      isbn,
      title,
      author,
      category,
      published_year: year,
      total_quantity: totalQty,
      available_quantity: totalQty,
      status,
      created_at: new Date().toISOString()
    });
    showToast('Thêm đầu sách mới thành công!', 'success');
  }

  saveData();
  renderAll();
  closeBookModal();
}

function deleteBook(id) {
  const isBorrowing = borrowDetails.some(d => d.book_id === id && d.status === 'BORROWING');
  if (isBorrowing) {
    showToast('Không thể xóa sách này vì đang có độc giả mượn chưa trả!', 'error');
    return;
  }

  if (confirm(`Xác nhận xóa cuốn sách này khỏi kho dữ liệu?`)) {
    books = books.filter(b => b.id !== id);
    saveData();
    renderAll();
    showToast('Đã xóa sách khỏi kho!', 'success');
  }
}

// ================= 6. QUẢN LÝ ĐỘC GIẢ (READER MANAGEMENT) =================
function renderReaders() {
  const tbody = document.getElementById('readersTableBody');
  const kw = (document.getElementById('searchReaderInput')?.value || '').toLowerCase().trim();

  const filtered = readers.filter(r =>
    r.full_name.toLowerCase().includes(kw) ||
    r.card_code.toLowerCase().includes(kw) ||
    r.phone.includes(kw) ||
    (r.email && r.email.toLowerCase().includes(kw))
  );

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Không tìm thấy độc giả</td></tr>`;
    return;
  }

  filtered.forEach(r => {
    // Đếm số sách đang mượn
    const readerSlips = borrowSlips.filter(s => s.reader_id === r.id && s.status !== 'COMPLETED');
    const borrowingBooksCount = borrowDetails.filter(d =>
      readerSlips.some(s => s.id === d.borrow_slip_id) && d.status === 'BORROWING'
    ).length;

    let statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Hoạt động</span>`;
    if (r.status === 'LOCKED') {
      statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Khóa thẻ</span>`;
    } else if (r.status === 'EXPIRED' || r.expired_at < TODAY) {
      statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Hết hạn</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/70 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold text-slate-700">${r.card_code}</td>
      <td class="px-4 py-3 font-medium text-slate-900">${r.full_name}</td>
      <td class="px-4 py-3 text-slate-600">${r.phone}</td>
      <td class="px-4 py-3 text-slate-600">${r.email || '-'}</td>
      <td class="px-4 py-3 text-center text-xs ${r.expired_at < TODAY ? 'text-rose-600 font-bold' : 'text-slate-500'}">${r.expired_at}</td>
      <td class="px-4 py-3 text-center">${statusBadge}</td>
      <td class="px-4 py-3 text-center">
        <span class="px-2 py-0.5 rounded-full text-xs font-bold ${borrowingBooksCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}">
          ${borrowingBooksCount} cuốn
        </span>
      </td>
      <td class="px-4 py-3 text-center space-x-1">
        <button onclick="toggleReaderLock('${r.id}')" class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Khóa / Mở thẻ"><i class="fa-solid fa-lock"></i></button>
        <button onclick="renewReaderCard('${r.id}')" class="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Gia hạn thẻ thêm 1 năm"><i class="fa-solid fa-calendar-plus"></i></button>
        <button onclick="editReader('${r.id}')" class="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition" title="Sửa độc giả"><i class="fa-solid fa-pen-to-square"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openReaderModal(isEdit = false) {
  document.getElementById('readerModalTitle').textContent = isEdit ? 'Cập nhật thẻ độc giả' : 'Đăng ký thẻ độc giả mới';
  document.getElementById('readerModal').classList.remove('hidden');
}

function closeReaderModal() {
  document.getElementById('readerModal').classList.add('hidden');
  document.getElementById('readerForm').reset();
  document.getElementById('readerFormId').value = '';
}

function editReader(id) {
  const r = readers.find(x => x.id === id);
  if (!r) return;

  document.getElementById('readerFormId').value = r.id;
  document.getElementById('readerFormCode').value = r.card_code;
  document.getElementById('readerFormStatus').value = r.status;
  document.getElementById('readerFormName').value = r.full_name;
  document.getElementById('readerFormPhone').value = r.phone;
  document.getElementById('readerFormExpiredAt').value = r.expired_at;
  document.getElementById('readerFormEmail').value = r.email || '';

  openReaderModal(true);
}

function toggleReaderLock(id) {
  const r = readers.find(x => x.id === id);
  if (!r) return;
  r.status = r.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
  saveData();
  renderAll();
  showToast(`Thẻ độc giả [${r.card_code}] hiện chuyển sang: ${r.status}`, 'info');
}

function renewReaderCard(id) {
  const r = readers.find(x => x.id === id);
  if (!r) return;
  // Gia hạn thêm 365 ngày
  const curr = new Date(r.expired_at < TODAY ? TODAY : r.expired_at);
  curr.setDate(curr.getDate() + 365);
  r.expired_at = curr.toISOString().split('T')[0];
  if (r.status === 'EXPIRED') r.status = 'ACTIVE';
  saveData();
  renderAll();
  showToast(`Gia hạn thành công thẻ [${r.card_code}] đến ngày ${r.expired_at}!`, 'success');
}

function handleSaveReader(e) {
  e.preventDefault();
  const id = document.getElementById('readerFormId').value;
  const card_code = document.getElementById('readerFormCode').value.trim();
  const status = document.getElementById('readerFormStatus').value;
  const full_name = document.getElementById('readerFormName').value.trim();
  const phone = document.getElementById('readerFormPhone').value.trim();
  const expired_at = document.getElementById('readerFormExpiredAt').value;
  const email = document.getElementById('readerFormEmail').value.trim();

  if (id) {
    const idx = readers.findIndex(r => r.id === id);
    if (idx !== -1) {
      readers[idx] = { ...readers[idx], card_code, status, full_name, phone, expired_at, email };
      showToast('Cập nhật độc giả thành công!', 'success');
    }
  } else {
    if (readers.some(r => r.card_code.toLowerCase() === card_code.toLowerCase())) {
      showToast(`Mã thẻ "${card_code}" đã tồn tại!`, 'error');
      return;
    }
    const newId = 'R' + String(readers.length + 1).padStart(3, '0');
    readers.push({
      id: newId,
      card_code,
      full_name,
      phone,
      email,
      status,
      expired_at,
      created_at: new Date().toISOString()
    });
    showToast('Đăng ký thẻ độc giả mới thành công!', 'success');
  }

  saveData();
  renderAll();
  closeReaderModal();
}

// ================= 7. QUẢN LÝ MƯỢN - TRẢ (CIRCULATION MANAGEMENT - BR-01 ĐẾN BR-04) =================
function filterCirculationStatus(status) {
  currentCirculationFilter = status;
  ['all', 'BORROWING', 'PARTIAL_RETURNED', 'OVERDUE', 'COMPLETED'].forEach(st => {
    const btn = document.getElementById(`filter-circ-${st}`);
    if (btn) {
      btn.className = (st === status)
        ? 'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white'
        : 'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
    }
  });
  renderCirculation();
}

function renderCirculation() {
  const tbody = document.getElementById('circulationTableBody');
  syncOverdueStatus();

  const filtered = borrowSlips.filter(slip => {
    if (currentCirculationFilter === 'all') return true;
    return slip.status === currentCirculationFilter;
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Không có phiếu mượn nào trong mục này</td></tr>`;
    return;
  }

  filtered.forEach(slip => {
    const reader = readers.find(r => r.id === slip.reader_id) || { full_name: slip.reader_id, card_code: '' };
    const details = borrowDetails.filter(d => d.borrow_slip_id === slip.id);
    const returnedCount = details.filter(d => d.status === 'RETURNED').length;
    const isCompleted = slip.status === 'COMPLETED';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/70 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold text-slate-700">${slip.slip_code}</td>
      <td class="px-4 py-3">
        <div class="font-medium text-slate-900">${reader.full_name}</div>
        <div class="text-[11px] text-slate-400">Thẻ: ${reader.card_code}</div>
      </td>
      <td class="px-4 py-3 text-center text-slate-600 text-xs">${slip.borrow_date}</td>
      <td class="px-4 py-3 text-center text-xs font-medium ${slip.status === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-700'}">${slip.due_date}</td>
      <td class="px-4 py-3 text-center">
        <span class="px-2 py-0.5 rounded text-xs font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-50 text-sky-600'}">
          ${returnedCount} / ${details.length} cuốn
        </span>
      </td>
      <td class="px-4 py-3 text-center">${getSlipStatusBadge(slip.status)}</td>
      <td class="px-4 py-3 text-center">
        <button onclick="openSlipDetailModal('${slip.id}')" class="bg-sky-50 hover:bg-blue-100 text-sky-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition border border-sky-200 flex items-center gap-1.5 mx-auto">
          <i class="fa-solid fa-receipt"></i> Xem & Trả sách
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openBorrowModal() {
  const readerSelect = document.getElementById('borrowReaderSelect');
  readerSelect.innerHTML = '<option value="">-- Chọn độc giả mượn --</option>';

  readers.forEach(r => {
    let warning = '';
    let isDisabled = false;
    if (r.status === 'LOCKED') {
      warning = ' (Thẻ đang khóa)';
      isDisabled = true;
    } else if (r.status === 'EXPIRED' || r.expired_at < TODAY) {
      warning = ' (Thẻ đã hết hạn)';
      isDisabled = true;
    }

    readerSelect.innerHTML += `<option value="${r.id}" ${isDisabled ? 'disabled' : ''}>${r.card_code} - ${r.full_name}${warning}</option>`;
  });

  // Render checklist sách khả dụng
  renderBorrowBookChecklist();

  document.getElementById('borrowDateInput').value = TODAY;
  document.getElementById('borrowDueDateInput').value = getDateOffset(14); // BR-02: 14 ngày
  document.getElementById('borrowNoteInput').value = '';
  document.getElementById('readerBorrowQuotaAlert').innerHTML = '';

  document.getElementById('borrowModal').classList.remove('hidden');
}

function closeBorrowModal() {
  document.getElementById('borrowModal').classList.add('hidden');
  document.getElementById('borrowForm').reset();
}

function renderBorrowBookChecklist() {
  const container = document.getElementById('borrowBookChecklist');
  container.innerHTML = '';

  const activeBooks = books.filter(b => b.status === 'ACTIVE');
  if (activeBooks.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 p-2">Không có đầu sách nào trong kho</p>';
    return;
  }

  activeBooks.forEach(b => {
    const isOutOfStock = b.available_quantity <= 0;
    const div = document.createElement('label');
    div.className = `flex items-center justify-between p-2 rounded-lg transition cursor-pointer ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:bg-white'}`;
    div.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="checkbox" name="borrow_books" value="${b.id}" ${isOutOfStock ? 'disabled' : ''} onchange="updateSelectedBooksCounter()" class="rounded text-sky-600 focus:ring-sky-500">
        <div>
          <span class="font-medium text-slate-800 text-xs">${b.title}</span>
          <span class="text-[10px] text-slate-400 block">${b.isbn} - Tác giả: ${b.author}</span>
        </div>
      </div>
      <span class="text-xs font-semibold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}">
        ${isOutOfStock ? 'Hết sách' : `Còn ${b.available_quantity} bản`}
      </span>
    `;
    container.appendChild(div);
  });

  updateSelectedBooksCounter();
}

function handleReaderSelectionChange() {
  const readerId = document.getElementById('borrowReaderSelect').value;
  const alertEl = document.getElementById('readerBorrowQuotaAlert');
  if (!readerId) {
    alertEl.innerHTML = '';
    return;
  }

  const reader = readers.find(r => r.id === readerId);
  if (!reader) return;

  // Tính số sách đang nợ chưa trả
  const activeSlips = borrowSlips.filter(s => s.reader_id === readerId && s.status !== 'COMPLETED');
  const borrowingDetails = borrowDetails.filter(d =>
    activeSlips.some(s => s.id === d.borrow_slip_id) && d.status === 'BORROWING'
  );
  const currentBorrowed = borrowingDetails.length;
  const maxQuota = 5; // BR-01
  const remainingQuota = Math.max(0, maxQuota - currentBorrowed);

  // Kiểm tra BR-03: Có sách quá hạn không
  const hasOverdue = activeSlips.some(s => s.status === 'OVERDUE' || (s.due_date < TODAY));

  if (hasOverdue) {
    alertEl.innerHTML = `<span class="text-rose-600 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Từ chối: Độc giả đang có sách quá hạn chưa trả!</span>`;
  } else if (remainingQuota === 0) {
    alertEl.innerHTML = `<span class="text-rose-600 font-bold"><i class="fa-solid fa-circle-xmark"></i> Độc giả đã chạm ngưỡng tối đa ${maxQuota} cuốn! Đã đạt giới hạn tối đa.</span>`;
  } else {
    alertEl.innerHTML = `<span class="text-emerald-700"><i class="fa-solid fa-circle-check"></i> Đang mượn: <strong>${currentBorrowed}/${maxQuota} cuốn</strong>. Được mượn thêm tối đa: <strong>${remainingQuota} cuốn</strong>.</span>`;
  }
}

function updateSelectedBooksCounter() {
  const checked = document.querySelectorAll('input[name="borrow_books"]:checked');
  const badge = document.getElementById('selectedBooksCountBadge');
  badge.textContent = `Đã chọn: ${checked.length}/5`;
  if (checked.length > 5) {
    badge.className = 'text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full';
  } else {
    badge.className = 'text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full';
  }
}

function handleCreateBorrow(e) {
  e.preventDefault();
  const readerId = document.getElementById('borrowReaderSelect').value;
  const borrowDate = document.getElementById('borrowDateInput').value;
  const dueDate = document.getElementById('borrowDueDateInput').value;
  const note = document.getElementById('borrowNoteInput').value.trim();

  const selectedBookCheckboxes = document.querySelectorAll('input[name="borrow_books"]:checked');
  const selectedBookIds = Array.from(selectedBookCheckboxes).map(cb => cb.value);

  if (!readerId) {
    showToast('Vui lòng chọn độc giả!', 'error');
    return;
  }
  if (selectedBookIds.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 cuốn sách cần mượn!', 'error');
    return;
  }

  // VALIDATION BR-03: Thẻ độc giả
  const reader = readers.find(r => r.id === readerId);
  if (!reader || reader.status === 'LOCKED') {
    showToast('Từ chối: Thẻ độc giả đang bị KHÓA!', 'error');
    return;
  }
  if (reader.status === 'EXPIRED' || reader.expired_at < TODAY) {
    showToast('Từ chối: Thẻ độc giả đã HẾT HẠN!', 'error');
    return;
  }

  // VALIDATION BR-03: Độc giả có sách quá hạn không
  const activeSlips = borrowSlips.filter(s => s.reader_id === readerId && s.status !== 'COMPLETED');
  const hasOverdue = activeSlips.some(s => s.status === 'OVERDUE' || s.due_date < TODAY);
  if (hasOverdue) {
    showToast('Từ chối: Độc giả đang có sách QUÁ HẠN chưa trả!', 'error');
    return;
  }

  // VALIDATION BR-01: Kiểm tra hạn mức mượn tối đa 5 cuốn
  const currentBorrowed = borrowDetails.filter(d =>
    activeSlips.some(s => s.id === d.borrow_slip_id) && d.status === 'BORROWING'
  ).length;

  if (currentBorrowed + selectedBookIds.length > 5) {
    showToast(`Từ chối: Tổng số sách (${currentBorrowed} đang mượn + ${selectedBookIds.length} sắp mượn) vượt quá giới hạn 5 cuốn!`, 'error');
    return;
  }

  // VALIDATION ATOMIC TỒN KHO: Kiểm tra tồn kho của từng cuốn sách
  for (const bookId of selectedBookIds) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available_quantity <= 0) {
      showToast(`Sách "${book ? book.title : bookId}" vừa hết trong kho! Vui lòng chọn sách khác.`, 'error');
      return;
    }
  }

  // ================= BẮT ĐẦU TRANSACTION MƯỢN SÁCH =================
  // 1. Tạo bản ghi borrow_slips (Master)
  const slipSeq = borrowSlips.length + 1;
  const slipId = 'SLIP' + String(slipSeq).padStart(3, '0');
  const slipCode = `PM-${borrowDate.replace(/-/g, '')}-${String(slipSeq).padStart(3, '0')}`;

  const newSlip = {
    id: slipId,
    slip_code: slipCode,
    reader_id: readerId,
    borrow_date: borrowDate,
    due_date: dueDate,
    status: 'BORROWING',
    note: note || 'Không có ghi chú'
  };

  // 2. Tạo các bản ghi borrow_details & Atomic Update trừ available_quantity
  selectedBookIds.forEach((bookId, idx) => {
    const detailId = `DET${String(borrowDetails.length + idx + 1).padStart(3, '0')}`;
    borrowDetails.push({
      id: detailId,
      borrow_slip_id: slipId,
      book_id: bookId,
      return_date: null,
      return_condition: null,
      fine_amount: 0,
      status: 'BORROWING'
    });

    // Trừ tồn kho khả dụng
    const book = books.find(b => b.id === bookId);
    if (book) book.available_quantity -= 1;
  });

  borrowSlips.unshift(newSlip);
  saveData();
  renderAll();
  closeBorrowModal();

  showToast(`Tạo phiếu mượn [${slipCode}] thành công với ${selectedBookIds.length} cuốn sách!`, 'success');
}

// ================= 8. CHI TIẾT PHIẾU & XỬ LÝ TRẢ LẺ (BR-04) =================
let currentViewingSlipId = null;

function openSlipDetailModal(slipId) {
  currentViewingSlipId = slipId;
  const slip = borrowSlips.find(s => s.id === slipId);
  if (!slip) return;

  const reader = readers.find(r => r.id === slip.reader_id) || { full_name: slip.reader_id, card_code: '', phone: '' };

  // Render Header Info
  const headerCard = document.getElementById('slipHeaderInfoCard');
  headerCard.innerHTML = `
    <div>
      <span class="text-slate-400 block">Mã phiếu:</span>
      <span class="font-bold text-slate-800">${slip.slip_code}</span>
    </div>
    <div>
      <span class="text-slate-400 block">Độc giả:</span>
      <span class="font-bold text-slate-800">${reader.full_name} (${reader.card_code})</span>
    </div>
    <div>
      <span class="text-slate-400 block">Ngày mượn - Hạn trả:</span>
      <span class="font-medium text-slate-700">${slip.borrow_date} $\rightarrow$ ${slip.due_date}</span>
    </div>
    <div>
      <span class="text-slate-400 block">Trạng thái phiếu:</span>
      <div>${getSlipStatusBadge(slip.status)}</div>
    </div>
  `;

  renderSlipBooksDetailTbody();
  document.getElementById('slipDetailModal').classList.remove('hidden');
}

function closeSlipDetailModal() {
  document.getElementById('slipDetailModal').classList.add('hidden');
  currentViewingSlipId = null;
  renderAll();
}

function renderSlipBooksDetailTbody() {
  const tbody = document.getElementById('slipBooksDetailTbody');
  const slip = borrowSlips.find(s => s.id === currentViewingSlipId);
  if (!slip) return;

  const details = borrowDetails.filter(d => d.borrow_slip_id === slip.id);
  tbody.innerHTML = '';

  const isOverdue = slip.due_date < TODAY;
  const overdueDays = isOverdue ? Math.ceil(Math.abs(new Date(TODAY) - new Date(slip.due_date)) / (1000 * 60 * 60 * 24)) : 0;

  details.forEach(det => {
    const book = books.find(b => b.id === det.book_id) || { title: det.book_id, isbn: '' };
    const isReturned = det.status === 'RETURNED';

    let actionCell = '';
    if (isReturned) {
      actionCell = `<span class="text-emerald-600 font-medium text-[11px]"><i class="fa-solid fa-check-double"></i> Đã hoàn tất</span>`;
    } else {
      actionCell = `
        <button onclick="handleIndividualReturn('${det.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-lg text-xs transition shadow-sm flex items-center gap-1 mx-auto">
          <i class="fa-solid fa-arrow-turn-down"></i> Trả cuốn này
        </button>
      `;
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-3 py-2.5">
        <div class="font-medium text-slate-800">${book.title}</div>
        <div class="text-[10px] text-slate-400">ISBN: ${book.isbn}</div>
      </td>
      <td class="px-3 py-2.5 text-center">
        ${isReturned
          ? '<span class="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">Đã trả</span>'
          : (isOverdue
              ? `<span class="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] animate-pulse">Quá hạn (${overdueDays} ngày)</span>`
              : '<span class="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">Đang mượn</span>')
        }
      </td>
      <td class="px-3 py-2.5 text-center text-slate-600">${det.return_date || '-'}</td>
      <td class="px-3 py-2.5 text-center">
        ${det.return_condition
          ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${det.return_condition === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : (det.return_condition === 'DAMAGED' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')}">${det.return_condition}</span>`
          : '-'
        }
      </td>
      <td class="px-3 py-2.5 text-center font-medium ${det.fine_amount > 0 ? 'text-rose-600' : 'text-slate-500'}">
        ${det.fine_amount > 0 ? `${det.fine_amount.toLocaleString('vi-VN')} đ` : '0 đ'}
      </td>
      <td class="px-3 py-2.5 text-center">${actionCell}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Xử lý trả lẻ từng cuốn theo Quy trình 2 (Return Flow)
function handleIndividualReturn(detailId) {
  const det = borrowDetails.find(d => d.id === detailId);
  if (!det || det.status === 'RETURNED') return;

  const slip = borrowSlips.find(s => s.id === det.borrow_slip_id);
  const book = books.find(b => b.id === det.book_id);

  // Tính phạt quá hạn nếu có
  const isOverdue = slip.due_date < TODAY;
  let overdueFine = 0;
  if (isOverdue) {
    const diffDays = Math.ceil(Math.abs(new Date(TODAY) - new Date(slip.due_date)) / (1000 * 60 * 60 * 24));
    overdueFine = diffDays * 5000; // 5.000 VNĐ / ngày trễ
  }

  // Hỏi tình trạng sách: 1. GOOD (Tốt), 2. DAMAGED (Hư hỏng), 3. LOST (Mất)
  const conditionInput = prompt(
    `Chọn tình trạng sách khi trả cho cuốn "${book.title}":\n` +
    `1. GOOD - Sách nguyên vẹn, tốt\n` +
    `2. DAMAGED - Sách bị rách/hư hỏng (Phụ thu 50.000 đ)\n` +
    `3. LOST - Sách bị mất (Đền bù 150.000 đ)\n\n` +
    `Nhập 1, 2 hoặc 3 (Mặc định: 1):`, '1'
  );

  if (conditionInput === null) return; // Người dùng ấn Hủy

  let condition = 'GOOD';
  let damageFine = 0;

  if (conditionInput === '2') {
    condition = 'DAMAGED';
    damageFine = 50000;
  } else if (conditionInput === '3') {
    condition = 'LOST';
    damageFine = 150000;
  }

  const totalFine = overdueFine + damageFine;

  // Xác nhận thu tiền phạt nếu có
  if (totalFine > 0) {
    const confirmFine = confirm(
      `Thông báo thu phí:\n` +
      `- Phạt quá hạn: ${overdueFine.toLocaleString('vi-VN')} đ\n` +
      `- Đền bù hư hại/mất: ${damageFine.toLocaleString('vi-VN')} đ\n` +
      `--------------------------------\n` +
      `TỔNG PHÍ PHẢT: ${totalFine.toLocaleString('vi-VN')} đ\n\n` +
      `Xác nhận độc giả đã thanh toán và hoàn tất trả sách?`
    );
    if (!confirmFine) return;
  }

  // ================= BẮT ĐẦU TRANSACTION TRẢ SÁCH =================
  det.return_date = TODAY;
  det.return_condition = condition;
  det.fine_amount = totalFine;
  det.status = 'RETURNED';

  // Cập nhật tồn kho theo Quy trình 2
  if (condition !== 'LOST') {
    // Sách còn nguyên vẹn hoặc sửa chữa được -> Tăng available_quantity
    book.available_quantity = Math.min(book.total_quantity, book.available_quantity + 1);
  } else {
    // Sách bị mất (LOST) -> Giảm tổng số sách sở hữu
    book.total_quantity = Math.max(0, book.total_quantity - 1);
  }

  // Cập nhật trạng thái Master Slip
  const allSlipDetails = borrowDetails.filter(d => d.borrow_slip_id === slip.id);
  const remainingBorrowing = allSlipDetails.filter(d => d.status === 'BORROWING');

  if (remainingBorrowing.length === 0) {
    slip.status = 'COMPLETED'; // Đã trả hết
  } else {
    slip.status = 'PARTIAL_RETURNED'; // Còn sách chưa trả
  }

  saveData();
  openSlipDetailModal(slip.id); // Re-render modal
  showToast(`Đã ghi nhận trả cuốn "${book.title}" thành công!`, 'success');
}

// ================= 9. TRỢ LÝ AI (AI ASSISTANT) =================
function setQueryPrompt(text) {
  document.getElementById('aiQueryInput').value = text;
  handleAISearch();
}

function handleAISearch() {
  const query = document.getElementById('aiQueryInput').value.trim();
  if (!query) {
    showToast('Vui lòng nhập câu hỏi cần tra cứu!', 'info');
    return;
  }

  const resContainer = document.getElementById('aiResponseContainer');
  const resContent = document.getElementById('aiResponseContent');
  const recBooks = document.getElementById('aiRecommendedBooks');

  resContainer.classList.remove('hidden');
  resContent.innerHTML = `<div class="flex items-center gap-2 text-sky-600"><i class="fa-solid fa-spinner fa-spin"></i> Hệ thống đang đối chiếu danh mục sách...</div>`;
  recBooks.innerHTML = '';

  setTimeout(() => {
    const q = query.toLowerCase();
    const matched = books.filter(b => {
      if (q.includes('cntt') || q.includes('lập trình') || q.includes('code')) return b.category === 'CNTT & Lập trình';
      if (q.includes('ai') || q.includes('trí tuệ nhân tạo') || q.includes('machine learning')) return b.category === 'Trí tuệ nhân tạo';
      if (q.includes('kinh tế') || q.includes('quản trị') || q.includes('kinh doanh')) return b.category === 'Kinh tế & Quản trị';
      if (q.includes('kỹ năng') || q.includes('giao tiếp')) return b.category === 'Kỹ năng sống';
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q);
    });

    const displayBooks = matched.length > 0 ? matched : books.slice(0, 3);

    resContent.innerHTML = `
      <p>Xin chào! Dựa trên câu hỏi của bạn: <em>"${query}"</em>, Hệ thống thư viện đề xuất các tài liệu phù hợp trong danh mục lưu kho:</p>
      <ul class="list-disc pl-5 space-y-1 text-slate-600 text-xs mt-2">
        <li><strong>Chuyên mục nhận diện:</strong> <code>${displayBooks[0]?.category || 'Tổng hợp'}</code></li>
        <li><strong>Số lượng tài liệu phù hợp:</strong> ${displayBooks.length} đầu sách đang lưu hành.</li>
        <li><strong>Lời khuyên thủ thư:</strong> Bạn có thể chọn mượn tối đa 5 cuốn trong cùng 1 phiếu mượn (tối đa 5 cuốn, hỗ trợ trả lẻ từng cuốn).</li>
      </ul>
    `;

    recBooks.innerHTML = '';
    displayBooks.forEach(b => {
      const card = document.createElement('div');
      card.className = 'bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">${b.category}</span>
          <h4 class="font-bold text-slate-800 text-sm mt-1.5">${b.title}</h4>
          <p class="text-xs text-slate-500">Tác giả: ${b.author} | ISBN: ${b.isbn}</p>
        </div>
        <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
          <span class="${b.available_quantity > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}">
            ${b.available_quantity > 0 ? `Còn ${b.available_quantity} bản` : 'Hết sách'}
          </span>
          <button onclick="quickBorrowFromAI('${b.id}')" ${b.available_quantity <= 0 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg ${b.available_quantity > 0 ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} transition text-xs font-medium">
            Mượn ngay
          </button>
        </div>
      `;
      recBooks.appendChild(card);
    });
  }, 400);
}

function quickBorrowFromAI(bookId) {
  switchTab('circulation');
  openBorrowModal();
  const cb = document.querySelector(`input[name="borrow_books"][value="${bookId}"]`);
  if (cb && !cb.disabled) {
    cb.checked = true;
    updateSelectedBooksCounter();
  }
}

// ================= 10. TOAST THÔNG BÁO =================
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  toastMsg.textContent = message;

  if (type === 'success') {
    toastIcon.className = 'fa-solid fa-circle-check text-emerald-400';
  } else if (type === 'error') {
    toastIcon.className = 'fa-solid fa-circle-xmark text-rose-400';
  } else {
    toastIcon.className = 'fa-solid fa-circle-info text-blue-400';
  }

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// ================= KHỞI CHẠY =================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderAll();

  document.getElementById('btnResetData')?.addEventListener('click', resetToDefault);
  document.getElementById('searchBookInput')?.addEventListener('input', renderBooks);
  document.getElementById('filterCategory')?.addEventListener('change', renderBooks);
  document.getElementById('searchReaderInput')?.addEventListener('input', renderReaders);

  document.getElementById('aiQueryInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAISearch();
  });
});
