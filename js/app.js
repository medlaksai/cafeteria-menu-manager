const reppas = [
    {
        id: 1,
        reppasName: "Tajine Poulet",
        reppasType: "Classique",
        reppasCategory: "Plat principal",
        reppasPrice: 30
    },
    {
        id: 2,
        reppasName: "Salade",
        reppasType: "Végétarien",
        reppasCategory: "Entree",
        reppasPrice: 30
    },
    {
        id: 3,
        reppasName: "Yoghort",
        reppasType: "Classique",
        reppasCategory: "Dessert",
        reppasPrice: 3
    }
];

let stocks;

try {
    const savedStocks = localStorage.getItem("stocks");
    stocks = savedStocks === null
        ? reppas.map(repas => ({ ...repas }))
        : JSON.parse(savedStocks);

} catch {
    stocks = reppas.map(repas => ({ ...repas }));
}

function saveStocks() {
    localStorage.setItem("stocks", JSON.stringify(stocks));
}

function normalizeCategory(category) {
    const value = String(category || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
    return value;
}

function getRepasById(id) {
    return stocks.find(repas => String(repas.id) === String(id));
}

const container = document.getElementById("div-Repas");
const template = document.getElementById("items-cards");
const popupsBtn = document.querySelector(".add-repas");
const closeBtnPopUp = document.querySelector(".close-popup");
const showModal = document.querySelector(".popup-Form");
const form = showModal.querySelector("form");
const addBtn = document.getElementById("submit-Repas");
const nameRepas = document.getElementById("name");
const priceRepas = document.getElementById("price");
const repasType = document.getElementById("type");
const categorieSelect = document.getElementById("categorie");

const RE_NAME = /^[a-zA-ZÀ-ÿ\s'-]{3,30}$/;
const RE_PRICE = /^\d+(\.\d{1,2})?$/;

let editRepasId = null;

const originalTemplate = template.cloneNode(true);
template.remove();


function displayStocks() {
    container.innerHTML = "";

    const selects = document.querySelectorAll(".repas-select");
    const usedRepas = [];

    selects.forEach(function(select) {
        if (select.value !== "") {
            usedRepas.push(select.value);
        }
    });

    stocks.forEach(function(repas) {
        const card = originalTemplate.cloneNode(true);
        
        card.removeAttribute("id");
        card.dataset.id = repas.id;
        card.classList.remove("hidden");

        const titre = card.querySelector("h3");
        const spans = card.querySelectorAll("span");
        const editBtn = card.querySelector(".edit-Btn");
        const deleteBtn = card.querySelector(".delete-Btn");
        
        titre.textContent = repas.reppasName;
        spans[0].textContent = repas.reppasCategory;
        spans[1].textContent = repas.reppasType || "Classique";
        spans[2].textContent = `${repas.reppasPrice} DH`;
        

        if (usedRepas.includes(String(repas.id))) {
            card.classList.add("opacity-80");
            titre.textContent += ` Assigné :  `;
            if (editBtn) {
                editBtn.disabled = true;
                editBtn.classList.add("opacity-30", "cursor-not-allowed" );
            }

            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.classList.add("opacity-30", "cursor-not-allowed");
            }
        }

        container.appendChild(card);
    });
}



function repasSelect() {
    const selects = document.querySelectorAll(".repas-select");

    selects.forEach(function(select) {
        const selectedValue = select.value;
        const category = normalizeCategory(select.dataset.category);

        select.innerHTML = '<option value="">Choisir</option>';

        stocks.forEach(function(repas) {
            if (normalizeCategory(repas.reppasCategory) === category) {
                const option = document.createElement("option");

                option.value = repas.id;
                option.textContent = repas.reppasName;

                select.appendChild(option);
            }
        });

        select.value = selectedValue;
    });

    selects.forEach(function(select) {
        const options = select.querySelectorAll("option");

        options.forEach(function(option) {
            if (option.value === "") return;

            let alreadyUsed = false;

            selects.forEach(function(otherSelect) {
                if (
                    otherSelect !== select &&
                    otherSelect.value === option.value
                ) {
                    alreadyUsed = true;
                }
            });

            option.disabled = alreadyUsed;
        });
    });
}

document.querySelectorAll(".repas-select").forEach(function(select) {
    
    select.addEventListener("change", function() {
        repasSelect();
        displayStocks();
        updateStats();
    });
});


function updateStats() {
    const stockCount = document.getElementById("stock-count");
    const daysCompletedElement = document.getElementById("days-completed");
    const weeklyCostElement = document.getElementById("weekly-cost");
    const nutritionStatusElement = document.getElementById("nutrition-status");

    if (stockCount) {
        stockCount.textContent = stocks.length;
    }

    const days = document.querySelectorAll(
        "#weekly-menu > article, main > div.grid > section:last-child > div.grid > article"
    );

    let completedDays = 0;
    let weeklyCost = 0;
    const selectedTypes = [];

    days.forEach(day => {
        const selects = day.querySelectorAll(".repas-select");
        let dailyCost = 0;
        let allSelected = selects.length === 3;

        selects.forEach(select => {
            const repas = getRepasById(select.value);

            if (repas) {
                dailyCost += Number(repas.reppasPrice) || 0;
                selectedTypes.push(
                    normalizeCategory(repas.reppasType)
                );
            } else {
                allSelected = false;
            }
        });

        if (allSelected) {
            completedDays++;
        }

        weeklyCost += dailyCost;

        const costLabel = day.querySelector("p");

        if (costLabel) {
            costLabel.textContent = `${dailyCost.toFixed(2)} / 50 DH`;
            costLabel.classList.toggle("text-red-600", dailyCost > 50 );
        }
        
    });

    if (daysCompletedElement) {
        daysCompletedElement.textContent = `${completedDays}/5`;
    }

    if (weeklyCostElement) {
        weeklyCostElement.textContent = `${weeklyCost.toFixed(2)} DH`;
    }

    if (nutritionStatusElement) {
        const hasVegetarian = selectedTypes.includes("végétarien") ||
            selectedTypes.includes("vegetarien");

        const hasSelections = selectedTypes.length = 1 ;
        if (!hasSelections) {
            nutritionStatusElement.textContent = "À vérifier";
        } else if (hasVegetarian) {
            nutritionStatusElement.textContent = "Varié";
        } else {
            nutritionStatusElement.textContent = "À vérifier";
        }
    }
}


function openModal(repas = null) {
    editRepasId = repas ? repas.id : null;
    form.reset();

    if (repas) {
        nameRepas.value = repas.reppasName;
        priceRepas.value = repas.reppasPrice;
        categorieSelect.value = repas.reppasCategory;
        repasType.value = repas.reppasType || "Classique";
    }

    showModal.querySelector("h2").textContent = repas
        ? "Modifier une recette"
        : "Ajouter une recette";

    showModal.classList.remove("hidden");
}

function closeModal() {
    showModal.classList.add("hidden");
    editRepasId = null;
    form.reset();
}

popupsBtn.addEventListener("click", () => openModal());

closeBtnPopUp.addEventListener("click", closeModal);

showModal.addEventListener("click", event => {
    if (event.target === showModal) {
        closeModal();
    }
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const valueName = nameRepas.value.trim();
    const valuePrice = priceRepas.value.trim();
    const valueCategorie = categorieSelect.value;
    const valueType = repasType.value.trim();

    if (!RE_NAME.test(valueName)) {
        alert("Le nom doit contenir entre 3 et 30 caractères valides.");
        return;
    }

    if (!RE_PRICE.test(valuePrice) || Number(valuePrice) <= 0) {
        alert("Veuillez saisir un prix valide supérieur à 0.");
        return;
    }

    if (!valueCategorie) {
        alert("Veuillez choisir une catégorie.");
        return;
    }

    if (editRepasId !== null) {
        const repas = getRepasById(editRepasId);

        if (repas) {
            repas.reppasName = valueName;
            repas.reppasPrice = Number(valuePrice);
            repas.reppasCategory = valueCategorie;
            repas.reppasType = valueType;
        }
    } else {
        stocks.push({
            id: Date.now(),
            reppasName: valueName,
            reppasType: valueType,
            reppasCategory: valueCategorie,
            reppasPrice: Number(valuePrice)
        });
    }

    saveStocks();
    closeModal();
    refreshApp();
    alert("Repas a ete ajoutee avec succes")
});

container.addEventListener("click", event => {
    const editBtn = event.target.closest(".edit-Btn");
    const deleteBtn = event.target.closest(".delete-Btn");

    if (editBtn) {
        const card = editBtn.closest(".items-cards");
        const repas = getRepasById(card.dataset.id);

        if (repas) {
            openModal(repas);
        }

        return;
    }

    if (deleteBtn) {
        const card = deleteBtn.closest(".items-cards");
        const id = Number(card.dataset.id);

        if (!confirm("Voulez-vous vraiment supprimer cette recette ?")) {
            return;
        }

        stocks = stocks.filter(repas => repas.id !== id);
        saveStocks();
        refreshApp();
    }
});


function refreshApp() {
    displayStocks();
    repasSelect();
    updateStats();
}
refreshApp();
