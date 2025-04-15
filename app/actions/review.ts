export const getReviewCheck = async (tourId : string, userId : string) => {
    const res = await fetch(`/api/review/check?tourId=${tourId}&userId=${userId}`);
    return res.json();
};

export const getReviewsByTourId = async (tourId : string) => {
    const res = await fetch(`/api/review/tour/${tourId}`);
    return res.json();
};