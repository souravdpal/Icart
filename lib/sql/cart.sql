create table cart(
    id  text primary key,
    user_id text  not null,
    product_id text  not null,
    amount  int  not null
  
)