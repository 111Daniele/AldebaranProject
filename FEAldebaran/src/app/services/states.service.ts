import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  signup: boolean= false

  login: boolean= false

  myMeteorSection: boolean= false

  adminSection: boolean= false

  alertWindow: boolean= false

  amInAdmin: boolean=false

  formAddMeteor: boolean= false
  constructor() { }
}
