import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './../../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { GlobalsService } from 'src/app/services/gloabal.service';
import { computeStyles } from '@popperjs/core';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.css']
})
export class DeveloperComponent implements OnInit {


  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

    tasks : any;
    userData : any;


  constructor(
    private fb: FormBuilder,
    private gs : GlobalsService,
    private authService: AuthService
  ) { 
    this.gs.user$.subscribe(data=> this.userData = data);
    console.log('user date ')
    console.log(this.userData)
    this.gettasks();
  }



  ngOnInit(): void {
    
  }


  gettasks(){

    this.authService.gettasks_developer().subscribe(
      data => {
        this.tasks  = data['records']

      },
      error => {
        console.log('error got ')

      }
    );
    
  }


  onSelect(taskdeatil, action){

    this.authService.edittaskstatus(taskdeatil['id'], action).subscribe(
      data => {


          let index = this.tasks.indexOf(taskdeatil);
          if (index > -1) {
            taskdeatil['status'] = action;
            this.tasks.splice(index, 1, taskdeatil);
         
          }

      },
      error => {
        console.log('error got ')
      }
    );



  }

}
