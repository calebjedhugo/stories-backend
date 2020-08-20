const {Pool, Client} = require('pg')
const connectionString = `postgressql://postgres:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`

const conn = new Client({
  connectionString: connectionString
})

conn.connect()

const createTables = `
  CREATE TABLE users (
    id serial PRIMARY KEY,
    firstName VARCHAR (50) NOT NULL,
    lastName VARCHAR (50) NOT NULL,
    role VARCHAR (10) NOT NULL,
    email VARCHAR (100) NOT NULL,
    password VARCHAR (1000) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE stories (
    id serial PRIMARY KEY,
    created_by INTEGER NOT NULL,
    summary VARCHAR (100000) NOT NULL,
    description VARCHAR (10000) NOT NULL,
    type VARCHAR (100) NOT NULL,
    complexity VARCHAR (100) NOT NULL,
    etc TIMESTAMP NOT NULL,
    cost INTEGER NOT NULL,
    status VARCHAR (10) DEFAULT 'new',
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

const testQuery = `SELECT COUNT(id) FROM USERS`
// const testQuery = `DROP TABLE users, stories`
let tested = false

//Is the database set up?
conn.query(testQuery, (err, data) => {
  if(err && err.message === `relation "users" does not exist`){
    //Let's go ahead and set it up.
    conn.query(createTables, (err, data) => {
      if(err) return console.error(err.message)
      console.log(`The tables 'users' and 'stories' have been created`)
      tested = true
    })
  } else if(err){
    return console.error(err.message)
  }
  else {
    tested = true
  }

  if(tested){
    console.log(`Connected to database, '${process.env.DB_HOST}'`)
  } else {
    console.log(`Failed to test connection to database, '${process.env.DB_HOST}'`)
  }
})

module.exports = conn
