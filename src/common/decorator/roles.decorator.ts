import { SetMetadata } from '@nestjs/common';

export const ROLES = 'Roles'

export const Roles = (value:string[])=>SetMetadata(ROLES,value)
