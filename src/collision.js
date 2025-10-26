/**
 * Vérifie si la tête du serpent entre en collision avec son propre corps.
 *
 * Cette fonction détermine si la tête du serpent occupe la même position que
 * n'importe quel autre segment de son corps. Si la tête du serpent se trouve
 * aux mêmes coordonnées `x` et `y` qu'un autre segment, la fonction retourne `true`,
 * indiquant une collision avec le corps du serpent (c'est-à-dire que le serpent se mord la queue).
 *
 * @param {{x: number, y: number}} head - Un objet représentant les coordonnées `x` et `y` de la tête du serpent.
 * @param {Array<{x: number, y: number}>} snakeArray - Un tableau d'objets représentant les segments du serpent, où chaque objet contient des coordonnées `x` et `y`.
 * @returns {boolean} - Retourne `true` si la tête du serpent entre en collision avec un segment de son corps, sinon `false`.
 */
export function checkCollision(head, snakeArray) {
  // On commence à 1 pour ignorer la tête (index 0) et ne comparer qu'avec le corps
  for (let i = 1; i < snakeArray.length; i++) {
    // Si la tête partage exactement les mêmes coordonnées qu'un segment du corps
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y){
      // collision détectée
      return true;
    }
  }
  // aucune collision avec le corps
  return false;
}

/**
 * Vérifie si la tête du serpent entre en collision avec les murs du canvas.
 *
 * Cette fonction détermine si la tête du serpent a dépassé les limites du canvas,
 * ce qui signifierait une collision avec un mur. Si la tête du serpent sort du canvas
 * (c'est-à-dire si ses coordonnées `x` ou `y` sont en dehors des limites définies par
 * la largeur et la hauteur du canvas), la fonction retourne `true`, indiquant une collision.
 *
 * @param {{x: number, y: number}} head - Un objet représentant les coordonnées `x` et `y` de la tête du serpent.
 * @param {HTMLCanvasElement} canvas - L'élément canvas représentant la surface de jeu.
 * @param {number} box - La taille d'une case de la grille en pixels, utilisée pour déterminer les limites du déplacement du serpent.
 * @returns {boolean} - Retourne `true` si la tête du serpent entre en collision avec un mur, sinon `false`.
 */
export function checkWallCollision(head, canvas, box) {
  // Teste les 4 bords : gauche/haut (valeurs négatives) et droite/bas (au-delà de la largeur/hauteur)
  if (
    // sorti par la gauche
    head.x < 0 ||
    // sorti par la gauche
    head.y < 0 ||
    // au moins une case en dehors à droite
    head.x >= canvas.width / box * box ||
    // au moins une case en dehors en bas
    head.y >= canvas.height / box * box 
  ) {
    // collision avec un mur
    return true;
  }
  // pas de collision murale
  return false;
}
