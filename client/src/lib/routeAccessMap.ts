export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/(.*)": ["admin"],
  "/admin(.*)": ["admin"],
  "/learner(.*)": ["learner", "admin"],
  "/educator(.*)": ["educator"],
  "/guardian(.*)": ["guardian"],
  "/educators": ["admin", "educator"],
  "/learners": ["admin", "educator"],
  "/guardians": ["admin", "educator"],
  "/subjects": ["admin"],
  "/classes": ["admin", "educator"],
  "/exams": ["admin", "educator", "learner", "guardian"],
  "/assignments": ["admin", "educator", "learner", "guardian"],
  "/results": ["admin", "educator", "learner", "guardian"],
  "/attendance": ["admin", "educator", "learner", "guardian"],
  "/events": ["admin", "educator", "learner", "guardian"],
  "/announcements": ["admin", "educator", "learner", "guardian"],
  "/academicplans/acadmindmaps": ["admin", "employee", "intern", "educator"], 
  "/academicplans(.*)": ["admin", "employee", "intern", "educator"]


};