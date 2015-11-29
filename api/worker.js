var kue = require('kue'),
    queue = kue.createQueue();

var logger = require('winston');
var Promise = require('bluebird');

var textget = require('./text-get'),
  stats = require('./stats'),
  repo = require('./repo');

var config = {
  depths: [2, 5, 9],
  catalog: 'maincat'
};

queue.process('textstats', function(job, done) {
  var url = job.data.url;

  logger.info('processing url');

  textget.get(url).then(function(text) {

    return Promise.map(config.depths, function(depth) {

      logger.info('getting stats for depth', depth);

      var textstats = stats.get(text, depth);
      var catname = config.catalog + ':' + depth;

      return repo.updateCatalog(textstats, catname)
        .error(function(err) {
          logger.error('error updating catalog', catname, err); 
        });

    }).then(function() {
      return repo.processedLink(url)
        .error(function(err) {
          logger.error('error updating catalog', catname, err); 
        });
      done && done();
    }); 
  }).error(function(err) {
    done && done(err);
  });
});

exports.process = function (input) {
  var job = queue.create('textstats', input);
  job
    .on('enqueue', function () {
      console.log('Job', job.id, 'with url', job.data.url, 'is queued');
    })
    .on('complete', function (result) {
      console.log('Job', job.id, 'with url', job.data.url, 'is done with result', result);
    })
    .on('failed', function (error) {
      console.log('Job', job.id, 'with url', job.data.url, 'has failed', error);
    })  
    .on('progress', function (progress, data) {
      console.log('Job', job.id, 'is', progress, '% complete with data ', data);  
    })
    .save(function (err) {
      if (err) { console.log('Error saving job', job.id, 'error', err); }
    });
};

