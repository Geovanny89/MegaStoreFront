export const updateOrder = async (orderId, products) => {
    try {
        const res = await api.put(`/order/update/${orderId}`, {
            products
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
