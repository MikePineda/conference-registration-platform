import type Conference from '#models/conference'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ConferenceTransformer extends BaseTransformer<Conference> {
  toObject() {
    return this.pick(this.resource, [
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
    ])
  }
}
