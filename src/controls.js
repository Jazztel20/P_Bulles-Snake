/**
 * Gère le changement de direction du serpent en fonction de l'entrée de l'utilisateur.
 *
 * Cette fonction est appelée chaque fois qu'une touche directionnelle est pressée.
 * Elle vérifie que la nouvelle direction n'est pas opposée à la direction actuelle
 * (pour éviter que le serpent se retourne sur lui-même) et retourne la nouvelle direction
 * si elle est valide.
 *
 * @param {KeyboardEvent} event - L'événement clavier qui contient les informations sur la touche pressée.
 * @param {string} currentDirection - La direction actuelle du serpent (peut être "UP", "DOWN", "LEFT", ou "RIGHT").
 * @returns {string} - La nouvelle direction du serpent après traitement, ou la direction actuelle si le changement n'est pas valide.
 */
export function handleDirectionChange(event, currentDirection) {
  // récupère la touche pressée (ex: "ArrowLeft")
  const key = event.key;
  switch (key) {
    case "ArrowLeft":
      // Interdit le demi-tour immédiat (droite -> gauche)
      if (currentDirection !== "RIGHT") return "LEFT";
      break;
    case "ArrowUp":
      // Interdit le demi-tour immédiat (bas -> haut)
      if (currentDirection !== "DOWN") return "UP";
      break;
    case "ArrowRight":
      // Interdit le demi-tour immédiat (gauche -> droite)
      if (currentDirection !== "LEFT") return "RIGHT";
      break;
    case "ArrowDown":
      // Interdit le demi-tour immédiat (haut -> bas)
      if (currentDirection !== "UP") return "DOWN";
      break;  
  }
  // si la touche ne change pas la direction, on conserve l'actuelle
  return currentDirection;
}
