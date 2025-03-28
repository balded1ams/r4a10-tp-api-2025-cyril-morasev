// Attendre que le DOM soit chargé avant d'exécuter le script

document.addEventListener("DOMContentLoaded", async () => {
    const categories = [
        "creatures",
        "equipment",
        "materials",
        "monsters",
        "treasure",
    ];
    
    // Sélection des conteneurs dans le DOM
    const sectionContainer = document.querySelector(".section_container_favoris");
    const favorisContainer = document.querySelector(".favoris-container"); 
    const searchInput = document.querySelector(".search-form input");
    const searchForm = document.querySelector(".search-form");
    const ul_recherche = document.querySelector(".ul_recherche");

    // Création d'un conteneur pour afficher les suggestions de recherche
    const searchResults = document.createElement("li");
    searchResults.classList.add("search-results");
    ul_recherche.appendChild(searchResults);

    let allItems = [];

    //Lien statique pour résoudre les soucis des url différents pour quand on navigue entre les dfifférentes catégories et éléments
    const basePath = window.location.origin + "/r4a10-tp-api-2025-cyril-morasev";

    try {
        await Promise.all(
            categories.map(async (name) => {
                const category = new Category(name);
                await category.fetchContent();
                allItems = allItems.concat(category.content);
            })
        );
        console.log("Données chargées :", allItems);
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }

    // Gestion de la recherche
    let searchTimeout;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.toLowerCase().trim();
            ul_recherche.innerHTML = "";

            if (query.length === 0) {
                ul_recherche.style.display = "none";
                return;
            }

            ul_recherche.style.display = "block";

            const filteredItems = allItems.filter(item => item.name.toLowerCase().includes(query));

            filteredItems.forEach(item => {
                const resultli = document.createElement("li");
                resultli.classList.add("search-item");
                resultli.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="search-img">
                    <span>${item.name}</span>
                `;
                resultli.addEventListener("click", () => {
                    history.pushState({ category: item.category, item: item.name }, "", `${basePath}/${item.category}/${item.name}`);
                    loadElement(item);
                    ul_recherche.innerHTML = ""; 
                });
                ul_recherche.appendChild(resultli);
            });
        }, 300);
    });

    // Cacher la barre de résultats quand on clique ailleurs
    document.addEventListener("click", (event) => {
        if (!searchForm.contains(event.target)) {
            ul_recherche.innerHTML = "";
        }
    });


    
    // Récupération des favoris stockés dans le localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    // Vérification si des favoris existent, sinon afficher un message
    if (favorites.length === 0) {
        favorisContainer.innerHTML = "<p>Aucun favori pour le moment.</p>";
        return;
    }

    //On affiche tous les favoris qu'on vient de recuperer au dessus
    favorites.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("favori-item");
        
        const div_img_txt = document.createElement("div");
        div_img_txt.classList.add("div_img_txt");

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        const aHeart = document.createElement("a"); 
        aHeart.href = "#";
        const img_coeur = document.createElement("img");
        img_coeur.classList.add("coeur_favori");
        img_coeur.src = "images/heart.png";
        aHeart.appendChild(img_coeur);

        const name = document.createElement("h3");
        name.textContent = item.name;

        div_img_txt.appendChild(img);
        div_img_txt.appendChild(name);
        div.appendChild(div_img_txt);
        div.appendChild(aHeart);
        favorisContainer.appendChild(div);


        //Gestion du clic sur un des éléments favoris
        div_img_txt.addEventListener("click", function() {
            sectionContainer.innerHTML = "";
            const element_div = document.createElement("div");
            element_div.classList.add("element_div");

            const div_a = document.createElement("div");
            div_a.classList.add("div_a");

            // Bouton favoris dans la page de détail
            const a_favoris = document.createElement("a");
            a_favoris.href = "#";
            const img_favoris = document.createElement("img");
            img_favoris.src = "images/heart.png";
            img_favoris.alt = "coeur";
            a_favoris.appendChild(img_favoris);
            a_favoris.classList.add("a_favoris");

            a_favoris.addEventListener("click", function (event) {
                event.preventDefault();
                enlever_favoris(event);
            });

            // Bouton retour
            const a_return = document.createElement("a");
            a_return.classList.add("a_return");
            a_return.href = `favoris.html`;

            const img_in_a = document.createElement("img");
            img_in_a.src = "images/4225636.png";
            img_in_a.alt = "croix";
            a_return.appendChild(img_in_a);

            div_a.appendChild(a_favoris);
            div_a.appendChild(a_return);

            const elementImg = document.createElement("img");
            elementImg.src = item.image;
            elementImg.alt = item.name;
            const elementName = document.createElement("h2");
            elementName.textContent = item.name;
            const elementDescription = document.createElement("p");
            elementDescription.textContent = "Description : " + (item.description || "");
            const elementLocation = document.createElement("p");
            elementLocation.textContent = "Common(s) location(s) : " + (item.common_locations || "");
            const elementDrops = document.createElement("p");
            elementDrops.textContent = "Drops : " + (item.drops || "");

            element_div.appendChild(div_a);
            element_div.appendChild(elementName);
            element_div.appendChild(elementImg);
            element_div.appendChild(elementDescription);
            element_div.appendChild(elementLocation);
            element_div.appendChild(elementDrops);
            sectionContainer.appendChild(element_div);
        });

        //Gestion du clic sur le bouton favori qui va enlever l'élément des favoris
        aHeart.addEventListener("click", function(event) {
            enlever_favoris(event);
            div.remove(); 
        });

        // Fonction pour supprimer un favori et recharger la page
        const enlever_favoris = (event) => {
            event.preventDefault();
            favorites = favorites.filter(fav => fav.name !== item.name);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("L'élément a été retiré de vos favoris");
            location.reload();
        }
    });
});
