// Simulated database
const imageDB = [
  { id: 101, url: "img/blue-coster.jpeg", description: "Blue Coster under a microscope" },
  { id: 102, url: "img/carpet.jpeg", description: "Carpet under a microscope" },
  { id: 103, url: "img/m4-mac-mini.jpeg", description: "M4 Mac Mini under a microscope" },
  { id: 104, url: "img/magic-keyboard.jpeg", description:"Magic Keyboard under a microscope" },
  { id: 105, url: "img/red-apple-logo.jpeg", description: "Red Apple Logo under a microscope" },
  { id: 106, url: "img/table.jpeg", description: "Table under a microscopen" },
  { id: 107, url: "img/wood-chair.jpeg", description: "Wood Chair under a microscope" }

];

// Get current scope from URL
const urlParams = new URLSearchParams(window.location.search);
let scopeID = parseInt(urlParams.get("scope")) || imageDB[0].id;

// Helpers
function getImageById(id) {
  return imageDB.find(img => img.id === id);
}

function getRandomImage() {
  return imageDB[Math.floor(Math.random() * imageDB.length)];
}

// Display image
function displayImage(id) {
  const imgData = getImageById(id);
  if (!imgData) return;

  document.getElementById("scopeImage").src = imgData.url;
  document.getElementById("imageDescription").textContent = imgData.description;
  history.replaceState({}, "", `?scope=${imgData.id}`);
  scopeID = imgData.id;
}

displayImage(scopeID);

// Save
document.getElementById("saveBtn").addEventListener("click", () => {
  const imgData = getImageById(scopeID);
  let saved = JSON.parse(localStorage.getItem("savedImages") || "[]");
  if (!saved.find(img => img.id === imgData.id)) {
    saved.push(imgData);
    localStorage.setItem("savedImages", JSON.stringify(saved));
    alert("Image saved!");
  } else {
    alert("Image already saved.");
  }
});

// Share
document.getElementById("shareBtn").addEventListener("click", () => {
  const imgData = getImageById(scopeID);
  if (navigator.share) {
    navigator.share({
      title: "Image Scope",
      text: imgData.description,
      url: `${location.origin}${location.pathname}?scope=${imgData.id}`
    }).catch(err => console.error("Share failed", err));
  } else {
    alert("Share not supported in this browser.");
  }
});

// Navigation
function goPrev() {
  const index = imageDB.findIndex(img => img.id === scopeID);
  if (index > 0) {
    displayImage(imageDB[index - 1].id);
  }
}

function goNext() {
  const index = imageDB.findIndex(img => img.id === scopeID);
  if (index < imageDB.length - 1) {
    displayImage(imageDB[index + 1].id);
  }
}

function goRandom() {
  const randomImage = getRandomImage();
  displayImage(randomImage.id);
}

// Button events
document.getElementById("upBtn").addEventListener("click", goPrev);
document.getElementById("downBtn").addEventListener("click", goNext);
document.getElementById("randomBtn").addEventListener("click", goRandom);

// Keyboard events
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    goPrev();
  } else if (e.key === "ArrowDown") {
    goNext();
  } else if (e.key.toLowerCase() === "r") {
    goRandom();
  }
});
