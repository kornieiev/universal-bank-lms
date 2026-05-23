/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class refreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
