/**
 * Dessine le score sur le canvas.
 *
 * Cette fonction affiche le score actuel du jeu dans le coin supérieur gauche du canvas.
 * Le score est affiché en noir avec une police Arial de 20px.
 *
 * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D du canvas utilisé pour dessiner.
 * @param {number} score - Le score à afficher, qui est un entier.
 */
export function drawScore(ctx, score) {
  // couleur du texte (noir)
  ctx.fillStyle = "#000";
  // police et taille du texte
  ctx.font = "20px Arial";
  // ancre le texte par le haut
  ctx.textBaseline = "top";
  // écrit le score à (10,10)
  ctx.fillText(`Score: ${score}`, 10, 10);
}
