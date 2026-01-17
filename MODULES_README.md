# Permissions & Roles Management Modules

## Tổng quan

Đã tạo 2 module quản lý:
1. **Permissions Management** - Quản lý quyền hạn
2. **Roles Management** - Quản lý vai trò với TreeTable để gán quyền

## Cấu trúc

### 1. Data Access Layer

#### Permissions
- `src/app/data-access/permissions/permissions.store.ts` - State management
- `src/app/data-access/permissions/permissions.facade.ts` - Business logic
- `src/app/data-access/permissions/permissions.service.ts` - API calls

#### Roles
- `src/app/data-access/roles/roles.store.ts` - State management
- `src/app/data-access/roles/roles.facade.ts` - Business logic
- `src/app/data-access/roles/roles.service.ts` - API calls

### 2. Pages/Components

#### Permissions Module
```
src/app/pages/permissions/
├── permissions-list/
│   ├── permissions.component.ts
│   └── permissions.component.html
├── permission-form/
│   ├── permission-form.component.ts
│   └── permission-form.component.html
└── permissions.routes.ts
```

#### Roles Module
```
src/app/pages/roles/
├── roles-list/
│   ├── roles.component.ts
│   └── roles.component.html
├── role-form/
│   ├── role-form.component.ts
│   └── role-form.component.html
├── assign-permissions/
│   ├── assign-permissions.component.ts
│   └── assign-permissions.component.html
└── roles.routes.ts
```

## Tính năng

### Permissions Management
- ✅ Xem danh sách permissions (Table với pagination, search, sort)
- ✅ Tạo permission mới
- ✅ Sửa permission
- ✅ Xóa permission (có confirm dialog)
- ✅ Filter theo name, description, routePath, method
- ✅ Hiển thị HTTP method với màu sắc khác nhau
- ✅ Hiển thị trạng thái Active/Inactive

### Roles Management
- ✅ Xem danh sách roles (Table với pagination, search, sort)
- ✅ Tạo role mới
- ✅ Sửa role
- ✅ Xóa role (có confirm dialog)
- ✅ Hiển thị số lượng permissions của mỗi role
- ✅ **Gán permissions cho role bằng TreeTable**
  - Permissions được nhóm theo route path
  - Checkbox selection
  - Hiển thị method và route path
  - Pre-select permissions đã được gán

## API Endpoints được sử dụng

### Permissions
- `GET /permissions` - Lấy danh sách
- `GET /permissions/:id` - Lấy chi tiết
- `POST /permissions` - Tạo mới
- `PUT /permissions/:id` - Cập nhật
- `DELETE /permissions/:id` - Xóa

### Roles
- `GET /roles` - Lấy danh sách
- `GET /roles/:id` - Lấy chi tiết
- `POST /roles` - Tạo mới
- `PUT /roles/:id` - Cập nhật
- `DELETE /roles/:id` - Xóa
- `GET /roles/:id/permissions` - Lấy permissions của role
- `PUT /roles/:id/permissions` - Gán permissions cho role

## Menu Navigation

Đã thêm vào menu sidebar:
- **Quản lý vai trò** - `/pages/roles`
- **Quản lý quyền** - `/pages/permissions`

## Cách sử dụng

### 1. Quản lý Permissions
1. Vào menu "Quản lý quyền"
2. Click "New Permission" để tạo mới
3. Điền thông tin: Name (required), Description, Route Path, HTTP Method
4. Chọn Active/Inactive
5. Click Save

### 2. Quản lý Roles
1. Vào menu "Quản lý vai trò"
2. Click "New Role" để tạo mới
3. Điền thông tin: Name (required), Description, Priority
4. Click Save
5. Để gán permissions:
   - Click icon shield (🛡️) ở cột Actions
   - TreeTable hiển thị permissions nhóm theo route path
   - Check/uncheck permissions cần gán
   - Click "Save Permissions"

## TreeTable Features

TreeTable cho phép:
- Xem permissions theo nhóm route path
- Expand/collapse từng nhóm
- Checkbox selection với parent-child relationship
- Hiển thị method với màu sắc:
  - GET: Blue
  - POST: Green
  - PUT/PATCH: Yellow/Orange
  - DELETE: Red
- Pre-select permissions đã được gán trước đó

## Dependencies

Các PrimeNG components được sử dụng:
- Table
- TreeTable (cho assign permissions)
- Dialog
- Button
- InputText
- InputTextarea
- InputNumber
- InputSwitch
- Dropdown
- Tag
- Badge
- Toast
- ConfirmDialog

## Next Steps

Để hoàn thiện hệ thống, bạn có thể:
1. Tạo module Users Management (module thứ 3)
2. Thêm permission-based access control
3. Thêm audit log
4. Thêm bulk actions
5. Export/Import permissions và roles
