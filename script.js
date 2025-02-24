// Global variables
let generatedImages = []; // Store original "/i/" image URLs
let currentImageIndex = -1; // Index for current popup image
const batchSize = 20; // Number of images to load per batch
let totalImagesLoaded = 0; // Count of images loaded

// Base image URLs – add more as needed
const baseLinks = [
  "https://i.imx.to/i/2025/02/10/5x0999.jpg",
  "https://i.imx.to/i/2025/02/22/5y8s3x.jpg"
];

// Allowed characters for random string (a-z and 0-9)
const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";

// Function to generate a random string of specified length
function generateRandomString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    result += allowedChars[randomIndex];
  }
  return result;
}

// Function to modify a URL by removing last 3 characters before ".jpg" and appending 3 random characters
function modifyLink(link) {
  const jpgIndex = link.lastIndexOf(".jpg");
  if (jpgIndex === -1) return link;
  const basePart = link.substring(0, jpgIndex);
  const newBase = basePart.slice(0, -3);  // Remove last 3 characters
  const randomSuffix = generateRandomString(3);
  return newBase + randomSuffix + ".jpg";
}

// Function to create and append a batch of images to the grid
function loadNextBatch() {
  const imagesGrid = document.getElementById("imagesGrid");
  for (let i = 0; i < batchSize; i++) {
    // Select a random base link and modify it
    const randomBase = baseLinks[Math.floor(Math.random() * baseLinks.length)];
    const originalLink = modifyLink(randomBase);
    // Save the original URL in the global array
    generatedImages.push(originalLink);
    totalImagesLoaded++;
    // Create display URL by replacing "/i/" with "/t/"
    const displayLink = originalLink.replace("/i/", "/t/");
    
    // Create image element
    const img = document.createElement("img");
    img.src = displayLink;
    img.alt = "Generated Image";
    // Store both URLs in data attributes
    img.dataset.display = displayLink;
    img.dataset.original = originalLink;

    // Set up hover event to switch to original URL after 2 seconds
    let hoverTimeout;
    img.addEventListener("mouseenter", () => {
      hoverTimeout = setTimeout(() => {
        img.src = img.dataset.original;
      }, 2000);
    });
    img.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);
      img.src = img.dataset.display;
    });
    // On click, open the popup and show the clicked image; update currentImageIndex accordingly
    img.addEventListener("click", () => {
      currentImageIndex = generatedImages.indexOf(img.dataset.original);
      openPopup(currentImageIndex);
    });
    imagesGrid.appendChild(img);
  }
}

// Function to open the popup with image at specified index
function openPopup(index) {
  const popupOverlay = document.getElementById("popupOverlay");
  const popupImage = document.getElementById("popupImage");
  popupImage.src = generatedImages[index];
  popupOverlay.style.display = "flex";
}

// Function to close the popup
function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

// Function to download the current image
function downloadCurrentImage() {
  const link = document.createElement("a");
  link.href = generatedImages[currentImageIndex];
  link.download = ""; // Let the browser set the filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to show previous image in the carousel
function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
  } else {
    currentImageIndex = generatedImages.length - 1; // Wrap around to last image
  }
  document.getElementById("popupImage").src = generatedImages[currentImageIndex];
}

// Function to show next image in the carousel
function showNextImage() {
  if (currentImageIndex < generatedImages.length - 1) {
    currentImageIndex++;
  } else {
    currentImageIndex = 0; // Wrap around to first image
  }
  document.getElementById("popupImage").src = generatedImages[currentImageIndex];
}

// Event listener for the "Generate" button: load initial batch and set up infinite scrolling
document.getElementById("generateButton").addEventListener("click", () => {
  // Clear grid and reset variables
  document.getElementById("imagesGrid").innerHTML = "";
  generatedImages = [];
  totalImagesLoaded = 0;
  loadNextBatch();
});

// Infinite scrolling: Load next batch when near the bottom of the page
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100) {
    loadNextBatch();
  }
});

// Event listener for download button in popup
document.getElementById("downloadBtn").addEventListener("click", downloadCurrentImage);

// Event listeners for carousel buttons
document.getElementById("prevBtn").addEventListener("click", showPrevImage);
document.getElementById("nextBtn").addEventListener("click", showNextImage);

// Close popup when clicking outside popup content
document.getElementById("popupOverlay").addEventListener("click", function(e) {
  if (e.target === this) {
    closePopup();
  }
});