import api from "../api/axios";

export const createOrder = async (cartItems, shippingAddress) => {
    try {
        const products = cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity
        }));

        const res = await api.post("/order'", {
            products,
            shippingAddress
        });

        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
