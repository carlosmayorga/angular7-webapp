import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  title = 'Angular7App';

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
