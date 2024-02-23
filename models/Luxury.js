const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const luxurySchema = mongoose.Schema(
    {
        name: {
            type: 'String',
            required: true
        },
        email: {
            type: 'String',
            required: true,
            unique: true
        },
        type:{
            type: 'String',
            required: true,
           

        },
        password: {
            type: 'String',
            
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
