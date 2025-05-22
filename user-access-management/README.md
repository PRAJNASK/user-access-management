# 🛡️ User Access Management System

A backend system for managing software and role-based user access.

---

## 📡 API Summary

### ➕ Admin: Create SoftwarePOST http://localhost:5000/api/software/create
Headers:
Authorization: Bearer <admin_token>
Body:
{
"name": "Photoshop",
"description": "Image editing software",
"accessLevels": ["Read", "Write", "Admin"]
}
GET http://localhost:5000/api/software
Headers:
Authorization: Bearer <token>
**Description:** Admins can create new software records.

### 🧾 Headers
```http
Authorization: Bearer <admin_token>
{
  "name": "Photoshop",
  "description": "Image editing software",
  "accessLevels": ["Read", "Write", "Admin"]
}
{
  "id": 1,
  "name": "Photoshop",
  "description": "Image editing software",
  "accessLevels": ["Read", "Write", "Admin"]
}
400 Bad Request: Invalid input  
401 Unauthorized: No or invalid token  
403 Forbidden: User is not Admin  
500 Internal Server Error
Authorization: Bearer <token>
[
  {
    "id": 1,
    "name": "Photoshop",
    "description": "Image editing software",
    "accessLevels": ["Read", "Write", "Admin"]
  },
  {
    "id": 2,
    "name": "VS Code",
    "description": "Code editor",
    "accessLevels": ["Read", "Write"]
  }
]
401 Unauthorized: No or invalid token  
500 Internal Server Error
