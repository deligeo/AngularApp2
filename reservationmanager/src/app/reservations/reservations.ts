import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],  
})
export class Reservations implements OnInit {
  title = 'ReservationManager';
  public reservations: Reservation[] = [];
  reservation: Reservation = { area: '', start_time: '', end_time: '', booked: '', imageName: '' };

  error = '';
  success = '';

  selectedFile: File | null = null;

  constructor(private reservationService: ReservationService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges(); // <--- force UI update
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm)
    {
        this.resetAlerts();

        this.uploadFile();

        this.reservationService.add(this.reservation).subscribe(
          (res: Reservation) => {
            this.reservations.push(res);
            this.cdr.detectChanges(); // <--- force UI update
            this.success = 'Successfully created';

            f.reset();
          },
          (err) => (this.error = err.message)
        );
    }

  editReservation(area: any, start_time:any, end_time:any, booked:any, id: any)
    {
        this.resetAlerts();

        // console.log(area);
        console.log(area.value);
        this.reservationService.edit({area: area.value, start_time: start_time.value, end_time: end_time.value, booked: booked.value, id: +id}).subscribe(
                (res) => {
                    this.cdr.detectChanges(); // <--- force UI update
                    this.success = 'Successfully edited';
                },
                (err) => (
                    this.error = err.message
                )
        );
    }

    deleteReservation(id: number)
    {
        this.resetAlerts();

        this.reservationService.delete(id)
            .subscribe(
                (res) => {
                    this.reservations = this.reservations.filter( function (item) {
                        return item['id'] && +item['id'] !== +id;
                    });
                    this.cdr.detectChanges(); // <--- force UI update
                    this.success = "Deleted successfully";
                },
                (err) => (
                    this.error = err.message
                )
            );
    }

    uploadFile(): void 
    {
        if(!this.selectedFile)
        {
            return;
        }

        const formData = new FormData();
        formData.append('image', this.selectedFile);

        this.http.post('http://localhost/angularapp2/reservationapi/upload',  formData).subscribe(
          response => console.log('File uploaded successfully:', response),
          error => console.error('File upload failed', error)
        );
    }

    onFileSelected(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        if(input.files && input.files.length > 0)
        {
            this.selectedFile = input.files[0];
        }
    }


  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}