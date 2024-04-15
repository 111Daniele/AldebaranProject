import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MeteorsService } from './meteors.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  constructor(private http: HttpClient) { }

  router= inject(Router)

  route= inject(ActivatedRoute)

 meteorService= inject(MeteorsService)

 meteors: any

  ngOnInit(): void {
    

  }

  getUser(id: any){
    return this.http.get(environment.HOST + "users/users/" + id)
  }
}
