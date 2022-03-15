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
const idProductAPI = `http://localhost:3000/api/products/${idProduct}` 


fetch(idProductAPI)
.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then((product)=> {
      console.log(product)

        const image = document.getElementsByClassName("item__img") [0]// Récupère la class item img dans HTML
        // getElementsByName renvoi à une nodelist et pas un élément, il faut donc indiquer un index soit ici 0
        image.innerHTML= `<img src="${product.imageUrl}" alt="${product.altTxt}" />`; // Insère l'url de l'image et son alt

        const titlePage = document.getElementsByTagName('title')[0]; // Récupère la balise title dans HTML
        titlePage.innerText = product.name; // Insère nom du produit trouvé dans l'API

        const title = document.getElementById("title"); // Recupere id Title dans HTML
        title.innerText = product.name; //Insére le nom du produit trouvé dans l'API

        const price = document.getElementById("price") // Récupère id price dans HTML
        price.innerText = product.price // Insére le prix trouvé dans l'API 

        const description = document.getElementById("description") // Récupère id descrption dans HTML
        description.innerText = product.description; // Insére le texte de la description trouvé dans l'API

        let couleur = document.getElementById("colors") // Récup§re id colors dans HTML
        // Pour chaque couleur dans product, création d'une nouvelle entrée value
        for (let color of product.colors){
            // Pour chaque color dans colors de products provennant de l'API
        console.log(color)
        // ajouter à couleur (selectionné par id) dans HTML de l'option {color}
        couleur.innerHTML+= `<option value="${color}">${color}</option>`
        };
       
  })

  .catch(function(err) {
    // Une erreur est survenue
  });

