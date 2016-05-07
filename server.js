var http = require('http');
var server = new http.Server;
var io = require('socket.io')(server);
var CronJob = require('cron').CronJob;
var cytoscape = require('cytoscape');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'university',
            password: 'jp8jp8jp8',
        database: 'database'
    }
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

server.listen(81, function(){
  console.log('listening on *:81');
});



// initialise.
// stations and paths

var cy = cytoscape();




new CronJob('*/5 * * * * *', function() {
    
    // 5 trains, 5 colours.
    // red, blue, green, yellow, purple. tracks are also these colors
    // stations are grey.
    
    
    // init all stations.
    cy.add([
      { group: "nodes", data: { id: "n0", label: 'bottom left' }, position: { x: 100, y: 100 } },
      { group: "nodes", data: { id: "n1" }, position: { x: 200, y: 200 } },
      { group: "edges", data: { id: "e0", source: "n0", target: "n1" } }
    ]);
    
    // classes : 'trainPresent' <- this means a train is present at that station.
    
    // select all trains. station
    
    // loop through stations, and 'attach' a train to a station node if match.
    
    
    
    // select all tracks
    
    // build from table, mark closed ones
    
    // loop through tracks, and 'attach' a train to a track path if match.
    
    
    
    

// initialisation complete
    

// BEGIN simulation loop.

// for each train:

// get next path.

// if path closed:
    // offboard all customers.
    // DONE.
    
// if path open:
    // offboard some customers based on FINAL = TOTAL - ( random fraction of total * modifier), selection will be random
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
    
    
    io.emit('some event', { nodeMap: cy.json() });
    cy.remove('*');
}, null, true);
