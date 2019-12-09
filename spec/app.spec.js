process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const request = require('supertest');
const knex = require('knex');
const config = require('../knexfile');

const { expect } = chai;

describe('/api', () => {
  it('ERROR 404: returns an error when any path other than /api is attempted', () => {
    const methods = ['get', 'patch', 'post', 'put', 'delete'];
    const promises = [];
    methods.forEach(method => {
      promises.push(request(app)[method]('/wrongPath'));
    });
    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        expect(response.body.msg).to.equal('Page Not Found');
        expect(response.status).to.equal(404);
      });
    });
  });
  describe('/topics', () => {
    it('GET:200 - sends an object containing all topics back to the client', () => {
      const {
        up,
        down
      } = require('../db/migrations/20191209104752_create_table_topics');
      knex.migrate.up(config);
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics).to.be.an('array');
          expect(response.body.topics.length).to.equal(3);
          response.body.topics.forEach(topic => {
            expect(topic).to.have.keys('slug', 'description');
          });
        });
    });
  });
});
