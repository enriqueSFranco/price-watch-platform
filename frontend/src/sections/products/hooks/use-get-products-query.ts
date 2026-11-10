import { useEffect, useState } from "react";
import type { Product } from "@/modules/products/domain/Product.schema";
import {mockProducts} from "@/data/mockProducts"

export const useGetProductsQuery = (arg: undefined) => {
  const [data, setData] = useState<Product[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    setIsLoading(true);
    // Simular API call delay
    const timer = setTimeout(() => {
      // Simular éxito y devolver los datos mock
      setData(mockProducts);
      setError(undefined);
      setIsLoading(false);
    }, 800); // 800ms de latencia simulada

    return () => clearTimeout(timer);
  }, []);

  return { data, error, isLoading };
};
