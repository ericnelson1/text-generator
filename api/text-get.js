var ineed = require('ineed');
var _ = require('underscore');
var logger = require('winston');
var Promise = require('bluebird');

exports.get = function(url) {

  logger.info('getting text from url', url);

  return new Promise(function(resolve, reject) {

    ineed.collect.texts.from({url: url}, function(err, response, result) {

      if (err) {
        logger.error('ineed error', err); 
        reject(err);
        return;
      }
      if (response.statusCode !== 200) {
        logger.error('ineed response', response);
        reject(new Error('ineed response error'));
        return;
      }
      
      logger.info('got text from url', url);

      // result = { texts: ['string1', 'string2']}

      // clean text
      _.each(result.texts, function(element, index, list) {
        element = element.trim();
        if (element.match(/^</) || element.match(/^\\/) || element.length < 25) {
          delete list[index]; 
        }
      });

      // join and normalize text
      var text = result.texts
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z]+/g, ' ');

      resolve(text);
    });
  });
};



