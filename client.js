var lactate = require('lactate');

var pageOptions = {};
var files = lactate.dir('public');

files.maxAge(0);
var http = require('http');
var server = new http.Server;

server.addListener('request', function(req, res) {
  
  req.headers['if-modified-since'] = undefined;
  req.headers['if-none-match'] = undefined;
    
  if (req.url === '/') {
    files.serve('index.html', req, res);
  } else {
    files.serve(req, res);
  };
});
server.listen(80);

// initialise.

// trains all start pre-condfigured nodes.




// BEGIN simulation loop.

// for each train:

// get next path.

// if path closed:
    // offboard all customers.
    // DONE.
    
// if path open:
    // offboard some customers based on FINAL = TOTAL - ( random fraction of total * modifier)
    // onboard some customers based on FINAL = TOTAL - ( random fraction of total * modifier)
        // for each new customer:
        // chance to be anonymous.
            // buy ticket
        
        // chance to be known customer. if none available, then anonymous
            // buy ticket
            // attach to customer id (random, and not currently on a train)
    // move to next point in path.
        // if reached endpoint:
        // swap endpoints.
    