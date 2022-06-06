import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Ignite UI for Angular
import {
  IgxForOfModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxRippleModule,
  IgxToggleModule,
  IgxIconModule
} from 'igniteui-angular';

// App
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,

    // Ignite UI for Angular modules
    IgxForOfModule,
    IgxIconModule,
    IgxInputGroupModule,
    IgxListModule,
    IgxRippleModule,
    IgxToggleModule
  ],
  declarations: [DropdownComponent, LoaderComponent],
  exports: [DropdownComponent, LoaderComponent]
})
export class SharedModule {}
