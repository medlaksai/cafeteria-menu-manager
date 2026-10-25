const stock = JSON.parse(localStorage.getItem("stock")) || [
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


function saveStock() {
  localStorage.setItem("stock", JSON.stringify(stock));
}

function repasSelect() {
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

repasSelect();
function displayStock() {
    container.innerHTML = "";

    stock.forEach((repas) => {
        const card = template.cloneNode(true);

        card.classList.remove("hidden");
        card.dataset.id = repas.id;

        const titre = card.querySelector("h3");
        const spans = card.querySelectorAll("span");

        titre.textContent = repas.reppasName;
        spans[0].textContent = repas.reppasCategory;
        spans[1].textContent = repas.reppasType;
        spans[2].textContent = `${repas.reppasPrice}dh`;

        container.appendChild(card);
    });
}
const RE_NAME = /^[a-zA-ZÀ-ÿ\s'-]{5,30}$/;
const RE_PRICE = /^\d+(\.\d{1,2})?$/;
let editRepas = null;
const popupsBtn = document.querySelector(".add-repas");
const closeBtnPopUp = document.querySelector(".close-popup");
const showModal = document.querySelector(".popup-Form");

popupsBtn.addEventListener("click", () =>{

    editRepas = null;
    nameRepas.value = "";
    priceRepas.value = "";
    categorieSelect.value = "";
    repasType.value = "";
    showModal.classList.remove("hidden");
    
})
closeBtnPopUp.addEventListener("click", () =>{
    showModal.classList.add("hidden");
})

const addBtn = document.getElementById("submit-Repas");
const nameRepas = document.getElementById("name");
const priceRepas = document.getElementById("price");
const repasType = document.getElementById("type");

const container = document.getElementById("div-Repas");
const template = document.getElementById("items-cards");
const categorieSelect = document.getElementById("categorie");

addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const valueName = nameRepas.value;
  const valuePrice = priceRepas.value;
  const valueCategorie = categorieSelect.value;
  const valueType = repasType.value;
  if (!RE_NAME.test(valueName.trim())) {
    alert("Name must contain 3 to 30 letters.");
    return;
  }

  if (!RE_PRICE.test(valuePrice.trim()) || Number(valuePrice) <= 0) {
    alert("Enter a valid price greater than 0.");
    return;
  }
  let card;
  if (editRepas){
    card = editRepas;
    }else {
    card = template.cloneNode(true);
    card.dataset.id = Date.now();
    container.appendChild(card);
      }
  const titre = card.querySelector("h3");
  const spans = card.querySelectorAll("span");
  
  titre.textContent = valueName;
  spans[0].textContent = valueCategorie;
  spans[1].textContent = valueType;
  spans[2].textContent = `${valuePrice}dh`;
  if (editRepas) {
  const id = Number(editRepas.dataset.id);
  const repas = stock.find((r) => r.id === id);

  if (repas) {
    repas.reppasName = valueName;
    repas.reppasPrice = Number(valuePrice);
    repas.reppasCategory = valueCategorie;
    repas.reppasType = valueType;
  }
} else {
  const newRepas = {
    id: Number(card.dataset.id),
    reppasName: valueName,
    reppasType: valueType,
    reppasCategory: valueCategorie,
    reppasPrice: Number(valuePrice)
  };

  stock.push(newRepas);
}

saveStock();
  

  
  nameRepas.value = "" ;
  categorieSelect.value = "";
  repasType.value = "" ; 
  priceRepas.value = "" ; 
  editRepas = null ; 
  showModal.classList.add("hidden")
});


container.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-Btn");
  if (!editBtn) return;
  editRepas = editBtn.closest(".items-cards");
  
  const titre = editRepas.querySelector("h3");
  const spans = editRepas.querySelectorAll("span");
  
  nameRepas.value = titre.textContent;
  categorieSelect.value = spans[0].textContent;
  repasType.value = spans[1].textContent;
  priceRepas.value = spans[2].textContent.replace("dh", "").trim();

  showModal.classList.remove("hidden");
  saveStock();
});


container.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-Btn");
  if (!deleteBtn) return;

  const card = deleteBtn.closest(".items-cards");
  const id = Number(card.dataset.id)
  const index = stock.findIndex((repas) => repas.id === id);

    if (index !== -1) {
        stock.splice(index, 1);
    }

    card.remove();
    saveStock();
});
displayStock();
repasSelect();