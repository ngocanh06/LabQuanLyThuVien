# Hệ Thống Quản Lý Thư Viện Thông Minh (SmartLib AI)
**Bài thực hành (Lab): Phân tích, Thiết kế và Xây dựng Hệ thống Quản lý Thư viện Ứng dụng Công cụ AI**

---

## Thông tin sinh viên
* **Họ và tên:** Trần Thị Ngọc Anh
* **Mã số sinh viên (MSSV):** 29209243814
* **Đơn vị:** Khoa Công nghệ Thông tin

---

## Tính năng nổi bật của ứng dụng
1. **Bảng điều khiển (Dashboard):** Thống kê số lượng đầu sách, tồn kho thực tế, số lượt mượn đang diễn ra và số lượt quá hạn.
2. **Quản lý Sách:** Thêm, sửa, xóa, tìm kiếm đa tiêu chí theo tên sách, tác giả, thể loại. Kiểm soát chính xác số lượng tồn kho khả dụng.
3. **Quản lý Độc giả:** Quản lý thông tin thẻ thư viện, đổi trạng thái thẻ (Hoạt động / Tạm khóa), ngăn chặn mượn sách đối với thẻ bị khóa.
4. **Quy trình Mượn - Trả sách:**
   * Tự động kiểm tra tính hợp lệ của thẻ và tình trạng sách trong kho.
   * Tự động giảm/tăng số lượng sách khả dụng.
   * Cảnh báo quá hạn và tự động tính phí phạt trễ hạn.
5. **Trợ lý AI Thư viện (Google AI Studio Assistant):** Phân tích câu hỏi/nhu cầu của độc giả và gợi ý các đầu sách phù hợp nhất từ kho dữ liệu.
6. **Lưu trữ bền vững:** Toàn bộ dữ liệu được lưu tại `LocalStorage` và có sẵn nút "Dữ liệu mẫu" để khôi phục nhanh khi kiểm thử.

---

## 🛠 Hướng dẫn cài đặt và khởi chạy ứng dụng

Ứng dụng được thiết kế theo kiến trúc chuẩn Web Single Page Application (SPA), không phụ thuộc vào máy chủ cơ sở dữ liệu phức tạp.

### Cách 1: Chạy trực tiếp (Nhanh nhất)
1. Truy cập vào thư mục `src/`.
2. Nhấp đúp chuột vào file `index.html` để mở trực tiếp trên trình duyệt web bất kỳ (Chrome, Edge, Firefox, Brave...).

### Cách 2: Chạy thông qua Live Server / Local HTTP Server
Nếu có cài đặt Node.js hoặc Visual Studio Code / Antigravity IDE:
* **Sử dụng npx serve:**
  ```bash
  cd src
  npx serve .
  ```
* Mở trình duyệt tại địa chỉ: `http://localhost:3000`

---

## Cấu trúc thư mục nộp bài
```text
Lab_QLThuVien_29209243814_TranThiNgocAnh/
├── src/
│   ├── index.html          # Giao diện chính ứng dụng
│   └── app.js              # Nghiệp vụ xử lý, dữ liệu mẫu & LocalStorage
├── docs/                   # Ảnh sơ đồ quy trình & hướng dẫn
│   ├── quy_trinh_muon_sach.png
│   ├── quy_trinh_muon_sach.svg
│   ├── quy_trinh_tra_sach.png
│   ├── quy_trinh_tra_sach.svg
│   └── HUONG_DAN_ANH.md
├── BaoCao_Lab.pdf          # Báo cáo phân tích, thiết kế & kiểm thử chuẩn đẹp (PDF)
├── BaoCao_Lab.md           # Bản báo cáo định dạng Markdown dự phòng
└── README.md               # Hướng dẫn cài đặt và khởi chạy
```

---

## Liên kết mã nguồn (Repository)
* **GitHub Repository:** `https://github.com/ngocanh06/LabQuanLyThuVien`
