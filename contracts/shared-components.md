Shared Components
Location: frontend/src/components/.

Navbar
<Navbar />
No props. Reads user and role from localStorage.

ProtectedRoute
<ProtectedRoute roles={["Admin", "Member"]}>
<SomePage />
</ProtectedRoute>

Prop	Type	Notes
roles	string[]	Empty array = any logged-in user
children	node	The page to render
LoadingSpinner
<LoadingSpinner />
No props.

ErrorAlert
<ErrorAlert message="Could not load data." onClose={() => setError("")} />

Prop	Type	Notes
message	string	Empty = don't render
onClose	function	Optional
Who owns what
Owner	Files
M3	Navbar.js, ProtectedRoute.js, LoadingSpinner.js, ErrorAlert.js
M3	App.js, index.js, LoginPage.js, RegisterPage.js, HomePage.js
M3	services/api.js
M4	ClassesPage.jsx, MyBookingsPage.jsx, TrainersPage.jsx, ManageClassesPage.jsx
M4	services/classService.js, bookingService.js, trainerService.js, mockData.js
M4	everything in /docs
Rule
If M4 needs a new route or a change to Navbar, M4 sends the exact lines to M3. M4 never edits M3's files.