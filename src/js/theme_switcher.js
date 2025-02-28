// Apply a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
}

// Toggle between light and dark theme
function toggleTheme() {
 if (localStorage.getItem('theme') === 'theme-dark'){
     setTheme('theme-light');
 } else {
     setTheme('theme-dark');
 }
}

// Set the theme on initial load
(function () {
 if (localStorage.getItem('theme') === 'theme-dark') {
     setTheme('theme-dark');
 } else {
     setTheme('theme-light');
 }
})();

// Listen for changes to the dark mode media query and set the theme to match
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)').onchange = (e) => {
    if (e.matches) {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
}
