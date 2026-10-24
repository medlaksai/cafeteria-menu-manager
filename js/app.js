const stock = [
  {
    id : 1 , 
    reppasName : "Tajine Poulet",
    reppasType : "", 
    reppasCategory : "Plat principal" , 
    reppasPrice : 30 } ,
    {
    id : 2 , 
    reppasName : "Salade",
    reppasType : "", 
    reppasCategory : "Entree" , 
    reppasPrice : 30 } ,
    {
    id : 3 , 
    reppasName : "Yoghort",
    reppasType : "", 
    reppasCategory : "Dessert" , 
    reppasPrice : 3 } ,
];

function fillSelect() {
    const selects = document.querySelectorAll(".repas-select");
    selects.forEach((select) => {
        const categorie = select.dataset.category;

        select.innerHTML = '<option value="">Choisir</option>';

        stock
            .filter((repas) => repas.reppasCategory === categorie)
            .forEach((repas) => {
                const option = document.createElement("option");
                option.value = repas.id;
                option.textContent = repas.reppasName;
                select.appendChild(option);
            });
    });
}

fillSelect();

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
const repasType = document.getElementById("type");

const container = document.getElementById("div-Repas");
const template = document.getElementById("items-cards");
const categorieSelect = document.getElementById("categorie");

button.addEventListener("click", (event) => {
  event.preventDefault();

  const valueName = nameRepas.value;
  const valuePrice = priceRepas.value;
  const valueCategorie = categorieSelect.value;
  const valueType = repasType.value;
  const card = template.cloneNode(true);
  const titre = card.querySelector("h3");
  const spans = card.querySelectorAll("span");
  
  titre.textContent = valueName;
  spans[0].textContent = valueCategorie;
  spans[1].textContent = valueType;
  spans[2].textContent = `${valuePrice}dh`;

  

  container.appendChild(card);
  nameRepas.value = "" ;
  categorieSelect.value = "";
  repasType.value = "" ; 
  priceRepas.value = "" ; 

});
container.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-Btn");
  const card = editBtn.closest(".items-cards");
  const titre = card.querySelector("h3");
  const spans = card.querySelectorAll("span");
  
  nameRepas.value = titre.textContent;
  categorieSelect.value = spans[0].textContent;
  repasType.value = spans[1].textContent;
  priceRepas.value = spans[2].textContent.replace("dh", "").trim();

  showModal.classList.remove("hidden");
  
});
container.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-Btn");
  const card = deleteBtn.closest(".items-cards");
  card.remove();
});
