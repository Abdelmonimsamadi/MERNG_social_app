import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
    password: { type: String, required: true }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)