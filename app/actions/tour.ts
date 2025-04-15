export const getToursById = async (id: string, excludeId?: string) => {
    const res = await fetch(`/api/tour?id=${id}&exclude=${excludeId}`);
    return res.json();
};

export const getTourById = async (id: string) => {
    const res = await fetch(`/api/tour/${id}`);
    return res.json();
};

export const getTours = async () => {
    const res = await fetch("/api/tour");
    return res.json();
};