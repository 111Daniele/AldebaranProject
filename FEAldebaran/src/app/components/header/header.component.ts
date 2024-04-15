import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/services/auth.service';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  

  constructor(public states: StatesService, private auth: AuthService, public router: Router){

  }
  ngOnInit(): void {
    this.auth.user.subscribe(user=> this.user= user)
    this.states.adminSection=true
  }

  user: User= null

  isLogged: boolean= this.user ? true : false

  signup(){
    this.states.signup= true;
    this.states.login=false;
    console.log(this.states.signup)
    
  }

  approve(){
    
    this.router.navigate(["/admin"])
  }

  login(){
    this.states.signup= true;
    this.states.login= true;
    console.log(this.states.signup)
    
  }


  logout(){
    this.auth.logout()
  }


  addMeteor(){
    console.log("attivo form add")
    let allowed= ["approved", "admin"]
    // if (!this.user || this.user.role!= "approved") return window.alert("YOU ARE NOT APPROVED! WAIT FOR APPROVAL!")
    if (!this.user || !allowed.includes(this.user.role)) {
      this.states.alertWindow= true
      return
    }
    this.states.formAddMeteor= true
    console.log("form: ", this.states.formAddMeteor)
  }

}
