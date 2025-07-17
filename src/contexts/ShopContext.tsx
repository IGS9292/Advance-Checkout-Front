// // contexts/ShopContext.tsx
// import React, { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";
// import axios from "axios";

// type Shop = {
//   id: number;
//   shopName: string;
//   shopUrl: string;
//   shopContactNo: string;
//   ordersPerMonth: number;
//   status: string;
//   users: string;
//   [key: string]: any;
// };

// type ShopContextType = {
//   shops: Shop[];
//   fetchShops: () => Promise<void>;
// };

// const ShopContext = createContext<ShopContextType | undefined>(undefined);

// type ShopProviderProps = {
//   children: ReactNode;
// };

// // ✅ Named function expressions (avoids HMR issue)
// function ShopProvider({ children }: ShopProviderProps) {
//   const [shops, setShops] = useState<Shop[]>([]);

//   const fetchShops = async () => {
//     try {
//       const response = await axios.get("/api/shops");
//       const shops = response.data?.shops;
//       setShops(shops || []);
//     } catch (err) {
//       console.error("❌ Error fetching shops:", err);
//       setShops([]);
//     }
//   };

//   return (
//     <ShopContext.Provider value={{ shops, fetchShops }}>
//       {children}
//     </ShopContext.Provider>
//   );
// }

// function useShopContext(): ShopContextType {
//   const context = useContext(ShopContext);
//   if (!context) {
//     throw new Error("useShopContext must be used within a ShopProvider");
//   }
//   return context;
// }

// export { ShopProvider, useShopContext };
