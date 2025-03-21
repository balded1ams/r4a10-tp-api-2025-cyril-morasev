document.addEventListener("DOMContentLoaded", async () => {
    const categories = [
        "creatures",
        "equipment",
        "materials",
        "monsters",
        "treasure",
    ];
    const category_section = document.querySelector(".choice_category");
    const listSection = document.querySelector("main ul");
    const main_section = document.querySelector("main");

    const loadCategory = async (category) => {
        main_section.innerHTML = "";
        const images_section = document.createElement("section");
        images_section.classList.add("images_section");

        category.content.forEach((item) => {
            const div_elements = document.createElement("div");
            div_elements.classList.add("div_elements");
            const img = document.createElement("img");
            const nom_element = document.createElement("h3");
            nom_element.textContent = item.name;
            img.src = item.image;
            img.alt = item.name;
            div_elements.appendChild(img);
            div_elements.appendChild(nom_element);
            images_section.appendChild(div_elements);

            // Gérer le clic sur un élément
            div_elements.addEventListener("click", () => {
                history.pushState({ category: category.name, item: item.name }, "", `/${category.name}/${item.name}`);
                loadElement(item);
            });
        });

        main_section.appendChild(images_section);
    };

    const loadElement = (item) => {
        main_section.innerHTML = "";
        const element_div = document.createElement("div");
        element_div.classList.add("element_div");

        const div_a = document.createElement("div");
        div_a.classList.add("div_a");

        const a_favoris = document.createElement("a");
        a_favoris.href = "#";
        const img_favoris = document.createElement("img");
        img_favoris.src = "images/14815.png";
        img_favoris.alt = "coeur";
        a_favoris.appendChild(img_favoris);

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
        main_section.appendChild(element_div);
    };

    await Promise.all(
        categories.map(async (name) => {
            const category = new Category(name);
            await category.fetchContent();
            const category_div = document.createElement("div");
            category_div.classList.add("category_summary");
            category_div.innerHTML = `<h2>${name}</h2>`;
            category_div.id = name;

            // Création d'un conteneur spécifique pour cette catégorie
            const elements_container = document.createElement("div");
            elements_container.classList.add("elements_container");

            // Affichage des 5 premiers éléments pour chaque catégorie
            for (let i = 0; i < 5; i++) {
                const elements_div = document.createElement("div");
                elements_div.classList.add("elements_summary");
                const element = category.content[i].image;
                elements_div.innerHTML = `<img src="${element}" alt="${category.content[i].name}">`;

                elements_container.appendChild(elements_div);
            }

            category_div.appendChild(elements_container);

            // Ajout des catégories dans la liste
            const listItem = document.createElement("li");
            const a = document.createElement("a");
            a.href = `/${name}`;
            a.textContent = name;
            listItem.appendChild(a);
            listSection.appendChild(listItem);

            // Clic sur une catégorie
            category_div.addEventListener("click", () => {
                history.pushState({ category: name }, "", `/${name}`);
                loadCategory(category);
            });

            category_section.appendChild(category_div);
        })
    );

    window.onpopstate = (event) => {
        if (event.state) {
            if (event.state.item) {
                const category = categories.find((c) => c.name === event.state.category);
                const item = category.content.find((i) => i.name === event.state.item);
                loadElement(item);
            } else if (event.state.category) {
                const category = categories.find((c) => c.name === event.state.category);
                loadCategory(category);
            }
        } else {
            main_section.innerHTML = "";
        }
    };

    const path = window.location.pathname.split("/").filter(Boolean);
    if (path.length === 1) {
        const category = categories.find((c) => c.name === path[0]);
        if (category) loadCategory(category);
    } else if (path.length === 2) {
        const category = categories.find((c) => c.name === path[0]);
        if (category) {
            const item = category.content.find((i) => i.name === path[1]);
            if (item) loadElement(item);
        }
    }
});

