import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth/auth.service';
declare var jQuery: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  process: string;
  loginError: string;


  constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        ) {}



  ngOnInit(): void {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      loginUsername: ['', [Validators.required]],
      loginPassword: ['', [Validators.required]]
    });
  }

  
  handleError(error: any) {
    console.log('handle erro', error)
    if (new RegExp('Unable to login').test(error)) {
      this.loginError = 'Invalid credentials';
    }
    else if (new RegExp("Bad Request").test(error)) {
      console.log('comw to basd one')
      this.loginError = 'Invalid credentials';
    }
    else{
      console.log('comw to other one')
      this.loginError = error;
    }
  }

  login() {
    console.log(this.loginForm.value);
    this.process = 'checking';
    let formValue = this.loginForm.value;
    this.authService.login(formValue.loginUsername, formValue.loginPassword).subscribe(
      data => {
        console.log('data at login',data['user']['user_type'])
        
        this.loginError = null;
        this.authService.redirectToHome();
      },
      error => {
        this.process = null;
        this.handleError(error);
      }
    );
  }





   

}
