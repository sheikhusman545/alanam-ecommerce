import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UserService {

    private _userData = null;

    set user$(data: any) {
        this._userData = data;
    }

    get user() {
        return this._userData;
    }
}
