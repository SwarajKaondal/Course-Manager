// SnackbarContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar, Alert as MUIAlert, AlertColor } from "@mui/material";

type AlertContextType = {
  showAlert: (message: string, severity?: AlertColor) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MUIAlert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </MUIAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
