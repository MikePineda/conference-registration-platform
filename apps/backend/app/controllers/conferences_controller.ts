import Conference from '#models/conference'
import ConferenceTransformer from '#transformers/conference_transformer'
import { createConferenceValidator, updateConferenceValidator } from '#validators/conference'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConferencesController {
  async store({ request, auth, serialize }: HttpContext) {
    const payload = await request.validateUsing(createConferenceValidator)
    const user = auth.getUserOrFail()

    const conference = await user.related('conferences').create(payload)

    return serialize(ConferenceTransformer.transform(conference))
  }

  async show({ params, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const conference = await Conference.query()
      .where('id', params['id'])
      .where('organizerId', user.id)
      .firstOrFail()

    return serialize(ConferenceTransformer.transform(conference))
  }

  async update({ params, request, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const conference = await Conference.query()
      .where('id', params['id'])
      .where('organizerId', user.id)
      .firstOrFail()

    const payload = await request.validateUsing(updateConferenceValidator)

    conference.merge(payload)
    await conference.save()

    return serialize(ConferenceTransformer.transform(conference))
  }
}
