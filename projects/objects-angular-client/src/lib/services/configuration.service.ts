import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  getRootObjectTypeName(): string {
    return 'root';
  }
  getServer(): string {
    return 'http://127.0.0.1:3000';
  }

  constructor() {}
}
