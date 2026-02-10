import { eq } from "drizzle-orm";
import { Id } from "../../../../../core/domain/Id";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../../../core/domain/value-objects/Email";
import { HashedPassword } from "../../../../../core/domain/value-objects/HashedPassword";
import { UserRepositoryPort } from "../../../domain/repositories/IUserRepositoryPort";
import { db } from "../../../../../shared/config/database";
import { users } from "../../../../../shared/config/db-schema";


export class UserRepository implements UserRepositoryPort {
  /**
   * @description
   * @param user
   */
  public save = async (user: User) => {
    const [saved] = await db
      .insert(users)
      .values({
        email: user.Email.Value,
        passwordHash: user.PasswordHash.Value,
        createAt: new Date(),
        lastLogin: new Date(),
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          passwordHash: user.PasswordHash.Value,
          updatedAt: new Date(),
        },
      })
      .returning();
    const emailVO = Email.create(saved.email);
    const hashed = HashedPassword.fromHash(saved.passwordHash);

    return User.createNew(emailVO, hashed);
  };

  public findByEmail = async (email: string) => {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!result) return null;

    const passwordHash = HashedPassword.fromHash(result.passwordHash);
    return User.createNew(Email.create(email), passwordHash);
  };

  public delete = async (id: Id) => {
    const isExistingUser = await db.query.users.findFirst({
      where: eq(users.id, id.value),
    });

    if (isExistingUser) {
      await db.delete(users).where(eq(users.id, id.value));
    }
  };
}
