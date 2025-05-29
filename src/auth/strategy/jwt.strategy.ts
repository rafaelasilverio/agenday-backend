import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'segredo123', // ideal usar process.env
    });
  }

async validate(payload: any) {
  console.log('JWT VALIDATED:', payload); // 👈 ajuda para debug
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

}
