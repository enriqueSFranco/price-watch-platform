import { Id } from "../../../../core/domain/Id";
import { User } from "../entities/User";

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: Id): Promise<void>;
}
