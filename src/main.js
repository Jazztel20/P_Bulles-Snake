import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision } from "./collision.js";
import { drawScore } from "./score.js";


// Récupère l'élément <canvas> depuis le fichier HTML
const canvas = document.getElementById("gameCanvas");
// Récupère le contexte de dessin en 2D pour pouvoir tracer des formes sur le canvas
const ctx = canvas.getContext("2d");

// Variables globales
const box = 20;           // Taille d'une case de la grille (en pixels)
const gameSpeed = 200;    // Vitesse du jeu (en millisecondes entre chaque frame)
let snake;                // Tableau représentant le serpent
let food;                 // Objet représentant la nourriture
let direction = "RIGHT";  // Direction de départ du serpent
let score = 0;            // Score du joueur
let gameInterval;         // Variable pour stocker l'identifiant de l'intervalle

// Détecte lorsqu'une touche est pressée et met à jour la direction du serpent
document.addEventListener("keydown", (event) => {
  direction = handleDirectionChange(event, direction);
});

function startGame() {
  // Initialise le serpent et la nourriture au démarrage
  snake = initSnake();
  food = generateFood(box, canvas);

  // Lance la boucle principale du jeu à intervalles réguliers
  gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
}

function draw() {
 // Efface le canevas avant de redessiner la nouvelle frame
 ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine la nourriture, le serpent et le score
  drawFood(ctx,food, box);
  drawSnake(ctx, snake, box);
  drawScore(ctx, score);

  // Calcule la position de la prochaine tête du serpent
  const nextHead = moveSnake(snake, direction, box);
  
  // Si le serpent touche un mur ou son propre corps
  if (checkWallCollision(nextHead, canvas, box) || checkCollision(nextHead, snake)) {

    // Arrête la boucle du jeu
    clearInterval(gameInterval);

    // Affiche un message "Game Over" au centre de l’écran
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Game Over! Score: ${score} - F5 pour rejouer`, canvas.width / 2, canvas.height / 2);
    return;
  }

  // Vérifie si le serpent a mangé la nourriture
  const ate = nextHead.x === food.x && nextHead.y === food.y;

  // Ajoute la nouvelle tête à l’avant du tableau (le serpent avance)
  snake.unshift(nextHead);

  if(ate){
    // Si le serpent mange : augmente le score
    score += 1;
    // Génère une nouvelle nourriture à un emplacement aléatoire
    food = generateFood(box, canvas);
    // Pas de suppression de la queue → le serpent grandit
  } else {
    // Si le serpent n’a rien mangé, supprime le dernier segment pour simuler le mouvement
    snake.pop(); 
  }
}
// Démarre le jeu dès le chargement
startGame();
