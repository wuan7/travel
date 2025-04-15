export const createCategory = async (data: FormData) => {
    try {
        const response = await fetch("/api/category", {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            throw new Error("Failed to create category");
        }

        return response.json();
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch("/api/category", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}