module.exports = function(config) { 
  config.set({
    frameworks: ['jasmine'],
    files: [
      'api/**/*.js',
      'app/**/*.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'api/**/*.js': ['jshint'],
      'app/**/*.js': ['jshint'],
      'test/**/*.js': ['jshint']
    }
  });
};

