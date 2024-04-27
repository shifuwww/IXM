import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUser } from 'src/common/interfaces/user';
import { UserEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.repository.findOne({
        where: { email },
      });

      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async createUser(createUser: ICreateUser): Promise<UserEntity> {
    try {
      const newUser = this.repository.create(createUser);
      return await this.repository.save(newUser);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async updateUserPassword(
    email: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await this.repository.update({ email }, { password: newPassword });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
