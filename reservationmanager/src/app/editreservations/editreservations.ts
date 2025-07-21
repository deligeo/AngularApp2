import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-editreservations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './editreservations.html',
  styleUrls: ['./editreservations.css'],
  providers: [ReservationService]
})
export class Editreservations implements OnInit {
  id!: number;
  reservation: Reservation = {
    area: '', start_time: '', end_time: '',
    booked: '', imageName: ''
  };

  success = '';
  error = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalImageName: string = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.reservationService.get(this.id).subscribe({
      next: (data: Reservation) => {
        this.reservation = data;
        this.originalImageName = data.imageName || '';
        this.previewUrl = `http://localhost/angularapp2/reservationapi/uploads/${this.originalImageName}`;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error loading Reservation.'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editReservation(form: NgForm) {
    if (form.invalid) return;

    const formData = new FormData();
    formData.append('id', this.id.toString());
    formData.append('area', this.reservation.area || '');
    formData.append('start_time', this.reservation.start_time || '');
    formData.append('end_time', this.reservation.end_time || '');
    formData.append('booked', this.reservation.booked || '');
    formData.append('imageName', this.reservation.imageName || '');
    // formData.append('oldImageName', this.originalImageName);
    formData.append('originalImageName', this.originalImageName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post('http://localhost/angularapp2/reservationapi/edit.php', formData).subscribe({
      next: () => {
        this.success = 'Reservation updated successfully';
        this.router.navigate(['/reservations']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          const body = err.error;
          this.error = body?.error || 'Duplicate entry detected';
          this.cdr.detectChanges();
        } else {
          this.error = 'Update failed';
          this.cdr.detectChanges();
        }
      }
    });
  }

  cancel() {
  this.selectedFile = null;
  this.reservation.imageName = this.originalImageName;
  this.previewUrl = `http://localhost/angularapp2/reservationapi/uploads/${this.originalImageName}`;

  // Reset the form or navigate away:
  this.router.navigate(['/reservations']);
}

}