drop  table bnk.b_cust;
drop  table bnk.b_accounts;
drop  table bnk.b_cards;




create table bnk.b_cust(
                 idcust   SERIAL PRIMARY KEY,
                 first_nm varchar(35) NULL,
                 last_nm  varchar(35) NULL,
                 email    varchar(35) NULL,
                 tin      varchar(10) NULL,
                 phone    varchar(15) NULL,
                 status   varchar(1) NOT NULL default 'O',
                 dtopen   date  not null default now() ,
                 dtclose  date ,
                 idt      date  not null default now() ,
                 itm      time  not null default now(),
                 mdt      date NULL ,
                 mtm      time NULL

) ;

CREATE INDEX b_cust_email_idx
    ON bnk.b_cust USING btree
    (email ASC NULLS LAST)
;

CREATE INDEX b_cust_phone_idx
    ON bnk.b_cust USING btree
    (phone ASC NULLS LAST)
;


create table bnk.b_accounts(
                 idacnt   SERIAL PRIMARY KEY,
                 acnum    varchar(14) NULL,
                 ccy      varchar(3) NULL,
                 actype   varchar(1) default '1',
                 acname   varchar(35) NOT NULL,
                 idcust   integer NOT NULL,
                 dtopen   date not null default now(),
                 dtclose  date,
                 bal      numeric(12) default 0, 
                 idt      date  not null default now() ,
                 itm      time  not null default now(),
                 mdt      date NULL ,
                 mtm      time NULL

) ;

CREATE INDEX b_accounts_idcust_idx
    ON bnk.b_accounts USING btree
    ( idcust ASC NULLS LAST)
;



create table bnk.b_cards(
                 idcrd    SERIAL PRIMARY KEY,
                 card     varchar(16) NULL,
                 idacnt   integer NOT NULL,
                 dtissue   date not null default now(),
                 dtexpire   date,
                 islck    varchar(1) not null default 'N',
                 dtlck    date,   
                 idt      date  not null default now() ,
                 itm      time  not null default now(),
                 mdt      date NULL ,
                 mtm      time NULL

) ;

CREATE INDEX b_curds_idacnt_idx
    ON bnk.b_cards USING btree
    ( idacnt ASC NULLS LAST)
;




