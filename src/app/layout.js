import "./globals.css";

export const metadata = {
  title: "AA Enterprises | Bulk Scrap Buyers & Recycling Partners",
  description: "AA Enterprises, run by Altaf Ahmed & Ashfaque Ahmed, is a leading scrap buyer. We buy IT scrap, AC plants, scrap cables, electric wires, and scrap motor parts at the best market rates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
