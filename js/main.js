document.addEventListener("DOMContentLoaded", async () => {
    const categories = [
        "creatures",
        "equipment",
        "materials",
        "monsters",
        "treasure",
    ];

    const categorySection = document.querySelector(".choice_category");
    const listSection = document.querySelector("main ul");
    const mainContent = document.querySelector("main");
    const linkelements = document.querySelectorAll("link[rel=preload]");

    const promises = categories.map(async (categoryName) => {
        const categoryInstance = new Category(categoryName);
        await categoryInstance.fetchContent();
        const imageUrl = categoryInstance.get_image_url();

        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category_summary");
        categoryDiv.innerHTML = `
            <img src="${imageUrl}" alt="${categoryName}">
            <h2>${categoryName}</h2>
        `;
        categoryDiv.id = categoryName;
        
        const preloadImages = () => {
            for (let i = 1; i < 21; i++) {
                const link = document.createElement("link");
                link.rel = "preload";
                link.as = "image";
                link.href = categoryInstance.content[i].image;
                document.head.appendChild(link);
            }
            categoryDiv.removeEventListener("mouseenter", preloadImages);
        };
        
        categoryDiv.addEventListener("mouseenter", preloadImages);
        categorySection.appendChild(categoryDiv);

        const listItem = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${categoryName}`;
        a.textContent = categoryName;
        listItem.appendChild(a);
        listSection.appendChild(listItem);


        
        linkelements.forEach((link) => {
            const preloadElements = () => {
                if (!link.dataset.element) {
                    const divElement = document.createElement("div");
                    divElement.classList.add("element");
                    const item = categoryInstance.content[0]; 

                    divElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <h1>${item.name}</h1>
                        <p>${item.description}</p>
                        <p>${item.location}</p>
                    `;

                    link.dataset.element = divElement.outerHTML;
                }
                link.removeEventListener("mouseenter", preloadElements);
            };

            const showElements = () => {
                if (link.dataset.element) {
                    mainContent.innerHTML = link.dataset.element;
                }
                link.removeEventListener("click", showElements);
            };

            link.addEventListener("mouseenter", preloadElements);
            link.addEventListener("click", showElements);
        });
    });

    await Promise.all(promises);

});

