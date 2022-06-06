import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _registerUrl = '/api/register';
  private _loginUrl = '/api/login';

  constructor(private http: HttpClient) {}

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getProfile(): any {
    return JSON.parse(localStorage.getItem('profile'));
  }
  private _setProfile(profile: any) {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
    }
  }
  private _removeProfile(): void {
    localStorage.removeItem('profile');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }
  private _setToken(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }
  private _remoToken() {
    localStorage.removeItem('token');
  }

  register(email: string, password: string) {
    return this.http.post(this._registerUrl, { email, password }).pipe(
      tap((res: any) => {
        this._setProfile(res.profile);
        this._setToken(res.token);
      })
    );
  }

  // TODO
  login(usernameOrEmail: string, password: string) {
    return this.http.post(this._loginUrl, { usernameOrEmail, password }).pipe(
      tap((res: any) => {
        this._setProfile(res.profile);
        this._setToken(res.token);
      })
    );
  }

  logout() {
    this._removeProfile();
    this._remoToken();
  }
}
