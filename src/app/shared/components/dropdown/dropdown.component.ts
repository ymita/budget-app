import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  IgxToggleDirective,
  IgxForOfDirective
} from 'igniteui-angular';
import { IgxListItemComponent } from 'igniteui-angular/lib/list/list-item.component';

const DROPDOWN_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true
};

@Component({
  selector: 'app-dropdown',
  providers: [DROPDOWN_CONTROL_ACCESSOR],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() label: string;

  @Input() items: any[];

  @Input() valueKey = 'value';

  @Input() textKey = 'text';

  value = null;

  selectedItem = null;

  get selectedText() {
    if (!this.selectedItem) {
      return '';
    }

    return this.selectedItem[this.textKey] || this.selectedItem;
  }

  @ViewChild('toggleRef') toggle: IgxToggleDirective;

  @ViewChild(IgxForOfDirective) igxFor: IgxForOfDirective<any>;

  private onTouch: Function;
  private onModelChange: Function;

  writeValue(value: any): void {
    this.value = value || null;

    this.selectedItem = this.items.find(
      item =>
        item[this.valueKey]
          ? item[this.valueKey] === this.value
          : item === this.value
    );
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onItemClicked(event) {
    const item = event.item as IgxListItemComponent;
    const index = this.igxFor.state.startIndex + item.index;
    this.selectedItem = this.items[index];
    this.value = this.selectedItem[this.valueKey] || this.selectedItem;

    this.onModelChange(this.value);
    this.onTouch();

    setTimeout(() => this.toggle.close(), 200);
  }
}
