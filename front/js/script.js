// Objectif : Insérer les produits dans la page d'accueil 


// Besoins : 
// Elements de l'API
const productsAPI = "http://localhost:3000/api/products/"
// ID items dans HTML
const itemsHtml = document.getElementById("items")

//Je créé un fetch pour récupérer les éléments de l'API afin de pouvoir les utiliser

fetch(productsAPI) 
//asynchrone
//fonction then pour récupérer le résultat de la requete au format json en ayant vérifié que tout s'est bien passé
//Ce résultat est une promise : 
// la Promise est un objet qui fournit une fonction then qui sera exécutée quand le résultat aura été obtenu  et une fonction catch qui sera appelée s’il y a une erreur qui est survenue lors de la requête   
.then(function(res) {
    if (res.ok) {
      return res.json()
    }
  })

// Ce résultat est une promise à résoudre (then) ou si erreur (catch)
  .then(function(products) {
    console.log(products)
    // Afficher les produits

    for (let product of products){
    //Pour chaque "product" dans "products" j'ajoute les éléments HTML ci dessous à l'id items
      itemsHtml.innerHTML += `<a href="./product.html?id=${product._id}">
      <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}" />
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
      </article>
    </a>`
      

    }
  })
  .catch(function(err) {
    // Une erreur est survenue
  })




    
  
  

  
