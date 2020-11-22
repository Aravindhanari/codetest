import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from './../../../services/auth/auth.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

tasks: any;
projects:any;
userslist: any;
taskadditionform: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.taskadditionform = this.fb.group({
      'task': ['', [Validators.required]],
      'project': ['', [Validators.required]],
      'assignedTo': ['', [Validators.required]],
      'status': ['Assigned', [Validators.required]],
      
      
    });
   }

  ngOnInit(): void {

    this.gettasks();
    this.getproject();
    this.getusers();
  }


  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";


  getproject(){
    this.authService.getproject().subscribe(
      data => {
        this.projects  = data['records']

      },
      error => {
        console.log('error got ')

      }
    );
    
  }

  getusers(){
    this.authService.getusers().subscribe(
      data => {

        this.userslist  = data['records']

      },
      error => {
        console.log('error got ')

      }
    );
    
  }


  gettasks(){
    this.authService.gettasks().subscribe(
      data => {
        this.tasks  = data['records']
      },
      error => {
        console.log('error got ')

      }
    );
    
  }



  public addtask()
  {

      let project = this.projects.find(e => e.id  === Number(this.taskadditionform.value['project']) ); // { name: 'apples', quantity: 2 } 

      
      this.authService.addtask(this.taskadditionform.value).subscribe(
        data => {
          data['project'] = {'name':project['name']};
          this.tasks.push(data);    
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
