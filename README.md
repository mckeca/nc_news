# Cal's Northcoders News API

## Introduction

Welcome to my Northcoders back end project! I've built a basic system for seeding a database containing users, articles, topics and comments, as well as a server that can make requests to said database and deliver that information to you, the user. I've made use of several packages including knex to write my sql queries and express to create my server.


You can find it hosted online at https://cals-nc-news-app.herokuapp.com/api

This page will provide a list of all the available endpoints and their methods, so go ahead and browse through.

## Getting Started

The first thing you'll need to do in order to run my project is clone it from github. You can do this by entering the following into your terminal:

```
git clone https://github.com/mckeca/nc_news.git
```

### Prerequisites

To run this project you will need Node v12.13.1 as well as PSQL version 10.10. You can check you versions by running:

```
node -v
```

and 

```
psql --version
```

respectively.

You will also need to install several packages:

* knex
* express
* pg

As well as these packages for testing purposes:

* mocha
* supertest
* chai
* chai-sorted

To install these packages you can simply run:

```
npm install [package]
```

in your terminal, or simply:

```
npm install
```

will install everything listed in the package.json file.

### Setting the Environment

You're nearly ready to go! Just a couple more things to set up - 

You'll need to create a file in the root directory called "knexfile.js". If you are using Linux, this will need to include your username and password for PSQL, so make sure it's included in the .gitignore! Mac users don't have to worry about it. This file will allow knex to make a connection to the database and needs to be pretty specific, so copy and paste the following:

```javascript
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      // Linux users only:
      username: 'your username',
      password: 'your password'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      // Linux users only:
      username: 'your username',
      password: 'your password'
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

### Seeding

The last thing you have to do is seed the database - this can be done by running the command:

```
"npm run seed" 
```

in your terminal. This will seed both the development database and the test database, so both will be ready for use!

## Testing

Now that you've got everything set up, you might want to double check that the code actually works. There are two different test commands available, running

```
npm run test-utils
```

will test the functions responsible for manipulating data as it is seeded into the database.
Alternatively, running

```
npm test
```

will test the server itself, making various requests to all the available endpoints. If this command takes a little time to run, don't worry. The test database is re-seeded before very test so it will take a few seconds to run through the entire suite.

If all goes well, running either of these commands should result in a lot of green ticks scrolling past your terminal!


## Acknowledgments

* Caffeine
* Bon Jovi
