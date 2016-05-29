-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-05-29 02:37:49.454

-- views
DROP VIEW Top_Stations;

DROP VIEW Top_Customers;

DROP VIEW Train_Business_Analysis;

-- foreign keys
ALTER TABLE Ticket
    DROP FOREIGN KEY Ticket_Customer;

ALTER TABLE Ticket
    DROP FOREIGN KEY Ticket_Station;

ALTER TABLE Ticket
    DROP FOREIGN KEY Ticket_Station2;

ALTER TABLE Ticket
    DROP FOREIGN KEY Ticket_Train;

ALTER TABLE Track_Closure
    DROP FOREIGN KEY Track_Closure_StationFirst;

ALTER TABLE Track_Closure
    DROP FOREIGN KEY Track_Closure_StationSecond;

ALTER TABLE Train
    DROP FOREIGN KEY Train_Operator;

ALTER TABLE Train
    DROP FOREIGN KEY Train_Station;

-- tables
DROP TABLE Customer;

DROP TABLE Operator;

DROP TABLE Station;

DROP TABLE Ticket;

DROP TABLE Track_Closure;

DROP TABLE Train;

-- End of file.

