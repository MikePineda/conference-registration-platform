import Conference from '#models/conference'
import ConferenceTransformer from '#transformers/conference_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class PublicConferencesController {
  async show({ params, serialize }: HttpContext) {
    const conference = await Conference.query()
      .where('publicId', params['publicId'])
      .withCount('reservations')
      .firstOrFail()

    return serialize(ConferenceTransformer.transform(conference))
  }
}
