var logger = require('./log'); 
var worker = require('./worker');
var repo = require('./repo');
var _ = require('underscore');

exports.setupRoutes = function(app) {

  app.get('/api', function(req, res) {
    var host = 'http://' + req.headers.host;
    res.json({
      links: host + '/api/links',
      processed: host + '/api/links/processed',
      unprocessed: host + '/api/links/unprocessed',
      stats: host + '/api/stats'
    });
  });

  app.get('/api/links', function(req, res) {
    repo.get().then(function(links) {
      res.json(links);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'error getting links',
        error: err  
      })
    });
  });

  app.post('/api/links', function(req, res) {
    var url = req.body.data.url;
    repo.validate(url).then(function(url) {
      return repo.add(url);
    }).then(function(link) {
      // queue the work for processing
      worker.queue(link);
      res.json(link); 
    }).catch(repo.ValidationError, function(err) {
      res.status(400).json({
        url: url,
        message: 'invalid url',
        error: err
      });
    }).catch(function(err) {
      res.status(500).json({
        url: url,
        message: 'error adding link',
        error: err
      });
    });
  });
   
  app.get('/api/links/processed', function(req, res) {
    repo.get({ processed: true }).then(function(links) {
      res.json(links);
    }).catch(function(err) {
      res.status(500).json({
        message: 'error getting processed links',
        error: err
      });
    });
  });

  app.get('/api/links/unprocessed', function(req, res) {
    repo.get({ processed: false }).then(function(links) {
      res.json(links);
    }).catch(function(err) {
      res.status(500).json({
        message: 'error getting unprocessed links',
        error: err
      });
    });
  });

  app.get('/api/text/:id', function(req, res) {
    repo.getById(req.params.id, 'text').then(function(link) {
      res.send(link.text);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'error getting text',
        error: err  
      })
    });
  });

  app.get('/api/stats/:id', function(req, res) {
    repo.getById(req.params.id, 'stats').then(function(link) {
      res.send(link.stats);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'error getting stats',
        error: err  
      })
    });
  });

};
