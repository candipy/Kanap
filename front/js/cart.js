// Objectif : Créer la page récaptitulative du panier avec le total du prix, la possibilité le mettre à jour, saisir le formulaire de contact et récupérer le numéro de la commande

// Besoins permanents
const itemsHtml = document.getElementById("cart__items");

let products = [];

/////////////////////////////////////////////////////
if (localStorage.getItem("products") === null) {
  // Vérifier si il y a quelque chose dans le localStorage
  itemsHtml.innerHTML = `<p>Votre panier est actuellement vide</p>`;
  itemsHtml.style.color = "#501717";
} else {
  // ----- Gestion du panier-----
  let localStorageCart = JSON.parse(localStorage.getItem("products"));
  let totalQuantity = 0;
  let totalPrice = 0;

  localStorageCart.forEach((productLS) => {
    // Pour chaque produit dans le local Storage récupérer son id

    fetch(`http://localhost:3000/api/products/${productLS.id}`) // Requete à l'API de l'ID récupéré dans le local Storage
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })

      .then((productAPI) => {
        // ----- Affichage du panier-----

        let priceTotalProductSelect = productAPI.price * productLS.quantity; //  Prix total d'un produit

        itemsHtml.innerHTML += `<article class="cart__item" data-id="${productLS.id}" data-color="${productLS.color}">
                    <div class="cart__item__img">
                      <img src="${productAPI.imageUrl}" alt="${productAPI.altTxt}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${productAPI.name}</h2>
                        <p>Couleur Selectionnée : ${productLS.color}</p>
                            <div class = "cart__item__content__titlePrice">
                                <p>Prix Unitaire : ${productAPI.price} €</p>
                                <p> Prix Total : ${priceTotalProductSelect} € </p>
                             </div>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLS.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        
                        
                          <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </article>`;
        //  Nombre de produits commandés :
        totalQuantity += productLS.quantity;
        document.getElementById("totalQuantity").textContent = `${totalQuantity}`;

        //  Prix des produits commandés :
        totalPrice += priceTotalProductSelect;
        document.getElementById("totalPrice").textContent = `${totalPrice}`;

        // Récupère ID du produit à mettre dans un tableau pour passer la requete POST vers l'API
        products.push(productLS.id);
      })
      .then(() => {
        // ----- Modification de la quantité ----

        let inputsQuantity = document.querySelectorAll(".itemQuantity");

        inputsQuantity.forEach((input) => {
          input.addEventListener("change", (e) => {
            let articleHMTL = e.target.closest("article");
            let articleHTMLId = articleHMTL.dataset.id;
            let articleHTMLcolor = articleHMTL.dataset.color;
            // Trouver le premier article dans le local storage qui respecte la condition
            let articleChanged = localStorageCart.find((e) => e.id === articleHTMLId && e.color === articleHTMLcolor);

            if (articleChanged !== undefined) {
              articleChanged.quantity = parseInt(e.target.value);

              if (articleChanged.quantity > 100) {
                alert("Votre panier ne pas contenir plus de 100 produits identiques, la quantité à été limitée 100");
                e.target.value = 100;
                articleChanged.quantity = parseInt(e.target.value);
                localStorage.setItem("products", JSON.stringify(localStorageCart));
              } else if (articleChanged.quantity <= 0) {
                localStorageCart = localStorageCart.filter((e) => !(e.id === articleHTMLId && e.color === articleHTMLcolor));
                articleHMTL.remove();
                localStorage.setItem("products", JSON.stringify(localStorageCart));

                if (localStorageCart.length < 1) {
                  localStorage.clear("products");
                }
              } else {
                localStorage.setItem("products", JSON.stringify(localStorageCart));
              }
            } else {
              localStorage.clear("products");
              alert("Nous sommes désolés mais une erreur s'est produite, nous n'avons pas pu finalier votre commande, veuillez réessayer plus tard");
            }
            location.reload();
          });
        });
      })

      .then(() => {
        // ----- Suppression d'un article ----

        let inputsDelete = document.querySelectorAll(".deleteItem");

        inputsDelete.forEach((input) => {
          input.addEventListener("click", (e) => {
            let articleHMTL = e.target.closest("article");
            let articleHTMLId = articleHMTL.dataset.id;
            let articleHTMLcolor = articleHMTL.dataset.color;

            localStorageCart = localStorageCart.filter((e) => !(e.id === articleHTMLId && e.color === articleHTMLcolor));

            if (localStorageCart.find((e) => e.id === articleHTMLId && e.color === articleHTMLcolor)) {
              localStorage.clear("products");
              alert("Nous sommes désolés mais une erreur s'est produite, nous n'avons pas pu finalier votre commande, veuillez réessayer plus tard");
            } else {
              articleHMTL.remove();
              localStorage.setItem("products", JSON.stringify(localStorageCart));

              if (localStorageCart.length < 1) {
                localStorage.clear("products");
              }
            }
            location.reload();
          });
        });
      })
      .catch(function (err) {
        itemsHtml.innerHTML = `<p>Nous sommes désolés mais une erreur s'est produite, veuillez réessayer plus tard</p>`;
        itemsHtml.style.color = "#501717";
      });
  });
}

