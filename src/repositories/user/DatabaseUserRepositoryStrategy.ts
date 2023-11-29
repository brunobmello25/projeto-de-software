import { User } from "~/models/user";
import { PrismaClient, PrismaSingleton } from "~/config/database";
import { UserRepositoryStrategy } from "./UserRepositoryStrategy";

export class DatabaseUserRepositoryStrategy implements UserRepositoryStrategy {
  private db: PrismaClient;

  constructor() {
    this.db = PrismaSingleton.getInstance();
  }

  public async getById(id: number): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  public async getByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  public async create(name: string, email: string): Promise<User> {
    return this.db.user.create({ data: { name, email } });
  }

  public async list(): Promise<User[]> {
    return this.db.user.findMany();
  }

  public async update(id: number, name: string, email: string): Promise<User> {
    return this.db.user.update({ where: { id }, data: { name, email } });
  }

  public async delete(id: number): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}