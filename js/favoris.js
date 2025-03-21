document.addEventListener("DOMContentLoaded", () => {
    const favorisContainer = document.querySelector(".favoris-container"); 
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favorisContainer.innerHTML = "<p>Aucun favori pour le moment.</p>";
        return;
    }

    favorites.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("favori-item");

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

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(aHeart);
        favorisContainer.appendChild(div);

        aHeart.addEventListener("click", function(event) {
            event.preventDefault(); 
            favorites = favorites.filter(fav => fav.name !== item.name);
            localStorage.setItem("favorites", JSON.stringify(favorites)); 
            alert("L'élément a été retiré de vos favoris");
            div.remove(); 
            location.reload();
        });
    });
});
