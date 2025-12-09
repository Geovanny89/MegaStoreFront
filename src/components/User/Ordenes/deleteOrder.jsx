export const deleteOrder = async (orderId) => {
    try {
        const res = await api.delete(`/order/delete//${orderId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
