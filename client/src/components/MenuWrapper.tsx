// Server component

import { currentUser } from "@clerk/nextjs/server";
import MenuClient from "./MenuClient";
import { Menu } from "lucide-react";

export default async function MenuWrapper(){
    const user = await currentUser();
    const role = user?.publicMetadata.role as string;

    return <MenuClient role={role} />;
}