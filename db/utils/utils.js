exports.formatDates = list => {
  return list.map(({ created_at, ...otherKeys }) => {
    const dateObj = new Date(created_at);
    return { ...otherKeys, created_at: dateObj };
  });
};

exports.makeRefObj = list => {
  return list.reduce((refObj, { title, article_id }) => {
    refObj[title] = article_id;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return exports
    .formatDates(comments)
    .map(({ belongs_to, created_by, ...otherKeys }) => {
      return {
        article_id: articleRef[belongs_to],
        author: created_by,
        ...otherKeys
      };
    });
};
