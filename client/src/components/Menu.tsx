import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { adminMenu } from "../menus/adminMenu.tsx";
import { teacherMenu } from "../menus/teacherMenu.tsx";
import { studentMenu } from "../menus/studentMenu.tsx";
import { parentMenu } from "../menus/parentMenu.tsx";

const menuMap: Record<string, any[]> = {
  admin: adminMenu,
  teacher: teacherMenu,
  student: studentMenu,
  parent: parentMenu,
};

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const menuItems = menuMap[role] || [];
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
            >
              {item.icon}
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
