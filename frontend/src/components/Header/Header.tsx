import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, Chip } from "@mui/material";
import { useAuth } from "../../provider/AuthProvider";
import { PostRequest } from "../../utils/ApiManager";
import { Link } from "react-router-dom";

export const Header = ({
  setChangePass,
  setShowNotification,
}: {
  setChangePass: (val: boolean) => void;
  setShowNotification: (val: boolean) => void;
}) => {
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [score, setScore] = React.useState<{ total: number; score: number }>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    auth.logout();
  };

  const getScore = async () => {
    if (auth.user?.role_name === "Student") {
      const result: { total: number; score: number } = await PostRequest(
        "/student/get_score",
        { user_id: auth.user.user_id }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
      setScore(result);
    }
  };

  React.useEffect(() => {
    getScore();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          ZyBooks
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, margin: 2, textAlign: "right" }}
        >
          <Link to="/query">Query</Link>
        </Typography>
        {auth && (
          <div>
            <Chip
              onClick={handleMenu}
              sx={{
                fontSize: "1.25rem",
                padding: "12px 20px",
                height: "50px",
                borderRadius: "18px",
              }}
              avatar={
                <Avatar>
                  {auth.user?.first_name[0] + "" + auth.user?.last_name[0]}
                </Avatar>
              }
              label={
                auth.user?.first_name +
                " " +
                auth.user?.last_name +
                " - " +
                auth.user?.role_name
              }
            />
            {score && (
              <Chip
                sx={{
                  fontSize: "1.25rem",
                  padding: "12px 20px",
                  height: "50px",
                }}
                label={"Score:" + score.score + "/" + score.total}
              />
            )}

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <MenuItem onClick={() => setShowNotification(true)}>
                Notifications
              </MenuItem>
              <MenuItem onClick={() => setChangePass(true)}>
                Change Password
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};
