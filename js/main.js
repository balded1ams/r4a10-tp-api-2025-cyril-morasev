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
        listItem.textContent = categoryName;
        listSection.appendChild(listItem);
    });

    await Promise.all(promises);
});

