class User:
    def __init__(self, first_name, last_name, user_id, email, role, role_name):
        self.first_name = first_name
        self.last_name = last_name
        self.user_id = user_id
        self.email = email
        self.role = role
        self.role_name = role_name

    def __repr__(self):
        return f"User(username={self.username}, email={self.email})"
    
    def to_dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "user_id": self.user_id,
            "email": self.email,
            "role": self.role,
            "role_name": self.role_name
        }