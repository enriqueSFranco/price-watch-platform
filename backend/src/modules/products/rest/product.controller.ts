import type { Request, Response, NextFunction } from "express";
import { AddProductUseCase } from "../application/use-cases/AddProductUseCase.ts";
import { CreateProductSchema } from "../../scraper/application/dto/createProduct.dto.ts";
import { GetProductUseCase } from "../application/use-cases/GetProductUseCase.ts";
import { ListProductsUseCase } from "../application/use-cases/ListProductsUseCase.ts";
import { Id } from "../../../core/domain/Id.ts";

// Orquestan la lógica del request y response. No tienen lógica de negocio.
export class ProductController {
  constructor(
    private readonly listUC: ListProductsUseCase,
    private readonly getUC: GetProductUseCase,
    private readonly addProductUC: AddProductUseCase
  ) {}

  public list = async (req: Request, res: Response) => {
    try {
      const rawUserId = req.user?.userId;
      if (!rawUserId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: userId missing",
        });
      }

      const userId = Id.fromString(rawUserId);

      const data = await this.listUC.execute(userId);
      return res.status(200).json({ status: "success", data });
    } catch (e) {
      console.error("[ListController] Error:", e);
      return res
        .status(400)
        .json({ status: "error", message: (e as Error).message });
    }
  };

  public get = async (req: Request, res: Response) => {
    try {
      const rowUserId = req.user?.userId;
      const rowProductId = req.params.id;

      if (!rowUserId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: userId missing",
        });
      }
      const userId = Id.fromString(rowUserId);
      const productId = Id.fromString(rowProductId);
      const product = await this.getUC.execute(userId, productId);
      return res.json({ status: "success", data: product });
    } catch (e) {
      return res
        .status(400)
        .json({ status: "error", message: (e as Error).message });
    }
  };

  /**
   *
   * @param req - El objeto de la solicitud HTTP.
   * @param res - El objeto de la respuesta HTTP.
   * @param next - El siguiente middleware en la pila.
   * @returns
   */
  public add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rowUserId = req.user?.userId;
      if (!rowUserId) {
        return res.json(401).json({
          status: "error",
          message: "Unauthorized: userId missing",
        });
      }
      const userId = Id.fromString(rowUserId);
      const dto = CreateProductSchema.parse(req.body);
      // llamamos al caso de uso AddProduct
      const newProduct = this.addProductUC.execute(userId, dto);

      return res.status(201).json({
        status: "success",
        message: "Product added to monitoring",
        product: newProduct,
      });
    } catch (e) {
      console.error("[AddController]: Error: ", e);
      return res.status(400).json({
        status: "error",
        message: e instanceof Error ? e.message : "Error Unknown",
      });
    }
  };

  /**
   * @description Controlador para buscar productos
   * Se encarga de validar la entrada, llamar al servicio y formatear la respuesta HTTP con metadatos de paginación.
   * @param {Request} req - El objeto de la solicitud HTTP.
   * @param {Response} res - El objeto de la respuesta HTTP.
   * @param {NextFunction} next - El siguiente middleware en la pila.
   * @returns Una respuesta HTTP con la data y los metadatos.
   */
  // handleSearchProducts = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const parsedQuery = SearchProductSchema.parse(req.query);
  //     const { q, page, per_page: perPage } = parsedQuery;
  //     const { data, totalCount } = await this.productService.searchProducts({
  //       q,
  //       page,
  //       per_page: perPage,
  //     });
  //     // calculamos los metadatos de la paginación
  //     const pageCount = Math.ceil(totalCount / perPage);
  //     const baseUrl = req.baseUrl + req.path;
  //     const queryStr = `q=${q}&per_page=${perPage}`;
  //     const buildLink = (p: number) =>
  //       p ? `${baseUrl}?${queryStr}&page=${p}` : null;

  //     const metadata = {
  //       page,
  //       per_page: perPage,
  //       page_count: pageCount,
  //       total_count: totalCount,
  //       links: [
  //         { self: buildLink(page) },
  //         { first: buildLink(1) },
  //         { prev: page > 1 ? buildLink(page - 1) : null },
  //         { next: page < pageCount ? buildLink(page + 1) : null },
  //         { last: buildLink(pageCount) },
  //       ],
  //     };
  //     res.status(200).json({
  //       _metadata: metadata,
  //       records: data,
  //     });
  //   } catch (error) {
  //     // Pasamos el error al middleware
  //     next(error);
  //   }
  // };
}
