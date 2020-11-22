import { Injectable, Inject, forwardRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../classes';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class GlobalsService {

  private userSource = new BehaviorSubject<User>(null);
  user$ = this.userSource.asObservable();
  private userPermissionsSource = new BehaviorSubject<Array<string>>([]);
  userPermissions$ = this.userPermissionsSource.asObservable();

  
  
  

  constructor(
    @Inject(forwardRef(() => JwtHelperService)) private jwtHelper,

  ) {

   }


   
   setUser(user: User) {
    if (user instanceof Object) {
        this.userPermissionsSource.next(user.permissions);
        delete user.permissions;
        this.userSource.next(user);
    }
    else {
        this.userSource.next(null);
        this.userPermissionsSource.next([]);

    }
}



  
}
