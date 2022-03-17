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
        productSelect(product);
        ArrayPanier(product);
       
       

       
  })



  .catch(function(err) {
    // Une erreur est survenue
  });



// Fonction qui récupère les données de la promise .then(product) pour insérer les éléments dans HTML
function productSelect(product){

    const image = document.getElementsByClassName("item__img") [0]// Récupère la class item img dans HTML
    // getElementsByName renvoi à une nodelist et pas un élément, il faut donc indiquer un index soit ici 0
    // image.innerHTML= `<img src="${product.imageUrl}" alt="${product.altTxt}" />`; // Insère l'url de l'image et son alt

    let newImage = document.createElement('img')
    // Création d'une balise <img>
    newImage.src=product.imageUrl;
    // Ajout du lien src à cette balise img
    newImage.alt=product.altTxt;
    // Ajout du alt texte à cette balise img
    image.appendChild(newImage);
    // Rattachement en tant qu'enfant de newImage à image précédemment récupéré par sa class dans HTML

    const titlePage = document.getElementsByTagName('title')[0]; // Récupère la balise title dans HTML
    titlePage.innerText = product.name; // Insère nom du produit trouvé dans l'API

    const title = document.getElementById("title"); // Recupere id Title dans HTML
    title.innerText = product.name; //Insére le nom du produit trouvé dans l'API

    const price = document.getElementById("price") // Récupère id price dans HTML
    price.innerText = product.price // Insére le prix trouvé dans l'API 

    const description = document.getElementById("description") // Récupère id descrption dans HTML
    description.innerText = product.description; // Insére le texte de la description trouvé dans l'API

    let couleur = document.getElementById("colors") // Récupère id colors dans HTML
    // Pour chaque couleur dans product, création d'une nouvelle entrée value
    for (let color of product.colors){
        // Pour chaque color dans colors de products provennant de l'API
    console.log(color)
    // ajouter à couleur (selectionné par id) dans HTML de l'option {color}
    couleur.innerHTML+= `<option value="${color}">${color}</option>`
    };
}


// Fonction qui récupère les données de la promise .then(product) et qui permet de récupérer l'article et de l'ajouter au local storage


function ArrayPanier(product){
const bouton = document.getElementById("addToCart")
// Pour écouter le click sur le bouton "ajouter au panier"
// Puis exécute une fonction qui récupère les valeurs couleur, quantité, id et créé un tableau, puis un objet pour test
bouton.addEventListener('click',function productAdd(product){
    const couleur = document.getElementById("colors")
    let couleurAdd=couleur.value 
    console.log(couleurAdd)


    const quantité = document.getElementById("quantity")
    let quantitéAdd = quantité.value
    console.log(quantitéAdd)

    console.log(idProduct)

    // productPanier =[couleurAdd,quantitéAdd,idProduct]
    // console.log(productPanier)


    // Création d'un objet avec les éléments selectionnés par le client
    productPanier ={
        couleur : couleurAdd,
        quantité : quantitéAdd,
        id : idProduct,
    }
    console.log(productPanier)

    // Transformation en ligne de caractère de l'objet productPanier
    let productPanierJson = JSON.stringify(productPanier)
    console.log(productPanierJson)

    // Ajout dans le local storage du produit selectionné par le client
    localStorage.setItem('panier',productPanierJson);
} )
}

function localeStorageAdd(product){
 
    localStorage.setItem('products', productPanierJson);
}



