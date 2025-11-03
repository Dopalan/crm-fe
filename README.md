# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

### 📂 Cấu Trúc Thư Mục


| Thư mục |
| :--- | :--- |
| **`src/pages`** | **Các Trang/Màn hình Lớn.** Chứa các Component đại diện cho một trang hoặc một route hoàn chỉnh (ví dụ: `Login.tsx`, `CustomerList.tsx`). |
| **`src/components`** | **Các Khối UI Tái Sử dụng.** Chứa các Component nhỏ, độc lập, có thể tái sử dụng trên nhiều trang (ví dụ: `Button`, `Modal`, `Sidebar`). |
| **`src/components/auth`** | Các component UI chỉ dành riêng cho chức năng Đăng nhập/Đăng ký. |
| **`src/components/common`** | Các component UI phổ biến, sử dụng rộng rãi trong toàn bộ ứng dụng (Input, Table, etc.). |
| **`src/components/customer`** | Các component UI dành riêng cho việc hiển thị thông tin Khách hàng và Tương tác. |
| **`src/api`** | **Giao tiếp Backend.** Chứa logic gọi API RESTful đến Backend (Spring Boot). Đảm bảo logic UI và logic Fetching Data tách biệt. |
| **`src/types`** | **Định nghĩa Kiểu dữ liệu.** Chứa các Interface/Type của TypeScript cho các đối tượng dữ liệu quan trọng (ví dụ: `Customer`, `User`, `Interaction`). |
| **`src/contexts`** | **Quản lý Trạng thái Toàn cục.** Chứa các Context để quản lý trạng thái chia sẻ (ví dụ: trạng thái Đăng nhập, thông tin User hiện tại). |
| **`src/hooks`** | **Tái sử dụng Logic React.** Chứa các Custom Hooks để tái sử dụng logic phức tạp giữa các Component (ví dụ: `useAuth`, `useFetchData`). |
| **`src/utils`** | **Các Hàm Tiện ích Chung.** Chứa các hàm JavaScript/TypeScript thuần túy, không liên quan đến React (ví dụ: `validator.ts`, `formatter.ts`). |
| **`src/styles`** | **CSS/Styling.** Chứa các file CSS hoặc SCSS toàn cục, biến CSS, hoặc cấu hình chung cho styling. |
| **`src/assets`** | **Tài nguyên Tĩnh.** Chứa hình ảnh, fonts, hoặc các file tĩnh khác. |