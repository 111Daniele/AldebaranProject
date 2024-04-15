import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  @Output() isSignup: EventEmitter<boolean>= new EventEmitter<boolean>()

  signup(){
    this.isSignup.emit(true)
  }

}
