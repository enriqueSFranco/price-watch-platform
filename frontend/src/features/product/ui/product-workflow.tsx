"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { submitScreapedProduct } from "@/actions/submitScrapedProduct";
import { useAddProductMutation } from "@/store/features/products/products.api";
import { Button } from "@/ui/atoms/Button/button";
import { ROUTES } from "@/shared/constants/routes";
import { AddProductDataType, ScrapedProduct } from "@/shared/types/product.d";
import { CustomError } from "@/shared/custom-error";
import { ScraperForm } from "@/features/scraper/ui/scraper-form";
import { AddRulesForm } from "@/features/scraper/ui/add-rules-form";
import styles from "./product-workflow.module.css";

// enums
enum CurrentStep {
  SCRAPER = "scraper",
  RULES = "rules",
}

// componente orquestador
export function ProductWorkflow() {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<ScrapedProduct | null>(
    null
  );
  const [
    triggerAddProduct,
    { isLoading, error: addError, isError: hasAddError },
  ] = useAddProductMutation();

  // Función para manejar la adición del producto
  const handleAddProduct = async () => {
    if (!productDetails) return;
    console.log("agregando un nuevo producto");

    // aqui ya el productDetails contiene la información scrapeada
    const { name, originalUrl } = productDetails.data.product;
    const finalProduct: AddProductDataType = {
      url: originalUrl,
      name: name,
      email: "default.email@domain.com",
      rules: {
        threshold: 3000,
        percentageDrop: 10,
      },
    };
    try {
      await triggerAddProduct(finalProduct).unwrap();
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const currentStep: CurrentStep = !productDetails
    ? CurrentStep.SCRAPER
    : CurrentStep.RULES;

  return (
    <>
      {currentStep === CurrentStep.SCRAPER && (
        <ScraperForm onSuccess={setProductDetails} />
      )}
      {currentStep === CurrentStep.RULES && (
        <div>
          <AddRulesForm />
          <Button
            disabled={isLoading}
            onClick={handleAddProduct}
          >
            <span>Agregar producto</span>
          </Button>
        </div>
      )}
      {hasAddError && (
        <div className={styles.errorMessage}>
          <p>{(addError as CustomError).message}</p>
        </div>
      )}
    </>
  );
}
