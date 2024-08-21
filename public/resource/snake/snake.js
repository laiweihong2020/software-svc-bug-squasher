const width = 400;
const height = 400;
const cellSize = 20;
const rows = height / cellSize;
const cols = width / cellSize;

const svg = d3.select("#game")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "game-board");

let snake = [{ x: 5, y: 5 }];
let direction = { x: 0, y: 0 }; // Initial direction is set to zero
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let gameInterval = null;

function drawBoard() {
  svg.selectAll("*").remove();

  // Draw snake
  svg.selectAll(".snake")
    .data(snake)
    .enter()
    .append("rect")
    .attr("class", "snake")
    .attr("x", d => d.x * cellSize)
    .attr("y", d => d.y * cellSize)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", "green");

  // Draw food
  svg.append("rect")
    .attr("class", "food")
    .attr("x", food.x * cellSize)
    .attr("y", food.y * cellSize)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", "red");
}

drawBoard();

document.addEventListener("keydown", (event) => {
  if (!gameInterval) {
    gameInterval = setInterval(updateGame, 200);
  }

  switch (event.key) {
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

function updateGame() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions with walls
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    alert("Game Over!");
    resetGame();
    return;
  }

  // Check for collisions with itself
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return;
  }
  }

  snake.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    food = { x: 5, y: 5};
  }
  snake.pop();


  drawBoard();
}

function resetGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  snake = [{ x: 5, y: 5 }];
  direction = { x: 0, y: 0 }; // Reset direction to zero
  food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  drawBoard();
}