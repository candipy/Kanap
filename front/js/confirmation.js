// Objectif : Récupérer l'orderId dans l'URL pour l'afficher sur la page

//Récupération de l'URL de la page affichée
const url = new URL(location.href);

//Recherche dans l'url le paramètre de l'orderId
const orderIdURL = url.searchParams.get("id");

// Cibler l'id dans HTML
const orderIdHTML = document.getElementById("orderId");

// Ajouter l'orderId trouvé dans l'URL et l'afficher sur la page
orderIdHTML.innerText = orderIdURL;
