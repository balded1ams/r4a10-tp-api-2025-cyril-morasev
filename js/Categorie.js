class Category {
    constructor(name) {
        this.name = name;
        this.content = null;
        this.fetchContent();
    }

    async fetchContent() {
        try {
            const response = await fetch(
                `https://botw-compendium.herokuapp.com/api/v3/compendium/category/${this.name}`
            );
            const data = await response.json();
            this.content = data.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }

    get_image() {
        if (this.content && this.content.length > 0) {
            return this.content[0].image;
        }
        return null;
    }

    get_content() {
        return this.content || [];
    }
}
