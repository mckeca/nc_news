const { DB_URL } = process.env;
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
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'nc_news',
      username: 'callum',
      password: 'password123'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username: 'callum',
      password: 'password123'
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
