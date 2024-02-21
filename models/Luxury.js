const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const luxurySchema = mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        type:{
            type: 'string',
            required: true,
            unique: true

        },
        password: {
            type: 'string',
            
            required: true
        },
        avatar: [Object]
    }
)


luxurySchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

luxurySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('Luxury', luxurySchema)
