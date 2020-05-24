import mongoose, { Schema, Document, HookNextFunction } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  password: string;
  fname: string;
  sname: string;
  email: string;
  checkPassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    sname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (this: IUser, next: HookNextFunction) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

const checkPassword = function (this: IUser, password: string): Promise<boolean> {
  const passwordHash: string = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

userSchema.methods.checkPassword = checkPassword;

export const User = mongoose.model<IUser>('user', userSchema);
