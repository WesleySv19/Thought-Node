const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        // Primeiro vamos checar se o usuário existe
        const user = await User.findOne({ where: { email: email }})

        if(!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }
        // Segunda, vamos verificar se a senha combina com a seneha cadastrada no banco

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')

            return
        }

         // Inicializando a sessão
         req.session.userid = user.id
         req.flash('message', 'Autenticação realizada com sucesso!')

         req.session.save(() => {
             res.redirect('/')
         })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const {
            name,
            email,
            password,
            confirmpassword
        } = req.body

        if(password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // Checar se o usuário existe no banco
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if(checkIfUserExists) {
            req.flash('message', 'O E-mail já está em uso!')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            // Inicializando a sessão
            req.session.userid = createdUser.id
            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })

        } catch (err) {
            console.log(err)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}
