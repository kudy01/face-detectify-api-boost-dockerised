BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined, age, occupation) values ('Kudy', 'kudy@gmail.com', 5, '2020-01-01', 19, 'Software Developer');
INSERT into login (hash, email) values ('$2a$10$cmzRI1knSTCOTLsudVp5kORCVE3oNerWkv9FhFI6qr/Hk01p8Ika6', 'kudy@gmail.com');

COMMIT;