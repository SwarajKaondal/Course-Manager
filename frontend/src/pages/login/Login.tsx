import React, {useState} from "react";
import {useAuth} from "../../provider/AuthProvider";
import {User} from "../../models/models";

// Material-UI imports
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert, Select,
} from "@mui/material";
import {PostRequest} from "../../utils/ApiManager";
import MenuItem from "@mui/material/MenuItem";

export const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const {login} = useAuth();

    // Handle form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        const response = await PostRequest("/person/login", {"user_id": username, "password": password});
        if (response.ok) {
            const userData: User = await response.json();
            await login(userData);
        } else {
            setError("Invalid username or password");
        }

    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Course Manager!!!
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleLogin}>
                    <Box marginBottom={2}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};
