const db = require('../database/dbConfig');

module.exports = {
    find,
    findById, // findById(id)
    findByUsername, // findByUsername(username)
    addUser, // registerUser(user)
    removeUser,
    removeAllUsers
}

function find() {
    return db('users').select('id', 'username');
}

function findById(id) {
    return db('users')
        .select('id', 'username')
        .where({id})
        .first();
}

function findByUsername(username) {
    return db('users')
        .select( 'id', 'username', 'password' )
        .where(username)
}

function addUser(user) {
    return db('users').insert(user)
        .then( ids => {
            return findById(ids[0])
        })
}
function removeUser(id) {
    return db('users').where({id}).del()
}

function removeAllUsers() {
    return db('users').del();
}