INSERT INTO users (name, email, password)
VALUES ('namer', '1@1.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('reman', '2@2.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('meran', '3@3.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, country,street,city,province,post_code)
VALUES (1, 'speed lamp', ' https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '123 street rd', 'vancouver', 'bc', 'v1a1b3'),
(1, 'speed lamp', ' https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '123 street rd', 'vancouver', 'bc', 'v1a1b3'),
(1, 'speed lamp', ' https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '123 street rd', 'vancouver', 'bc', 'v1a1b3');


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES('2018-09-01', '2018-09-03', 1, 1),
('2018-09-01', '2018-09-03', 2, 1),
('2018-09-01', '2018-09-03',3, 1);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES(3,1,1,1,'MESSAGE'),
(3,2,1,2,'MESSAGE'),
(3,3,1,3,'MESSAGE');
