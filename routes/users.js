const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("User List")
})

router.get("/new", (req, res) => {
    res.render("users/new")
})

router.post('/', (req, res) => {
    const isValid = true
    if (isValid) {
        users.push({ firstName: req.body.firstName })
        res.redirect('/users/${users.length - 1}')
    } else {
        console.log("Error");
        res.redirect('/users/new', { firstName: req.body.firstName })
    }
    res.send("Create User")
})

router.get('/:id', (req, res) => {
    console.log(req.user);
    res.send('Get user with ID ${req.params.id}')
})

router.put('/:id', (req, res) => {
    res.send('Update user with ID ${req.params.id}')
})

router.delete('/:id', (req, res) => {
    res.send('Delete user with ID ${req.params.id}')
})

const users = [{ name: "Kyle"}, { name: "Sally"}]
router.param("id", (req,res, next, id) => {
    req.user = users[id]
    next()
})

module.exports = router