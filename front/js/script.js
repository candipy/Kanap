

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
    for (i of products){
      //Pour chaque tour dans products, on pointe l'ID "items" dans HTML
      document
      .getElementById("items")
      // Puis on ajoute des éléments HTML, ex paragraphes pour tester, j'ai vu que avec juste = il n'y avait qu'un élément affiché, avec += c'est 8, soit le nombre de i
      // .innerHTML += "<p>texte</p>";

    

      .innerHTML += " <a href='./product.html?id=(&{i._id})'><article><img src='.../product01.jpg' alt=(i.altTxt)/><h3 class='productName'>Kanap name1</h3><p class='productDescription'>Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p></article></a>"
      ;
    }
  })
  .catch(function(err) {
    // Une erreur est survenue
  });




    
  
  

  
