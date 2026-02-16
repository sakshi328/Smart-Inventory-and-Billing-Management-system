
import { createContext, useContext, useState, ReactNode } from "react";
import { stores, Store } from "@/lib/mock-data";

interface StoreContextType {
    currentStore: Store | null; // null means 'All Stores'
    setCurrentStore: (store: Store | null) => void;
    stores: Store[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [currentStore, setCurrentStore] = useState<Store | null>(stores[0]); // Default to first store

    return (
        <StoreContext.Provider value={{ currentStore, setCurrentStore, stores }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
