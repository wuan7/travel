export const getContinents = async () => {
    const res = await fetch("/api/continent", {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy danh sách khu vực");
    return res.json();
};

export const getContinent = async (id: string) => {
    const res = await fetch(`/api/continent/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy khu vực");
    return res.json();
};