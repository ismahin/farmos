import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches } from "class-validator";

export class CreateOrganizationDto {
  @ApiProperty({ example: "EXAMPLE" }) @Matches(/^[A-Z][A-Z0-9_-]{1,31}$/) code!: string;
  @ApiProperty({ example: "Example Agro Ltd." }) @IsString() @Length(2, 160) displayName!: string;
  @ApiProperty({ example: "Example Agro Ltd." }) @IsString() @Length(2, 200) legalName!: string;
  @ApiProperty({ example: "USD" }) @Matches(/^[A-Z]{3}$/) baseCurrency!: string;
}

export class UpdateOrganizationDto {
  @ApiProperty() @IsString() @Length(2, 160) displayName!: string;
}

export class OrganizationResponseDto {
  @ApiProperty({ format: "uuid" }) id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty() status!: string;
  @ApiProperty() version!: number;
  @ApiProperty({ format: "date-time" }) createdAt!: string;
  @ApiProperty({ format: "date-time" }) updatedAt!: string;
}
