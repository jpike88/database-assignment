-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-29 02:37:49.454

-- tables
-- Table: Customer
CREATE TABLE Customer (
    cid int NOT NULL AUTO_INCREMENT,
    stationsTravelled int NOT NULL,
    name text NOT NULL,
    isAvailable bool NOT NULL,
    CONSTRAINT Customer_pk PRIMARY KEY (cid)
);

-- Table: Operator
CREATE TABLE Operator (
    oid int NOT NULL AUTO_INCREMENT,
    name text NOT NULL,
    stationsTravelled int NOT NULL DEFAULT 0,
    CONSTRAINT Operator_pk PRIMARY KEY (oid)
);

-- Table: Station
CREATE TABLE Station (
    sid int NOT NULL AUTO_INCREMENT,
    name text NOT NULL,
    CONSTRAINT Station_pk PRIMARY KEY (sid)
);

-- Table: Ticket
CREATE TABLE Ticket (
    tkid int NOT NULL AUTO_INCREMENT,
    cid int NULL,
    tid int NOT NULL,
    cost decimal(10,2) NOT NULL,
    timePurchased int NOT NULL,
    stationPurchased int NOT NULL,
    stationDisembarked int NULL,
    CONSTRAINT Ticket_pk PRIMARY KEY (tkid)
);

-- Table: Track_Closure
CREATE TABLE Track_Closure (
    tcid int NOT NULL AUTO_INCREMENT,
    firstStation int NOT NULL,
    secondStation int NOT NULL,
    CONSTRAINT Track_Closure_pk PRIMARY KEY (tcid)
);

-- Table: Train
CREATE TABLE Train (
    tid int NOT NULL AUTO_INCREMENT,
    oid int NOT NULL,
    sid int NOT NULL,
    destinationStation int NOT NULL,
    startingStation int NOT NULL,
    tripsCompleted int NOT NULL DEFAULT 0,
    stationsTravelled int NOT NULL,
    active bool NOT NULL DEFAULT 1,
    CONSTRAINT Train_pk PRIMARY KEY (tid)
);

-- views
-- View: Train_Business_Analysis
CREATE VIEW Train_Business_Analysis AS
SELECT Train.tid, Train.stationsTravelled, Train.tripsCompleted, Operator.name AS currentOperator, IFNULL(SUM(Ticket.cost), 0) AS totalRevenue, COUNT(Ticket.tkid) AS ticketsPurchased, COUNT(Ticket.cid) AS customerTickets FROM Train
 INNER JOIN Operator 
  ON Operator.oid = Train.oid
 LEFT JOIN Ticket
  ON Ticket.tid = Train.tid
GROUP BY Train.tid;

-- View: Top_Customers
CREATE VIEW Top_Customers AS
SELECT Customer.name, COUNT(Ticket.cid) AS ticketsPurchased, IFNULL(SUM(Ticket.cost), 0) AS revenue FROM Customer
 LEFT JOIN Ticket
  ON Customer.cid = Ticket.cid
GROUP BY Customer.name
ORDER BY ticketsPurchased DESC
LIMIT 10;

-- View: Top_Stations
CREATE VIEW Top_Stations AS
SELECT Station.name, COUNT(Ticket.tid) AS ticketsPurchased, COUNT(Ticket.cid) AS customerTickets, IFNULL(SUM(Ticket.cost), 0) AS revenue FROM Station
 LEFT JOIN Ticket
  ON Ticket.stationPurchased = Station.sid
GROUP BY Station.name;

-- foreign keys
-- Reference: Ticket_Customer (table: Ticket)
ALTER TABLE Ticket ADD CONSTRAINT Ticket_Customer FOREIGN KEY Ticket_Customer (cid)
    REFERENCES Customer (cid);

-- Reference: Ticket_Station (table: Ticket)
ALTER TABLE Ticket ADD CONSTRAINT Ticket_Station FOREIGN KEY Ticket_Station (stationPurchased)
    REFERENCES Station (sid);

-- Reference: Ticket_Station2 (table: Ticket)
ALTER TABLE Ticket ADD CONSTRAINT Ticket_Station2 FOREIGN KEY Ticket_Station2 (stationDisembarked)
    REFERENCES Station (sid);

-- Reference: Ticket_Train (table: Ticket)
ALTER TABLE Ticket ADD CONSTRAINT Ticket_Train FOREIGN KEY Ticket_Train (tid)
    REFERENCES Train (tid);

-- Reference: Track_Closure_StationFirst (table: Track_Closure)
ALTER TABLE Track_Closure ADD CONSTRAINT Track_Closure_StationFirst FOREIGN KEY Track_Closure_StationFirst (firstStation)
    REFERENCES Station (sid);

-- Reference: Track_Closure_StationSecond (table: Track_Closure)
ALTER TABLE Track_Closure ADD CONSTRAINT Track_Closure_StationSecond FOREIGN KEY Track_Closure_StationSecond (secondStation)
    REFERENCES Station (sid);

-- Reference: Train_Operator (table: Train)
ALTER TABLE Train ADD CONSTRAINT Train_Operator FOREIGN KEY Train_Operator (oid)
    REFERENCES Operator (oid);

-- Reference: Train_Station (table: Train)
ALTER TABLE Train ADD CONSTRAINT Train_Station FOREIGN KEY Train_Station (sid)
    REFERENCES Station (sid);


-- Procedure: Updates counters
DELIMITER $$

CREATE PROCEDURE move_train_to_station(IN selectedTrainID INT, IN selectedStationID INT)
BEGIN
	SET @trainOID = (SELECT oid FROM Train WHERE tid = selectedTrainID LIMIT 1);

	UPDATE Operator
			SET Operator.stationsTravelled = Operator.stationsTravelled + 1 
			WHERE Operator.oid = @trainOID;

	UPDATE Train
			SET Train.stationsTravelled = Train.stationsTravelled + 1,
			Train.sid = selectedStationID
			WHERE Train.tid = selectedTrainID;

END$$
DELIMITER ;