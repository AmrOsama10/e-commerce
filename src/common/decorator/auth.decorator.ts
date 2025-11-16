import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard, Roles, RolesGuard } from '@common/index';

export const Auth = (roles:string[])=>{
    return applyDecorators(
        Roles(['Admin']),
        UseGuards(AuthGuard,RolesGuard)
    )
}