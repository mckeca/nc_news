process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const request = require('supertest');
const connection = require('../db/connection');
const { expect } = chai;

describe('/server', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
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
  describe('/api', () => {
    it('ERROR 404: returns an error on an invalid path after/api', () => {
      const methods = ['get', 'patch', 'post', 'put', 'delete'];
      const promises = [];
      methods.forEach(method => {
        promises.push(request(app)[method]('/api/wrongPath'));
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
    describe('/users', () => {
      describe('/:username', () => {
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
    describe('/articles', () => {
      it('GET 200: returns an object containing array of all articles in the database', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an('array');
            expect(response.body.articles.length).to.equal(12);
            response.body.articles.forEach(article => {
              expect(article).to.have.keys(
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
      });
      describe('/:article_id', () => {
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
                'created_at'
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
        it('PATCH 202: returns a 202 accepted code and an objected containing the patched article', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ votes: 150 })
            .expect(202)
            .then(response => {
              expect(response.body.updatedArticle.votes).to.equal(150);
              expect(response.body.updatedArticle).to.have.keys(
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
        it('ERROR 404: returns a not found error when passed an article id that does not exist', () => {
          return request(app)
            .patch('/api/articles/999')
            .send({ votes: 150 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Article Not Found');
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an invalid article_id', () => {
          return request(app)
            .patch('/api/articles/banana')
            .send({ votes: 150 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('ERROR 404: returns a Not Found error when passed a non existant column in body', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ banana: 150 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Column Not Found');
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an invalid data value for specified column', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ votes: 'banana' })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an empty body', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Bad Request - Empty Body');
            });
        });
        it('GET 200: returns an object containing an array of all comments associated with a particular aticle', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an('array');
              response.body.comments.forEach(comment => {
                expect(comment).to.have.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body'
                );
                expect(comment.article_id).to.equal(1);
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
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('POST 201: returns an object of the succesfully posted comment', () => {
          return request(app)
            .post('/api/articles/2/comments')
            .send({
              body:
                'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
              author: 'butter_bridge',
              votes: 16
            })
            .expect(201)
            .then(response => {
              expect(response.body.insertedComment).to.have.keys(
                'comment_id',
                'author',
                'article_id',
                'votes',
                'created_at',
                'body'
              );
              expect(response.body.insertedComment.article_id).to.equal(2);
            });
        });
        it('ERROR 404: returns a Not Found error when specified article does not exist', () => {
          return request(app)
            .post('/api/articles/99/comments')
            .send({
              body:
                'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
              author: 'butter_bridge',
              votes: 16
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
              author: 'butter_bridge',
              votes: 16
            })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('ERROR 404: returns a Not Found error when body contains a non existant column name', () => {
          return request(app)
            .post('/api/articles/2/comments')
            .send({
              body:
                'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
              author: 'butter_bridge',
              votes: 16,
              rubbish: 'what is this rubbish?'
            })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Column Not Found');
            });
        });
        it('ERROR 400: returns a Bad Request when body omits an essential key', () => {
          return request(app)
            .post('/api/articles/2/comments')
            .send({
              body:
                'Oh yes, wait a minute Mr. Postman! (Wait) Way-ay-ay-ait Mr. Postman',
              votes: 16
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
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        it('PATCH 202: returns an object containing the updated comment', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ votes: 50 })
            .expect(202)
            .then(response => {
              expect(response.body.updatedComment).to.have.keys(
                'comment_id',
                'author',
                'article_id',
                'votes',
                'created_at',
                'body'
              );
              expect(response.body.updatedComment.votes).to.equal(50);
            });
        });
        it('ERROR 404: returns a Not Found error when passed a non existant comment_id', () => {
          return request(app)
            .patch('/api/comments/999')
            .send({ votes: 50 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Comment Not Found');
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an invalid comment_id', () => {
          return request(app)
            .patch('/api/comments/banana')
            .send({ votes: 50 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('ERROR 404: returns a Not Found error when passed a non existant column in body', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ banana: 150 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Column Not Found');
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an invalid data value for specified column', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ votes: 'banana' })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                'Bad Request - Invalid Data Type'
              );
            });
        });
        it('ERROR 400: returns a Bad Request error when passed an empty body', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({})
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Bad Request - Empty Body');
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
});