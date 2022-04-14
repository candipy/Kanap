// Objectif : Insérer les produits dans la page d'accueil de manière dynamique. Permettre une redirection vers le détail du produit au clic

// Besoins :

// Elements de l'API
const productsAPI = "http://localhost:3000/api/products/";
// ID items dans le DOM
const itemsHtml = document.getElementById("items");

//Récupération des données de l'API et insertion dans le DOM

fetch(productsAPI)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then(function (products) {
    for (let product of products) {
      itemsHtml.innerHTML += `<a href="./product.html?id=${product._id}">
      <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}" />
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
      </article>
    </a>`;
    }
  })
  .catch(function (err) {
    let alert = document.createElement("p");
    alert.style.color = "#501717";
    alert.innerText = "Nous sommes désolés mais une erreur s'est produite, veuillez réessayer plus tard";
    itemsHtml.appendChild(alert);
  });
