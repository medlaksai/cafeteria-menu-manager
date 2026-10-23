const popupsBtn = document.querySelector(".add-repas");
const closeBtnPopUp = document.querySelector(".close-popup");
const showModal = document.querySelector(".popup-Form");




popupsBtn.addEventListener("click", () =>{
    showModal.classList.remove("hidden");
    
})
closeBtnPopUp.addEventListener("click", () =>{
    showModal.classList.add("hidden");
})


const button = document.getElementById("submit-Repas");
const nameRepas = document.getElementById("name");
const priceRepas = document.getElementById("price");

const container = document.getElementById("div-Repas");
const template = document.getElementById("items-cards");
const categorieSelect = document.getElementById("categorie");

button.addEventListener("click", (event) => {
  event.preventDefault();

  const valueName = nameRepas.value;
  const valuePrice = priceRepas.value;
  const valueCategorie = categorieSelect.value;
  const card = template.cloneNode(true);
  card.removeAttribute("id");
  const titre = card.querySelector("h3");
  const spans = card.querySelectorAll("span");

  titre.textContent = valueName;
  spans[0].textContent = valueCategorie;
  spans[1].textContent = `${valuePrice}dh`;

  container.appendChild(card);

  console.log(valueName);
  console.log(valuePrice);
  console.log(valueCategorie);
});

container.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-Btn");
  const card = deleteBtn.closest(".items-cards");
  card.remove();
  console.log("Repas A Ete Supprime!");
});