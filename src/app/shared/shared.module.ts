import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon/icon.component';
import { CustomPaginationComponent } from './custom-pagination/custom-pagination.component';
import { ToasterComponent } from './toaster/toaster.component';

@NgModule({
  declarations: [IconComponent, CustomPaginationComponent, ToasterComponent],
  imports: [CommonModule, FormsModule],
  exports: [IconComponent, CustomPaginationComponent, ToasterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
