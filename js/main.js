const links = document.querySelectorAll(".menu-container ul li h3 a");
const currentUrl = window.location.href;
const year = document.getElementById("year");
const thisYear = new Date().getFullYear();

// For Show active page in Nav

links.forEach((link) => {
  if (link.href === currentUrl) {
    link.classList.add("active");
  }
});

// For copy right year
year.innerHTML = thisYear;
