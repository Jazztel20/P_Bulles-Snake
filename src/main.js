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
let isPaused = false;     // Etat de pause
let pausedTime = 0;       // Total du temps passé en pause (ms)
let pauseStart = null;    // Timestamp du début de la pause
let startTime;            // Timestamp du début de partie


// Détecte lorsqu'une touche est pressée et met à jour la direction du serpent
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.key === " ") {
    if (event.repeat) return;    // évite l’auto-répétition de la barre d’espace
    event.preventDefault();      // évite le scroll de la page
    togglePause();
    return;
  }
  direction = handleDirectionChange(event, direction);
});




function startGame() {
  // Initialise le serpent et la nourriture au démarrage
  snake = initSnake();
  food = generateFood(box, canvas);

  // Réinitialise le temps passé en pause (important si on recommence une partie)
  pausedTime = 0;

  // Supprime tout marqueur de pause précédent
  pauseStart = null;

  // Assure que le jeu démarre en mode "non pausé"
  isPaused = false;

  // Démarre le chronomètre au lancement du jeu
  startTime = Date.now();

  // Lance la boucle principale du jeu à intervalles réguliers
  // La fonction draw() sera appelée toutes les "gameSpeed" millisecondes pour animer le serpent
  gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
}


function togglePause() {
  // Si le jeu est déjà en pause
  if (isPaused) {
    // On calcule combien de temps la pause a duré
    pausedTime += Date.now() - pauseStart;

    // On remet le marqueur de début de pause à zéro
    pauseStart = null;

    // Le jeu reprend
    isPaused = false;
  } else {
    // Si le jeu n’est pas encore en pause
    // On enregistre le moment où la pause commence
    pauseStart = Date.now();

    // On active l’état de pause (le jeu s’arrêtera dans draw())
    isPaused = true;
  }
}





function draw() {
 // Efface le canevas avant de redessiner la nouvelle frame
 ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine la nourriture, le serpent et le score
  drawFood(ctx,food, box);
  drawSnake(ctx, snake, box);
  // On affiche le score à l'extérieur du canvas
  scoreDisplay.textContent = `Score: ${score}`;

  // PAUSE : si le jeu est en pause, on affiche un overlay et on ne met rien à jour 
  if (isPaused) {
    // Définition de la hauteur de la zone sombre affichée au centre
    const boxHeight = 100;

    // Dessine un rectangle semi-transparent au centre de l’écran
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, (canvas.height - boxHeight) / 2, canvas.width, boxHeight);

    // Configure le style du texte "PAUSE"
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Affiche le texte "PAUSE" au centre exact du canevas
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);

    // ➜ On sort de la fonction draw() : rien d'autre n'est mis à jour
    return;
  }

  // Calcule la position de la prochaine tête du serpent
  const nextHead = moveSnake(snake, direction, box);
  
  // Si le serpent touche un mur ou son propre corps
  if (checkWallCollision(nextHead, canvas, box) || checkCollision(nextHead, snake)) {

  // Arrête la boucle du jeu
  clearInterval(gameInterval);

  // Texte à afficher à la fin du jeu

  // Calcule le temps écoulé depuis le début de la partie.
  // On soustrait le temps total passé en pause pour avoir la durée réelle de jeu.
  const elapsedTime = Math.floor((Date.now() - startTime - pausedTime) / 1000);

  // Définit les lignes de texte à afficher à la fin du jeu
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
