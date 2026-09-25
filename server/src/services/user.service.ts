import { User } from '../models';

export class UserService {
  /**
   * List all registered users
   */
  static async getAllUsers() {
    return User.findAll({
      attributes: ['id', 'name', 'email', 'avatar_color', 'created_at'],
      order: [['name', 'ASC']],
    });
  }

  /**
   * Find user by ID
   */
  static async getUserById(userId: string) {
    return User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'avatar_color', 'created_at'],
    });
  }
}
