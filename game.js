const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const player = {
    x: 50,
    y: 200,
    width: 50,
    height: 50,
    speed: 5,
    hp: 100,
    img: new Image()
};
player.img.src = "assets/pepeuser.png";

const ai = {
    x: 700,
    y: 200,
    width: 70,
    height: 70,
    speed: 2,
    hp: 690,
    maxHp: 690,
    img: new Image()
};
ai.img.src = "assets/pepeking.png";

const bullets = [];
const aiBullets = [];
let gameOver = false;

function drawCharacter(character, label) {
    ctx.drawImage(character.img, character.x, character.y, character.width, character.height);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(label, character.x + character.width / 4, character.y - 15);
}

function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach((bullet, index) => {
        bullet.x += 8;
        ctx.fillRect(bullet.x, bullet.y, 10, 5);
        if (bullet.x > canvas.width) bullets.splice(index, 1);
    });

    ctx.fillStyle = "yellow";
    aiBullets.forEach((bullet, index) => {
        bullet.x -= 5;
        ctx.fillRect(bullet.x, bullet.y, 10, 5);
        if (bullet.x < 0) aiBullets.splice(index, 1);
    });
}

function updateAI() {
    if (ai.y < player.y) ai.y += ai.speed;
    else if (ai.y > player.y) ai.y -= ai.speed;

    if (Math.random() < 0.1) {
        aiBullets.push({ x: ai.x, y: ai.y + ai.height / 2 });
    }
}

function drawHPBars() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y - 10, (player.hp / 100) * player.width, 5);
    
    ctx.fillStyle = "red";
    ctx.fillRect(ai.x, ai.y - 10, (ai.hp / ai.maxHp) * ai.width, 5);
}

// Fungsi untuk memperbarui tampilan HP di HUD
function updateHUD() {
    document.getElementById("playerHP").innerText = `Player HP: ${player.hp}`;
    document.getElementById("aiHP").innerText = `PEPE BYTE HP: ${ai.hp}`;
}

function checkCollisions() {
    bullets.forEach((bullet, index) => {
        if (bullet.x >= ai.x && bullet.y >= ai.y && bullet.y <= ai.y + ai.height) {
            ai.hp -= 50;
            bullets.splice(index, 1);
            updateHUD(); // Update tampilan HP setelah serangan
        }
    });

    aiBullets.forEach((bullet, index) => {
        if (bullet.x <= player.x + player.width && bullet.y >= player.y && bullet.y <= player.y + player.height) {
            player.hp -= 10;
            aiBullets.splice(index, 1);
            updateHUD(); // Update tampilan HP setelah terkena serangan
        }
    });

    if (player.hp <= 0) endGame("Game Over! PEPE BYTE Win!");
    if (ai.hp <= 0) endGame("You Win!");
}

function endGame(message) {
    gameOver = true;
    bullets.length = 0;
    aiBullets.length = 0;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
    showPlayAgainButton();
}

function showPlayAgainButton() {
    const button = document.createElement("button");
    button.innerText = "Play Again";
    button.style.position = "absolute";
    button.style.top = "450px";
    button.style.left = "50%";
    button.style.transform = "translateX(-50%)";
    button.onclick = resetGame;
    document.body.appendChild(button);
}

function resetGame() {
    player.hp = 100;
    ai.hp = ai.maxHp;
    gameOver = false;
    document.body.removeChild(document.querySelector("button"));
    updateHUD(); // Perbarui HP di layar saat reset game
    gameLoop();
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter(player, "YOU");
    drawCharacter(ai, "PEPE BYTE");
    drawBullets();
    drawHPBars();
    updateAI();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    if (event.key === "ArrowUp" && player.y > 0) player.y -= player.speed;
    if (event.key === "ArrowDown" && player.y < canvas.height - player.height) player.y += player.speed;
    if (event.key === " ") bullets.push({ x: player.x + player.width, y: player.y + player.height / 2 });
});

// Panggil updateHUD untuk memastikan tampilan HP diupdate saat game dimulai
updateHUD();
gameLoop();
