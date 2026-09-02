const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// ให้ Express เปิดไฟล์ในโฟลเดอร์ public
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// เปิดไฟล์ PNG สำหรับใช้เป็นภาพกล่องของวัญ
app.get("/Gift.png", (req, res) => {
    res.sendFile(path.join(__dirname, "Gift.png"));
});

app.get("/Gifi_poen.png", (req, res) => {
    res.sendFile(path.join(__dirname, "Gifi_poen.png"));
});

app.get("/play.mp3", (req, res) => {
    res.sendFile(path.join(__dirname, "play.mp3"));
});

app.get("/keep.mp3", (req, res) => {
    res.sendFile(path.join(__dirname, "keep.mp3"));
});

app.get("/gift.mp3", (req, res) => {
    res.sendFile(path.join(__dirname, "gift.mp3"));
});

// หน้าแรก
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "claw-machine.html"
        )
    );
});

app.get("/gift", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "gift.html"
        )
    );
});

app.listen(PORT, () => {

    console.log(`
=================================
   🎮 CLAW MACHINE SERVER
=================================

Game:
http://localhost:${PORT}

Server running...
`);

});