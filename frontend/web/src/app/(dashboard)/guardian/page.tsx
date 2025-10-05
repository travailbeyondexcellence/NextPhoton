
import prisma from "../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server"; // Commented out for mock deployment


const ParentPage = async () => {
  // const { userId } = auth(); // Commented out for mock deployment
  // const currentUserId = userId;

  // const students = await prisma.student.findMany({
  //   where: {
  //     parentId: currentUserId!,
  //   },
  // });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
     
    </div>
  );
};

export default ParentPage;
