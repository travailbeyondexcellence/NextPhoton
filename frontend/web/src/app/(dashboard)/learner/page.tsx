
import prisma from "../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server"; // Commented out for mock deployment

const StudentPage = async () => {
  // const { userId } = auth(); // Commented out for mock deployment

  // const classItem = await prisma.class.findMany({
  //   where: {
  //     students: { some: { id: userId! } },
  //   },
  // });

  // console.log(classItem);
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
    
    </div>
  );
};

export default StudentPage;
