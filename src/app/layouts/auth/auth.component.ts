import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-auth',
 
  imports: [
    CommonModule, 
    RouterOutlet, 
    NzLayoutModule, 
    NzCardModule, 
    NzTypographyModule
  ],
  styleUrl: './auth.component.scss',
  templateUrl: './auth.component.html', 
  })
export class AuthComponent { }
