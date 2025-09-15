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

 // 1) calculer la nouvelle tête à partir de l'état courant
 const newHead = moveSnake(snake, direction, box);

  // 2) vérifier les collisions
  if (checkWallCollision(newHead, canvas) || checkCollision(newHead, snake)) {
    clearInterval(gameInterval); // Arrêter le jeu en supprimant l'intervalle
    alert("Game Over! Votre score: " + score);
    return;
  }

  // 3) Avancer (ajouter la tête)
  snake.unshift(newHead);

  // 4) Manger la nourriture
  const ateFood = newHead.x === food.x && newHead.y === food.y;
  if (ateFood) {
    score +=1;

    // Générer la nourriture sur une case libre
    do {
      food = generateFood(box, canvas);
    } while (checkCollision(seg => seg.x === food.x && seg.y === food.y,));
  }else{
    // Pas mangé -> retirer la queue 
    snake.pop()
  }

  // 5) Dessiner
  drawSnake(ctx, snake, box);
  drawFood(ctx, food, box);
  drawScore(ctx, score);
}
startGame();
