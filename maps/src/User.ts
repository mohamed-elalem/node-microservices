import faker from 'faker';
import { Mappable } from './Mappable';

export class User implements Mappable {
  name: string;
  location: {
    lng: number,
    lat: number,
  };

  constructor() {
    this.name = faker.name.firstName();
    this.location = {
      lng: parseFloat(faker.address.longitude()),
      lat: parseFloat(faker.address.latitude()),
    };
  }

  markerContent(): string {
    return this.name;
  }
}
