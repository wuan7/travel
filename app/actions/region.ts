export const getRegions = async () => {
    const res = await fetch("/api/region", {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy danh sách khu vực");
    return res.json();
};

export const getRegion = async (id: string) => {
    const res = await fetch(`/api/region/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy khu vực");
    return res.json();
};