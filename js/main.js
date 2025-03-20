document.addEventListener("DOMContentLoaded", async () => {
    const categories = [
        "creatures",
        "equipment",
        "materials",
    ];
    const category_section = document.querySelector(".choice_category");
    const main_section = document.querySelector("main");

    await Promise.all(
        categories.map(async (name) => {
        const category = new Category(name);
        await category.fetchContent();
        const image_url = category.get_image_url();
        const category_div = document.createElement("div");
        category_div.classList.add("category_summary");
        category_div.innerHTML = `
            <img src="${image_url}" alt="${name}">
            <h2>${name}</h2>
        `;

        //gestion du prechargement
        const preloadImages = () => {
            for (let i = 1; i < 21; i++) {
                const link = document.createElement("link");
                link.rel = "preload";
                link.as = "image";
                link.href = category.content[i].image;
                document.head.appendChild(link);
            }
            category_div.removeEventListener("mouseenter", preloadImages);
        };
        category_div.addEventListener("mouseenter", preloadImages);
        //click sur les categories
        category_div.addEventListener("click", () => {
            main_section.innerHTML = "";
            const images_section = document.createElement("section");
            images_section.classList.add("images_section");
            //ajoute des iamges
            category.content.forEach((item) => {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.name;
                images_section.appendChild(img);
                //click sur les images
                img.addEventListener("click", () => {
                    main_section.innerHTML = "";
                    const element_section = document.createElement("section");
                    element_section.classList.add("element_section");

                    const elementImg = document.createElement("img");
                    elementImg.src = item.image;
                    elementImg.alt = item.name;
                    element_section.appendChild(elementImg);
                    main_section.appendChild(element_section);
                });
            });
            main_section.appendChild(images_section);
        });
        category_section.appendChild(category_div);
    })
  );
});

