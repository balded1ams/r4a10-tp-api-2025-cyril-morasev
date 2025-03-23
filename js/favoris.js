// Attendre que le DOM soit chargé avant d'exécuter le script

document.addEventListener("DOMContentLoaded", () => {
    
    // Sélection des conteneurs dans le DOM
    const sectionContainer = document.querySelector(".section_container_favoris");
    const favorisContainer = document.querySelector(".favoris-container"); 
    
    // Récupération des favoris stockés dans le localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    // Vérification si des favoris existent, sinon afficher un message
    if (favorites.length === 0) {
        favorisContainer.innerHTML = "<p>Aucun favori pour le moment.</p>";
        return;
    }

    // AFFICHAGE DES FAVORIS 
    
    favorites.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("favori-item");
        
        const div_img_txt = document.createElement("div");
        div_img_txt.classList.add("div_img_txt");

        // Création de l'image de l'élément
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        // Création du bouton pour supprimer l'élément des favoris
        const aHeart = document.createElement("a"); 
        aHeart.href = "#";
        const img_coeur = document.createElement("img");
        img_coeur.classList.add("coeur_favori");
        img_coeur.src = "images/heart.png";
        aHeart.appendChild(img_coeur);

        // Création du nom de l'élément
        const name = document.createElement("h3");
        name.textContent = item.name;

        div_img_txt.appendChild(img);
        div_img_txt.appendChild(name);
        div.appendChild(div_img_txt);
        div.appendChild(aHeart);
        favorisContainer.appendChild(div);

        // AFFICHAGE D'UN ÉLÉMENT AU CLIC

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
                enelever_favoris(event);
            });

            // Bouton retour
            const a_return = document.createElement("a");
            a_return.classList.add("a_return");
            a_return.href = `/${item.category}`;
            a_return.addEventListener("click", (event) => {
                event.preventDefault();
                history.pushState({ category: item.category }, "", `/${item.category}`);
                loadCategory(categories.find((c) => c.name === item.category));
            });

            const img_in_a = document.createElement("img");
            img_in_a.src = "images/4225636.png";
            img_in_a.alt = "croix";
            a_return.appendChild(img_in_a);

            div_a.appendChild(a_favoris);
            div_a.appendChild(a_return);

            // Détails de l'élément
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

        // GESTION DE LA SUPPRESSION D'UN FAVORI

        aHeart.addEventListener("click", function(event) {
            event.preventDefault(); 
            favorites = favorites.filter(fav => fav.name !== item.name);
            localStorage.setItem("favorites", JSON.stringify(favorites)); 
            alert("L'élément a été retiré de vos favoris");
            div.remove(); 
            location.reload();
        });

        // Fonction pour supprimer un favori et recharger la page
        const enelever_favoris = (event) => {
            event.preventDefault();
            favorites = favorites.filter(fav => fav.name !== item.name);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("L'élément a été retiré de vos favoris");
            location.reload();
        }
    });
});
