import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ADC-WTM Appointment Letter Generator",
  description: "Appointment letter submission and approval portal for ADC We-Together Movement."
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
