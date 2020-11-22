import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UserType } from 'src/app/_modals/user';
import { AuthService } from './../../../services/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";


  userslist: any;
  useradditionform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { 
    this.useradditionform = this.fb.group({
      'first_name': ['', [Validators.required]],
      'last_name': ['', [Validators.required]],
      'username': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      'user_type': ['', [Validators.required]],
     
      
    });

  }

  ngOnInit(): void {
    this.getusers();
  }


  getusers(){
    this.authService.getusers().subscribe(
      data => {
        console.log('projects', data['records'])
        this.userslist  = data['records']
        console.log('user list ', data['records'])
        // this.authService.redirectToHome();
      },
      error => {
        console.log('error got ')

      }
    );
    
  }


  adduser()
  {



    this.authService.adduser(this.useradditionform.value).subscribe(
      data => {
        // data['project'] = {'name':project['name']};
        let User_type : any;
        if (data['user_type'] == 'A')
        {
          User_type = 'Admin';
        }
        else if (data['user_type'] == 'M')
        {
          User_type = 'Manager'

        }
        else{
          User_type = 'Developer'
        }

        let pushdata : any = {
          username: data['username'],
          user_type : User_type,
          email : data['email']
        }
        this.userslist.push(pushdata);    
      },
      error => {
        console.log('error got ')
      }
    );

  }


}
