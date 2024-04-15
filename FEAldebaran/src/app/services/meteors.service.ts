import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meteor } from '../Models/Meteor';
import { Observable, map } from 'rxjs';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MeteorsService {

  constructor(private http: HttpClient) { }

  meteors: Meteor[]

  getMeteors(): Observable<any>{
    // return this.http.get("http://localhost:8000/CNEOS_API").pipe(
    //   map(
    //     res=> {
    //       let meteors= [];
    //       for (let key in res){
    //         if (res.hasOwnProperty(key)){
    //             meteors.push({...res[key], id: key })
    //         }
    //       }
    //     }
    //   )
    // )

  
    return this.http.get( environment.HOST + "CNEOS_API").pipe(map(res=> {
      let meteors= []; 
      console.log("res", res["data"].slice(8000, 8050))
    for (let met of res["data"]){ 
      // if (met.range === undefined){ console.log("attenz", met)}
      // console.log("m ", met.author)
      let author= met.author ? met.author : "CNEOS"

      if (author=="Edo") console.log("TROVATO EDO£", met)
      meteors.push(new Meteor(met.id, met.des, met.range, met.ps_max, met.fullname, met.v_inf, met.h, met.last_obs_jd, met.ip, met.ps_cum, met.last_obs, met.n_imp,met.diameter,met.ts_max, author))
    }
    return meteors
  } ))


  }
}
