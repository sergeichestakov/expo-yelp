type Location = {
  address1: string,
  city: string,
  state: string,
}

export type Category = {
  alias: string,
  title: string,
}

export type Coordinates = {
  longitude: number,
  latitude: number,
}

export type Business = {
  name: string,
  rating: number,
  review_count: number,
  distance: number,
  photos: string,
  url: string,
  location: Location,
  coordinates: Coordinates,
}