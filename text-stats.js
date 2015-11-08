

exports.getStatsFour = function(stream) {

	stream.on('readable', function(){
		var chunk; 
		while (null != (chunk = stream.read())) {
			chunk = chunk.toString('utf8')
				.toLowerCase()
				.replace(/[^a-z]/g, '_');

			if (chunk.length > 4) {
				var s = chunk.substring(0,3);
				for (var i = 3; i < chunk.length; i++) {
					var c = chunk[i]
						.toLowerCase()
						.replace(/[^a-z]/g, '_');

					s += c;
					if (!(s in textcount)) {
						textcount[s] = 1;
					}
					else {
						textcount[s]++;
					}
					s = s.substring(1,4);
				}
			}
		}
	})
	.on('end', function() {
		console.log(textcount);
	});
}