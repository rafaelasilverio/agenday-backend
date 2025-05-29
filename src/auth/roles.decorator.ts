import { SetMetadata } from '@nestjs/common';

// Define os roles aceitos por uma rota
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
