import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../database/models/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    await this.isUserActive(user.id);

    if (user.roles === 'sysAdmin') return true;

    const isValidUser = requiredRoles.some(role => user.roles?.includes(role));

    if (!isValidUser) throw new UnauthorizedException('invalid-user');

    return isValidUser;
  }

  async isUserActive(userId: number): Promise<void> {
    const userDatabase = await User.findOne({
      where: {
        id: userId
      },
      select: ['roles', 'status', 'deletedAt']
    });

    if (!userDatabase) throw new UnauthorizedException('user-is-not-active');

    if (!userDatabase.status || userDatabase.deletedAt) throw new UnauthorizedException('user-is-not-active');
  }
}
