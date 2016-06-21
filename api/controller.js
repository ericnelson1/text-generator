var logger = require('./log'); 
var worker = require('./worker');
var linkrepo = require('./link-repo');
var catalogrepo = require('./catalog-repo');


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
    linkrepo.get().then(function(links) {
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
    linkrepo.validate(url).then(function(url) {
      return linkrepo.add(url);
    }).then(function(link) {
      // queue the work for processing
      worker.queue(link);
      res.json(link); 
    }).catch(linkrepo.ValidationError, function(err) {
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
    linkrepo.get({ processed: true }).then(function(links) {
      res.json(links);
    }).catch(function(err) {
      res.status(500).json({
        message: 'error getting processed links',
        error: err
      });
    });
  });

  app.get('/api/links/unprocessed', function(req, res) {
    linkrepo.get({ processed: false }).then(function(links) {
      res.json(links);
    }).catch(function(err) {
      res.status(500).json({
        message: 'error getting unprocessed links',
        error: err
      });
    });
  });

  app.get('/api/text/:id', function(req, res) {
    linkrepo.getById(req.params.id, 'text').then(function(link) {
      res.send(link.text);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'error getting text',
        error: err  
      })
    });
  });

  app.get('/api/stats/:id/depth/:depth', function(req, res) {
    linkrepo.getById(req.params.id, 'stats').then(function(link) {
      res.send(link.stats);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'error getting stats',
        error: err  
      })
    });
  });

  app.get('/api/stats/depth/:depth', function (req,res) {
    res.send([]);
  });
};
