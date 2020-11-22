import { Injectable, Inject, forwardRef } from '@angular/core';
import { GetApiurl } from '../../parameters';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { User } from './../../_modals/user';
import { GlobalsService } from '../gloabal.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  private userSource = new BehaviorSubject<User>(null);
  user$ = this.userSource.asObservable();
  ngUnSubscribe: Subject<void> = new Subject<void>();
  userPermissions: Array<string> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwthelper: JwtHelperService,
    private gs : GlobalsService,
    @Inject(forwardRef(() => GlobalsService)) private globals,
  ) {


    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}


  public login(username: string, password: string) {
    let url = GetApiurl("api-token-auth/");
    let headers = new HttpHeaders;
    headers.set("Content-Type", "application/json");
    let data = {
        'username': username,
        'password': password,
    };

    return this.http
        .post(url, data, { headers: headers })
        .pipe(map(data => {
          console.log('printing user',data)
            if (data) {
              console.log('before assingn user ', this.user);
              this.user = data['user'];
              console.log('after assigning ', this.user);
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(data));
              

              this.handleResponse(data);
              
          }
         
          return data;
        }  )    )
        

    }



        // Handle response and schedule token refresh
        public handleResponse(response  ) {
          let data = response;
          localStorage.setItem('id_token', data['token']);
          this.gs.setUser(data['user']);
  
          return response;
  
      }

      public refreshToken(token: string) {
        console.log("Token expired refreshing : ", new Date());

        let url = GetApiurl("api-token-refresh/");
        let headers = new Headers;
        headers.append("Content-Type", "application/json");
        let credentials = `{"token":"${token}"}`;

        return this.http
            .post(url, credentials)

    }

    // Handeling error
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    // Logout action
    public logout() {

      this.doLogoutAudit().subscribe(Result => {
          // Clearing local storage
          if (localStorage.getItem("id_token")) {
              localStorage.removeItem("id_token");
          }

          localStorage.clear();

            this.globals.setUser(null);

            this.router.navigate(['/auth/login']);

          

      })

  }

 // Redirecting to respective homepages for the recpective users
 redirectToHome(){

      if (this.user['user_type'] =='A' || this.user['user_type'] =='AA') {

          this.router.navigate(['/dashboard/admin/']);
      
      }
      else if (this.user['user_type'] =='M'){
        this.router.navigate(['/dashboard/manager/']);
      }
      else if (this.user['user_type'] =='D'){
        this.router.navigate(['/dashboard/developer/']);
      }
      else{
        this.router.navigate(['/dashboard/admin/']);
      }
 }


private doLogoutAudit() {
  let url = GetApiurl("api-token-logout/");

  let data = {
      'user_id': this.user.id
  };


  return this.http
      .post(url, JSON.stringify(data))
      .pipe(map(Response => Response))

}



getproject()
{
  let url = GetApiurl("projects/");

  return this.http
      .get(url)
      .pipe(map(Response => Response))
}


getusers()
{
  let url = GetApiurl("users/");


  return this.http
      .get(url)
      .pipe(map(Response => Response))
}


addproject(data)
{

    let url = GetApiurl(`projects/`);

    return this.http
    .post(url, JSON.stringify(data))
    .pipe(map(Response => Response))

}

addtask(data)
{

    let url = GetApiurl(`tasks/`);

    return this.http
    .post(url, JSON.stringify(data))
    .pipe(map(Response => Response))

}

adduser(data)
{

    let url = GetApiurl(`users/`);

    return this.http
    .post(url, JSON.stringify(data))
    .pipe(map(Response => Response))

}

gettasks_developer()
{

  let url = GetApiurl("tasks/usertask/");



  return this.http
      .get(url)
      .pipe(map(Response => Response))
}

gettasks()
{

  let url = GetApiurl("tasks/");



  return this.http
      .get(url)
      .pipe(map(Response => Response))
}

edittaskstatus(task_id, action)
{
  let url = GetApiurl(`tasks/update-status/`);
  let data = {
      'task_id': task_id,
      'status': action
      };


  return this.http
  .post(url, JSON.stringify(data))
  .pipe(map(Response => Response))

}


}



