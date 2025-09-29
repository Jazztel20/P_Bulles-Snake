import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision } from "./collision.js";
import { drawScore } from "./score.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables globales
const box = 20;
const gameSpeed = 200;
let snake;
let food;
let direction = "RIGHT";
let score = 0;
let gameInterval; // Variable pour stocker l'identifiant de l'intervalle

document.addEventListener("keydown", (event) => {
  direction = handleDirectionChange(event, direction);
});

function startGame() {
  snake = initSnake();
  food = generateFood(box, canvas);

  gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
}

function draw() {
 // Nettoyer le canevas
 ctx.clearRect(0, 0, canvas.width, canvas.height);

// Dessine la nourriture et le servent actuels
  drawFood(ctx,food, box);
  drawSnake(ctx, snake, box);
  drawScore(ctx, score);

  // Caclule la prochaine tête du serpent
  const nextHead = moveSnake(snake, direction, box);
  
  // Collisions
  if (checkWallCollision(nextHead, canvas, box) || checkCollision(nextHead, snake)) {

    // Game Over
    clearInterval(gameInterval);

    // Affichage d'un message simple
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial"
    ctx.textAlign = "middle";
    ctx.fillText("Game Over! Score: " + score, canvas.width / 2, canvas.height / 2 + 10 + "- F5 pour rejouer");
    return;
  }

  // Manger
  const ate = nextHead.x === food.x && nextHead.y === food.y;

  // Ajoute la nouvelle tête 
  snake.unshift(nextHead);

  if(ate){
    score += 1;
    food = generateFood(box, canvas);
    // pas de pop -> le serpent grandit
  } else {
    snake.pop(); // Enlève la queue pour se déplacer
  }
}
startGame();
