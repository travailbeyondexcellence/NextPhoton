// Modify this component later to include the actual data fetching and state management logic.

import React from "react";

// Types
export type ExecutedAcademicPlan = {
  id: string;
  assignedPlanId: string;
  learnerId: string;
  week: number;
  status: "on-track" | "behind" | "ahead" | "skipped";
  actualHours: {
    subject: string;
    hoursSpent: number;
  }[];
  remarks?: string;
};

export type AssignedAcademicPlan = {
  id: string;
  learnerId: string;
  baseTemplateId: string;
  assignedDate: string;
  startDate: string;
  endDate: string;
  customAdjustments?: string;
  assignedBy: string;
  status: "active" | "paused" | "completed";
};

export type PremadeAcademicPlan = {
  id: string;
  title: string;
  targetExams: string[];
  academicLevel: string;
  durationInWeeks: number;
  subjects: {
    subject: string;
    weeklyHours: number;
  }[];
  createdBy: string;
  notes?: string;
};

// Props
interface AcademicProgressProps {
  learnerId: string;
  assignedPlan: AssignedAcademicPlan;
  executedPlans: ExecutedAcademicPlan[];
  premadePlan: PremadeAcademicPlan;
}

const AcademicProgress: React.FC<AcademicProgressProps> = ({
  learnerId,
  assignedPlan,
  executedPlans,
  premadePlan,
}) => {
  const weeksCompleted = executedPlans.length;

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-2">Academic Progress</h2>
      <p className="text-sm text-gray-500 mb-4">
        {premadePlan.title} | Assigned by {assignedPlan.assignedBy} | Weeks Planned: {premadePlan.durationInWeeks}
      </p>

      <div className="space-y-4">
        {executedPlans.map((weekPlan) => (
          <div key={weekPlan.id} className="border rounded-md p-3">
            <h3 className="font-medium mb-1">Week {weekPlan.week} - <span className="capitalize">{weekPlan.status}</span></h3>
            <ul className="list-disc list-inside text-sm">
              {weekPlan.actualHours.map((entry, idx) => (
                <li key={idx}>
                  {entry.subject}: {entry.hoursSpent} hrs
                </li>
              ))}
            </ul>
            {weekPlan.remarks && (
              <p className="mt-2 text-xs text-gray-500">Note: {weekPlan.remarks}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-700">
        <p><strong>Total Weeks Completed:</strong> {weeksCompleted}</p>
        <p><strong>Status:</strong> {assignedPlan.status}</p>
        {assignedPlan.customAdjustments && (
          <p className="text-xs text-gray-400 mt-1">Adjustment: {assignedPlan.customAdjustments}</p>
        )}
      </div>
    </div>
  );
};

export default AcademicProgress;