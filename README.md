<div align="center">

# 📝 React Task Manager

**Ứng dụng quản lý công việc client-side — không cần backend, không cần đăng nhập.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Tested-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/USER/REPO/actions)

**[Tính năng](#-tính-năng) • [Cài đặt](#-cài-đặt) • [Cấu trúc](#-cấu-trúc-dự-án) • [FAQ](#-faq)**

</div>

---

## ✨ Tính năng

| Nhóm | Chi tiết |
|------|----------|
| **Task CRUD** | Tạo, sửa, xóa task với tiêu đề, mô tả, priority, due date |
| **Trạng thái** | Đánh dấu hoàn thành / chưa hoàn thành |
| **Lọc & tìm kiếm** | Filter theo status, priority; search full-text; sort 3 kiểu |
| **Overdue** | Tự động phát hiện task quá hạn theo ngày hiện tại |
| **Lưu trữ** | Persist trong `localStorage` — không mất khi refresh hoặc đóng tab |
| **Accessibility** | Focus trap, Escape handler, focus return — đạt WCAG cơ bản |
| **Giao diện** | Dark mode theo OS, responsive từ 320px, 44px touch target |

---

## 🚀 Cài đặt

**Yêu cầu:** Node.js ≥ 18

```bash
git clone https://github.com/Tuannll/react-task-manager.git
cd REPO
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

> [!NOTE]
> Dữ liệu lưu trong `localStorage` của trình duyệt hiện tại. Xóa site data hoặc dùng trình duyệt khác sẽ mất data.

---

## 🛠️ Lệnh phổ biến

```bash
npm run dev        # dev server
npm run build      # production build → dist/
npm run preview    # preview build
npm run lint       # ESLint
npm test           # chạy toàn bộ test (unit + integration)
npm run test:watch # test watch mode
```

---

## 📁 Cấu trúc dự án

```
src/
  lib/
    tasks.js          # Pure domain logic (create, update, toggle, delete, filter, stats)
    tasks.test.js     # Unit tests
  components/
    TaskForm.jsx      # Form tạo/sửa task
    TaskToolbar.jsx   # Search, filter, sort
    TaskList.jsx      # Danh sách task
    TaskSummary.jsx   # Thống kê tổng quan
    EmptyState.jsx    # Trạng thái rỗng
  App.jsx             # State, localStorage sync, layout
  App.test.jsx        # Integration tests
  App.css             # Component styles, design tokens
  index.css           # Reset, global tokens, dark mode, reduced motion
```

---

## 🧪 Testing

Dùng **Vitest** + **@testing-library/react**:

- **Unit tests** (`tasks.test.js`): pure function — create, update, toggle, delete, filter, stats
- **Integration tests** (`App.test.jsx`): render, user interaction, localStorage sync

```bash
npm test
```

---

## 🔧 Stack

- **React 19** — UI
- **Vite 8** — build tool, dev server
- **Vitest + Testing Library** — testing
- **ESLint** — linting
- **CSS custom properties** — design tokens, dark mode, responsive

---

## ❓ FAQ

**Data lưu ở đâu?**
Chỉ trong `localStorage` của trình duyệt. Không có server, không sync giữa thiết bị.

**Có thể deploy không?**
Được. `npm run build` tạo ra thư mục `dist/` — upload lên Vercel, GitHub Pages, hoặc bất kỳ static host nào.

**Tại sao không dùng Redux hay Zustand?**
App nhỏ, state đơn giản. `useState` + `useEffect` đủ dùng, không cần thêm dependency.

**Có thể thêm backend không?**
Được. Domain logic nằm trong `src/lib/tasks.js` tách biệt hoàn toàn với UI — thay `localStorage` bằng API call là xong.

---

## 📄 License

MIT
