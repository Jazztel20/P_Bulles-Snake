import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision } from "./collision.js";
import { drawScore } from "./score.js";


// Récupère l'élément <canvas> depuis le fichier HTML
const canvas = document.getElementById("gameCanvas");
// Récupère le contexte de dessin en 2D pour pouvoir tracer des formes sur le canvas
const ctx = canvas.getContext("2d");
// Affichage du score dans le DOM (au-dessus du canvas)
const scoreDisplay = document.getElementById("scoreDisplay"); 


// Variables globales
const box = 20;           // Taille d'une case de la grille (en pixels)
const gameSpeed = 150;    // Vitesse du jeu (en millisecondes entre chaque frame)
let snake;                // Tableau représentant le serpent
let food;                 // Objet représentant la nourriture
let direction = "RIGHT";  // Direction de départ du serpent
let score = 0;            // Score du joueur
let gameInterval;         // Variable pour stocker l'identifiant de l'intervalle
let startTime;            // Variable pour stocker le temps de début du jeu  

// Détecte lorsqu'une touche est pressée et met à jour la direction du serpent
document.addEventListener("keydown", (event) => {
  direction = handleDirectionChange(event, direction);
});

function startGame() {
  // Initialise le serpent et la nourriture au démarrage
  snake = initSnake();
  food = generateFood(box, canvas);

  // Démarre le chronomètre au lancement du jeu
  startTime = Date.now();
  // Lance la boucle principale du jeu à intervalles réguliers
  gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
}

function draw() {
 // Efface le canevas avant de redessiner la nouvelle frame
 ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine la nourriture, le serpent et le score
  drawFood(ctx,food, box);
  drawSnake(ctx, snake, box);
  // On affiche le score à l'extérieur du canvas
  scoreDisplay.textContent = `Score: ${score}`;


  // Calcule la position de la prochaine tête du serpent
  const nextHead = moveSnake(snake, direction, box);
  
  // Si le serpent touche un mur ou son propre corps
  if (checkWallCollision(nextHead, canvas, box) || checkCollision(nextHead, snake)) {

    // Arrête la boucle du jeu
    clearInterval(gameInterval);

  // Texte à afficher à la fin du jeu
  // Texte à afficher à la fin du jeu
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Temps écoulé en secondes
  const gameOverLines = [
    "Game Over!",
    `Ton score: ${score}`,
    `Temps écoulé: ${elapsedTime} sec`,
    "Appuie sur F5 pour rejouer"
  ];

  // Paramètres de style
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Calcul dynamique de la hauteur totale du texte
  const lineHeight = 30; // Espacement entre les lignes
  const totalHeight = gameOverLines.length * lineHeight;

  // Position du centre de l'écran
  const centerY = canvas.height / 2;

  // Calcul du point de départ pour centrer verticalement les lignes
  const startY = centerY - totalHeight / 2;

  // Dessine un fond noir légèrement plus grand que le texte
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, startY - 20, canvas.width, totalHeight + 40);

  // Affiche chaque ligne centrée verticalement et horizontalement
  ctx.fillStyle = "#fff";
  gameOverLines.forEach((line, index) => {
    const y = startY + index * lineHeight + lineHeight / 2; // Décalage pour un centrage parfait
    ctx.fillText(line, canvas.width / 2, y);
  });
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
