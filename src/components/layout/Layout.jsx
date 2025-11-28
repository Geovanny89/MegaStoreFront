import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
