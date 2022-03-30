// Objectif : Créer la page récaptitulative du panier avec le total du prix, la possibilité le mettre à jour

// Besoins :

// A. Récupérer éléments dans HTML
const itemsHtml = document.getElementById("cart__items");

// B. Vérifier qu'il y qq chose dans le local Storage
console.log(localStorage.getItem("products")); // Si vide résultat = null, sinon objet JSON

// C. Initialisation de données nécessaires
let totalQuantity = 0; // Sera modifié à chaque produit
let totalPrice = 0; // Sera modifié à chaque produit

if (localStorage.getItem("products") === null) {
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
        // console.log(productLS);
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
        console.log(totalQuantity);
        document.getElementById("totalQuantity").textContent = `${totalQuantity}`;

        //  Cumul de la quantité de produits commandés :
        totalPrice += priceTotalProductSelect;
        console.log(totalPrice);
        document.getElementById("totalPrice").textContent = `${totalPrice}`;
        return productAPI;
      })
      .then(() => {
        // Modification de la quantité

        let inputsQuantity = document.querySelectorAll(".itemQuantity"); // Cible les quantités et renvoi une nodeList qui peut être itéré comme un tableau

        inputsQuantity.forEach((input, key) => {
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
                debugger;
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

        inputsDelete.forEach((input, key) => {
          // pour chaque élément=input dans inputsDelete

          input.addEventListener("click", (e) => {
            let articleHMTL = e.target.closest("article"); // Cible la balise article la plus proche du bouton supprimé
            let articleHTMLId = articleHMTL.dataset.id; // Cibler son attribut data-id
            let articleHTMLcolor = articleHMTL.dataset.color; // Cibler son attribut data color
            localStorageCart = localStorageCart.filter((e) => e.id !== articleHTMLId || e.color !== articleHTMLcolor);
            //Renvoi un tableau filtré avec les critères suivants :
            // - Element doit avoir un id différent de celui trouvé dans HTML
            // OU
            // - Element doit avoir une couleur différentes de celle trouvée dans HTML
            // => Soit un tableau sans l'élément du correspondant au bouton cliqué 'supprimer'

            articleHMTL.remove(); // Suppression de la balise article correspondante
            localStorage.setItem("products", JSON.stringify(localStorageCart)); // Enregistrement du localStrageCart filtré

            if (localStorageCart.length <= 0) {
              localStorage.clear("products");
            }
            location.reload();
          });
        });
      })
      .catch(function (err) {
        // Une erreur est survenue
      });
  });
}
