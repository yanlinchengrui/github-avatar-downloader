var request = require('request');
var fs = require('fs');
require('dotenv').config();

function getRepoContributors(repoOwner, repoName, cb) {
  // store URL and headers to the parameter
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization' : 'token ' + process.env.GITHUB_TOKEN
    }
  };
  // request the data
  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function downloadImageByURL(url, filePath) {
  // check if the file already exists
  if(fs.existsSync(filePath)){
    console.log(filePath, 'already exists!');
  }else{
    // request the image and save it to the provided path
    request.get(url)
           .on('error', function (err) {
            throw err;
           })
           .pipe(fs.createWriteStream(filePath));
  }
}

function callback(err, result) {
  // save login and avatar URL to variable contributors
  var contributors = JSON.parse(result).map(
    function (x) {
      return {
        name: x.login,
        url: x.avatar_url
      }
    }
  );
  // if no directory called avatar exists, create one
  if(contributors && !fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }
  // go through each contributor and get login and avatar url
  contributors.forEach(
    function (x) {
      downloadImageByURL(x.url, './avatars/' + x.name + '.jpg');
    }
  );
  console.log('Download completed.');
  console.log('Please check your avatars folder.');
}

// takes two arguments and run the function
if(process.argv.length !== 4) {
  console.log("Parameters should only have repoOwner and repoName.");
}
else{
  var agrs = process.argv.slice(2);
  getRepoContributors(agrs[0], agrs[1], callback);
}
