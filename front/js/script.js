

//Je créé un fetch pour récupérer les éléments de l'API afin de pouvoir les utiliser

fetch("http://localhost:3000/api/products/") 
//fonction then pour récupérer le résultat de la requete au format json en ayant vérifié que tout s'est bien passé
//Ce résultat est une promise : la Promise est un objet qui fournit une fonction then qui sera exécutée quand le résultat aura été obtenu, et une fonction catch qui sera appelée s’il y a une erreur qui est survenue lors de la requête   
.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

// Ce résultat est une promise à résoudre
  .then(function(products) {
    console.log(products);
    // Pour chaque tour dans products, afficher le nom - Ok ca a fonctionné
    // for (i of products) {
    //   console.log(i.name)
    // }
    for (let i of products){

      //Pour chaque tour dans products, on pointe l'ID "items" dans HTML
      document
      .getElementById("items")
      // Puis on ajoute des éléments HTML, ex paragraphes pour tester, j'ai vu que avec juste = il n'y avait qu'un élément affiché, avec += c'est 8, soit le nombre de i
      // .innerHTML += "<p>texte</p>";

    // Après plusieurs tests avec des "" '' des (), j'ai retrouvé ca dans le cours : Pour créer une string interpolation on écrit du texte encadrée par le signe  `  et si on veut injecter une variable dans ce code on utilise l’expression  ${maVariable}. 
      // Ca n'a fonctionné que quand j'ai copié collé depuis le code commenté dans index.html. quand j'ai tappé avec des tab ou des espaces ou sans ca n'a pas fonctionné 

      
      .innerHTML += `<a href="./product.html?id=${i._id}">
      <article>
        <img src=${i.imageUrl} alt=${i.altTxt} />
        <h3 class="productName">${i.name}</h3>
        <p class="productDescription">${i.description}</p>
      </article>
    </a>`;
      
;
    };
  })
  .catch(function(err) {
    // Une erreur est survenue
  });




    
  
  

  
