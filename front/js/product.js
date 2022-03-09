// Il faut maintenant récupérer l'id ayant été cliqué sur la page d'accueil

//1) Récupération de l'URL de la page affichée
var url = new URL(location.href);
//2) Recherche dans l'url le paramètre de l'ID
var idProduit = url.searchParams.get("id");
console.log(idProduit);

