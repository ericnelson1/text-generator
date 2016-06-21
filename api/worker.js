var kue = require('kue'),
    queue = kue.createQueue();

var logger = require('winston');
var Promise = require('bluebird');
var _ = require('underscore');

var textget = require('./text-get');
var stats = require('./stats');
var repo = require('./repo');

var config = {
  depths: [2, 5, 9],
  catalog: 'maincat'
};

queue.process('textstats', function(job, done) {
  var link = job.data;
  logger.info('processing url', link.url);

  textget.get(link).then(function(link) {
    link.stats = [];
    _.each(config.depths, function(depth) {
      logger.info('getting stats for', link.url, 'depth', depth);
      var textstats = stats.get(link.text, depth);
      link.stats.push({ depth: depth, stats: textstats });
    });
    return link;
  }).then(function(link) {
    link.processed = true;
    return repo.update(link);
  }).then(function(link) {
      done && done();
      return link;
  }).catch(function(err) {
    done && done(err);
  });

  // redis code
  // return Promise.reduce
  // var catname = config.catalog + ':' + depth;
  //   return repo.updateCatalog(textstats, catname)
  // }).then(function() {
  //   return repo.processedLink(url)
  // }); 
});

exports.queue = function (link) {
  var job = queue.create('textstats', link);
  job
    .on('enqueue', function () {
      logger.info('Job', job.id, 'with url', job.data.url, 'is queued for processing');
    })
    .on('complete', function (result) {
      logger.info('Job', job.id, 'with url', job.data.url, 'is done with result', result);
    })
    .on('failed', function (err) {
      logger.error('Job', job.id, 'with url', job.data.url, 'has failed', err);
    })  
    .on('progress', function (progress, data) {
      logger.info('Job', job.id, 'is', progress, '% complete');  
    })
    .save(function (err) {
      if (err) { logger.error('Error saving job', job.id, 'error', err); }
    });
};

