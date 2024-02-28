import { Schema, model, models } from 'mongoose'

const ForgotPassSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required!'],
    },
    token: {
      type: String,
      required: [true, 'Token is required!'],
    },
  },
  {
    timestamps: true,
  }
)

ForgotPassSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const ForgotPass = models.ForgotPass || model('ForgotPass', ForgotPassSchema)

export default ForgotPass
