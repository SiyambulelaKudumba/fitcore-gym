React Routes
Path	Component	Access	Notes
/	HomePage	Public	Landing page
/login	LoginPage	Public	Redirects to /classes if logged in
/register	RegisterPage	Public	Creates a Member
/classes	ClassesPage	Member, Admin	Class timetable + booking
/my-bookings	MyBookingsPage	Member	Current user's bookings
/trainers	TrainersPage	Member, Admin	List of trainers
/manage-classes	ManageClassesPage	Admin	Add/delete classes
/members	MembersPage	Admin	Manage members
NotFoundPage	Public	404

Guard rules
If not logged in, redirect to /login

If logged in but wrong role, redirect to / with a message

ProtectedRoute component wraps role-restricted routes:

<ProtectedRoute roles={["Admin"]}>
<ManageClassesPage />
</ProtectedRoute>

Navbar links by role
Public: Home, Login

Member: Classes, My Bookings, Trainers, Logout

Admin: Classes, Trainers, Manage Classes, Members, Logout

Routes M4 needs added to App.js
<Route path="/classes" element={<ClassesPage />} />
<Route path="/my-bookings" element={<MyBookingsPage />} />
<Route path="/trainers" element={<TrainersPage />} />
<Route path="/manage-classes" element={<ManageClassesPage />} />