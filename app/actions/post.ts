
export const getPostById = async (id: string) => {
    const res = await fetch(`/api/post/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay bai viet");
    return res.json();
}