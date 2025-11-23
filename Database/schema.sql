CREATE DATABASE IF NOT EXISTS erecruitmentdb;
USE erecruitmentdb;

CREATE TABLE HRAdmins (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Position VARCHAR(255) NOT NULL
);

CREATE TABLE BusinessUnits (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE JobPosts (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    PostName VARCHAR(500) NOT NULL,
    JobDescription TEXT,
    BusinessUnitId INT,
    ManagerName VARCHAR(255),
    ManagerEmail VARCHAR(255),
    ExperienceRequired VARCHAR(100),
    QualificationRequired VARCHAR(100),
    DriversLicenseRequired BOOLEAN,
    OpeningDate DATE,
    ClosingDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BusinessUnitId) REFERENCES BusinessUnits(Id)
);

CREATE TABLE Applicants (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Surname VARCHAR(255) NOT NULL,
    IDNumber VARCHAR(20),
    CellphoneNumber VARCHAR(20),
    WorkNumber VARCHAR(20),
    HomeAddress TEXT,
    Province VARCHAR(100),
    CVFilePath VARCHAR(500),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE JobApplications (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ApplicantId INT,
    JobPostId INT,
    HighestQualification VARCHAR(100),
    HasDriversLicense BOOLEAN,
    CurrentPosition VARCHAR(255),
    CurrentCompany VARCHAR(255),
    YearsWithCurrentEmployer VARCHAR(100),
    CurrentSalary DECIMAL(15,2),
    TotalExperience VARCHAR(100),
    ApplicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ApplicantId) REFERENCES Applicants(Id),
    FOREIGN KEY (JobPostId) REFERENCES JobPosts(Id)
);

INSERT INTO HRAdmins (Username, Password, Name, Position) 
VALUES ('admin', 'HRPassword', 'James Brook', 'HC Admin');

INSERT INTO BusinessUnits (Name) VALUES 
('ICT'), 
('Human Capital'), 
('Law Enforcement'), 
('Finance');