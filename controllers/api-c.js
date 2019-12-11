exports.getAllEndpoints = (req, res, next) => {
    res.sendFile('/home/callum/northcoders/back-end/be-nc-news/endpoints.json', err => {
        next(err)
    })
};
