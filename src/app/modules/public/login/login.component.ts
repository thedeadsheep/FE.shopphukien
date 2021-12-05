import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public _formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }
  public loginForm = this._formBuilder.group({
    loginEmail: ['', [Validators.required, Validators.email]],
    loginPassword: ['', [Validators.required]]
  });
  ngOnInit(): void {
  }
  onLogin() {
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.getToken(res['token']);
        console.log(localStorage.getItem('token'));
        console.log(res);
        localStorage.setItem('emailLogin', res['displayName']);
        this.showToastr(true, "Login Successful");
      },
      err => {
        console.log(err);
        this.showToastr(false, err.error.message);
      }
    );

  }
  getToken(token: any) {
    localStorage.setItem('token', token);
  }
  showToastr(success: boolean, message: any) {
    if (success) {
      this.toastr.success(message, "", {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing',
        tapToDismiss: true
      })
    }
    else {
      this.toastr.error(message, "", {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing',
        tapToDismiss: true
      })
    }
  }
}
