import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throttleTime, throwError } from 'rxjs';
import { User } from '../Models/User';
import { Router } from '@angular/router';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User>= new BehaviorSubject<User>(null)

  tokenExpireTimer: any

  router: Router= new Router()

  constructor(private http: HttpClient) { }

  signup(user){
    return this.http.post(environment.HOST + "users/signup", user).pipe(catchError(this.errorHandler), tap((res)=> {
      this.createUser(res)
      }
      ))
     
  }



  login(user){
    return this.http.post(environment.HOST + "users/login", user).pipe(catchError(this.errorHandler), tap((res)=> {
      console.log("inizio login auth")
      this.createUser(res)
      }
      ))
     

  }




  autoLogin(){
    const user= JSON.parse(localStorage.getItem("user"))
    console.log("utente cookie", user)
    
    if (!user) {console.log("utente non presente"); return}

    console.log("metodo", user.token)
    const modelUser= new User(user.id, user.name, user.token, user.expiresDate, user.role)
    console.log("model", modelUser)
    // if (!user.token) {
    //   console.log("scadutooo");
    //   return
    // }

    // if (modelUser.expiresDate> new Date()){
    //     console.log("scadutooo");
    //     return
    //   }
    this.user.next(modelUser)
    let dateus: Date= new Date(modelUser.expiresDate)
   

    if (dateus < new Date()){
      console.log("scaduto2 perchè ", dateus, "è minore di " , new Date());
      return
    }

    this.autoLogout(dateus.getTime() - new Date().getTime())
    // this.autoLogout(user.expiresDate.getTime() - new Date().getTime())
  }



  logout(){
    console.log("effettuato logout")
    this.user.next(null)
    localStorage.removeItem("user")
    if (this.tokenExpireTimer){  //IT'S IMPLIED THAT IT IS TRUE, BEVAUSE WHEN USER LOGGIN, IT A TOKENEXPIRE WILL BE CREATED
        clearTimeout(this.tokenExpireTimer)
    }
    this.tokenExpireTimer= null
    this.router.navigate([''])
  }


  autoLogout(expiresTS: number){
    // setTimeout(()=> this.logout(), expiresTS)
    // this.tokenExpireTimer= setTimeout(()=> this.logout(), 999999999)
    this.tokenExpireTimer= setTimeout(()=> this.logout(), expiresTS)
  }

//Res: {status: "success", user: {}, token:1234}
  private createUser(res){ 
    console.log("inizio creazione utente", res)
    let expiresTS = new Date().getTime() + +res.expires*1000
    let expiresDate= new Date(expiresTS)
    console.log("DATE: ", expiresTS, " - ", expiresDate)
    const user= new User(res.data.user.name, res.data.user.email, res.token, expiresDate, res.data.user.role)
    localStorage.setItem("user", JSON.stringify(user))
    console.log("utente creato e passato ", user)
    this.autoLogout(+res.expires*1000)
    this.user.next(user)
  }




private errorHandler(err){
  let message="Unkown Error!"
  if (!err.error || !err.error.error ) return throwError(()=> message)
  switch(err.error.error.message){
      case "MAIL_EXISTS":
        message= "The email already exist!";
        break;
  }
  return throwError(()=> message)
}











}
