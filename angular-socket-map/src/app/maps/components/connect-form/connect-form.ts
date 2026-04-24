import { Component, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

interface ConnectFormData {
  name: string;
  color: string;
}

@Component({
  selector: 'connect-form',
  imports: [FormField],
  templateUrl: './connect-form.html',
  styleUrls: ['./connect-form.css'],
})
export class ConnectForm {
  public formSubmitted = output<ConnectFormData>();
  public connectFormModel = signal<ConnectFormData>({
    name: '',
    color: '#000000',
  });

  public connectForm = form(this.connectFormModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
    required(fieldPath.color, { message: 'Color is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    console.log(this.connectFormModel());
    this.formSubmitted.emit(this.connectFormModel());
  }
}