// ----- Validation du formulaire-----

//A.  Selection du bouton Commander
const btnOrder = document.querySelector("#order");

//B. Selection des inputs du formulaire

let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let addressInput = document.getElementById("address");
let cityInput = document.getElementById("city");
let emailInput = document.getElementById("email");

// C. Validation des entrées
function RegexAlpha(value) {
  return /^[A-Za-zÀ-ž-'\s]+$/.test(value);
}

function RegexAlphaNum(value) {
  return /^[a-zA-ZÀ-ž0-9,'-\s]+$/.test(value);
}

function RegexEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}$/.test(value);
}
//    Vérification du prénom
function checkFirstName() {
  if (RegexAlpha(firstNameInput.value)) {
    firstNameInput.style.border = "medium solid #74f774";
    firstNameInput.nextElementSibling.textContent = "";
    return true;
  } else {
    firstNameInput.nextElementSibling.textContent = "Merci d'entrer un prénom conforme. Ex : Jean, Jean-François, Jean François";
    firstNameInput.style.border = "medium solid #f77474";
    return false;
  }
}

firstNameInput.addEventListener("change", () => {
  checkFirstName();
});

//    Vérification du nom
function checkLastName() {
  if (RegexAlpha(lastNameInput.value)) {
    lastNameInput.style.border = "medium solid #74f774";
    lastNameInput.nextElementSibling.textContent = "";
    return true;
  } else {
    lastNameInput.nextElementSibling.textContent = "Merci d'entrer un nom conforme. Ex : Dupond, Du-Pond, Du Pond ";
    lastNameInput.style.border = "medium solid #f77474";
    return false;
  }
}

lastNameInput.addEventListener("change", () => {
  checkLastName();
});

//    Vérification de la ville
function checkCity() {
  if (RegexAlphaNum(cityInput.value)) {
    cityInput.style.border = "medium solid #74f774";
    cityInput.nextElementSibling.textContent = "";
    return true;
  } else {
    cityInput.nextElementSibling.textContent = "Merci d'entrer une ville conforme. Ex : Lyon, Lyon-V, Lyon 4ème";
    cityInput.style.border = "medium solid #f77474";
    return false;
  }
}

cityInput.addEventListener("change", () => {
  checkCity();
});

//    Vérification de l'adresse
function checkAddress() {
  if (RegexAlphaNum(addressInput.value)) {
    addressInput.style.border = "medium solid #74f774";
    addressInput.nextElementSibling.textContent = "";
    return true;
  } else {
    addressInput.nextElementSibling.textContent = "Merci d'entrer une adresse conforme. Ex : 3 Avenue de l'Europe, Rue Albert-Camus ";
    addressInput.style.border = "medium solid #f77474";
    return false;
  }
}

addressInput.addEventListener("change", () => {
  checkAddress();
});

//    Vérification de l'email
function checkEmail() {
  if (RegexEmail(emailInput.value)) {
    emailInput.style.border = "medium solid #74f774";
    emailInput.nextElementSibling.textContent = "";
    return true;
  } else {
    emailInput.nextElementSibling.textContent = "Merci d'entrer un courriel conforme. Ex : contact@kanap.com";
    emailInput.style.border = "medium solid #f77474";
    return false;
  }
}

emailInput.addEventListener("change", () => {
  checkEmail();
});

// Création du client

btnOrder.addEventListener("click", (e) => {
  e.preventDefault();

  if (checkFirstName() && checkLastName() && checkCity() && checkAddress() && checkEmail()) {
    let contact = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      email: emailInput.value,
    };

    //localStorage.setItem("contact", JSON.stringify(contact));

    if (localStorage.products === undefined) {
      alert("Votre panier est vide, retrouvez nos produits sur la page d'Accueil");
      location.href = "./index.html";
    } else {
      PostAPI(contact, products);
    }
  } else {
    alert("Veuillez revoir la saisie du formulaire s'il vous plait");
    checkFirstName();
    checkLastName();
    checkCity();
    checkAddress();
    checkEmail();
  }
});

// Envoi à l'API du client et des produits + récupération du numéro de commande
function PostAPI(contact, products) {
  fetch(
    `http://localhost:3000/api/products/order`,

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }),
    }
  )
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    .then(function (api) {
      location.href = `./confirmation.html?id=${api.orderId}`; // Redirige vers la page confirmation avec l'orderId pour pouvoir le récupérer sans le stocker
    })

    .catch(function (err) {
      alert("Nous sommes désolés mais une erreur s'est produite, nous n'avons pas pu finalier votre commande, veuillez réessayer plus tard");
      location.href = "./index.html";
    });
}
