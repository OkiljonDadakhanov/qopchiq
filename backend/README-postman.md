# Qopchiq API Postman Collection

Bu hujjat Qopchiq API endpointlarini test qilish uchun Postman collectiondan foydalanish bo'yicha ko'rsatmalarni o'z ichiga oladi.

## O'rnatish ko'rsatmalari

1. Collectionni import qilish:
   - Postman dasturini oching
   - "Import" tugmasini bosing
   - `postman_collection.json` faylini tanlang
   - "Import" tugmasini bosing

2. Environment o'zgaruvchilarini sozlash:
   Postmanda yangi environment yarating va quyidagi o'zgaruvchilarni qo'shing:
   - `BASE_URL`: Standart qiymati `http://localhost:5000`

3. Backend uchun kerakli Environment o'zgaruvchilari:
   Backend papkasida `.env` faylini yarating va quyidagi ma'lumotlarni kiriting:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

## Mavjud Endpointlar

### Autentifikatsiya (Auth)

1. **Ro'yxatdan o'tish (Sign Up)**
   - URL: `POST {{BASE_URL}}/api/auth/signup`
   - Body:
     ```json
     {
         "name": "Test User",
         "email": "test@example.com",
         "password": "testpassword123"
     }
     ```
   - Natija: Foydalanuvchi yaratiladi va email verifikatsiya kodi yuboriladi

2. **Email tasdiqlash (Verify Email)**
   - URL: `POST {{BASE_URL}}/api/auth/verify-email`
   - Body:
     ```json
     {
         "code": "123456"
     }
     ```
   - Natija: Email tasdiqlangandan so'ng foydalanuvchi verified bo'ladi

3. **Tizimga kirish (Login)**
   - URL: `POST {{BASE_URL}}/api/auth/login`
   - Body:
     ```json
     {
         "email": "test@example.com",
         "password": "testpassword123"
     }
     ```
   - Natija: JWT token cookie sifatida saqlanadi

4. **Tizimdan chiqish (Logout)**
   - URL: `POST {{BASE_URL}}/api/auth/logout`
   - Body kerak emas
   - Natija: JWT token cookie o'chiriladi

5. **Parolni tiklash so'rovi (Forgot Password)**
   - URL: `POST {{BASE_URL}}/api/auth/forgot-password`
   - Body:
     ```json
     {
         "email": "test@example.com"
     }
     ```
   - Natija: Parolni tiklash havolasi emailga yuboriladi

6. **Parolni tiklash (Reset Password)**
   - URL: `POST {{BASE_URL}}/api/auth/reset-password/:token`
   - Body:
     ```json
     {
         "password": "newpassword123"
     }
     ```
   - `:token` - emailga yuborilgan maxsus token
   - Natija: Yangi parol o'rnatiladi

7. **Autentifikatsiyani tekshirish (Check Auth)**
   - URL: `GET {{BASE_URL}}/api/auth/check`
   - Body kerak emas
   - Headers: JWT token cookie bo'lishi kerak
   - Natija: Joriy foydalanuvchi ma'lumotlari qaytariladi

## Eslatmalar
- API JWT tokenni HTTP-only cookie sifatida saqlaydi
- Barcha javoblar JSON formatida qaytariladi
- Xatolik javoblarida `success: false` va xato xabari bo'ladi
- Muvaffaqiyatli javoblarda `success: true` va tegishli ma'lumotlar bo'ladi
- Email verifikatsiya va parolni tiklash uchun Mailtrap xizmati ishlatiladi