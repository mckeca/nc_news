process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const request = require('supertest');

const { expect } = chai;
chai.use(chaiSorted);

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
    it('ERROR 405: returns a Method Not Allowed error when attempting any query other than get to /topics', () => {
      const methods = ['patch', 'post', 'put', 'delete'];
      const promises = [];
      methods.forEach(method => {
        promises.push(request(app)[method]('/api/topics'));
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.body.msg).to.equal('Method Not Allowed');
          expect(response.status).to.equal(405);
        });
      });
    });
  });
  describe('/articles', () => {
    const methods = ['patch', 'post', 'put', 'delete'];
    const promises = [];
    methods.forEach(method => {
      promises.push(request(app)[method]('/api/articles'));
    });
    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        expect(response.body.msg).to.equal('Method Not Allowed');
        expect(response.status).to.equal(405);
      });
    });
  });
});
