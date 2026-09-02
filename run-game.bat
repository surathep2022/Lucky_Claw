@echo off
chcp 65001 > nul
title Running Lucky Wheel Project with Ngrok...

:: ย้ายไดเรกทอรีไปยังโฟลเดอร์โปรเจกต์อัตโนมัติ
cd /d "%~dp0"

echo ===================================================
echo   [SUCCESS] Starting HTTP Server and Ngrok...
echo ===================================================

:: 1. สั่งรัน http-server (Port 8080)
start "HTTP Server Backend" cmd /k "http-server -p 8080"

:: 2. สั่งรัน ngrok สร้าง Tunnel ไปยัง Port 8080
start "Ngrok Online Tunnel" cmd /k "ngrok http 8080"

:: 3. เปิด Web Browser ดูหน้าเว็บ Localhost
start chrome http://localhost:8080

echo ---------------------------------------------------
echo  [READY] ระบบกำลังเริ่มทำงาน...
echo  - คัดลอกลิงก์ Forwarding (https://...ngrok-free.app) 
echo    จากหน้าต่าง "Ngrok Online Tunnel" ไปส่งให้เครื่องอื่นหรือเปิดในมือถือได้เลยครับ
echo ---------------------------------------------------
pause