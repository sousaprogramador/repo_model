import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

class UpdateAdjective {
  id: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumberString()
  minRating?: number;

  @IsOptional()
  @IsNumberString()
  maxRating?: number;
}

export { UpdateAdjective };
