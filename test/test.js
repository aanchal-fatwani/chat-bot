/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const mongooseConnect = require('../server');

chai.use(chaiHttp);
chai.should();

function getUrlTest(url, done, responseCode = 200) {
  chai
    .request(app)
    .get(url)
    .end((err, res) => {
      res.should.have.status(responseCode);
      res.body.should.be.a('object');
      done();
    });
}
function getUrlQueryParamsTest(url, queryParams, done) {
  chai
    .request(app)
    .get(url)
    .query(queryParams)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      done();
    });
}
function postUrlTest(url, data, done, status = 201) {
  chai
    .request(app)
    .post(url)
    .send(data)
    .end((err, res) => {
      res.should.have.status(status);
      res.body.should.be.a('object');
      done();
    });
}
function patchUrlTest(url, data, done) {
  chai
    .request(app)
    .patch(url)
    .send(data)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      done();
    });
}
function deleteUrlTest(url, done) {
  chai
    .request(app)
    .delete(url)
    .end((err, res) => {
      res.should.have.status(204);
      res.body.should.be.a('object');
      done();
    });
}

before(done => {
  mongooseConnect
    .dbconnect()
    .once('open', () => {
      console.log('DB connection established for tests');
      setTimeout(() => {
        done();
      }, 5000);
    })
    .on('error', error => done(error));
});

after(done => {
  mongooseConnect
    .dbclose()
    .then(() => {
      console.log('DB connection closed for tests');
      done();
      mongooseConnect.server.close(() => {
        process.exit(1);
      });
    })
    .catch(err => done(err));
});

describe('Chat bot', () => {
  const randomNum = parseInt(Math.random() * 1000);
  describe('Views', () => {
    it('should get Overview', done => {
      getUrlTest('/', done);
    });
    it('should get Login view', done => {
      getUrlTest('/login', done);
    });
    it('should get Signup view', done => {
      getUrlTest('/signup', done);
    });
    it('should give error for invalid route', done => {
      getUrlTest('/abc', done, 404);
    });
  });

  describe('Users', () => {
    it('should get all users', done => {
      getUrlTest('/api/v1/users', done);
    });
    it('should add a specific user', done => {
      postUrlTest(
        `/api/v1/users/signup`,
        {
          name: 'Test User',
          email: `testuser${randomNum}@test.com`,
          password: 'password',
          passwordConfirm: 'password'
        },
        done
      );
    });
    it('should login as a specific user', done => {
      postUrlTest(
        `/api/v1/users/login`,
        {
          email: 'test@test.com',
          password: 'password',
        },
        done,
        200
      );
    });
    it('should get a specific user', done => {
      const testUserId = '62feb80e3960592c6412a1a1';
      getUrlTest(`/api/v1/users/${testUserId}`, done);
    });
    it('should update a specific user', done => {
      const testUserId = '62feb98e3eef545794501653';
      patchUrlTest(
        `/api/v1/users/${testUserId}`,
        {
          name: `Test ${randomNum}`
        },
        done
      );
    });
    it('should delete a specific user', done => {
      const testUserId = '62febbb4e2b12314e4254b99';
      deleteUrlTest(`/api/v1/users/${testUserId}`, done);
    });
  });

  describe('Conversations', () => {
    it('should get all conversations', done => {
      getUrlTest('/api/v1/conversations', done);
    });
    it('should get a specific conversation', done => {
      const testConversationId = '62f7760095953d0ce0ab797c';
      getUrlTest(`/api/v1/conversations/${testConversationId}`, done);
    });
    it('should add a specific conversation', done => {
      postUrlTest(
        `/api/v1/conversations`,
        { questions: [`Test_question${randomNum}`], answers: ['Okay'], choices: [] },
        done
      );
    });
    it('should update a specific conversation', done => {
      const testConversationId = '62febe9a48a64b26cc48336d';
      patchUrlTest(
        `/api/v1/conversations/${testConversationId}`,
        {
          questions: ['Test question']
        },
        done
      );
    });
    it('should delete a specific conversation', done => {
      const testConversationId = '62febf67cfdd1246fc323e88';
      deleteUrlTest(`/api/v1/conversations/${testConversationId}`, done);
    });
    it('should get reply for a question', done => {
      getUrlQueryParamsTest(
        '/api/v1/conversations/reply',
        { question: 'hello' },
        done
      );
    });
    it('should get close reply for a question', done => {
      getUrlQueryParamsTest(
        '/api/v1/conversations/close-reply',
        { question: 'connect' },
        done
      );
    });
  });
});
