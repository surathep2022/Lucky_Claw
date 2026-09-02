// start-ngrok.js
const ngrok = require('ngrok');

(async function() {
  try {
    // 💡 เปลี่ยน PORT 3000 ให้ตรงกับ พอร์ตที่ npm start ของคุณใช้งาน
    const url = await ngrok.connect({
      proto: 'http',
      addr: 3000,
      // authtoken: 'YOUR_NGROK_AUTHTOKEN' // ใส่ Authtoken หากคุณมีบัญชี ngrok
    });
    
    console.log('\n==================================================');
    console.log(`🚀 Ngrok Tunnel Active!`);
    console.log(`🌐 Admin URL (ส่งลิงก์นี้ให้เครื่องอื่น): ${url}`);
    console.log('==================================================\n');
  } catch (err) {
    console.error('Error starting ngrok:', err);
  }
})();