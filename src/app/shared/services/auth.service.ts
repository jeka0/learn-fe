import { Injectable } from '@angular/core';
import { IUser } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface ILoginPayload {
  username: string;
  password: string;
}

const ACCESS_TOKEN_KEY = 'access_token';

interface ILoginDTO {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profile: IUser | null = null;
  access_token: string;

  constructor(private readonly http: HttpClient) {
    this.access_token = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
  }

  login(payload: ILoginPayload): Observable<ILoginDTO> {
    return this.http
      .post<ILoginDTO>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.access_token = response.access_token;
          localStorage.setItem(ACCESS_TOKEN_KEY, this.access_token);
        }),
      );
  }

  logout() {
    this.access_token = '';
    this.profile = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  isAuth(): boolean {
    return !!this.access_token;
  }

  getProfile(): Observable<IUser | null> {
    return this.http.get<IUser>(`${environment.apiUrl}/profile`);
  }
}
