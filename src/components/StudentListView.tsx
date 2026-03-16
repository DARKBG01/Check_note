import { useState } from "react";
import { Search, Plus, Trash2, Eye } from "lucide-react";
import { Student } from "@/types/student";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StudentListViewProps {
  students: Student[];
  getStudentAverage: (studentId: string) => number | null;
  addStudent: (student: Omit<Student, "id">) => Student;
  deleteStudent: (id: string) => void;
  onViewStudent: (studentId: string) => void;
}

const StudentListView = ({
  students,
  getStudentAverage,
  addStudent,
  deleteStudent,
  onViewStudent,
}: StudentListViewProps) => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", class: "" });

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (form.firstName && form.lastName && form.email && form.class) {
      addStudent(form);
      setForm({ firstName: "", lastName: "", email: "", class: "" });
      setDialogOpen(false);
    }
  };

  const getAverageBadge = (avg: number | null) => {
    if (avg === null) return <Badge variant="outline">N/A</Badge>;
    if (avg >= 16) return <Badge className="bg-success text-success-foreground">{avg.toFixed(1)}</Badge>;
    if (avg >= 12) return <Badge className="bg-accent text-accent-foreground">{avg.toFixed(1)}</Badge>;
    if (avg >= 10) return <Badge variant="secondary">{avg.toFixed(1)}</Badge>;
    return <Badge variant="destructive">{avg.toFixed(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Étudiants</h2>
          <p className="text-sm text-muted-foreground">{students.length} étudiants inscrits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nouvel étudiant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Classe</Label>
                <Input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} placeholder="Ex: L3 Info" />
              </div>
              <Button onClick={handleAdd} className="w-full">Ajouter l'étudiant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Étudiant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classe</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Moyenne</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => {
              const avg = getStudentAverage(student.id);
              return (
                <tr key={student.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{student.class}</td>
                  <td className="px-5 py-3">{getAverageBadge(avg)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onViewStudent(student.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteStudent(student.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Aucun étudiant trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentListView;
