const thought = require('../models/Thought')
const User = require('../models/User')

module.exports = class ThoughtController {
    static async showThoughts(req, res) {
        res.render('thoughts/home')
    }

    static async dashboard(req, res) {
        res.render('thoughts/dashboard')
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserI: req.session.userid
        }

        try {
            await Thought.create(thought)

            req.flash('message', 'Pensamento criado com sucesso')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            console.log(err)
        }
    }
}