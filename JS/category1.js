//this js is to make that when the user clicks on a category it moves backward like a button
const links = document.querySelectorAll("a");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    history.back();
  });
});