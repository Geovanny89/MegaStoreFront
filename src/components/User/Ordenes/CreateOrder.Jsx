import api from "../api/axios";

export const createOrder = async (cartItems, addressId = null) => {
  const products = cartItems.map(item => ({
    productId: item._id,
    quantity: item.quantity
  }));

  const res = await api.post("/order", {
    products,
    addressId // 👈 ID de la dirección seleccionada
  });

  return res.data;
};
