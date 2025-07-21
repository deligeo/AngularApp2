import { Routes } from '@angular/router';

import { About } from './about/about';
import { Reservations } from './reservations/reservations';
import { Addreservations } from './addreservations/addreservations';
import { Editreservations } from './editreservations/editreservations';

export const routes: Routes = [
    { path: "reservations", component: Reservations},
    { path: "add", component: Addreservations},
    { path: "edit/:id", component: Editreservations},
    { path: "about", component: About},
    { path: "**", redirectTo: "/reservations"}
];