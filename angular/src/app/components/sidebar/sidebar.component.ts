import { Component, OnInit } from "@angular/core";
import { GlobalsService } from '../../services/gloabal.service';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  collapseShow = "hidden";
  user: any;
  user_type : any;

  constructor(private gs: GlobalsService) {}

  ngOnInit() {

    this.gs.user$.subscribe(user => {
      this.user = user;
      if (this.user != null) {
        this.user_type = this.user.user_type;
        console.log('user type at side bar', this.user.user_type)
        
        
      }
  });

  }
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
