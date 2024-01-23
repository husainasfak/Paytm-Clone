const zod = require('zod')


const signupBody = zod.object({
     username: zod.string().email(),
     firstname: zod.string(),
     lastname: zod.string(),
     password: zod.string()
})


const signinBody = zod.object({
     username: zod.string().email(),
     password: zod.string()
})


const updateUserBody = zod.object({
     password: zod.string().optional(),
     firstName: zod.string().optional(),
     lastName: zod.string().optional(),
})


module.exports = {
     signupBody,
     signinBody,
     updateUserBody
}