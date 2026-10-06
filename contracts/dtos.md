public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; }
    public UserDto User { get; set; }
}

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public int MemberId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class MemberDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime JoinDate { get; set; }
}

public class CreateMemberDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
}

public class TrainerDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Speciality { get; set; }
}

public class ClassDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int TrainerId { get; set; }
    public string TrainerName { get; set; }
    public string Day { get; set; }
    public string Time { get; set; }
    public int Capacity { get; set; }
    public int Booked { get; set; }
}

public class CreateClassDto
{
    public string Name { get; set; }
    public int TrainerId { get; set; }
    public string Day { get; set; }
    public string Time { get; set; }
    public int Capacity { get; set; }
}

public class BookingDto
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; }
    public string Day { get; set; }
    public string Time { get; set; }
    public string TrainerName { get; set; }
    public DateTime BookingDate { get; set; }
    public string Status { get; set; }
}

public class CreateBookingDto
{
    public int MemberId { get; set; }
    public int ClassId { get; set; }
}