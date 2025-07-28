import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
    userName: string = '';
    constructor(private router: RouterModule, public authService: Auth) {}
    // {
    //     // No code is required
    // }

    ngOnInit(): void {
      this.userName = localStorage.getItem('username') || 'Guest';
    }

}
