# stories-backend

This is a REST api for a UI to consume. It includes the following endpoints:

* POST api/auth/register
* POST api/auth/login
* GET /api/stories
* POST /api/stories
* PATCH /api/stories

Each non-`auth` endpoint is validated by the files in `./validation`. `auth` endpoints are validated in their own way within the code.

Each user is either assigned the role `user` or `admin`. Only an admin can create an admin

The code for each endpoint is found in `./routes`.

To run this server locally, you will need a PostgreSQL server running and the following variable in a `.env` file located at the root:

* PORT=3000
* env=dev
* DB_HOST=localhost
* dbPort=5432
* dbUser=yourname
* dbDatabase=yourname
* dbConnectionURL=postgresql://localhost
* TOKEN_SECRET=randomchars

There will, of course, be a little variance depending on your setup.

`./util/conn.js` is set up to automatically set up your database. It should create the tables as soon as you start the server.

To run the unit tests:
* start the server (obviously)
* navigate to the root in a seperate console
* enter the command `jasmine`.
