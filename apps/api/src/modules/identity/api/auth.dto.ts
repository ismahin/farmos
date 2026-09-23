import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Example Agro Ltd." }) @IsString() @Length(2, 120) displayName!: string;
  @ApiProperty({ example: "owner@example.com" }) @IsEmail() email!: string;
  @ApiProperty({ minLength: 12 }) @IsString() @MinLength(12) password!: string;
}

export class LoginDto {
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @MinLength(1) password!: string;
}

export class CreateUserDto {
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @Length(2, 120) displayName!: string;
  @ApiProperty({ minLength: 12 }) @IsString() @MinLength(12) temporaryPassword!: string;
}

export class AssignRoleDto {
  @ApiProperty({ format: "uuid" }) @Matches(/^[0-9a-f-]{36}$/i) roleId!: string;
}

export class AssignFarmDto {
  @ApiProperty({ format: "uuid" }) @Matches(/^[0-9a-f-]{36}$/i) farmId!: string;
}

export class SessionTokenDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty({ format: "date-time" }) expiresAt!: string;
}
export class BootstrapResultDto extends SessionTokenDto {
  @ApiProperty({ format: "uuid" }) tenantId!: string;
  @ApiProperty({ format: "uuid" }) userId!: string;
}
export class MeUserDto {
  @ApiProperty({ format: "uuid" }) id!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty({ format: "email" }) email!: string;
}
export class MeTenantDto {
  @ApiProperty({ format: "uuid" }) id!: string;
  @ApiProperty() displayName!: string;
}
export class AccessibleFarmDto {
  @ApiProperty({ format: "uuid" }) id!: string;
  @ApiProperty({ format: "uuid" }) organizationId!: string;
  @ApiProperty() code!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty() timezone!: string;
  @ApiProperty() status!: string;
}
export class FarmScopeDto {
  @ApiProperty() allFarms!: boolean;
  @ApiProperty({ type: [AccessibleFarmDto] }) accessibleFarms!: AccessibleFarmDto[];
  @ApiProperty() truncated!: boolean;
}
export class MeDto {
  @ApiProperty({ type: MeUserDto }) user!: MeUserDto;
  @ApiProperty({ type: MeTenantDto }) tenant!: MeTenantDto;
  @ApiProperty({ type: [String] }) permissions!: string[];
  @ApiProperty({ type: FarmScopeDto }) farmScope!: FarmScopeDto;
}

export class BrowserSessionDto {
  @ApiProperty() authenticated!: boolean;
  @ApiProperty({ format: "date-time" }) expiresAt!: string;
}
export class BrowserBootstrapDto extends BrowserSessionDto {
  @ApiProperty({ format: "uuid" }) tenantId!: string;
  @ApiProperty({ format: "uuid" }) userId!: string;
}
