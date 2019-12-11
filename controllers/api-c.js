exports.getAllEndpoints = (req, res, next) => {
    res.sendFile('/home/callum/northcoders/back-end/be-nc-news/endpoints.json', err => {
        next(err)
    })
};

// app.get('/file/:name', function (req, res, next) {
//     var options = {
//       root: path.join(__dirname, 'public'),
//       dotfiles: 'deny',
//       headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//       }
//     }

//     var fileName = req.params.name
//     res.sendFile(fileName, options, function (err) {
//       if (err) {
//         next(err)
//       } else {
//         console.log('Sent:', fileName)
//       }
//     })
//   })