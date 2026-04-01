import { Location } from '../models/Location.model'
import type { ILocationCreate, ILocationUpdate, LocationRegion } from '@falcanna/types'

export class LocationService {
  async getAll(region?: LocationRegion) {
    const filter = region ? { region } : {}
    return Location.find(filter).lean()
  }

  async getById(id: string) {
    const location = await Location.findById(id).lean()
    if (!location) throw Object.assign(new Error('Location not found'), { statusCode: 404 })
    return location
  }

  async create(data: ILocationCreate) {
    return Location.create(data)
  }

  async update(id: string, data: ILocationUpdate) {
    const location = await Location.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!location) throw Object.assign(new Error('Location not found'), { statusCode: 404 })
    return location
  }

  async delete(id: string) {
    const location = await Location.findByIdAndDelete(id)
    if (!location) throw Object.assign(new Error('Location not found'), { statusCode: 404 })
  }

  async bulkDelete(ids: string[]) {
    await Location.deleteMany({ _id: { $in: ids } })
  }
}

export const locationService = new LocationService()
