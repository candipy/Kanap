// Objectif : Créer la page récaptitulative du panier avec le total du prix, la possibilité le mettre à jour

// Besoins :

// A. Récupérer éléments dans HTML
const itemsHtml = document.getElementById("cart__items");

// B. Vérifier qu'il y qq chose dans le local Storage
console.log(localStorage.getItem("products")); // Si vide résultat = null, sinon objet JSON

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

        // Modification de la quantité
      })
      .then((productAPI) => {
        let inputsQuantity = document.querySelectorAll(".itemQuantity"); // Renvoi une nodeList qui peut être itéré comme un tableau

        inputsQuantity.forEach((input, key) => {
          // pour chaque élément=input dans inputsQuantity

          input.addEventListener("change", (e) => {
            console.log(e.target.value);

            // Ecoute du changement de l'évenement (quantité)
            let articleHMTL = e.target.closest("article");
            let articleHTMLId = articleHMTL.dataset.id;
            let articleHTMLcolor = articleHMTL.dataset.color;
            console.log("Dans HTML=", articleHTMLcolor, "productLS.color=", productLS.color, "localStorage[Key de la boucle foreach sur HTML=", localStorageCart[key].color);
            console.log(articleHTMLId, productLS.id, localStorageCart[key].id);

            if (articleHTMLId == productLS.id && productLS.color == articleHTMLcolor) {
              alert("ok !");

              let newQuantity = e.target.value;
              console.log(newQuantity);

              productLS.quantity = parseInt(newQuantity);
              console.log(productLS.quantity);
              localStorage.setItem("products", JSON.stringify(localStorageCart));
            } else {
              alert("pas le même");
            }
          });
        });
      })
      .catch(function (err) {
        // Une erreur est survenue
      });
  });
}

// console.log(input, key);
//           console.log(productLS);
//           console.log(localStorageCart[key].color);
//           input.addEventListener("change", (e) => {
//             console.log(e.target);
//             console.log(localStorageCart[key].color);
//             // Ecoute du changement de l'évenement (quantité)

//             let articleHMTL = e.target.closest("article");
//             let articleHTMLId = articleHMTL.dataset.id;
//             let articleHTMLcolor = articleHMTL.dataset.color;
//             console.log(articleHTMLcolor, localStorageCart[key].color);

//             if ((articleHTMLId && articleHTMLcolor) == (localStorageCart[key].id && localStorageCart[key].color)) {
//               alert("ok !");
//             } else {
//               alert("pas le même");
//             }
