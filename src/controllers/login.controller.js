import registroModel from '../models/registro.model.js'

export const authLogin = async (req, res) => { 
    if(!req.user) return res.status(400).send({status: 'error', error: 'Usuario no encontrado'});
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        id: req.user._id,
        rol: req.user.rol
    }
    if (req.user.rol === 'admin'){
        req.session.admin = true
        return res.status(200).send({message:'success', user: req.session.user, rol: 'admin'})
    }else{

        return res.status(200).send({message:'success', user: req.session.user, rol: 'user'})
    }
  
}

export const logFailed =  async (req, res) => {
    console.log('failed Strategy')
    res.send({error: 'Failed Strategy'})
}

export const auth = async (req, res, next) => {
    if (await req.session?.user){
        return next()
    }else{
        return res.status(401).send('error de autenticación')
    }
}

export const login = async (req,res)=>{
    if (await req.session.user){
        if (req.session?.admin){
            const userData = await registroModel.findOne({ email: req.session.user.email})
            const {firstName, lastName} = userData
            return res.render('admin',{firstName, lastName}) 
        }
        const userData = await registroModel.findOne({ email: req.session.user.email})
        const {firstName, lastName} = userData
        res.render('products',{firstName, lastName}) 
    }
}

export const authUser = async (req, res) => {
    if (await req.session.user){
        const userData = await registroModel.findOne({ email: req.session.user.email})
        res.send({user: userData})
    }
} 

export const logout =  (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.status(401).send({message:'ERROR'})
        }else{
            res.status(200).send({message:'LogoutOK'})
        }
    })
}