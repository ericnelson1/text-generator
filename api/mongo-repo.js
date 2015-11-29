var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/textgen');

var Link = mongoose.model('Link', {
  url: String, 
  submitted: { type: Date, default: Date.now }, 
  text: String, 
  stats: {} 
});

var link1 = new Link({url: 'http://blahblah.com', text: 'here is some text', stats: { a: 1, b: 2, c: 3 }});

console.log(link1);

link1.save(function (err, userObj) {
  if (err) {
    console.log(err);
  } else {
    console.log('saved successfully:', userObj);
  }
});

//Lets try to Find a link
Link.findOne({url: 'http://blahblah.com'}, function (err, userObj) {
  if (err) {
    console.log(err);
  } else if (userObj) {
    console.log('Found:', userObj);

    userObj.text = 'here is some updated text';

    //Lets save it
    userObj.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated', userObj);
      }
    });
  } else {
    console.log('Link not found!');
  }
});