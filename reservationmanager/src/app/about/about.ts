// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-about',
//   imports: [],
//   templateUrl: './about.html',
//   styleUrl: './about.css'
// })
// export class About {

// }


import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

    // constructor(private router: RouterModule)
    // {
    //     // No code is required
    // }
}
