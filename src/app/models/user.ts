import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists!'],
      required: [true, 'Email is required!'],
    },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      minLength: 7,
    },
    name: {
      type: String,
      unique: [true, 'Name already exists!'],
      required: [true, 'Name is required!'],
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      default: 'credentials',
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const User = models.User || model('User', UserSchema)

export default User
