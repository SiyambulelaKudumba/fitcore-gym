Error Format

Every error response from the API uses the same JSON shape:

{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "numberOfSets": ["Number of sets must be between 1 and 20"]
  }
}

| Field | Type | Notes |
|-------|------|-------|
| status | int | Same as HTTP status code |
| message | string | Human-readable summary |
| errors | object | Optional. Key = field, value = string[] |

## Example responses

### 400 Bad Request
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "exerciseName": ["Exercise name is required"],
    "numberOfSets": ["Number of sets must be between 1 and 20"]
  }
}

### 401 Unauthorized
{
  "status": 401,
  "message": "You must be logged in.",
  "errors": {}
}

### 403 Forbidden
{
  "status": 403,
  "message": "You do not have permission to do this.",
  "errors": {}
}

### 404 Not Found
{
  "status": 404,
  "message": "Workout task not found.",
  "errors": {}
}

### 409 Conflict
{
  "status": 409,
  "message": "Member is already assigned to this programme.",
  "errors": {}
}

## Frontend usage
Use error.response.data.message for the alert text, and
error.response.data.errors to attach messages to specific form fields.

catch (err) {
  setError(err.response?.data?.message || "Something went wrong.");
}