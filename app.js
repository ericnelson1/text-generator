var express = require('express');
var app = express();

var textEngine = require('./text-engine');

app.use(express.static('public'));

app.get('/api', function(req, res) {
    res.send(textEngine.getEntries());
});
  
app.get('/api/text/:id', function(req, res) {
	var entry = textEngine.getEntry(req.params.id);
    res.send(entry);
});
 
app.listen(3000);

console.log("listening on port 3000");
