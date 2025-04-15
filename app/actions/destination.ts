
export const getDestinationByRegionId = async (id: string) => {
    const res = await fetch(`/api/destination/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach diem den");
    return res.json();
}

export const getDestinationByCategoryId = async (id: string) => {
    const res = await fetch(`/api/destination?categoryId=${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach diem den");
    return res.json();
}

export const getDestination = async () => {
    const res = await fetch(`/api/destination`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach diem den");
    return res.json();
}

export const getDestinationById = async (id: string) => {
    const res = await fetch(`/api/destination/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay diem den");
    return res.json();
}