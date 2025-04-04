class Category {
    constructor(name) {
        this.name = name;
        this.content = null;
        this.fetchContent();
    }

    async fetchContent() {
        try {
            const response = await fetch(
                `https://botw-compendium.herokuapp.com/api/v3/compendium/category/${this.name}?game=totk`
            );
            const data = await response.json();
            this.content = data.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }

    preloadImages() {
        if (this.content && this.content.length > 0) {
            for (let i = 0; i < Math.min(20, this.content.length); i++) {
                const imageUrl = this.content[i].image;
                const link = document.createElement("link");
                link.rel = "preload";
                link.as = "image";
                link.href = imageUrl;
                document.head.appendChild(link);
            }
        }
    }

    get_image_url() {
        if (this.content && this.content.length > 0) {
            return this.content[0].image;
        }
        return null;
    }

    get_content() {
        return this.content;
    }
}


