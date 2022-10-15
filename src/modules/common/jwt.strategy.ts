import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any) {
    // console.log('validate AuthStrategy', payload);
    // if (payload.roles !== 'sysAdmin' && payload.roles !== 'admin') {
    //   // throw new ConflictException('invalid-user')
    //   return null;
    // }

    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
