import z from "zod";

export const PriceSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    const cleaned = val
      .replace(/[^\d.,-]/g, "") // quitamos todo menos digitos, puntos, comas y guiones
      .replace(/\./g, "") // quitar separadores de miles con punto (formato europeo)
      .replace(/,/g, "."); // convertir coma decimal a punto
    return Number(cleaned);
  }
}, z.number().positive());
