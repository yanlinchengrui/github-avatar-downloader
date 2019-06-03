var request = require('request');
var GITHUB_TOKEN = require('./secrets');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });

}

getRepoContributors("jquery", "jquery", function(err, result) {
  var contributors = JSON.parse(result).map(
    function (x) {
      return x.avatar_url;
    }
  );
  console.log("Errors:", err);
  console.log("Result:", contributors);
});