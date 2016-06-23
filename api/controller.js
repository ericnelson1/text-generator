var logger = require('./log'); 
var worker = require('./worker');
var linkrepo = require('./link-repo');
var sequencerepo = require('./sequence-repo');


exports.setupRoutes = function(app) {

  // api root
  app.get('/api', function(req, res) {
    var host = 'http://' + req.headers.host;
    res.json({
      links: host + '/api/links',
      processed: host + '/api/links/processed',
      unprocessed: host + '/api/links/unprocessed',
      stats: [
        { depth: 1, url: host + '/api/stats/depth/1' }, 
        { depth: 2, url: host + '/api/stats/depth/2' }, 
        { depth: 4, url: host + '/api/stats/depth/4' } 
      ],
      text: [
        { depth: 1, url: host + '/api/text/depth/1' }, 
        { depth: 2, url: host + '/api/text/depth/2' }, 
        { depth: 4, url: host + '/api/text/depth/4' } 
      ]
    });
  });

  // show list of links on catalog view
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

  // add link for processing
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

  // show text when they click on text button on catalog view
  app.get('/api/text/:id', function(req, res) {
    linkrepo.getById(req.params.id, 'text').then(function(link) {
      res.send(link.text);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'controller: error getting text',
        error: err  
      })
    });
  });

  // show stats for single file
  app.get('/api/stats/:id/depth/:depth', function(req, res) {
    linkrepo.getStats(req.params.id, parseInt(req.params.depth))
    .then(function(stats) {
      res.send(stats);
    }).catch(function(err) { 
      res.status(500).json({
        message: 'controller: error getting stats for file',
        error: err  
      })
    });
  });

  // show stats for entire catalog
  app.get('/api/stats/depth/:depth', function (req,res) {
    sequencerepo.getStats(parseInt(req.params.depth))
    .then(function(stats) {
      res.send(stats); 
    }).catch(function(err) { 
      res.status(500).json({
        message: 'controller: error getting stats for catalog',
        error: err  
      })
    });
  });

  // generate text
  app.get('/api/text/depth/:depth', function (req,res) {
    sequencerepo.getText(parseInt(req.params.depth))
    .then(function(text) {
      res.send(text); 
    }).catch(function(err) { 
      res.status(500).json({
        message: 'controller: error getting text',
        error: err  
      })
    });
  });

};
