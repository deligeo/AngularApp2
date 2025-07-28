import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService]
})
export class Addreservations {
  reservation: Reservation = {area:'', start_time:'', end_time:'', booked:'', imageName:''};
  selectedFile: File | null = null;
  error = '';
  success = '';
  userName: string = '';

  constructor(private reservationService: ReservationService, private http: HttpClient, public authService: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.userName = localStorage.getItem('username') || 'Guest';
    }

    addReservation(f: NgForm) {
      this.resetAlerts();

      if (!this.reservation.imageName) {
        this.reservation.imageName = 'placeholder_100.jpg';
      }

      this.reservationService.add(this.reservation).subscribe(
        (res: Reservation) => {
          this.success = 'Successfully created';

          // Only upload file AFTER successful reservation creation
          if (this.selectedFile && this.reservation.imageName !== 'placeholder_100.jpg') {
            this.uploadFile();
          }

          f.reset();
          this.router.navigate(['/reservations']);
        },
        (err) => {
          this.error = err.error?.message || err.message || 'Error occurred';
          this.cdr.detectChanges();
        }
      );
    }


  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/angularapp2/reservationapi/upload', formData).subscribe(
      response => console.log('File uploaded successfully:', response),
      error => console.error('File upload failed:', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;      
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}