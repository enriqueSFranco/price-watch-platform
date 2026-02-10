export interface IProductAlertPort {
  findActiveByProductId(productId: string): Promise<IProductAlert[]>;
  findAllActive(): Promise<IProductAlert[]>;
  markAsTriggered(id: string): Promise<void>;
  create(productAlert: IProductAlert): Promise<IProductAlert>;
  delete(id: string): Promise<void>;
}
