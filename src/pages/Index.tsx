import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import StudentListView from "@/components/StudentListView";
import GradesView from "@/components/GradesView";
import SubjectsView from "@/components/SubjectsView";
import { useStudentStore } from "@/hooks/useStudentStore";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const store = useStudentStore();

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab("grades");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "grades") setSelectedStudentId(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="ml-64 p-8">
        {activeTab === "dashboard" && (
          <DashboardView
            students={store.students}
            subjects={store.subjects}
            grades={store.grades}
            getOverallAverage={store.getOverallAverage}
            getSubjectAverage={store.getSubjectAverage}
            getStudentAverage={store.getStudentAverage}
          />
        )}
        {activeTab === "students" && (
          <StudentListView
            students={store.students}
            getStudentAverage={store.getStudentAverage}
            addStudent={store.addStudent}
            deleteStudent={store.deleteStudent}
            onViewStudent={handleViewStudent}
          />
        )}
        {activeTab === "grades" && (
          <GradesView
            students={store.students}
            subjects={store.subjects}
            grades={store.grades}
            addGrade={store.addGrade}
            selectedStudentId={selectedStudentId}
          />
        )}
        {activeTab === "subjects" && (
          <SubjectsView
            subjects={store.subjects}
            getSubjectAverage={store.getSubjectAverage}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
