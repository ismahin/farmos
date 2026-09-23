import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateFarmDto {
  @ApiProperty({ format: "uuid" }) @Matches(/^[0-9a-f-]{36}$/i) organizationId!: string;
  @ApiProperty({ example: "NORTH-01" }) @Matches(/^[A-Z][A-Z0-9_-]{1,31}$/) code!: string;
  @ApiProperty({ example: "North Integrated Farm" }) @IsString() @Length(2, 160) displayName!: string;
  @ApiProperty({ example: "Asia/Dhaka" }) @IsString() @Length(3, 64) timezone!: string;
}

export class UpdateFarmDto {
  @ApiProperty() @IsString() @Length(2, 160) displayName!: string;
  @ApiProperty() @IsString() @Length(3, 64) timezone!: string;
}

export class ListFarmsQuery {
  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 25 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number;
  @ApiPropertyOptional({ format: "uuid" }) @IsOptional() @Matches(/^[0-9a-f-]{36}$/i) cursor?: string;
}

export class FarmResponseDto {
  @ApiProperty({ format: "uuid" }) id!: string;
  @ApiProperty({ format: "uuid" }) organizationId!: string;
  @ApiProperty() code!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty() timezone!: string;
  @ApiProperty() status!: string;
  @ApiProperty() version!: number;
  @ApiProperty({ format: "date-time" }) createdAt!: string;
  @ApiProperty({ format: "date-time" }) updatedAt!: string;
}
