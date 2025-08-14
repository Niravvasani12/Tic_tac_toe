let draggedDisk = null;
const winSound = new Audio("win.mp3"); // Load the sound file

function initializeGame() {
  const towers = document.getElementsByClassName("tower");
  for (let tower of towers) {
    updateDraggable(tower);
  }
}

function updateDraggable(tower) {
  const disks = tower.getElementsByClassName("disk");

  // Make all disks undraggable first
  for (let disk of disks) {
    disk.setAttribute("draggable", false);
  }

  // Make only the top disk draggable (visually top because of column-reverse is index 0)
  if (disks.length > 0) {
    disks[0].setAttribute("draggable", true);
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  draggedDisk = event.target;
}

function touchDragStart(event) {
  draggedDisk = event.target;
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  // Hide popup before checking
  hideInvalidMovePopup();

  const tower = event.target.closest(".tower");

  if (tower) {
    const disks = tower.getElementsByClassName("disk");

    // Get the top disk visually (because column-reverse)
    const topDisk = disks.length > 0 ? disks[0] : null;

    if (disks.length === 0 || draggedDisk.clientWidth < topDisk.clientWidth) {
      tower.insertBefore(draggedDisk, topDisk); // Place on top visually
      updateAllTowers();
      checkWin();
    } else {
      showInvalidMovePopup(); // Only show on invalid move
    }
  }
}

function updateAllTowers() {
  const towers = document.getElementsByClassName("tower");
  for (let tower of towers) {
    updateDraggable(tower);
  }
}

function checkWin() {
  const tower3 = document
    .getElementById("tower3")
    .getElementsByClassName("disk");
  if (tower3.length === 3) {
    document.getElementById("status").textContent =
      "Congratulations! You solved the Tower of Hanoi!";
    winSound.play();
    createBubbles();
  }
}

function createBubbles() {
  const bubbleContainer = document.createElement("div");
  bubbleContainer.className = "bubble-container";
  document.body.appendChild(bubbleContainer);

  for (let i = 0; i < 30; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const size = Math.random() * 30 + 10 + "px";
    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = Math.random() * 100 + "vw";
    bubble.style.animationDelay = Math.random() * 2 + "s";
    bubbleContainer.appendChild(bubble);
  }

  setTimeout(() => {
    bubbleContainer.remove();
  }, 5000);
}

// Popup Functions
function showInvalidMovePopup() {
  const popup = document.getElementById("invalidMovePopup");
  popup.style.display = "flex";
}

function hideInvalidMovePopup() {
  const popup = document.getElementById("invalidMovePopup");
  popup.style.display = "none";
}

document
  .getElementById("closePopupBtn")
  .addEventListener("click", hideInvalidMovePopup);

// Add event listeners for both mouse and touch events
function addEventListeners(disk) {
  disk.addEventListener("dragstart", drag);
  disk.addEventListener("touchstart", touchDragStart);
  disk.addEventListener("touchmove", (event) => event.preventDefault());
}

window.onload = function () {
  initializeGame();

  const disks = document.querySelectorAll(".disk");
  disks.forEach((disk) => {
    addEventListeners(disk);
  });

  const towers = document.querySelectorAll(".tower");
  towers.forEach((tower) => {
    tower.addEventListener("touchend", drop);
    tower.addEventListener("drop", drop);
  });
};
