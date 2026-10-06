API Contract
Base URL (dev): https://localhost:7001/api

All protected endpoints require header: Authorization: Bearer <token>
Roles: Public = no token | Member | Admin | Trainer

Auth
Method	Route	Role	Request	Response
POST	/auth/register	Public	RegisterDto	200 AuthResponseDto
POST	/auth/login	Public	LoginDto	200 AuthResponseDto
GET	/auth/me	Any logged-in	-	200 UserDto
Members
Method	Route	Role	Request	Response
GET	/members	Admin	-	200 MemberDto[]
GET	/members/{id}	Admin, Member (own)	-	200 MemberDto / 404
POST	/members	Admin	CreateMemberDto	201 MemberDto / 400
PUT	/members/{id}	Admin	CreateMemberDto	200 MemberDto / 400
DELETE	/members/{id}	Admin	-	204 / 404
Trainers
Method	Route	Role	Request	Response
GET	/trainers	Member, Admin	-	200 TrainerDto[]
GET	/trainers/{id}	Member, Admin	-	200 TrainerDto / 404
POST	/trainers	Admin	TrainerDto	201 TrainerDto / 400
Classes
Method	Route	Role	Request	Response
GET	/classes	Member, Admin	-	200 ClassDto[]
GET	/classes/{id}	Member, Admin	-	200 ClassDto / 404
POST	/classes	Admin	CreateClassDto	201 ClassDto / 400
DELETE	/classes/{id}	Admin	-	204 / 404
Bookings
Method	Route	Role	Request	Response
GET	/bookings	Admin	-	200 BookingDto[]
GET	/bookings/member/{memberId}	Member (own), Admin	-	200 BookingDto[]
POST	/bookings	Member	CreateBookingDto	201 BookingDto / 400 / 409
DELETE	/bookings/{id}	Member (own), Admin	-	204 / 404
Status codes:

200 OK

201 Created

204 No Content

400 Bad Request (validation)

401 Unauthorized (no/invalid token)

403 Forbidden (wrong role)

404 Not Found

409 Conflict (already booked, class full)