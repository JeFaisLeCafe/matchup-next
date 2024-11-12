"use client";

import { createContext, useContext, ReactNode } from "react";
import { Poppins, Raleway } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway"
});

type Theme = {
  colors: {
    softPink: string;
    indigo: string;
    white: string;
    lightGrey: string;
    raspberry: string;
  };
};

const theme: Theme = {
  colors: {
    softPink: "#ECA7AA",
    indigo: "#425CA0",
    white: "#FFFFFF",
    lightGrey: "#D3D3D3",
    raspberry: "#DD75A4"
  }
};

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={`${poppins.variable} ${raleway.variable} font-sans`}>
        <style jsx global>{`
          :root {
            --color-soft-pink: ${theme.colors.softPink};
            --color-indigo: ${theme.colors.indigo};
            --color-white: ${theme.colors.white};
            --color-light-grey: ${theme.colors.lightGrey};
            --color-raspberry: ${theme.colors.raspberry};
          }
          body {
            background-color: var(--color-white);
            color: var(--color-indigo);
          }
        `}</style>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
