// Objectif : Créer la page récaptitulative du panier avec le total du prix, la possibilité le mettre à jour

// Besoins :

// A. Récupérer le local storage

let localStorageCart = JSON.parse(localStorage.getItem("products"));
console.log("Affichage du local storage au chargement de la page : ", localStorageCart);

// B. Récupérer l'API

const productsAPI = `http://localhost:3000/api/products/`;

// C. Récupérer ID items dans HTML
const itemsHtml = document.getElementById("cart__items");

for (let productLS of localStorageCart) {
  // Pour chaque produit dans le local Storage récupérer son id
  console.log(productLS.quantity);
  fetch(`http://localhost:3000/api/products/${productLS.id}`) // Requete à l'API de l'ID récupéré dans le local Storage
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    .then(function (productAPI) {
      console.log(productAPI);
      // Afficher les produits de l'API selectionnés par rapport à l'ID récupéré dans le local Storage
      console.log(productLS);
      let priceTotalProductSelect = productAPI.price * productLS.quantity; // Variable pour le prix total d'un produit
      itemsHtml.innerHTML += `<article class="cart__item" data-id="${productLS.id}" data-color="${productLS.color}">
                <div class="cart__item__img">
                  <img src="${productAPI.imageUrl}" alt="${productAPI.src}">
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
    })

    .catch(function (err) {
      // Une erreur est survenue
    });
}
