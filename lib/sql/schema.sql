create table Users(
    Id  varchar(40) primary key,
    Username varchar(50) unique not null,
    name    varchar (50) not null, 
    Email    varchar(100) unique not null,
    passwordHash varchar(225) unique not null,
    address      text  null,
    phone        varchar(15)       
    ip           text  null,
    user_agent   text  null,
)