import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";

import {Josefin_Sans} from "next/font/google";
import { ReservationProvider } from "./_components/ReservationContext";


const josefinFont = Josefin_Sans(
{
  subsets:["latin"],
  display: "swap",
})

export const metadata = 
{
  title: 
  {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis"
  },
  description: "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by mountains and dark forests."
}

export default function RootLayout({children})
{
  return (
  <html lang="en">
    <body className=
      {
        `${josefinFont.className} 
      bg-primary-950 
      text-accent-50 
        min-h-screen
        flex
        flex-col
        relative
      `}
    >
      <Header />
      <div className="
        flex-1 
        px-8 
        py-12
        grid
      ">
        <main className="
          max-w-7xl 
          mx-auto 
          w-full
        "
        > 
        <ReservationProvider>
          {children} 
        </ReservationProvider>
        </main>
      </div>
    </body>
  </html>
  );
}