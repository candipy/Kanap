// Objectif : Créer la page récaptitulative du panier avec le total du prix, la possibilité le mettre à jour, saisir le formalaire de contact et récupérer le numéro de la commande

// Besoins :

// A. Récupérer éléments dans HTML
const itemsHtml = document.getElementById("cart__items");

// B. Initialisation de données nécessaires
let totalQuantity = 0; // Sera modifié à chaque produit
let totalPrice = 0; // Sera modifié à chaque produit
let products = [];

/////////////////////////////////////////////////////
if (localStorage.getItem("products") === null) {
  // Vérifier si il y a quelque chose dans le localStorage
  itemsHtml.innerHTML = `<p>Votre panier est actuellement vide</p>`;
} else {
  let localStorageCart = JSON.parse(localStorage.getItem("products")); // si le résultat est pas null, construction en objet Javascript

  localStorageCart.forEach((productLS) => {
    // Pour chaque produit dans le local Storage récupérer son id

    fetch(`http://localhost:3000/api/products/${productLS.id}`) // Requete à l'API de l'ID récupéré dans le local Storage = envoi un requete
      .then(function (res) {
        // objet réponse de l'aPI
        if (res.ok) {
          // Si on a une réponse
          return res.json(); // Retourne la réponse en objet json
        }
      })

      .then((productAPI) => {
        // Afficher les produits de l'API selectionnés par rapport à l'ID récupéré dans le local Storage

        let priceTotalProductSelect = productAPI.price * productLS.quantity; // Variable pour le prix total d'un produit

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
        //  Cumul de la quantité de produits commandés :
        totalQuantity += productLS.quantity;
        document.getElementById("totalQuantity").textContent = `${totalQuantity}`;

        //  Cumul de la quantité de produits commandés :
        totalPrice += priceTotalProductSelect;
        document.getElementById("totalPrice").textContent = `${totalPrice}`;

        // Récupère ID du produit à mettre dans un tableau pour passer la requete POST vers l'API
        products.push(productLS.id);

        return productAPI;
      })
      .then(() => {
        // Modification de la quantité

        let inputsQuantity = document.querySelectorAll(".itemQuantity"); // Cible les quantités et renvoi une nodeList qui peut être itéré comme un tableau

        inputsQuantity.forEach((input) => {
          // pour chaque élément=input dans inputsQuantity

          input.addEventListener("change", (e) => {
            let articleHMTL = e.target.closest("article"); // Cibler la balise Article la plus proche de la quantité modifiée
            let articleHTMLId = articleHMTL.dataset.id; // Cibler son attribut data-id
            let articleHTMLcolor = articleHMTL.dataset.color; // Cibler son attribut data color
            let articleChanged = localStorageCart.find((e) => e.id === articleHTMLId && e.color === articleHTMLcolor);
            // Trouver le premier article (findArticle) dans le local storage qui respecte la condition suivante :
            // - ID dans le localStorage = Id trouvé dans la la balise article
            // ET
            // - Couleur dans le localStorage = couleur trouvée dans la balise article

            if (articleChanged !== undefined) {
              // Si findArticle n'est pas undefined (réponse de .find)

              articleChanged.quantity = parseInt(e.target.value); // la quantité trouvé dans le localStorage devient la nouvelle quantité, en nombre // Cibler la value du itemsQuantity changé

              if (articleChanged.quantity > 100) {
                alert("Votre panier ne pas contenir plus de 100 produits identiques, la quantité à été limitée 100");
                e.target.value = 100;
                articleChanged.quantity = parseInt(e.target.value);
                localStorage.setItem("products", JSON.stringify(localStorageCart)); // Envoi 100 dans le Local Storage
              } else if (articleChanged.quantity <= 0) {
                articleChanged.quantity = parseInt(e.target.value);

                localStorage.removeItem("products", JSON.stringify(localStorageCart));
              } else {
                articleChanged.quantity = parseInt(e.target.value);
                localStorage.setItem("products", JSON.stringify(localStorageCart)); // Envoi dans le localStorage de la nouvelle quantité
              }
            }
            location.reload();
          });
        });
      })

      .then(() => {
        // Suppression d'un article

        let inputsDelete = document.querySelectorAll(".deleteItem"); // Cible les boutons "Supprimer"

        inputsDelete.forEach((input) => {
          // pour chaque élément=input dans inputsDelete

          input.addEventListener("click", (e) => {
            let articleHMTL = e.target.closest("article"); // Cible la balise article la plus proche du bouton supprimé
            let articleHTMLId = articleHMTL.dataset.id; // Cibler son attribut data-id
            let articleHTMLcolor = articleHMTL.dataset.color; // Cibler son attribut data color

            localStorageCart = localStorageCart.filter((e) => !(e.id === articleHTMLId && e.color === articleHTMLcolor));

            //Renvoi un tableau filtré avec les critères suivants :
            // - Element doit avoir un id différent de celui trouvé dans HTML
            // OU
            // - Element doit avoir une couleur différentes de celle trouvée dans HTML
            // => Soit un tableau sans l'élément du correspondant au bouton cliqué 'supprimer'

            articleHMTL.remove(); // Suppression de la balise article correspondante
            localStorage.setItem("products", JSON.stringify(localStorageCart)); // Enregistrement du localStrageCart filtré

            if (localStorageCart.length < 0) {
              localStorage.clear("products");
            }
            location.reload();
          });
        });
      })
      .catch(function (_err) {
        // Une erreur est survenue
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
    // Si la valeur du bouton est conforme au RegexTxt
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
  checkFirstName(); // Vérification à chaque changement de la condition de validation
});

//    Vérification du nom
function checkLastName() {
  if (RegexAlpha(lastNameInput.value)) {
    // Si la valeur du bouton est conforme au RegexTxt
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
  checkLastName(); // Vérification à chaque changement de la condition de validation
});

//    Vérification de la ville
function checkCity() {
  if (RegexAlphaNum(cityInput.value)) {
    // Si la valeur du bouton est conforme au RegexTxt
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
  checkCity(); // Vérification à chaque changement de la condition de validation
});

//    Vérification de l'adresse
function checkAddress() {
  if (RegexAlphaNum(addressInput.value)) {
    // Si la valeur du bouton est conforme au RegexTxt
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
  checkAddress(); // Vérification à chaque changement de la condition de validation
});

//    Vérification de l'email
function checkEmail() {
  if (RegexEmail(emailInput.value)) {
    // Si la valeur du bouton est conforme au RegexTxt
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

// Au clic sur ce bouton, reprise des valeurs dans les champs du formulaire pour créer un objet contenant les éléments du client quand les formules de validation sont Ok
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

    localStorage.setItem("contact", JSON.stringify(contact));

    if (localStorage.products === undefined) {
      alert("Votre panier est vide, vous retrouverez nos produits sur la page d'Accueil");
      location.href = "./index.html";
    } else {
      PostAPI(contact, products);
    }
  } else {
    alert("Veuillez revoir la saisie du formulaire s'il vous plait");
  }
});

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
      // objet réponse de l'aPI
      if (res.ok) {
        // Si on a une réponse
        return res.json(); // Retourne la réponse en objet json
      }
    })

    .then(function (api) {
      orderId = api.orderId; // Récupère orderId dans la réponse de l'API
      localStorage.clear(); // Vide le local Storage
      location.href = `./confirmation.html?id=${orderId}`; // Redirige vers la page confirmation avec l'orderId pour pouvoir le récupérer sans le stocker
    })

    .catch(function (_err) {
      // Une erreur est survenue
    });
}
