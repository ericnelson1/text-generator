var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

var entries = [
{"id":1, "title":"Hello World!", "body":"This is the body of my blog entry. Sooo exciting.", "published":"6/2/2013"},
{"id":2, "title":"Eggs for Breakfast", "body":"Today I had eggs for breakfast. Sooo exciting.", "published":"6/3/2013"},
{"id":3, "title":"Beer is Good", "body":"News Flash! Beer is awesome!", "published":"6/4/2013"},
{"id":4, "title":"Mean People Suck", "body":"People who are mean aren't nice or fun to hang around.", "published":"6/5/2013"},
{"id":5, "title":"I'm Leaving Technology X and You Care", "body":"Let me write some link bait about why I'm not using a particular technology anymore.", "published":"6/10/2013"},
{"id":6, "title":"Help My Kickstarter", "body":"I want a new XBox One. Please fund my Kickstarter.", "published":"6/12/2013"}];
 
exports.setEntry = function(entry) {
	client.set("")
};
 
exports.getEntries = function() {
    return entries;
};
 
exports.getEntry = function(id) {
    for(var i=0; i < entries.length; i++) {
        if(entries[i].id == id) return entries[i];
    }
};