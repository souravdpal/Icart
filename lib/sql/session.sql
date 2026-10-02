create table session(
    id   char(40) primary key,
    session char(40) unique not null,
    refresh_token char(40) unique not null,
    session_exp     bigint  not null,
    refresh_exp    bigint  not null,
    user_id    char(40) not null 
)