import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SiftingResult } from '../models/sifting-result.model';

@Injectable({
  providedIn: 'root'
})
export class SiftingService {

  constructor(private apiService: ApiService) { }

  getSiftingResults(jobPostId: number): Observable<any> {
    return this.apiService.get<any>(`sifting/${jobPostId}`);
  }
}