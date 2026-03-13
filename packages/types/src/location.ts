export type LocationRegion = 'us-wa' | 'us-ok'

export interface ILocationCoordinates {
  lat: number
  lng: number
}

export interface ILocation {
  _id: string
  name: string
  region: LocationRegion
  address: string
  coordinates?: ILocationCoordinates
  phone?: string
  email?: string
  hours?: string
  createdAt: string
  updatedAt: string
}

export type ILocationCreate = Omit<ILocation, '_id' | 'createdAt' | 'updatedAt'>
export type ILocationUpdate = Partial<ILocationCreate>
