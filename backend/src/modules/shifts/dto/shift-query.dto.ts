import { IsOptional, IsString } from 'class-validator';

export class ShiftQueryDto {
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    userId?: string;

    @IsOptional()
    fromDate?: string;

    @IsOptional()
    toDate?: string;

    @IsString()
    @IsOptional()
    sortBy?: string;

    @IsString()
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC';
}