import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    addresses: [
      {
        id: 1,
        type: 'Home',
        address: '123 Main St, City, Country'
      }
    ],
    settings: {
      emailNotifications: true,
      smsNotifications: false
    }
  });

  const [orders, setOrders] = useState([
    {
      id: '1',
      date: '2024-03-15',
      status: 'Delivered',
      total: 129.99,
      items: ['Pain Relief Cream', 'First Aid Kit'],
    },
    {
      id: '2',
      date: '2024-03-10',
      status: 'Processing',
      total: 45.99,
      items: ['Baby Wipes', 'Baby Shampoo'],
    },
  ]);

  const [wishlist, setWishlist] = useState([]);

  // Helper function to handle async operations
  const handleAsync = async (operation) => {
    setError(null);
    setIsLoading(true);
    try {
      await operation();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // User profile actions
  const updateProfile = async (updatedData) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => ({
        ...prev,
        ...updatedData
      }));
    });
  };

  // Address actions
  const addAddress = async (newAddress) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => ({
        ...prev,
        addresses: [...prev.addresses, { id: Date.now(), ...newAddress }]
      }));
    });
  };

  const updateAddress = async (id, updatedAddress) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => 
          addr.id === id ? { ...addr, ...updatedAddress } : addr
        )
      }));
    });
  };

  const deleteAddress = async (id) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.id !== id)
      }));
    });
  };

  // Wishlist actions
  const addToWishlist = async (product) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWishlist(prev => [...prev, product]);
    });
  };

  const removeFromWishlist = async (productId) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWishlist(prev => prev.filter(item => item.id !== productId));
    });
  };

  // Settings actions
  const updateSettings = async (newSettings) => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings
        }
      }));
    });
  };

  // Account deletion
  const deleteAccount = async () => {
    await handleAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    });
  };

  return (
    <UserContext.Provider value={{
      user,
      orders,
      wishlist,
      isLoading,
      error,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addToWishlist,
      removeFromWishlist,
      updateSettings,
      deleteAccount
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 