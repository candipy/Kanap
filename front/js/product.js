// Objectif : Ajouter les éléments du produit cliqué dans la page d'accueil et de l'ajouter au panier

// Besoins
// A. Récupérer l'id id ayant été cliqué sur la page d'accueil

//1) Récupération de l'URL de la page affichée
const url = new URL(location.href);
//2) Recherche dans l'url le paramètre de l'ID
const idProduct = url.searchParams.get("id");

// Elements nécessaires pour informer l'utilisateur des produits ajoutés au panier :
let newAlert = document.createElement("p");
let itemcontentHtml = document.querySelector(".item__content");
itemcontentHtml.appendChild(newAlert);

// B. Intérroger l'API avec l'ID qui est maintenant présent
const productsAPIId = `http://localhost:3000/api/products/${idProduct}`;

fetch(productsAPIId)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then((product) => {
    addHTML(product);
    addCart();
  })

  .catch(function (err) {
    console.error(err);
    let newAlert = document.createElement("p");
    newAlert.style.color = "#501717";
    newAlert.innerText = "Nous sommes désolés mais une erreur s'est produite, veuillez réessayer plus tard";
    document.querySelector(".item").replaceChild(newAlert, document.querySelector("article"));
  });

// -----Affichage du produit-----

function addHTML(product) {
  // Image
  const imageHTML = document.querySelector(".item__img");
  let newImageHTML = document.createElement("img");
  newImageHTML.src = product.imageUrl;
  newImageHTML.alt = product.altTxt;
  imageHTML.appendChild(newImageHTML);

  // Titre
  const titlePageHTML = document.querySelector("title");
  titlePageHTML.innerText = product.name;

  const titleHTML = document.getElementById("title");
  titleHTML.innerText = product.name;

  // Prix
  const priceHTML = document.getElementById("price");
  priceHTML.innerText = product.price;

  // Description
  const descriptionHTML = document.getElementById("description");
  descriptionHTML.innerText = product.description;

  // Couleur
  let colorsHTML = document.getElementById("colors");
  for (let color of product.colors) {
    colorsHTML.innerHTML += `<option value="${color}">${color}</option>`;
  }
}

// -----Ajout au panier-----

function addCart() {
  const buttonHTML = document.getElementById("addToCart");

  buttonHTML.addEventListener("click", function () {
    // Conditions de commande pour l'utilisateur :
    // - Il doit selectionner une couleur
    // - Il doit saisir une quantité supérieur à 0 et inférieure à 100

    const colorsHTML = document.getElementById("colors");
    let colorsSelect = colorsHTML.value;

    const quantityHTML = document.getElementById("quantity");
    let quantitySelect = quantityHTML.value;

    if (colorsSelect == "" || quantitySelect <= 0 || quantitySelect > 100) {
      newAlert.style.color = "#501717";
      newAlert.innerText = "Pour ajouter l'article souhaité, veuillez selectionner une couleur valide et une quantité comprise entre 1 et 100";

      // Si la selection de l'utilisateur est conforme :
    } else {
      // objet : Selection de l'utilisateur
      let productSelect = {
        color: colorsSelect,
        quantity: Number(quantitySelect),
        id: idProduct,
      };

      newAlert.style.color = "inherit";

      // Interroger le localStorage

      let localStorageCart = JSON.parse(localStorage.getItem("products"));

      if (localStorageCart === null) {
        // LocalStorage vide
        let cart = [];

        cart.push(productSelect);

        if (productSelect.quantity == 1) {
          newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaire de ce produit, votre panier en contient ${productSelect.quantity}`;
        } else {
          newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaires de ce produit, votre panier en contient ${productSelect.quantity}`;
        }

        localStorage.setItem("products", JSON.stringify(cart));
      } else {
        // LocalStorage contient déjà un produit

        let productAlreadyOrdered = localStorageCart.find((e) => e.id == productSelect.id) && localStorageCart.find((e) => e.color == productSelect.color);

        if (productAlreadyOrdered === undefined) {
          // Si il y a un produit déjà commandé mais qu'il s'agit d'une autre référence
          localStorageCart.push(productSelect);

          if (productSelect.quantity == 1) {
            newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaire de ce produit, votre panier en contient ${productSelect.quantity}`;
          } else {
            newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaires de ce produit, votre panier en contient ${productSelect.quantity}`;
          }

          localStorage.setItem("products", JSON.stringify(localStorageCart));
        } else {
          // Si il y a un produit déjà commandé et qu'il s'agit d'une référence identique
          parseInt(productAlreadyOrdered.quantity);

          productAlreadyOrdered.quantity = productAlreadyOrdered.quantity + productSelect.quantity;

          if (productAlreadyOrdered.quantity < 100) {
            if (productSelect.quantity == 1) {
              newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaire de ce produit, votre panier en contient maintenant ${productAlreadyOrdered.quantity}`;
            } else {
              newAlert.innerText = `Vous venez d'ajouter ${productSelect.quantity} exemplaires de ce produit, votre panier en contient maintenant ${productAlreadyOrdered.quantity}`;
            }
            localStorage.setItem("products", JSON.stringify(localStorageCart));
          } else {
            productAlreadyOrdered.quantity = 100;
            newAlert.style.color = "#501717";
            newAlert.innerText = `Votre panier ne pas contenir plus de 100 produits identiques, la quantité à été limitée à ${productAlreadyOrdered.quantity} exemplaires de cet article`;

            localStorage.setItem("products", JSON.stringify(localStorageCart));
          }
        }
      }
    }
  });
}
