"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/context/cart-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import { RecentlyViewedProvider } from "@/lib/context/recently-viewed-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>{children}</RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
