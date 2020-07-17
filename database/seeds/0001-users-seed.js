exports.seed = async function(knex) {
    await knex('users').truncate()
    await knex('users').insert([
        {Username: 'Test User',
         Password:  'TestPassword'
        }
    ])
}