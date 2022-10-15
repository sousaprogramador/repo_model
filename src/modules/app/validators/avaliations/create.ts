import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

class CreateAvaliation {
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber({}, { each: true })
    adjectives: number[];
}

export { CreateAvaliation };
