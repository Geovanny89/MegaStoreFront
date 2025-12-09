export const CompleteOrder = async (orderId) => {
    try {
        const res = await api.post(`/order/complete/${orderId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
