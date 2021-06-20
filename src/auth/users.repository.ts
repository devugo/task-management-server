import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ERROR_CODE } from '../constants/error-code';
import { ThrowError } from '../helpers/throw-error';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, email, password: hashPassword });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === ERROR_CODE.conflict) {
        ThrowError.conflict('Username already exists');
      } else {
        ThrowError.internalServer();
      }
    }
  }
}
