        const firebaseConfig = {
          apiKey: "AIzaSyADzVirlflWjw7ux1i8fRNFUNSBT139-6I",
          authDomain: "slot-machine-ff297.firebaseapp.com",
          databaseURL: "https://slot-machine-ff297-default-rtdb.asia-southeast1.firebasedatabase.app",
          projectId: "slot-machine-ff297",
          storageBucket: "slot-machine-ff297.firebasestorage.app",
          messagingSenderId: "196859530049",
          appId: "1:196859530049:web:09ba13fa577fd5fbe1efc0"
        };

        if (firebase && firebase.apps && firebase.apps.length === 0) {
          firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.database();
        let dbQueue = [];
        let dbStock = {};
        let dbTotalSpins = 0;
        let dbPrizeOrder = {};

        function normalizeQueue(queueData) {
          if (Array.isArray(queueData)) {
            return queueData
              .map((item) => (typeof item === 'object' && item !== null && item.name ? item.name : String(item || '')))
              .filter(Boolean);
          }

          if (queueData && typeof queueData === 'object') {
            return Object.keys(queueData)
              .map((key) => {
                const item = queueData[key];
                return typeof item === 'object' && item !== null && item.name ? item.name : String(item || '');
              })
              .filter(Boolean);
          }

          return [];
        }

        function getCurrentPlayerName() {
          const uniqueQueue = [...new Set(dbQueue)];
          return uniqueQueue[0] || 'รอคิว';
        }

        function removeCurrentPlayerFromQueue() {
          if (!dbQueue.length) return;

          const nextQueue = [...new Set(dbQueue.slice(1))];
          const queueObject = {};
          nextQueue.forEach((name, index) => {
            queueObject[index] = name;
          });

          db.ref('customerQueue').set(queueObject).catch(() => {});
        }

        function updateCurrentPlayerBadge() {
          const badge = document.getElementById('player-name-display');
          if (!badge) return;
          badge.textContent = getCurrentPlayerName();
        }

        function getOrderedPrizeForTurn() {
          const slotKey = String((dbTotalSpins % 100) + 1);
          const orderedName = dbPrizeOrder[slotKey];
          if (!orderedName) return null;

          const orderedPrize = prizes.find(prize => prize.name === orderedName);
          if (!orderedPrize) return null;

          const stockCount = dbStock[orderedPrize.name] || 0;
          return stockCount > 0 ? orderedPrize : null;
        }

        const stage = document.getElementById("stage");
        function fitStage() {
          const scale = Math.min(
            window.innerWidth / 1080,
            window.innerHeight / 1920,
          );
          stage.style.transform = `scale(${scale})`;
        }
        window.addEventListener("resize", fitStage);
        fitStage();

        // decorative side lights
        function buildLights(el, count) {
          for (let i = 0; i < count; i++) {
            const b = document.createElement("div");
            b.className = "bulb";
            el.appendChild(b);
          }
        }
        buildLights(document.getElementById("lightsL"), 16);
        buildLights(document.getElementById("lightsR"), 16);

        // ---------------- gift box + surprise toy data ----------------
        const prizes = [          
            { name: "ร่มตอนเดียว", image: "gift/1.png" },  
            { name: "กระเป๋าช้อปปิ้ง", image: "gift/5.png" },
            { name: "กระเป๋าลายสัตว์", image: "gift/21.png" },
            { name: "แก้วเก็บความเย็น", image: "gift/20.png" },
            { name: "แก้วน้ำปาร์ตี้", image: "gift/11.png" },
            
            { name: "เครื่องผลไม้ปั่น", image: "gift/15.png" }, 
            { name: "เครื่องปั้นน้ำผลไม้", image: "gift/14.png" },
            { name: "เครื่องพ่นไอน้ำ" , image: "gift/17.png" },
            { name: "เครื่องจำกัดไรฝุ่น", image: "gift/18.png"},
            { name: "เครื่องบดเนื้อ", image: "gift/19.png" },
            { name: "เครื่องเตรียมอาหาร", image: "gift/12.png" },
            { name: "หม้อทอดไร้น้ำมัน", image: "gift/16.png" },
            { name: "เครื่องดูดฝุ่น", image: "gift/13.png" },   
        ];

        const BOX_COLORS = ["c1", "c2", "c3", "c4", "c5", "c6"];
        const BOX_DEFS = [
          {
            x: 20,
            y: 62,
            color: "c1",
            prize: { name: prizes[0].name, image: prizes[0].image, type: "product" },
          },
          {
            x: 33,
            y: 52,
            color: "c3",
            prize: { name: prizes[1].name, image: prizes[1].image, type: "product" },
          },
          {
            x: 50,
            y: 44,
            color: "c5",
            prize: { name: prizes[2].name, image: prizes[2].image, type: "product" },
          },
          {
            x: 64,
            y: 52,
            color: "c2",
            prize: { name: prizes[3].name, image: prizes[3].image, type: "product" },
          },
          {
            x: 78,
            y: 46,
            color: "c4",
            prize: { name: prizes[4].name, image: prizes[4].image, type: "product" },
          },
          {
            x: 90,
            y: 58,
            color: "c6",
            prize: { name: prizes[5].name, image: prizes[5].image, type: "product" },
          },
          {
            x: 44,
            y: 34,
            color: "c2",
            prize: { name: prizes[6].name, image: prizes[6].image, type: "product" },
          },
          {
            x: 68,
            y: 70,
            color: "c5",
            prize: { name: prizes[7].name, image: prizes[7].image, type: "product" },
          },
          {
            x: 26,
            y: 44,
            color: "c4",
            prize: { name: prizes[8].name, image: prizes[8].image, type: "product" },
          },
          {
            x: 55,
            y: 76,
            color: "c1",
            prize: { name: prizes[9].name, image: prizes[9].image, type: "product" },
          },
          {
            x: 14,
            y: 48,
            color: "c6",
            prize: { name: prizes[10].name, image: prizes[10].image, type: "product" },
          },
          {
            x: 84,
            y: 74,
            color: "c3",
            prize: { name: prizes[11].name, image: prizes[11].image, type: "product" },
          },
        ];

        const GIFT_IMAGE_PATH = "/Gift.png";
        const REVEAL_IMAGE_PATH = "/Gifi_poen.png";

        const soundMap = {
          play: new Audio('/play.mp3'),
          keep: new Audio('/keep.mp3'),
          gift: new Audio('/gift.mp3'),
        };

        function playSound(key) {
          const audio = soundMap[key];
          if (!audio) return;

          if (key === 'play') {
            audio.loop = true;
            if (audio.paused) {
              audio.currentTime = 0;
              audio.play().catch(() => {});
            }
            return;
          }

          audio.currentTime = 0;
          audio.play().catch(() => {});
        }

        function createGiftImage({ width = 100, height = 100, src = GIFT_IMAGE_PATH } = {}) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'gift';
          img.width = width;
          img.height = height;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          img.style.display = 'block';
          img.style.pointerEvents = 'none';
          return img;
        }

        function makeBoxEl(def) {
            const el = document.createElement('div');
            el.className = 'giftbox';
            el.style.left = def.x + '%';
            el.style.top = def.y + '%';
            el.style.setProperty('--s', (0.85 + Math.random() * 0.35).toFixed(2));
            el.style.setProperty('--gift-shift', `${(Math.random() - 0.5) * 10}px`);

            const img = createGiftImage({ width: 120, height: 120 });
            img.style.transform = 'translateX(var(--gift-shift))';
            img.style.transition = 'transform 0.6s ease-in-out';
            el.appendChild(img);
            return el;
        }
        let prizeElements = [];
        function resetPrizeField() {
          prizeField.innerHTML = "";
          prizeElements = [];
          BOX_DEFS.forEach((def, i) => {
            const el = makeBoxEl(def);
            prizeField.appendChild(el);
            prizeElements.push({ ...def, id: i, el });
          });
        }
        resetPrizeField();

        // ---------------- state ----------------
        const state = {
          clawXPct: 50, // 0-100 across rail
          depth: 0, // 0-100 -> maps to reach depth into field
          busy: false,
          timeLeft: 15,
          credit: 20,
          stars: 20,
          teddy: 0,
          gift: 0,
          keys: {},
          revealReady: false,
        };

        const motor = document.getElementById("motor");
        const rod = document.getElementById("rod");
        const clawEl = document.getElementById("claw");
        const heldPrizeEl = document.getElementById("heldPrize");
        const timerBadge = document.getElementById("timer-badge");
        const starVal = document.getElementById("starVal");
        const teddyVal = document.getElementById("teddyVal");
        const giftVal = document.getElementById("giftVal");
        const creditVal = document.getElementById("creditVal");
        const spaceBtn = document.getElementById("spaceBtn");
        const missMsg = document.getElementById("missMsg");
        const outMsg = document.getElementById("outMsg");

        const RAIL_MIN = 6,
          RAIL_MAX = 94; // percent
        const DEPTH_MIN = 0,
          DEPTH_MAX = 100; // percent -> motor top offset
        const ROD_REST = 30,
          ROD_MAX = 780; // px

        function renderMotor() {
          motor.style.left = state.clawXPct + "%";
          motor.style.top = 6 + state.depth * 0.1 + "%";
        }
        function updateHUD() {
          starVal.textContent = state.stars;
          teddyVal.textContent = state.teddy;
          giftVal.textContent = state.gift;
          creditVal.textContent = state.credit;
          timerBadge.textContent = state.timeLeft;
          timerBadge.classList.toggle("warn", state.timeLeft <= 5);
          spaceBtn.classList.toggle(
            "disabled",
            state.busy || state.credit <= 0,
          );
        }
        renderMotor();
        updateHUD();

        // ---------------- phase state machine ----------------
        let phase = "locked";
        const hintEl = document.getElementById("hint");
        function setHint(text) {
          hintEl.textContent = text;
        }

        // ---------------- movement & joystick ----------------
        const MOVE_SPEED = 0.85;
        const activeDirs = {
          left: false,
          right: false,
          up: false,
          down: false,
        };
        const joystickKnob = document.getElementById("joystickKnob");

        // Update Joystick tilt position based on input state
        function updateJoystickVisual() {
          let moveX = 0;
          let moveY = 0;

          if (activeDirs.left) moveX -= 18;
          if (activeDirs.right) moveX += 18;

          joystickKnob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        function gameLoop() {
          if (phase === "selecting") {
            let moved = false;
            if (activeDirs.left) {
              state.clawXPct = Math.max(RAIL_MIN, state.clawXPct - MOVE_SPEED);
              moved = true;
            }
            if (activeDirs.right) {
              state.clawXPct = Math.min(RAIL_MAX, state.clawXPct + MOVE_SPEED);
              moved = true;
            }
            if (moved) renderMotor();
          }

          const time = performance.now() * 0.003;
          const horizontalPress = (activeDirs.left ? -1 : 0) + (activeDirs.right ? 1 : 0);
          document.querySelectorAll('.giftbox').forEach((box, index) => {
            if (box && !box.classList.contains('caught')) {
              const idleDrift = Math.sin(time * 2 + index) * 4;
              const pressDrift = horizontalPress * Math.sin(time * 8 + index) * 12;
              const drift = idleDrift + pressDrift;
              box.style.transform = `translate(-50%, -50%) scale(var(--s, 1)) translateX(${drift}px)`;
            }
          });

          updateJoystickVisual();
          requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);

        // Keyboard controls
        window.addEventListener("keydown", (e) => {
          const code = e.code;
          if (
            [
              "ArrowUp",
              "ArrowDown",
              "ArrowLeft",
              "ArrowRight",
              "Space",
              "Enter",
            ].includes(code)
          )
            e.preventDefault();

          if (code === "ArrowLeft") activeDirs.left = true;
          if (code === "ArrowRight") activeDirs.right = true;
          if (code === "ArrowUp") activeDirs.up = true;
          if (code === "ArrowDown") activeDirs.down = true;

          if (code === "Enter" && !e.repeat) {
            startRoundFromEnter();
          }

          if (code === "Space" && !e.repeat) {
            handleSpacePress();
          }
        });

        window.addEventListener("keyup", (e) => {
          const code = e.code;
          if (code === "ArrowLeft") activeDirs.left = false;
          if (code === "ArrowRight") activeDirs.right = false;
          if (code === "ArrowUp") activeDirs.up = false;
          if (code === "ArrowDown") activeDirs.down = false;
        });

        // On-screen D-pad / Joystick Controls
        document.querySelectorAll(".dbtn[data-dir]").forEach((btn) => {
          const dir = btn.dataset.dir;
          const start = (e) => {
            e.preventDefault();
            activeDirs[dir] = true;
            btn.classList.add("active");
          };
          const stop = () => {
            activeDirs[dir] = false;
            btn.classList.remove("active");
          };
          btn.addEventListener("pointerdown", start);
          btn.addEventListener("pointerup", stop);
          btn.addEventListener("pointerleave", stop);
          btn.addEventListener("pointercancel", stop);
        });

        spaceBtn.addEventListener("click", handleSpacePress);
        
        const startBtn = document.getElementById("startBtn");
        if (startBtn) {
          startBtn.addEventListener("click", () => {
            if (!hasActivePlayer()) return;
            startRoundFromEnter();
          });
        }
        
        document
          .getElementById("startOverlay")
          .addEventListener("click", (e) => {});

        // ---------------- timer ----------------
        let timerInt = null;
        function startTimer() {
          stopTimer();
          state.timeLeft = 15;
          updateHUD();
          timerInt = setInterval(() => {
            state.timeLeft--;
            if (state.timeLeft <= 0) {
              state.timeLeft = 0;
              stopTimer();
              updateHUD();
              triggerGrab();
              return;
            }
            updateHUD();
          }, 1000);
        }
        function stopTimer() {
          if (timerInt) clearInterval(timerInt);
          timerInt = null;
        }

        function wait(ms) {
          return new Promise((res) => setTimeout(res, ms));
        }

        function hasActivePlayer() {
          return [...new Set(dbQueue)].length > 0;
        }

        function updateStartButtonState() {
          const startBtn = document.getElementById('startBtn');
          if (!startBtn) return;
          
          if (hasActivePlayer()) {
            startBtn.classList.remove('disabled');
          } else {
            startBtn.classList.add('disabled');
          }
        }

        function handleSpacePress() {
          if (phase === "locked") {
            if (!hasActivePlayer()) {
              setHint("รอชื่อผู้เล่นเข้าคิวก่อนเริ่มเกม");
              return;
            }
            startRoundFromEnter();
          } else if (phase === "selecting") {
            playSound("play");
            triggerGrab();
          } else if (phase === "revealing" && state.revealReady) {
            closeRevealAndRestart();
          }
        }

        function startRoundFromEnter() {
          if (!hasActivePlayer()) {
            setHint("รอชื่อผู้เล่นเข้าคิวก่อนเริ่มเกม");
            return;
          }

          if (phase !== "locked") return;

          playSound("play");
          resetPrizeField();
          phase = "selecting";
          state.clawXPct = 50;
          state.depth = 0;
          state.timeLeft = 15;
          renderMotor();
          setHint("ใช้ปุ่มซ้าย-ขวาเลือกกล่อง แล้วกด SPACE เพื่อคีบ!");
          startTimer();
          updateHUD();
        }

        // ---------------- grab sequence ----------------
        async function triggerGrab() {
          if (phase !== "selecting") return;
          if (state.credit <= 0) {
            stopTimer();
            showOut();
            return;
          }
          if (prizes.length === 0) {
            stopTimer();
            showAllCaught();
            return;
          }

          phase = "busy";
          stopTimer();
          setHint("กำลังคีบกล่องของขวัญ...");
          state.credit -= 1;
          updateHUD();

          const reachX = state.clawXPct;
          const reachY = 30 + (state.depth / 100) * 65;

          rod.style.height = ROD_MAX + "px";
          await wait(600);

          let nearest = null,
            nearestDist = Infinity;
          prizeElements.forEach((p) => {
            const dx = p.x - reachX;
            const dy = p.y - reachY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = p;
            }
          });
          const caught = nearest;

          playSound("keep");
          clawEl.classList.add("closed");
          await wait(320);

          caught.el.style.opacity = "0";
          // ตอนที่เล็บคีบจับกล่องได้ (ในฟังก์ชัน triggerGrab)
          const miniGift = createGiftImage({ width: 60, height: 60 });
          miniGift.style.width = "60px";
          miniGift.style.height = "60px";
          miniGift.style.objectFit = "contain";
          heldPrizeEl.innerHTML = "";
          heldPrizeEl.appendChild(miniGift);
          heldPrizeEl.classList.add("show");
          prizeElements = prizeElements.filter((p) => p.id !== caught.id);

          rod.style.height = ROD_REST + "px";
          await wait(600);

          state.clawXPct = RAIL_MIN;
          state.depth = 55;
          renderMotor();
          await wait(900);

          rod.style.height = 260 + "px";
          await wait(250);
          clawEl.classList.remove("closed");
          heldPrizeEl.classList.remove("show");
          dropIntoChute(caught);
          await wait(250);
          rod.style.height = ROD_REST + "px";
          await wait(500);

          state.clawXPct = 50;
          state.depth = 0;
          renderMotor();
          await wait(650);

          updateHUD();
          phase = "revealing";
          setHint("เปิดกล่องของขวัญ...");
          openBoxSequence(caught);
        }

        function dropIntoChute(box) {
          const chuteHole = document.getElementById("chuteHole");
          const el = document.createElement("div");
          el.className = "chute-prize";
          const giftImg = createGiftImage({ width: 42, height: 42 });
          giftImg.style.filter = "drop-shadow(0 6px 6px rgba(0,0,0,0.3))";
          el.appendChild(giftImg);
          el.style.left = 18 + Math.random() * 34 + "%";
          el.style.top = "0%";
          chuteHole.appendChild(el);
          setTimeout(() => {
            el.remove();
          }, 1400);
        }

        async function openBoxSequence(box) {
          const overlay = document.getElementById("overlay");
          const boxClosed = document.getElementById("boxClosed");
          const revealEmoji = document.getElementById("revealEmoji");
          const popTitle = document.getElementById("popTitle");
          const popText = document.getElementById("popText");
          const closeBtn = document.getElementById("popupClose");
          const blueReveal = document.getElementById("blueReveal");

          let finalPrize = getOrderedPrizeForTurn() || box.prize;

          state.revealReady = false;

          boxClosed.className = "giftbox-big";
          boxClosed.style.display = "block";
          boxClosed.style.opacity = "1";
          boxClosed.style.background = "transparent";

          boxClosed.innerHTML = "";
          boxClosed.appendChild(createGiftImage({ width: 220, height: 220, src: REVEAL_IMAGE_PATH }));
          revealEmoji.classList.remove("show", "bounce");
          revealEmoji.textContent = "";
          blueReveal.classList.remove("flash");
          blueReveal.style.opacity = "0";
          popTitle.textContent = "กำลังเปิดกล่อง...";
          popText.textContent = "";
          closeBtn.style.display = "none";
          overlay.classList.add("show");

          await wait(250);

          playSound("gift");
          blueReveal.style.opacity = "1";
          blueReveal.style.transform = "scale(0.7)";
          void blueReveal.offsetWidth;
          blueReveal.classList.add("flash");
          await wait(320);

          boxClosed.style.display = "none";
          blueReveal.style.opacity = "0";

          popTitle.textContent = "✨ กำลังเปิดรางวัล...";
          await wait(280);

          // คำนวณรางวัลพิเศษตามรอบการหมุน
          let specialPrizeName = "";
          if (dbTotalSpins % 5 === 0) {
            specialPrizeName = 'แลคตาซอย';
          } else if (dbTotalSpins % 2 === 1) {
            specialPrizeName = 'ไดนาไมท์';
          } else {
            specialPrizeName = 'ดิวเบอร์รี่';
          }

          revealEmoji.innerHTML = `<img src="${finalPrize.image}" style="width: 200px; height: 200px; object-fit: contain;">`;
          revealEmoji.classList.add("show");
          void revealEmoji.offsetWidth;
          revealEmoji.classList.add("bounce");

          state.stars += 5;
          state.gift += 1;
          updateHUD();

          // สร้าง HTML สำหรับรางวัลพิเศษ
          let specialPrizeHTML = '';
          let specialPrizeImage = '';

          if (specialPrizeName === "แลคตาซอย") {
            specialPrizeImage = "sponsors/lactasoy.png";
          } else if (specialPrizeName === "ดิวเบอร์รี่") {
            specialPrizeImage = "sponsors/blueberry.png";
          } else {
            specialPrizeImage = "sponsors/dynamite.png";
          }

          if (specialPrizeImage) { 
            specialPrizeHTML = ` 
                <div style="
                    margin-top:15px; 
                    background:#f9f9f9; 
                    padding:20px; 
                    border-radius:15px; 
                    border:2px solid #f1c40f;
                    font-family:'Kanit', sans-serif;
                "> 

                    <p style="
                        margin:0 0 10px 0; 
                        color:#34495e; 
                        font-weight:700; 
                        font-size:24px;
                        font-family:'Kanit', sans-serif;
                    ">
                        ✨ รับเพิ่ม! รางวัลพิเศษ ✨
                    </p> 

                    <img 
                        src="${specialPrizeImage}" 
                        style="
                            width:300px; 
                            height:300px; 
                            object-fit:contain;
                        "
                    > 

                </div> 
            `; 
          }

          // ดึงชื่อผู้เล่นปัจจุบัน
          const currentPlayer = getCurrentPlayerName() || "ผู้เล่น";

          popTitle.textContent = "🎉 ยินดีด้วย!";
          popTitle.style.fontFamily = "'Kanit', sans-serif";
          popTitle.style.fontWeight = "700";

          // แสดงชื่อผู้เล่นพร้อมรางวัลที่ได้รับ
          popText.innerHTML = `
              <div style="
                  font-family: 'Kanit', sans-serif;
                  font-weight: 700;
                  font-size: 44px;
                  color: #2c3e50;
                  margin-bottom: 8px;
              ">
                  คุณ ${currentPlayer}
              </div>
              <div style="
                  font-family: 'Kanit', sans-serif;
                  font-weight: 700;
                  font-size: 28px;
                  color: #e67e22;
              ">
                  ได้รับ ${finalPrize.name}! (+5 ⭐)
              </div>
              ${specialPrizeHTML}
          `;

          closeBtn.style.display = "inline-block";

          state.revealReady = true;

          // ตัดสต็อกและเพิ่มจำนวนการเล่นสะสม
          db.ref('currentStock/' + finalPrize.name).transaction((current) => (current || 0) - 1);
          db.ref('totalSpins').transaction((count) => (count || 0) + 1);

          // --- บันทึกประวัติการได้รับรางวัลลง Firebase ---
          const now = new Date();
          const timestampStr = now.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });

          db.ref('history').push({
            orderNo: (dbTotalSpins || 0) + 1,
            playerName: currentPlayer,
            prize: finalPrize.name,
            specialPrize: specialPrizeName || "-",
            datetime: timestampStr,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
          // ------------------------------------------

          setTimeout(() => {
            if (phase === "revealing" && state.revealReady) {
              closeRevealAndRestart();
            }
          }, 15000);
        }

        document.getElementById("popupClose").addEventListener("click", () => {
          if (phase === "revealing" && state.revealReady) {
            closeRevealAndRestart();
          }
        });

        function closeRevealAndRestart() {
          stopTimer();
          document.getElementById("overlay").classList.remove("show");
          state.revealReady = false;

          removeCurrentPlayerFromQueue();
          resetPrizeField();

          phase = "locked";
          state.clawXPct = 50;
          state.depth = 0;
          state.timeLeft = 15;
          heldPrizeEl.classList.remove("show");
          heldPrizeEl.innerHTML = "";
          clawEl.classList.remove("closed");
          rod.style.height = ROD_REST + "px";
          renderMotor();
          setHint("กด Enter หรือกดปุ่ม START เพื่อเริ่มเกมสำหรับผู้เล่นถัดไป");
          updateHUD();
          updateStartButtonState();
        }

        function showOut() {
          outMsg.classList.add("show");
        }
        document.getElementById("refillBtn").addEventListener("click", () => {
          state.credit = 20;
          outMsg.classList.remove("show");
          updateHUD();
        });

        function showAllCaught() {
          document.getElementById("allCaughtMsg").classList.add("show");
        }
        document.getElementById("restockBtn").addEventListener("click", () => {
          resetPrizeField();
          document.getElementById("allCaughtMsg").classList.remove("show");
        });

        document
          .getElementById("btnSound")
          .addEventListener("click", function () {
            this.textContent = this.textContent === "🔊" ? "🔇" : "🔊";
          });

        function syncPlayerFromAdmin() {
          const queueDisplay = document.getElementById('queueDisplay');
          const uniqueQueue = [...new Set(dbQueue)];

          if (queueDisplay) {
            queueDisplay.textContent = uniqueQueue.length
              ? `คิวปัจจุบัน: ${uniqueQueue[0]}`
              : 'คิว: รอชื่อผู้เล่น';
          }

          updateCurrentPlayerBadge();
          updateStartButtonState();
          
          if (!hasActivePlayer()) {
            setHint('รอชื่อผู้เล่นเข้าคิวก่อนเริ่มเกม');
          } else if (phase === 'locked') {
            setHint('กด Enter หรือกดปุ่ม START เพื่อเริ่มเกม');
          }
        }

        db.ref().on('value', (snapshot) => {
          const data = snapshot.val() || {};
          dbQueue = normalizeQueue(data.customerQueue || {});
          dbStock = data.currentStock || {};
          dbTotalSpins = data.totalSpins || 0;
          dbPrizeOrder = data.prizeOrder || {};
          syncPlayerFromAdmin();
        });

        phase = "locked";
        document.getElementById("startOverlay").classList.add("hide");
        stopTimer();
        state.timeLeft = 15;
        state.revealReady = false;
        setHint('รอชื่อผู้เล่นเข้าคิวก่อนเริ่มเกม');
        updateCurrentPlayerBadge();
        updateHUD();
        updateStartButtonState();

