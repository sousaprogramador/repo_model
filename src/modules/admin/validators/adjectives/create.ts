import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

class CreateAdjective {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true })
  text: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', required: true })
  minRating: number;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', required: true })
  maxRating: number;
}

export { CreateAdjective };
