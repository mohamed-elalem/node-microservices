export interface Mappable {
  location: {
    lng: number,
    lat: number,
  };

  markerContent(): string;
}