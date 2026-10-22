# Chạy demo Lingo an toàn trên máy cộng tác viên

Tài liệu này tạo một **database demo mới, riêng biệt và ban đầu phải trống**. Không dùng database đang chứa dữ liệu thật, không sao chép `.env.local` của chủ dự án và không chạy `db:reset`.

## Yêu cầu

- Windows 10/11
- Git, Node.js 20 trở lên và npm
- Tài khoản GitHub để tải mã nguồn
- Neon project/database riêng cho demo (ứng dụng đang dùng Neon)
- Ứng dụng Clerk Development riêng để đăng nhập

## 1. Lấy mã nguồn

Nếu dự án chưa có repository Git cục bộ, mở PowerShell tại thư mục dự án rồi chạy:

```powershell
git init
git add .
git status --short
```

Kiểm tra danh sách stage không có `.env.local`, `.next`, `node_modules`, `private-data` hay file ghi âm/tải lên. Nếu đúng, mở GitHub Desktop, chọn **File → Add Local Repository**, chọn thư mục dự án, commit và **Publish repository** ở chế độ **Private**. Không publish nếu thấy file riêng tư trong danh sách.

Mời cộng tác viên trong GitHub **Settings → Collaborators**. Cộng tác viên clone repo:

```powershell
git clone https://github.com/TAI-KHOAN/REPOSITORY.git
cd REPOSITORY
npm install
```

Không tải hoặc gửi `.env.local`, ảnh/file tải riêng tư hay bản sao database thật.

## 2. Tạo tài nguyên demo riêng

1. Tạo **một Neon project/database mới dành riêng cho demo**; không chọn project production của chủ dự án.
2. Tạo một Clerk Development instance mới cho bản demo.
3. Lấy connection string PostgreSQL của Neon mới và Clerk development keys của chính cộng tác viên.
4. Tạo file môi trường cục bộ:

```powershell
Copy-Item .env.local.example .env.local
notepad .env.local
```

Trong `.env.local`, thay `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` và `CLERK_SECRET_KEY` bằng thông tin của **tài nguyên demo mới**. Với demo thông thường, giữ các biến `PAYMENT_*` để trống; không dùng thông tin ngân hàng thật. Các khóa Stripe/Gemini có thể để trống nếu chỉ trình diễn các phần không dùng dịch vụ đó.

`.env.local` được Git bỏ qua; không gửi file này cho người khác, không chụp màn hình các khóa và không commit.

## 3. Khởi tạo database mẫu

Chạy:

```powershell
npm run demo:setup
```

Lệnh này kiểm tra database không có bảng người dùng trước. Nếu database đã có bảng, lệnh **dừng mà không thay đổi dữ liệu**. Nếu trống, nhập chính xác tên database được in ra để xác nhận, sau đó tạo schema hiện tại và thêm dữ liệu demo. Không dùng `npm run db:reset`.

Script `npm run demo:seed` chỉ thêm khóa học miễn phí mẫu và năm bài PDF còn thiếu; chạy lại không xóa hay ghi đè dữ liệu hiện có.

## 4. Chạy website

```powershell
npm run dev
```

Mở `http://localhost:3000`, đăng ký tài khoản bằng Clerk Development instance của cộng tác viên. Đây là ứng dụng demo riêng trên máy cộng tác viên, không chia sẻ tài khoản hay dữ liệu đăng nhập với chủ dự án.

Muốn xem khu vực đối soát admin trên database demo: sau khi đăng ký/đăng nhập để tài khoản được tạo trong database, quản trị viên demo chỉ có thể nâng role tài khoản của mình **trong Neon demo mới**:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'EMAIL_CUA_TAI_KHOAN_DEMO';
```

Đăng xuất rồi đăng nhập lại. Không chạy truy vấn này trên database production.

## Dữ liệu và chức năng thanh toán

- Năm đề PDF đã có trong `public/assignments/passive-voice/`; seed demo thêm bản ghi nếu còn thiếu.
- Bài nộp và file học viên là dữ liệu riêng tư, không nằm trong Git.
- Không cấu hình `PAYMENT_*` thì hệ thống từ chối tạo thanh toán, không giả vờ đã nhận tiền. Thanh toán QR thật cần tài khoản ngân hàng/cổng thanh toán do chủ dự án quản lý.
- Thanh toán hiện xác nhận thủ công; MoMo và webhook tự động chưa được thiết lập.

## An toàn trước khi push lên GitHub

Từ thư mục dự án, kiểm tra:

```powershell
git status --short
git check-ignore .env.local
git check-ignore private-data/pdf-assignment-submissions/
```

`git check-ignore` phải báo các đường dẫn nhạy cảm được bỏ qua. Nếu `.env.local`, thư mục `private-data`, `.next`, `node_modules` hoặc file tải riêng xuất hiện trong danh sách stage, **không commit/push**; gỡ chúng khỏi staging và kiểm tra lịch sử Git trước khi chia sẻ repo.
