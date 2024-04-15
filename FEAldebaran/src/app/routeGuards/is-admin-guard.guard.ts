import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { map, take } from "rxjs";

export const canActivate2= (router: ActivatedRouteSnapshot, state: RouterStateSnapshot)=>{
    
    const authService= inject(AuthService)
    return authService.user.pipe(take(1), map(u=> u.role=="admin"? true: false))
}