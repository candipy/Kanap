// Objectif : Ajouter les éléments du produit cliqué dans la page d'acceuil

// Besoins
// A. Récupérer l'id id ayant été cliqué sur la page d'accueil

//1) Récupération de l'URL de la page affichée
const url = new URL(location.href);
//2) Recherche dans l'url le paramètre de l'ID
const idProduct = url.searchParams.get("id");
// Vérification dans la console
console.log(idProduct);

// B. Intérroger l'API avec l'ID qui est maintenant présent
const productsAPIId = `http://localhost:3000/api/products/${idProduct}`;

fetch(productsAPIId)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then((product) => {
    console.log(product);
    addHTML(product);
    addCart(product);
  })

  .catch(function (err) {
    // Une erreur est survenue
  });

// Fonction qui récupère les données de la promise .then(product) pour insérer les éléments dans HTML
function addHTML(product) {
  const imageHTML = document.querySelector(".item__img"); // Récupère la class item img dans HTML
  // image.innerHTML= `<img src="${product.imageUrl}" alt="${product.altTxt}" />` // Insère l'url de l'image et son alt - Autre possibilité
  let newImageHTML = document.createElement("img");
  // Création d'une balise <img>
  newImageHTML.src = product.imageUrl;
  // Ajout du lien src à cette balise img
  newImageHTML.alt = product.altTxt;
  // Ajout du alt texte à cette balise img
  imageHTML.appendChild(newImageHTML);
  // Rattachement en tant qu'enfant de newImage à image précédemment récupéré par sa class dans HTML

  const titlePageHTML = document.querySelector("title"); // Récupère la balise title dans HTML
  titlePageHTML.innerText = product.name; // Insère nom du produit trouvé dans l'API

  const titleHTML = document.getElementById("title"); // Recupere id Title dans HTML
  titleHTML.innerText = product.name; //Insére le nom du produit trouvé dans l'API

  const priceHTML = document.getElementById("price"); // Récupère id price dans HTML
  priceHTML.innerText = product.price; // Insére le prix trouvé dans l'API

  const descriptionHTML = document.getElementById("description"); // Récupère id descrption dans HTML
  descriptionHTML.innerText = product.description; // Insére le texte de la description trouvé dans l'API

  let colorsHTML = document.getElementById("colors"); // Récupère id colors dans HTML
  // Pour chaque couleur dans product, création d'une nouvelle entrée value
  for (let color of product.colors) {
    // Pour chaque color dans colors de products provennant de l'API
    console.log(color);
    // ajouter à couleur (selectionné par id) dans HTML de l'option {color}
    colorsHTML.innerHTML += `<option value="${color}">${color}</option>`;
  }
}

// Fonction qui récupère les données de la promise .then(product) et qui permet de récupérer l'article et de l'ajouter au local storage

function addCart(product) {
  // Ecouter le click sur le bouton "ajouter au panier" dans HTML = va lancer la fonction à chaque click
  const buttonHTML = document.getElementById("addToCart");
  buttonHTML.addEventListener("click", function (product) {
    // Récupèrer les valeurs nécessaires couleur, quantité, id
    const colorsHTML = document.getElementById("colors");
    let colorsSelect = colorsHTML.value;
    console.log(colorsSelect);

    const quantityHTML = document.getElementById("quantity");
    let quantitySelect = quantityHTML.value;
    console.log(quantitySelect);

    console.log(idProduct);

    // Conditions de commande pour l'utilisateur :
    // - Il doit selectionner une couleur
    // - Il doit saisir une quantité supérieur à 0 et inférieure à 100

    if (colorsSelect == "" || quantitySelect <= 0 || quantitySelect > 100) {
      alert("Pour ajouter l'article souhaité, veuillez selectionner une couleur valide et une quantité comprise entre 1 et 100");

      //  Conditions pour que l'article s'ajoute dans le panier :
      // Vérifier si le local storage contient quelque chose
      //
      //      Si le locale Storage contient déjà quelque chose
      //              Si il y a un article dont la couleur et id sont identiques => Ajoute la quantité à celle déjà présente sans dépasser la quantité de 100
      //              Si il y a un article dont l'id et ou couleur différent => Ajoute de l'article
      //        Sinon ajout de l'article
    } else {
      // Création d'un objet avec les éléments selectionnés par le client
      let productSelect = {
        color: colorsSelect,
        quantity: quantitySelect,
        id: idProduct,
      };
      console.log(productSelect);

      // Création d'une variable qui interroge le localStorage en object Javascript

      let localStorageCart = JSON.parse(localStorage.getItem("products"));

      if (localStorageCart) {
        // Si le local Storage appelé localStorageCart est bien lu (donc existe)
        localStorageCart.push(productSelect); // Ajout du produit selectionné en object javascript
        localStorage.setItem("products", JSON.stringify(localStorageCart)); // Enregistrement dans le local storage en chaine de caractères de l'article selctionné
      } else {
        // Si le local local Storage appelé dans la variable localStorageCart n'est pas trouvé donc n'existe pas
        let cart = []; // Création d'un tableau vide à chaque click
        cart.push(productSelect); // Ajout à ce tableau du produit selectionné
        localStorage.setItem("products", JSON.stringify(cart)); // Enregistrement de ce tableau dans le local storage en chaine de caractères
      }
    }
  });
}
