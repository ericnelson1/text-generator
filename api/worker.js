var kue = require('kue'),
    queue = kue.createQueue();

var logger = require('winston');
var Promise = require('bluebird');
var _ = require('underscore');

var textget = require('./text-get');
var stats = require('./stats');
var linkrepo = require('./link-repo');
var sequencerepo = require('./sequence-repo');

var config = {
  depths: [1, 4]
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
    logger.info('finished link processing');
    link.processed = true;
    return linkrepo.update(link);
  }).then(function(link) {
    logger.info('finished link update');
    return sequencerepo.update(link);
  }).then(function(link) {
    logger.info('finished sequence update');
    done && done();
    return link;
  }).catch(function(err) {
    done && done(err);
  });
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

