var http = require('http');
var server = new http.Server;
var io = require('socket.io')(server);
var CronJob = require('cron').CronJob;
var cytoscape = require('cytoscape');
var jayson = require('jayson');
var moment = require('moment');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'university',
        password: 'jp8jp8jp8',
        database: 'database'
    }
});

var knexOperator = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'operator',
        password: '1234',
        database: 'database'
    }
});

var knexBA = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'ba',
        password: '1234',
        database: 'database'
    }
});


var knex_operator = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'university',
        password: 'jp8jp8jp8',
        database: 'database'
    }
});


var knex_ba = require('knex')({
    client: 'mysql',
    connection: {
        host: 'university.cb9rcqklli29.ap-southeast-2.rds.amazonaws.com',
        user: 'university',
        password: 'jp8jp8jp8',
        database: 'database'
    }
});

var embarkAndDisembarkCustomersOnTrain = function(train) {

    // onboard some customers based on FINAL = TOTAL - ( random fraction of total * modifier)

    // first step? total customers on train.


    knex.raw("SELECT COUNT(*) FROM Ticket WHERE tid = " + train.tid + " AND stationDisembarked IS NULL").then(function(result) {

        // we know the total customers onboard.
        var count = result[0][0][Object.keys(result[0][0])[0]];

        // we want to offboard some.
        var amountToOffboard = Math.floor(count * Math.random());

        knex.raw("UPDATE Ticket SET stationDisembarked = " + train.sid + " WHERE tkid IN (SELECT * FROM (SELECT tkid FROM Ticket WHERE tid = " + train.tid + " AND stationDisembarked IS NULL ORDER BY rand() LIMIT 0, " + amountToOffboard + ") tmp)").then(function(result) {

            // then we want to onboard some.
            var spacesAvailable = count - amountToOffboard;

            // now, onboard.
            var amountToOnboard = Math.floor(Math.random() * (50 - spacesAvailable));

            if (spacesAvailable + amountToOnboard)
                for (var i = 0; i < amountToOnboard; i++) {
                    // insert.
                    // anonymous for now.

                    if (Math.random() > 0.5) {

                        knex.raw("INSERT INTO Ticket(tid, cid, timePurchased, stationPurchased) VALUES(" + train.tid + ", null, " + moment.now() + ", " + train.sid + ");").then(function(result) {
                            // done!
                        }).catch(function(e) {
                            console.log('fail')
                        });

                    } else {

                        knex.raw("SELECT cid FROM Customer WHERE isAvailable = 1 ORDER BY RAND() LIMIT 1").then(function(customer) {
                            customer = customer[0][0][Object.keys(customer[0][0])[0]];
                            knex.raw("INSERT INTO Ticket(tid, cid, timePurchased, stationPurchased) VALUES(" + train.tid + ", " + customer + ", " + moment.now() + ", " + train.sid + ");").then(function(result) {
                                // done!
                            });
                        }).catch(function(e) {
                            console.log('fail')
                        });

                    }





                };


        });

    });

}

// initialise.
// stations and paths

var cy = cytoscape();

// initialise


var graphList = [{
    group: "nodes",
    data: {
        id: 1,
        label: 'Roma Street'
    },
    position: {
        x: 100,
        y: 50
    }
}, {
    group: "nodes",
    data: {
        id: 2,
        label: 'Beenleigh'
    },
    position: {
        x: 100,
        y: 400
    }
}, {
    group: "nodes",
    data: {
        id: 3,
        label: 'Cleveland'
    },
    position: {
        x: 300,
        y: 200
    }
}, {
    group: "nodes",
    data: {
        id: 4,
        label: 'Altandi'
    },
    position: {
        x: 100,
        y: 300
    }
}, {
    group: "nodes",
    data: {
        id: 5,
        label: 'Park Road'
    },
    position: {
        x: 100,
        y: 100
    }
}, {
    group: "nodes",
    data: {
        id: 6,
        label: 'Coorparoo'
    },
    position: {
        x: 200,
        y: 200
    }
}, {
    group: "nodes",
    data: {
        id: 7,
        label: 'South Bank'
    },
    position: {
        x: 50,
        y: 100
    }
}, {
    group: "edges",
    data: {
        id: "e0",
        source: 1,
        target: 5
    }
}, {
    group: "edges",
    data: {
        id: "e1",
        source: 7,
        target: 5
    }
}, {
    group: "edges",
    data: {
        id: "e2",
        source: 5,
        target: 4
    }
}, {
    group: "edges",
    data: {
        id: "e3",
        source: 4,
        target: 2
    }
}, {
    group: "edges",
    data: {
        id: "e4",
        source: 5,
        target: 6
    }
}, {
    group: "edges",
    data: {
        id: "e5",
        source: 6,
        target: 3
    }
}];




