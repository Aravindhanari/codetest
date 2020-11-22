import { Component, OnInit, Input } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from './../../../services/auth/auth.service';


@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
})
export class TablesComponent implements OnInit {

  projectadditionform : FormGroup;
  projects: any;

  constructor( private fb: FormBuilder,
    private authService: AuthService) {

          
    this.projectadditionform = this.fb.group({
      'name': ['', [Validators.required]],
      
    });
  }

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";


  ngOnInit(): void {
    this.getproject();
  }

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



  public project()
  {

      this.authService.addproject(this.projectadditionform.value).subscribe(
        data => {

          this.projects.push(data);

        },
        error => {
          console.log('error got ')
        }
      );

  }


}
