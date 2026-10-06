Seed Data
Created on first run by DbSeeder in backend/FitCore.Api/Data/.
These are the default rows inserted when the database is empty.

Users
Email	Password	Role
admin@fitcore.co.za	Admin@123	Admin
member@fitcore.co.za	Member@123	Member
trainer@fitcore.co.za	Trainer@123	Trainer
Members
Id	FirstName	LastName	Email	Phone
1	Test	Member	member@fitcore.co.za	0821234567
2	Sarah	Naidoo	sarah@fitcore.co.za	0839876543
Trainers
Id	FirstName	LastName	Email	Speciality
1	Thabo	Mokoena	thabo@fitcore.co.za	Strength
2	Aisha	Patel	aisha@fitcore.co.za	Yoga and Pilates
3	Sipho	Dlamini	sipho@fitcore.co.za	Boxing
Classes
Id	Name	TrainerId	Day	Time	Capacity	Booked
1	Spin	1	Monday	18:00	20	12
2	Yoga	2	Tuesday	07:00	15	15
3	Boxing	3	Wednesday	17:30	12	4
4	Pilates	2	Thursday	09:00	18	9
5	CrossFit	1	Friday	16:00	25	25
Bookings
Id	MemberId	ClassId	Status
1	1	1	Booked
2	1	3	Booked
Notes
Yoga is full (15 of 15 booked).

CrossFit is full (25 of 25 booked).

Use these to test the "Class Full" state on the Classes page.