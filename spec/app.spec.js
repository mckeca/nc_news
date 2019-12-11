process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const request = require('supertest');
const connection = require('../db/connection');
const { expect } = chai;
chai.use(chaiSorted);

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
    const methods = ['get', 'patch', 'post', 'put', 'delete'];
    const promises = [];
    methods.forEach(method => {
      promises.push(request(app)[method]('/api'));
    });
    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        expect(response.body.msg).to.equal('Method Not Allowed');
        expect(response.status).to.equal(405);
      });
    });
  });
  it.only('GET 200: serves a json file detailing all available endpoints', () => {
    return request(app).get('/api').expect(200)
  });
  describe('/api/topics', () => {
    it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
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
    it('GET 200: returns an object containing an array of all the topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics).to.be.an('array');
          response.body.topics.forEach(topic => {
            expect(topic).to.have.keys('slug', 'description');
          });
        });
    });
  });
  describe('/api/users', () => {
    it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
      const methods = ['get', 'patch', 'post', 'put', 'delete'];
      const promises = [];
      methods.forEach(method => {
        promises.push(request(app)[method]('/api/users'));
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.body.msg).to.equal('Method Not Allowed');
          expect(response.status).to.equal(405);
        });
      });
    });
    describe('/:username', () => {
      it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
        const methods = ['patch', 'post', 'put', 'delete'];
        const promises = [];
        methods.forEach(method => {
          promises.push(request(app)[method]('/api/users/1'));
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
            expect(response.status).to.equal(405);
          });
        });
      });
      it('GET 200: a request to a valid username returns an object of that user', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(response => {
            expect(response.body.user).to.be.an('object');
            expect(response.body.user).to.have.keys(
              'username',
              'avatar_url',
              'name'
            );
          });
      });
      it('ERROR 404: returns a 404 Not Found error when username does not exist', () => {
        return request(app)
          .get('/api/users/not_a_user')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('User Not Found');
          });
      });
    });
  });
  describe('/api/articles', () => {
    it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
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
    it('GET 200: returns an object containing array of all articles in the database', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.descendingBy('created_at');
          expect(response.body.articles.length).to.equal(12);
          response.body.articles.forEach(article => {
            expect(article).to.have.keys(
              'article_id',
              'title',
              'comment_count',
              'votes',
              'topic',
              'author',
              'created_at'
            );
          });
        });
    });
    it('GET 200: can sort by a particular column by adding relevant query', () => {
      return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(12);
          expect(response.body.articles).to.be.descendingBy('votes');
        });
    });
    it('GET 200: can filter by author by adding relevant query', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(3);
          response.body.articles.forEach(article => {
            expect(article.author).to.equal('butter_bridge');
          });
        });
    });
    it('GET 200: can filter by topic by adding relevant query', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(11);
          response.body.articles.forEach(article => {
            expect(article.topic).to.equal('mitch');
          });
        });
    });
    it('ERROR 404: returns a Not Found error when attempting to query a non existant topic', () => {
      return request(app)
        .get('/api/articles?topic=nonsense')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Topic Not Found');
        });
    });
    it('ERROR 404: returns a Not Found error when attempting to query a non existant author', () => {
      return request(app)
        .get('/api/articles?author=more_nonsense')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Author Not Found');
        });
    });
    it('ERROR 400: returns a Bad Request error when attempting to sort by a non existant column', () => {
      return request(app)
        .get('/api/articles?sort_by=even_more_nonsense')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request - Cannot Sort By Non Existant Column');
        });
    });
  });
  describe('/api/articles/:article_id', () => {
    it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
      const methods = ['post', 'put', 'delete'];
      const promises = [];
      methods.forEach(method => {
        promises.push(request(app)[method]('/api/articles/1'));
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.body.msg).to.equal('Method Not Allowed');
          expect(response.status).to.equal(405);
        });
      });
    });
    it('GET 200: returns a single article object based on the parametric article_id endpoint', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'author',
            'created_at',
            'comment_count'
          );
          expect(response.body.article.article_id).to.equal(1);
        });
    });
    it('ERROR 404: returns a not found error when passed an article id that does not exist', () => {
      return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article Not Found');
        });
    });
    it('ERROR 400: returns a bad request error when passes an invalid id type as a parametric endpoint', () => {
      return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Bad Request - Invalid Data Type'
          );
        });
    });
    it('PATCH 200: returns a 200 accepted code and an objected containing the patched article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          console.log(response.body)
          expect(response.body.article.votes).to.equal(101);
          expect(response.body.article).to.have.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'author',
            'created_at'
          );
        });
    });
    it('PATCH 200: ignores incorrect keys in body, returns unchanged article object', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ banana: 1 })
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(
            100
          );
        });
    });
    it('PATCH 200: when passed an empty body, returns the unchanged article object', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(
            100
          );
        });
    });
    it('ERROR 404: returns a not found error when passed an article id that does not exist', () => {
      return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article Not Found');
        });
    });
    it('ERROR 400: returns a Bad Request error when passed an invalid article_id', () => {
      return request(app)
        .patch('/api/articles/banana')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Bad Request - Invalid Data Type'
          );
        });
    });
    it('ERROR 400: returns a Bad Request error when passed an invalid data value for specified column', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Bad Request - Invalid Data Type'
          );
        });
    });
    describe('api/articles/:article_id/comments', () => {
      it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
        const methods = ['patch', 'put', 'delete'];
        const promises = [];
        methods.forEach(method => {
          promises.push(request(app)[method]('/api/articles/1/comments'));
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
            expect(response.status).to.equal(405);
          });
        });
      });
      it('GET 200: returns an object containing an array of all comments associated with a particular aticle', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.an('array');
            expect(response.body.comments).to.be.descendingBy('created_at');
            response.body.comments.forEach(comment => {
              expect(comment).to.have.keys(
                'comment_id',
                'author',
                'votes',
                'created_at',
                'body'
              );
            });
          });
      });
      it('GET 200: sorts returned comments by URL queries', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author&order=asc')
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.ascendingBy('author');
          });
      });
    });
    it('GET 200: returns an empty array when no comments belong to an existing article', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an('array');
          expect(response.body.comments.length).to.equal(0);
        });
    });
    it('ERROR 404: returns a Not Found error when specified article does not exist', () => {
      return request(app)
        .get('/api/articles/99/comments')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article Not Found');
        });
    });
    it('ERROR 400: returns a Bad Request error when passed an invalid article_id', () => {
      return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request - Invalid Data Type');
        });
    });
    it('POST 201: returns an object of the succesfully posted comment', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          body:
            'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
          username: 'butter_bridge'
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
          expect(response.body.comment.article_id).to.equal(2);
          expect(response.body.comment.votes).to.equal(0);
        });
    });
    it('POST 201: ignores any erroneous column names', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          body:
            'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
          username: 'butter_bridge',
          rubbish: 'what is this rubbish?'
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
        });
    });
    it('ERROR 404: returns a Not Found error when specified article does not exist', () => {
      return request(app)
        .post('/api/articles/99/comments')
        .send({
          body:
            'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
          username: 'butter_bridge'
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article Not Found');
        });
    });
    it('ERROR 400: returns a Bad Request error when passed an invalid article_id', () => {
      return request(app)
        .post('/api/articles/banana/comments')
        .send({
          body:
            'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
          username: 'butter_bridge'
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request - Invalid Data Type');
        });
    });
    it('ERROR 400: returns a Bad Request when body omits an essential key', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          body:
            'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman'
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Bad Request - Violating Not Null Constraint'
          );
        });
    });
    it('ERROR 400: returns a Bad Request when passed an empty body', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Bad Request - Violating Not Null Constraint'
          );
        });
    });
  });
  describe('/api/comments', () => {
    it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
      const methods = ['get', 'patch', 'post', 'put', 'delete'];
      const promises = [];
      methods.forEach(method => {
        promises.push(request(app)[method]('/api/comments'));
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.body.msg).to.equal('Method Not Allowed');
          expect(response.status).to.equal(405);
        });
      });
    });
    describe('/api/comments/:comment_id', () => {
      it('ERROR 405: sends a Method Not Allowed error to any unhandled endpoints', () => {
        const methods = ['post', 'put', 'get'];
        const promises = [];
        methods.forEach(method => {
          promises.push(request(app)[method]('/api/comments/1'));
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
            expect(response.status).to.equal(405);
          });
        });
      });
      it('PATCH 200: returns an object containing the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(response => {
            expect(response.body.comment.votes).to.equal(17);
            expect(response.body.comment).to.have.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('PATCH 200: ignores incorrect keys in body and returns unchanged comment object', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ banana: 1 })
          .expect(200)
          .then(response => {
            expect(response.body.comment.votes).to.equal(16);
          });
      });
      it('PATCH 200: ignores an empty body and returns the unchanged comment object', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then(response => {
            expect(response.body.comment.votes).to.equal(16);
          });
      });
      it('ERROR 404: returns a Not Found error when passed a non existant comment_id', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment Not Found');
          });
      });
      it('ERROR 400: returns a Bad Request error when passed an invalid comment_id', () => {
        return request(app)
          .patch('/api/comments/banana')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Bad Request - Invalid Data Type');
          });
      });
      it('ERROR 400: returns a Bad Request error when passed an invalid data value for specified column', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'banana' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Bad Request - Invalid Data Type');
          });
      });
      it('DELETE 204: returns a status code of 204 but no body on succesful delete', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('ERROR 404: returns a Not Found error when passed a non existant comment id', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment Not Found');
          });
      });
    });
  });
  it("ERROR 418: you're a teapot", () => {
    const methods = ['get', 'patch', 'post', 'put', 'delete'];
    const promises = [];
    methods.forEach(method => {
      promises.push(request(app)[method]('/api/teapot'));
    });
    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        expect(response.body.msg).to.equal("I'm a teapot");
        expect(response.status).to.equal(418);
      });
    });
  });
});