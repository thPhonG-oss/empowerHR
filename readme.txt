# Hướng Dẫn Cài Đặt và Chạy Đồ Án EmpowerHR

Tài liệu này hướng dẫn chi tiết cách chạy toàn bộ hệ thống (Frontend và 2 Backend) trên môi trường local (máy cá nhân) mà không cần sử dụng Docker.

## 1. Yêu cầu môi trường (Prerequisites)
Để chạy được ứng dụng, máy tính cần cài đặt sẵn các công cụ sau:

* **Java JDK 21** (Cho Backend Spring Boot).
* **Databases:** MySQL Server (Version 8.0 trở lên).
* **.NET SDK 8.0** (Cho Backend .NET).
* **Node.js** (Version 18 trở lên recommended) & npm.

---

## 2. Cấu hình Database (MySQL)

Trước khi chạy ứng dụng, vui lòng tạo database trong MySQL Workbench hoặc Command Line:

1.  Mở MySQL.
2.  Chạy câu lệnh SQL sau để tạo database:
    ```sql
    CREATE DATABASE hrm_db;
    ```
3.  **Lưu ý quan trọng:**
    * Ứng dụng đang được cấu hình mặc định kết nối với user: `root` và password: `root`.
    * Nếu máy của Thầy/Cô có password khác, vui lòng cập nhật lại file cấu hình tại:
        * **Java BE:** `BE/src/main/resources/application.yml` (hoặc `application.properties`).
        * **.NET BE:** `BE-dotnet/appsettings.json`.

---

## 3. Khởi chạy Backend 1: Java Spring Boot
Dịch vụ này chạy mặc định tại cổng **8080**.

1.  Mở terminal (Command Prompt hoặc PowerShell) và trỏ vào thư mục `BE`.
    ```bash
    cd BE
    ```
2.  Chạy lệnh sau để tải thư viện và khởi động ứng dụng (dùng Maven Wrapper có sẵn):
    * **Windows:**
        ```cmd
        mvnw.cmd spring-boot:run
        ```
    * **macOS / Linux:**
        ```bash
        ./mvnw spring-boot:run
        ```
3.  Chờ đến khi thấy log báo `Started HrManagementSystemApplication in ... seconds`.
4.  Database sẽ tự động được khởi tạo (Migration) nhờ Flyway.

---

## 4. Khởi chạy Backend 2: .NET Core API
Dịch vụ này sẽ chạy song song để xử lý các nghiệp vụ khác.

1.  Mở một cửa sổ terminal **mới**.
2.  Trỏ vào thư mục `BE-dotnet`.
    ```bash
    cd BE-dotnet
    ```
3.  Chạy lệnh để khôi phục thư viện và khởi chạy:
    ```bash
    dotnet run
    ```
    *(Hoặc có thể mở file `BE-dotnet.sln` bằng Visual Studio và nhấn F5)*.
4.  Lưu ý cổng mạng (Port) mà ứng dụng .NET đang chạy (thường sẽ hiển thị trong log, ví dụ: `Now listening on: http://localhost:5xxx`).

---

## 5. Khởi chạy Frontend: React App
Giao diện người dùng chạy trên Vite.

1.  Mở một cửa sổ terminal **mới**.
2.  Trỏ vào thư mục `FE`.
    ```bash
    cd FE
    ```
3.  Cài đặt các thư viện (node_modules):
    ```bash
    npm install
    ```
4.  **Cấu hình biến môi trường (Nếu cần):**
    * Kiểm tra file `.env` trong thư mục `FE`. Đảm bảo các đường dẫn API trỏ đúng về port của 2 Backend đang chạy ở trên (Ví dụ: `VITE_API_URL=http://localhost:8080`).
5.  Khởi chạy ứng dụng:
    ```bash
    npm run dev
    ```
6.  Truy cập vào đường dẫn hiển thị trên terminal (thường là `http://localhost:5173` hoặc `http://localhost:3000`).

---

## 6. Tổng kết các đường dẫn truy cập
Sau khi chạy thành công 3 bước trên:

* **Trang chủ (Web App):** `http://localhost:5173` (hoặc port hiển thị ở bước 5).
* **Java API Swagger:** `http://localhost:8080/swagger-ui/index.html` (đường dẫn có thể thay đổi tùy cấu hình Swagger).
* **Dotnet API Swagger:** `http://localhost:<PORT_DOTNET>/swagger`.

Nếu gặp lỗi xung đột cổng (Port already in use), vui lòng kiểm tra xem có tiến trình nào đang chạy ngầm và tắt nó đi.