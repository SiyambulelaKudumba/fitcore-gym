Auth Contract
Stack
ASP.NET Identity for users and password hashing

JWT Bearer tokens for authentication

Roles: Admin, Member, Trainer

Login flow
Frontend sends POST /api/auth/login with { email, password }.

API validates against Identity.

API returns:

{
"token": "eyJhbGciOiJIUzI1NiIs...",
"user": {
"id": "abc-123",
"email": "member@fitcore.co.za",
"role": "Member",
"memberId": 1,
"firstName": "Test",
"lastName": "Member"
}
}

Register flow
POST /api/auth/register creates an ApplicationUser with role Member and a matching Member row.

Returns the same shape as login (token + user).

JWT claims
Claim	Value
sub	user Id (GUID string)
email	user email
role	"Admin" / "Member" / "Trainer"
given_name	FirstName
family_name	LastName
memberId	Member.Id (0 if not a member)
Token settings
Expires: 60 minutes

Signing: HMAC SHA-256, key in appsettings.json under Jwt:Key

Issuer: FitCoreApi

Audience: FitCoreClient

Frontend storage
On successful login: localStorage.setItem("token", token) and localStorage.setItem("user", JSON.stringify(user))

On logout: remove both keys

Every axios request adds: Authorization: Bearer <token>

Seed users
Email	Password	Role
admin@fitcore.co.za	Admin@123	Admin
member@fitcore.co.za	Member@123	Member
trainer@fitcore.co.za	Trainer@123	Trainer

