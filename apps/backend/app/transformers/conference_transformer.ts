import type Conference from '#models/conference'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ConferenceTransformer extends BaseTransformer<Conference> {
  toObject() {
    return {
      reservationsCount: Number(this.resource.$extras['reservations_count'] ?? 0),
      ...this.pick(this.resource, [
        'id',
        'name',
        'description',
        'imageUrl',
        'location',
        'capacity',
        'startDate',
        'endDate',
        'publicId',
        'createdAt',
        'updatedAt',
      ]),
    }
  }
}
