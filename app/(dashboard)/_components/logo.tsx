import Image from "next/image";
import logo from "@/public/logo.png";

export const Logo = () => {
  return <Image height={40} width={40} alt="logo" src={logo} />;
};
