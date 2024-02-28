import { Schema, model, models } from 'mongoose'

const EventSchema = new Schema({
  title: {
    type: String,
    minLength: [3, 'Исправьте "{VALUE}" (минимум три буквы)'],
    required: [true, 'Введите место'],
  },
  name1: {
    type: String,
    minLength: [3, 'Исправьте "{VALUE}" (минимум три буквы)'],
    required: [true, 'Введите имя первого возвещателя'],
  },
  name2: {
    type: String,
    minLength: [3, 'Исправьте "{VALUE}" (минимум три буквы)'],
    required: [true, 'Введите имя второго возвещателя'],
  },
  start: Date,
  end: Date,
  resourceId: Number,
})

EventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Event = models.Event || model('Event', EventSchema)

export default Event
