# Thiết lập thanh toán chuyển khoản

Luồng hiện tại dùng QR VietQR để học viên chuyển khoản bằng ứng dụng ngân hàng. Giao dịch ở trạng thái chờ cho đến khi quản trị viên đối soát trên tài khoản ngân hàng và xác nhận tại `/admin/course-payments`.

Thêm các biến sau vào môi trường máy chủ (không đưa thông tin bí mật vào Git):

```text
PAYMENT_BANK_BIN=970422
PAYMENT_BANK_NAME=Ten ngan hang
PAYMENT_ACCOUNT_NUMBER=...
PAYMENT_ACCOUNT_NAME=...
```

`PAYMENT_BANK_BIN` là mã BIN 6 chữ số của ngân hàng nhận tiền; tên ngân hàng, số tài khoản và tên chủ tài khoản phải khớp với tài khoản dùng để nhận học phí. QR được tạo trong ứng dụng, không gửi số tài khoản tới dịch vụ tạo QR bên ngoài.

Giá khóa học trả phí phải là số nguyên VND. Sau khi cấu hình biến môi trường và triển khai migration `0005_bank_transfer_payments.sql`, hãy thử một giao dịch nhỏ, kiểm tra đúng người nhận/số tiền/nội dung, rồi xác nhận giao dịch trong trang quản trị. Không xác nhận chỉ dựa trên ảnh chụp giao dịch.

MoMo và xác nhận tự động qua ngân hàng chưa được bật trong luồng này; cần tài khoản merchant/cổng thanh toán và webhook riêng trước khi tích hợp.
