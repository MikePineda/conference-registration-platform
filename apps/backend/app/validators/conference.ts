import vine from '@vinejs/vine'

const conferenceFields = {
  name: vine.string().trim().minLength(3).maxLength(200),
  description: vine.string().trim().nullable().optional(),
  imageUrl: vine.string().trim().url().maxLength(1000).nullable().optional(),
  location: vine.string().trim().maxLength(200).nullable().optional(),
  capacity: vine.number().withoutDecimals().min(1),
  startDate: vine.date({ formats: { utc: true } }),
  endDate: vine
    .date({ formats: { utc: true } })
    .afterOrSameAs('startDate')
    .nullable()
    .optional(),
}

/**
 * Validator to use when an organizer creates a conference
 */
export const createConferenceValidator = vine.create(conferenceFields)

/**
 * Validator to use when an organizer updates a conference
 */
export const updateConferenceValidator = vine.create(conferenceFields)
