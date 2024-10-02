import { of, switchMap } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {

    const _router: Router = inject(Router);
    const _authService: AuthService = inject(AuthService);

    return _authService.check().pipe(
        switchMap((authenticated: boolean) => {
            if (authenticated) {
                return of(true);
            }

            return of(_router.parseUrl(`login`));
        })
    );
}
