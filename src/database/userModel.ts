import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const userScheme = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'Вкажіть пароль для користувача'],
    },
    email: {
        type: String,
        required: [true, 'Email є обов\'язковим полем'],
        unique: true,
    },
    token: {
        type: String,
        default: null
    }
});

userScheme.pre('save', async function () {
    if (this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

const User = mongoose.model('User', userScheme);

export default User;