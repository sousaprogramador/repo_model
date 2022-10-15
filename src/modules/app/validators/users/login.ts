import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Term } from 'src/modules/database/models/terms.entity';
import { User } from 'src/modules/database/models/users.entity';

export class ForgotPass {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: 'user@user.com' })
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
export class LoginUserApp {
  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, default: null })
  tokenOneSignal: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: 'user@user.com' })
  email: string;

  @ApiProperty({ type: 'string', required: true, default: '123456' })
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  password: string;
}

export class LoginResponse {
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

  @ApiProperty({ type: User, required: true })
  user?: User;

  @ApiProperty({ type: 'string', required: true, default: null, example: 'Token de Chat' })
  chatToken?: string;

  @ApiProperty({
    type: 'boolean',
    default: true,
    description: 'Se os dados de perfil estão todos preenchidos'
  })
  isMissingData?: boolean;

  @ApiProperty({
    type: 'boolean',
    default: true,
    description: 'Se precisa que o usuario aceite o novo termo'
  })
  lastTerm?: Term | null;
}

export class FacebookLogin {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  accessToken: string;

  // @IsOptional()
  // @ApiProperty({ type: 'string', required: false, default: null })
  // facebookId?: string;
  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, maxLength: 256, default: '' })
  tokenOneSignal: string;
}
export class GoogleLogin {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  accessToken: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  googleId?: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  name: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  profilePhoto: string;

  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, maxLength: 256, default: '' })
  tokenOneSignal: string;
}
export class AppleLogin {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    default: null,
    example: '000000.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.0000'
  })
  user: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null, example: 'JWT Token' })
  identityToken: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null, example: 'email@icloud.com' })
  email?: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null, example: 'Fulano' })
  givenName?: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null, example: 'da Silva' })
  familyName?: string;

  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, maxLength: 256, default: '' })
  tokenOneSignal: string;
}