cy.add(graphList);
new CronJob('*/10 * * * * *', function() {

    knex('Ticket').where('cost', '=', 0).whereRaw('stationDisembarked IS NOT NULL').then(function(tickets) {


        tickets.forEach(function(ticket) {

            var dijkstra = cy.elements().dijkstra('#' + ticket.stationPurchased, function() {
                return 1;
            });

            var pathToEndpoint = dijkstra.pathTo(cy.$('#' + ticket.stationDisembarked));
            var counter = 0;
            pathToEndpoint.forEach(function(node) {
                if (node.data().label) {
                    counter++;
                }
            })

            var ticketCost = counter * 3.00;

            knex('Ticket')
                .where('tkid', '=', ticket.tkid)
                .update({
                    cost: ticketCost
                }).then(function() {

                })

        });


    });


    knex('Train').join('Station', 'Station.sid', '=', 'Train.sid')
        .select().then(function(trains) {


            var trainToStation = {};
            var stationToTrain = {};
            var activeStations = [];
            trains.forEach(function(train) {


                // time to go to a different station.
                graphList.forEach(function(g) {
                    if (parseInt(g.data.id) == train.sid && Object.keys(trainToStation).indexOf('' + train.tid) == -1) {
                        // this train is at the station.
                        // look at their start and dest.

                        var dijkstra = cy.elements().dijkstra('#' + train.startingStation, function() {
                            return 1;
                        });

                        var pathToEndpoint = dijkstra.pathTo(cy.$('#' + train.destinationStation));


                        var getNextStation = false;
                        var runOnce = false;
                        var nextStation = null;
                        pathToEndpoint.forEach(function(node) {
                            if (node.data().label) {
                                // is station.
                                if (!runOnce && getNextStation) {
                                    nextStation = parseInt(node.data().id);
                                    runOnce = true;
                                }

                                if (!getNextStation && parseInt(node.data().id) == train.sid) {

                                    getNextStation = true;
                                }



                            }
                        })


                        if (nextStation) {
                            // path continues.

                            knex.raw("CALL move_train_to_station(" + train.tid + "," + nextStation + ")").then(function(result) {
                                // move.
                            });

                            train.sid = nextStation;

                            embarkAndDisembarkCustomersOnTrain(train);

                            // if path closed:
                            // offboard all customers.
                            // DONE.

                            // if path open:

                            // offboard some customers based on FINAL = TOTAL - ( random fraction of total * modifier), selection will be random




                        } else {

                            // path terminates. reverse.
                            knex('Train')
                                .where('tid', '=', train.tid)
                                .update({
                                    startingStation: train.destinationStation,
                                    destinationStation: train.startingStation,
                                    tripsCompleted: (train.tripsCompleted + 1)
                                }).then(function() {
                                    // we need another operator
                                })

                            knex('Ticket')
                                .where('tid', '=', train.tid)
                                .whereRaw('stationDisembarked IS NULL')
                                .update({
                                    stationDisembarked: train.sid
                                }).then(function() {

                                })



                        }

                        if (Object.keys(trainToStation).indexOf('' + train.tid) == -1) {
                            activeStations.push(train.sid)
                            stationToTrain[train.sid] = train.tid;
                            trainToStation[train.tid] = train.sid;
                        }



                    }
                });



            })


            graphList.forEach(function(g) {


                if (activeStations.indexOf(parseInt(g.data.id)) != -1) {
                    g.classes = 'trainPresent' + stationToTrain[g.data.id];
                } else {
                    g.classes = '';
                }

            })

            cy.remove('*');
            cy.add(graphList);


        }).catch(function(e) {

            console.log(e);

        })

}, null, true);


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });


    socket.on('addPersonToTrain', function(req) {


        knex.transaction(function(trx) {

            if (Math.random() > 0.5) {

                return trx.raw("INSERT INTO Ticket(tid, cid, timePurchased, stationPurchased) VALUES(" + req.train + ", null, " + moment.now() + ", " + req.station + ");")
                    .then(trx.commit)
                    .catch(trx.rollback);

            } else {

                return trx.raw("SELECT cid FROM Customer WHERE isAvailable = 1 ORDER BY RAND() LIMIT 1").then(function(customer) {
                        customer = customer[0][0][Object.keys(customer[0][0])[0]];
                        return trx.raw("INSERT INTO Ticket(tid, cid, timePurchased, stationPurchased) VALUES(" + req.train + ", " + customer + ", " + moment.now() + ", " + req.station + ");");
                    }).then(trx.commit)
                    .catch(trx.rollback);

            }
        })
            .then(function() {
                socket.emit('addPersonToTrain', {
                    train: req.train
                });
            })
            .catch(function(error) {
                // If we get here, that means that neither the 'Old Books' catalogues insert,
                // nor any of the books inserts will have taken place.
                console.error(error);
            });


    });

    socket.on('removePersonFromTrain', function(req) {

        knex.transaction(function(trx) {

            return trx.raw("UPDATE Ticket SET stationDisembarked = " + req.station + " WHERE tkid IN (SELECT * FROM (SELECT tkid FROM Ticket WHERE tid = " + req.train + " AND stationDisembarked IS NULL ORDER BY rand() LIMIT 0, " + 1 + ") tmp)")
                .then(trx.commit)
                .catch(trx.rollback);

        })
            .then(function() {
                socket.emit('removePersonFromTrain', {
                    train: req.train
                });
            })
            .catch(function(error) {
                // If we get here, that means that neither the 'Old Books' catalogues insert,
                // nor any of the books inserts will have taken place.
                console.error(error);
            });

    });

    socket.on('getOperatorData', function() {
        // OPERATOR DATA FETCH.

        knexOperator.raw("SELECT Train.tid, Train.sid, Train.tripsCompleted, Train.stationsTravelled, Station.name, COUNT(Ticket.tkid) AS totalOnboard FROM Ticket, Train, Station WHERE Ticket.tid = Train.tid AND Station.sid = Train.sid AND Ticket.stationDisembarked IS NULL GROUP BY Train.tid").then(function(r) {


            knexOperator.raw("SELECT * FROM Top_Stations").then(function(a) {
                knexOperator.raw("SELECT * FROM Top_Customers").then(function(b) {

                    var returnPackage = {
                        trains: (JSON.parse(JSON.stringify(r)))[0],
                        nodeMap: cy.json(),
                        stations: (JSON.parse(JSON.stringify(a)))[0],
                        customers: (JSON.parse(JSON.stringify(b)))[0]

                    };

                    socket.emit('getOperatorData', returnPackage);

                });
            });

        });

    });

    socket.on('getBusinessAnalystData', function() {
        // BUSINESS ANALYST DATA FETCH.

        // this gets all trains and people onboard and station name
        knexBA.raw("SELECT Train.tid, Train.sid, Train.tripsCompleted, Train.stationsTravelled, Station.name, COUNT(Ticket.tkid) AS totalOnboard FROM Ticket, Train, Station WHERE Ticket.tid = Train.tid AND Station.sid = Train.sid AND Ticket.stationDisembarked IS NULL GROUP BY Train.tid").then(function(r) {


            knexBA.raw("SELECT * FROM Train_Business_Analysis").then(function(a) {

              knexBA.raw("SELECT COUNT(cost) FROM Ticket WHERE cost > 5.00").then(function(c) {


                var returnPackage = {
                    trains: (JSON.parse(JSON.stringify(r)))[0],
                    nodeMap: cy.json(),
                    analytics: (JSON.parse(JSON.stringify(a)))[0],
                    ticketsAboveTwoStops: (JSON.parse(JSON.stringify(c)))[0]
                };

                socket.emit('getBusinessAnalystData', returnPackage);

              });

            });

        });

    });

});

server.listen(8001, function() {
    console.log('listening on *:8001');
});