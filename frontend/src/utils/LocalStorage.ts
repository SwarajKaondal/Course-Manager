import { useState } from "react";

// Define a type for the returned state
type UseLocalStorageReturnType<T> = [T, (newValue: T) => void];

export const useLocalStorage = <T>(keyName: string, defaultValue: T): UseLocalStorageReturnType<T> => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value) as T;
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    const setValue = (newValue: T) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {
            console.log(err);
        }
        setStoredValue(newValue);
    };

    return [storedValue, setValue];
};
