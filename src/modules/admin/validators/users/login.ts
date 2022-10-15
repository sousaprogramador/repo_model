import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export class ForgotPass {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  email: string;
}

export class ResetPass {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  password: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  confirmPassword: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  token: string;
}
export class LoginAdmin {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: 'admin@luby.software' })
  email: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: 'Luby2021' })
  password: string;
}

export class LoginResponseAdmin {
  @ApiProperty({ type: 'string', required: true, default: null, example: 'JWT Token' })
  access_token: string;

  @ApiProperty({
    type: Object,
    required: true,
    default: null,
    example: {
      refresh_token: 'Token refresh',
      expiresIn: 'Tempo de expiração'
    }
  })
  refresh_token: {
    refresh_token: string;
    expiresIn: number;
  };

  @ApiProperty({ type: 'string', required: true, default: null, example: 1 })
  id?: number;

  @ApiProperty({ type: 'string', required: true, default: null, example: 'email@email.com' })
  email?: string;

  @ApiProperty({ type: 'string', required: true, default: 'user', examples: ['sysAdmin', 'admin', 'user'] })
  roles?: string;
}
