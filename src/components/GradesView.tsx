import { useState } from "react";
import { Plus } from "lucide-react";
import { Student, Subject, Grade } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradesViewProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  addGrade: (grade: Omit<Grade, "id">) => Grade;
  selectedStudentId?: string;
}

const GradesView = ({ students, subjects, grades, addGrade, selectedStudentId }: GradesViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStudent, setFilterStudent] = useState(selectedStudentId || "all");
  const [form, setForm] = useState({ studentId: selectedStudentId || "", subjectId: "", value: "", comment: "" });

  const filteredGrades = filterStudent === "all"
    ? grades
    : grades.filter((g) => g.studentId === filterStudent);

  const sortedGrades = [...filteredGrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAdd = () => {
    const val = parseFloat(form.value);
    if (form.studentId && form.subjectId && !isNaN(val) && val >= 0 && val <= 20) {
      addGrade({
        studentId: form.studentId,
        subjectId: form.subjectId,
        value: val,
        date: new Date().toISOString().split("T")[0],
        comment: form.comment || undefined,
      });
      setForm({ studentId: "", subjectId: "", value: "", comment: "" });
      setDialogOpen(false);
    }
  };

  const getStudent = (id: string) => students.find((s) => s.id === id);
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const getGradeColor = (value: number) => {
    if (value >= 16) return "bg-success text-success-foreground";
    if (value >= 12) return "bg-accent text-accent-foreground";
    if (value >= 10) return "bg-secondary text-secondary-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Notes</h2>
          <p className="text-sm text-muted-foreground">{grades.length} notes enregistrées</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Ajouter une note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nouvelle note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Étudiant</Label>
                <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Matière</Label>
                <Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Note (/20)</Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="Ex: 14.5"
                />
              </div>
              <div>
                <Label>Commentaire (optionnel)</Label>
                <Input value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="w-full">Enregistrer la note</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <Label className="text-sm text-muted-foreground">Filtrer par étudiant :</Label>
        <Select value={filterStudent} onValueChange={setFilterStudent}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les étudiants</SelectItem>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Étudiant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matière</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {sortedGrades.map((grade) => {
              const student = getStudent(grade.studentId);
              const subject = getSubject(grade.subjectId);
              return (
                <tr key={grade.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    {student ? `${student.firstName} ${student.lastName}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{subject?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Badge className={getGradeColor(grade.value)}>{grade.value}/20</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {new Date(grade.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{grade.comment || "—"}</td>
                </tr>
              );
            })}
            {sortedGrades.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Aucune note trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesView;
