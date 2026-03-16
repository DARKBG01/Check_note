import { Users, BookOpen, TrendingUp, Award } from "lucide-react";
import { Student, Subject, Grade } from "@/types/student";
import StatCard from "./StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DashboardViewProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  getOverallAverage: () => number;
  getSubjectAverage: (subjectId: string) => number | null;
  getStudentAverage: (studentId: string) => number | null;
}

const DashboardView = ({
  students,
  subjects,
  grades,
  getOverallAverage,
  getSubjectAverage,
  getStudentAverage,
}: DashboardViewProps) => {
  const overallAvg = getOverallAverage();

  const subjectData = subjects.map((s) => ({
    name: s.name,
    moyenne: Number((getSubjectAverage(s.id) ?? 0).toFixed(1)),
  }));

  const topStudents = students
    .map((s) => ({ ...s, average: getStudentAverage(s.id) }))
    .filter((s) => s.average !== null)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0))
    .slice(0, 5);

  const barColors = ["hsl(220,60%,20%)", "hsl(220,50%,30%)", "hsl(38,92%,50%)", "hsl(220,50%,35%)", "hsl(30,90%,55%)"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-foreground">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble des performances</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Étudiants" value={students.length} icon={Users} variant="primary" />
        <StatCard title="Matières" value={subjects.length} icon={BookOpen} />
        <StatCard title="Notes saisies" value={grades.length} icon={TrendingUp} />
        <StatCard
          title="Moyenne générale"
          value={`${overallAvg.toFixed(1)}/20`}
          icon={Award}
          variant="accent"
          subtitle={overallAvg >= 12 ? "Satisfaisant" : "À améliorer"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <h3 className="mb-4 font-display text-lg text-foreground">Moyenne par matière</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(220,15%,88%)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="moyenne" radius={[6, 6, 0, 0]}>
                {subjectData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="mb-4 font-display text-lg text-foreground">Top 5 étudiants</h3>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-body text-sm font-semibold text-foreground">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{student.class}</p>
                </div>
                <span className="font-display text-lg text-foreground">
                  {student.average?.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
