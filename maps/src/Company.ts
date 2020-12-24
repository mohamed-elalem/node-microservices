import faker from 'faker';
import { Mappable } from './Mappable';

export class Company implements Mappable {
  companyName: string;
  catchPhrase: string;
  location: {
    lng: number,
    lat: number,
  };

  constructor() {
    this.companyName = faker.company.companyName();
    this.catchPhrase = faker.company.catchPhrase();
    this.location = {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude())
    };
  }

  markerContent(): string {
    return `
      <h4>${this.companyName}</h4>
      <p>${this.catchPhrase}</p>
    `;
  }
}