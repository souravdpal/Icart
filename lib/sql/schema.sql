create table Users(
    Id  char(40) primary key,
    Username varchar(50) unique not null,
    Name_    varchar (50) not null, 
    Email    varchar(100) unique not null,
    passwordHash varchar(225) unique not null,
)