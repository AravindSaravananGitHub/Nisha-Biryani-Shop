const links = document.querySelectorAll(".menu-container ul li h3 a");
const currentUrl = window.location.href;

// For Show active page in Nav

links.forEach((link) => {
  if (link.href === currentUrl) {
    link.classList.add("active");
  }
});
