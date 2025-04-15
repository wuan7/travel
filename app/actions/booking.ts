export const getBookingById = async (id: string) => {
    const res = await fetch(`/api/booking/${id}`);
    return res.json();
};

export const getBookingByUserId = async (id: string) => {
    const res = await fetch(`/api/booking/user/${id}`);
    return res.json();
}
