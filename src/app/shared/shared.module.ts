import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IconComponent } from './icon/icon.component';

@NgModule({
  declarations: [IconComponent],
  imports: [CommonModule],
  exports: [IconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
