import { Injectable, Inject } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private usersRepository: Repository<User>;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('DataSource')
    private dataSource: DataSource,
  ) {
    this.usersRepository = dataSource.getRepository(User);
  }

  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) return null;

    const isPasswordValid = compareSync(password, user.passwordHash);
    if (!isPasswordValid) return null;

    return user;
  }
}
