import Script from "next/script";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Script
          src="https://cloud.ccm19.de/app.js?apiKey=37d046acfdad233a5c74bfcf748d5f5ae13e550801800c15&amp;domain=67d32244e0b51cea3708a6f2"
          referrerPolicy="origin"
        ></Script>
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
