import { Subject } from "@/types/student";
import { Badge } from "@/components/ui/badge";

interface SubjectsViewProps {
  subjects: Subject[];
  getSubjectAverage: (subjectId: string) => number | null;
}

const SubjectsView = ({ subjects, getSubjectAverage }: SubjectsViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-foreground">Matières</h2>
        <p className="text-sm text-muted-foreground">{subjects.length} matières configurées</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const avg = getSubjectAverage(subject.id);
          return (
            <div key={subject.id} className="glass-card rounded-xl p-5 transition-all hover:shadow-md">
              <h3 className="font-display text-lg text-foreground">{subject.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Coefficient</p>
                  <p className="font-display text-xl text-foreground">{subject.coefficient}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                  {avg !== null ? (
                    <Badge className={avg >= 12 ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                      {avg.toFixed(1)}/20
                    </Badge>
                  ) : (
                    <Badge variant="outline">N/A</Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectsView;
