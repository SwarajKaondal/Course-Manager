class ChangePassword:
    def __init__(self, user_id: int, old_password: str, new_password: str):
        self.user_id = user_id
        self.old_password = old_password
        self.new_password = new_password