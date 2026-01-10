export const formatPriceCOP = (value) => {
  if (typeof value !== "number") return "0";
  return new Intl.NumberFormat("es-CO").format(value);
};