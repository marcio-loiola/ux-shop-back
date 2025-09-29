import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private usersRepository: Repository<User>;

  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
  ) {
    this.usersRepository = dataSource.getRepository(User);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    const emailIsUsed = await this.usersRepository.findOne({
      where: { email },
    });
    if (emailIsUsed) throw new ConflictException('Email already registered');

    const passwordHash = await hash(password, 8);

    const user = this.usersRepository.create({
      name,
      email,
      passwordHash,
    });

    return await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find({});
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User not found`);

    const { email, name, password } = updateUserDto as CreateUserDto;

    if (email && email !== user.email) {
      const emailIsUsed = await this.usersRepository.findOne({
        where: { email },
      });
      if (emailIsUsed) throw new ConflictException('Email already registered');
    }

    let passwordHash;
    if (password) passwordHash = await hash(password, 8);

    const updatedUser = await this.usersRepository.preload({
      id,
      email,
      name,
      passwordHash,
    });

    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User not found`);

    return await this.usersRepository.delete(id);
  }
}
