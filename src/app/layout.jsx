import { Oxygen } from "next/font/google";
import "./globals.css";

const oxygen = Oxygen({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Mind Guard",
  description: "Sistem Pakar Diagnosa Depresi Menggunakan Metode Forward Chaining dan Teorema Bayes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={oxygen.className}>{children}</body>
    </html>
  );
}
