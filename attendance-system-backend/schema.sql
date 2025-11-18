-- schema.sql

-- Drop tables in reverse order of dependency to avoid foreign key constraint errors
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Lecture;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS CourseBlueprints;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS StudentPhoneNumbers;
DROP TABLE IF EXISTS FacultyPhoneNumbers;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Departments;

CREATE TABLE Departments (
    Dept_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Dept_Name TEXT NOT NULL UNIQUE,
    Dept_Code TEXT NOT NULL UNIQUE
);

CREATE TABLE Faculty (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Dept_Id INTEGER NOT NULL,
    FOREIGN KEY (Dept_Id) REFERENCES Departments(Dept_Id)
);

CREATE TABLE Students (
    Std_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Std_Name TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Dept_Id INTEGER NOT NULL,
    Gender TEXT,
    Date_of_Birth DATE,
    FOREIGN KEY (Dept_Id) REFERENCES Departments(Dept_Id)
);

CREATE TABLE CourseBlueprints (
    Blueprint_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Course_Code TEXT NOT NULL UNIQUE,
    Course_Title TEXT NOT NULL,
    Dept_Id INTEGER,
    FOREIGN KEY (Dept_Id) REFERENCES Departments(Dept_Id)
);

CREATE TABLE Courses (
    Course_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Blueprint_Id INTEGER NOT NULL,
    Faculty_Id INTEGER NOT NULL,
    Academic_Year INTEGER NOT NULL,
    Semester_No INTEGER NOT NULL,
    FOREIGN KEY (Blueprint_Id) REFERENCES CourseBlueprints(Blueprint_Id) ON DELETE CASCADE,
    FOREIGN KEY (Faculty_Id) REFERENCES Faculty(Id) ON DELETE CASCADE
);

CREATE TABLE Lecture (
    Lecture_No INTEGER PRIMARY KEY AUTOINCREMENT,
    Lecture_Name TEXT NOT NULL,
    Date DATE,
    Duration INTEGER,
    Course_Id INTEGER NOT NULL,
    FOREIGN KEY (Course_Id) REFERENCES Courses(Course_Id) ON DELETE CASCADE
);

CREATE TABLE Enrollments (
    Std_Id INTEGER,
    Course_Id INTEGER,
    PRIMARY KEY (Std_Id, Course_Id),
    FOREIGN KEY (Std_Id) REFERENCES Students(Std_Id) ON DELETE CASCADE,
    FOREIGN KEY (Course_Id) REFERENCES Courses(Course_Id) ON DELETE CASCADE
);

CREATE TABLE Users (
    user_id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'faculty', 'student')),
    reference_id INTEGER
);

CREATE TABLE StudentPhoneNumbers (
    Std_Id INTEGER,
    Phone_No TEXT NOT NULL,
    Phone_Type TEXT,
    PRIMARY KEY (Std_Id, Phone_No),
    FOREIGN KEY (Std_Id) REFERENCES Students(Std_Id) ON DELETE CASCADE
);

CREATE TABLE FacultyPhoneNumbers (
    Faculty_Id INTEGER,
    Phone_No TEXT NOT NULL,
    Phone_Type TEXT,
    PRIMARY KEY (Faculty_Id, Phone_No),
    FOREIGN KEY (Faculty_Id) REFERENCES Faculty(Id) ON DELETE CASCADE
);

CREATE TABLE Attendance (
    Attendance_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Date DATE,
    Status TEXT CHECK(Status IN ('Present', 'Absent')),
    Std_Id INTEGER,
    Lecture_No INTEGER,
    FOREIGN KEY (Std_Id) REFERENCES Students(Std_Id) ON DELETE CASCADE,
    FOREIGN KEY (Lecture_No) REFERENCES Lecture(Lecture_No) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    Review_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    User_Id TEXT NOT NULL,
    Rating INTEGER NOT NULL CHECK(Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_Id) REFERENCES Users(user_id) ON DELETE CASCADE
);