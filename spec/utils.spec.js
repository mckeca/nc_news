const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('should return an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('when passed an arary containing one onject, should replace a Unix time stamp with a JS date object on the same key', () => {
    const input = [{ name: 'Cal', age: 25, created_at: Date.now() }];
    const actual = formatDates(input);
    expect(typeof actual[0].created_at).to.equal('object');
    expect(actual[0].created_at instanceof Date).to.equal(true);
  });
  it('should not alter any other keys in the passed objects', () => {
    const input = [{ name: 'Cal', age: 25, created_at: Date.now() }];
    const actual = formatDates(input);
    expect(actual[0]).to.have.keys('name', 'age', 'created_at');
  });
  it('should not mutate input data', () => {
    const input = [{ name: 'Cal', age: 25, created_at: Date.now() }];
    const inputClone = [{ name: 'Cal', age: 25, created_at: Date.now() }];
    formatDates(input);
    expect(input).to.eql(inputClone);
  });
  it('should iterate through an array of multiple objects', () => {
    const input = [
      { name: 'Cal', age: 25, created_at: Date.now() },
      { name: 'Tom', age: 27, created_at: Date.now() },
      { name: 'Kirsty', age: 26, created_at: Date.now() }
    ];
    const actual = formatDates(input);
    expect(actual.length).to.equal(3);
    actual.forEach(object => {
      expect(object).to.have.keys('name', 'age', 'created_at');
      expect(typeof object.created_at).to.equal('object');
      expect(object.created_at instanceof Date).to.equal(true);
    });
  });
});

describe('makeRefObj', () => {
  it('when passed an empty array should return an empty object', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('when passed an array containing one onject, returns a new object with a key value pair relating to the title and article_id values of passed object', () => {
    const input = [{ title: 'Gone with the wind', article_id: 1 }];
    const actual = makeRefObj(input);
    expect(actual).to.eql({ 'Gone with the wind': 1 });
  });
  it('should not mutate the input list', () => {
    const input = [{ title: 'Gone with the wind', article_id: 1 }];
    const inputClone = [{ title: 'Gone with the wind', article_id: 1 }];
    makeRefObj(input);
    expect(input).to.eql(inputClone);
  });
  it('should iterate through an array of multiple objects, adding a new key value pair to the output object for each one', () => {
    const input = [
      { title: 'Gone with the wind', article_id: 1 },
      { title: 'Catcher in the rye', article_id: 2 },
      { title: 'Atlas shrugged', article_id: 3 }
    ];
    const actual = makeRefObj(input);
    expect(actual).to.eql({
      'Gone with the wind': 1,
      'Catcher in the rye': 2,
      'Atlas shrugged': 3
    });
  });
});

describe('formatComments', () => {
  it('when passed an empty array, should return an empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('when passed an array containing one object, should replace the created_by value with a date object on the same key', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { 'Living in the shadow of a great man': 1 };
    const actual = formatComments(input, articleRef);
    expect(typeof actual[0].created_at).to.equal('object');
  });
  it('should replace the created_by key with an author key of the same value', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { 'Living in the shadow of a great man': 1 };
    const actual = formatComments(input, articleRef);
    expect(actual[0].author).to.equal('butter_bridge');
    expect(actual[0].created_by).to.equal(undefined);
  });
  it('should replace the belongs_to key with an article_id key, the value of which is determined by a reference object passed as a second arg', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { 'Living in the shadow of a great man': 1 };
    const actual = formatComments(input, articleRef);
    expect(actual[0].article_id).to.equal(1);
    expect(actual[0].belongs_to).to.equal(undefined);
  });
  it('should not mutate input data', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { 'Living in the shadow of a great man': 1 };
    const inputClone = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    formatComments(input, articleRef);
    expect(input).to.eql(inputClone);
  });
  it('should iterate through an array containing multiple objects', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389
      }
    ];
    const articleRef = {
      'Living in the shadow of a great man': 1,
      'UNCOVERED: catspiracy to bring down democracy': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(input, articleRef);
    expect(actual.length).to.equal(3);
    actual.forEach(comment => {
      expect(typeof comment.created_at).to.equal('object');
      expect(comment.created_at instanceof Date).to.equal(true);
      expect(comment.belongs_to).to.equal(undefined);
      expect(comment.created_by).to.equal(undefined);
      expect(comment.author).to.be.a('string');
      expect(comment.article_id).to.be.a('number');
    });
  });
});
