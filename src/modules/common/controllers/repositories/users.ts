import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/database/models/users.entity';

@Injectable()
export class UsersRepository {
  public async count(): Promise<number> {
    return await User.count();
  }
}
