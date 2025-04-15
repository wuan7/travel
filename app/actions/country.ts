export const getCountries = async () => {
    const res = await fetch("/api/country", {
        cache: "force-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy danh sách quốc gia");
    return res.json();
};

export const getCountry = async (id: string) => {
    const res = await fetch(`/api/country/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Lỗi lấy quốc gia");
    return res.json();
};

export const getCountryByContinentId = async (id: string) => {
    const res = await fetch(`/api/country?continentId=${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach quoc gia");
    return res.json();
}

export const getCountryByCategoryId = async (id: string) => {
    const res = await fetch(`/api/country?categoryId=${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach quoc gia");
    return res.json();
}
