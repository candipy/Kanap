//Création d'une constate composée des élément produits de l'API

let produitsApi=("http://localhost:3000/api/products/") 

//Je créé un fetch avec la constante contenant les éléments de l'API afin de les récupérer et de pouvoir les utiliser

fetch("http://localhost:3000/api/products/") 
//fonction then pour récupérer le résultat de la requete au format json en ayant vérifié que tout s'est bien passé
//Ce résultat est une promise : la Promise est un objet qui fournit une fonction then qui sera exécutée quand le résultat aura été obtenu, et une fonction catch qui sera appelée s’il y a une erreur qui est survenue lors de la requête   
.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

// pour l'instant j'essaye deja d'afficher dans la console les couleurs :'(
  .then(function(value) {
    for (let colors of products);
    console.log(products.colors)
        
        });     


console.log(produitsApi)
    
  
  

  
