import Script from "next/script";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Script
          src="https://cloud.ccm19.de/app.js?apiKey=5aafada9ca3be898712d75b70c286efa217c18a8cdec6102&amp;domain=67c8705f5c350797fb07dc02"
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
