//imports a server component

import MenuWrapper from "./MenuWrapper";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar(){

    return(
            //LEFT SIDEBAR
      <div className="w-[56px] md:w-[72px] lg:w-[200px] xl:w-[240px] p-4 mt-1">
      <Link
        href="/"
        className="flex items-center justify-center lg:justify-start gap-2"
      >
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <span className="hidden lg:block font-bold">Next Photon</span>
      </Link>
      <MenuWrapper/>
    </div>
    )
}