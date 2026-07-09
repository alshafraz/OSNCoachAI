'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getQuestionsListAction, deleteQuestionAction } from '../../../presentation/actions/questionActions';
import { QuestionForm } from '../../../presentation/components/admin/QuestionForm';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, HelpCircle, Eye, Check, Loader2 } from 'lucide-react';
import { Question } from '../../../domain/entities/Question';

export default function QuestionBankPage() {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(8);

  const [search, setSearch] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const [openAdd, setOpenAdd] = React.useState(false);
  const [editQuestion, setEditQuestion] = React.useState<Question | undefined>(undefined);
  const [previewQuestion, setPreviewQuestion] = React.useState<Question | undefined>(undefined);

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuestionsListAction({
        page,
        limit,
        search: search || undefined,
        topic: topic || undefined,
        difficulty: difficulty || undefined,
      });

      if (res.success && res.data) {
        setQuestions(res.data.questions);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, topic, difficulty]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await deleteQuestionAction(id);
      if (res.success) {
        fetchQuestions();
      } else {
        alert(res.error?.message || 'Delete failed.');
      }
    } catch (err) {
      alert('An error occurred during deletion.');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Question Bank</h1>
          <p className="text-neutral-500 text-sm">Manage, search, and edit Mathematics Olympiad coaching questions.</p>
        </div>
        <Button
          onClick={() => setOpenAdd(true)}
          className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title or body contents..."
              className="pl-9 rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 text-sm focus-visible:ring-indigo-600"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setPage(1);
              }}
              className="flex h-9 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-xs font-semibold focus-visible:outline-none"
            >
              <option value="">All Topics</option>
              <option value="Number Theory">Number Theory</option>
              <option value="Geometry">Geometry</option>
              <option value="Combinatorics">Combinatorics</option>
              <option value="Algebra">Algebra</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="flex h-9 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-xs font-semibold focus-visible:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-neutral-500 pl-6">Question</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Source</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Type</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Tags</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-neutral-400 font-semibold">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading question bank...
                  </TableCell>
                </TableRow>
              ) : questions.length > 0 ? (
                questions.map((q) => (
                  <TableRow key={q.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                    <TableCell className="pl-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{q.title}</span>
                          <Badge className={`border-none rounded-full text-[9px] font-bold px-2 py-0.5 ${
                            q.difficulty === 'EASY'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              : q.difficulty === 'MEDIUM'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                              : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                          }`}>
                            {q.difficulty}
                          </Badge>
                        </div>
                        <p className="text-neutral-400 text-xs font-semibold">{q.topic}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-neutral-500">{q.source || '-'}</TableCell>
                    <TableCell className="font-semibold text-neutral-600 dark:text-neutral-300">
                      {q.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 'Short Answer'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {q.tags?.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="rounded-full text-[9px] font-bold text-neutral-500 border-neutral-200">
                            {tag}
                          </Badge>
                        ))}
                        {q.tags && q.tags.length > 3 && (
                          <span className="text-[10px] text-neutral-400 font-bold">+{q.tags.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right py-4 space-x-2">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setPreviewQuestion(q)}
                        className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 h-8 w-8"
                        title="Preview Question"
                      >
                        <Eye className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setEditQuestion(q)}
                        className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 h-8 w-8"
                        title="Edit Question"
                      >
                        <Edit2 className="h-4 w-4 text-indigo-500" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDelete(q.id)}
                        className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 h-8 w-8"
                        title="Delete Question"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-neutral-400 italic">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                    No questions found matching the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">
                Page {page} of {totalPages} ({total} total questions)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 cursor-pointer text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 cursor-pointer text-xs"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading">Add New OSN Question</DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Populate math Olympiad questions to include in student practice loops.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <QuestionForm
              onSuccess={() => {
                setOpenAdd(false);
                fetchQuestions();
              }}
              onCancel={() => setOpenAdd(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editQuestion} onOpenChange={(open) => !open && setEditQuestion(undefined)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading">Edit Question</DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Modify the question parameters, explanation, or tags.
            </DialogDescription>
          </DialogHeader>
          {editQuestion && (
            <div className="mt-4">
              <QuestionForm
                question={editQuestion}
                onSuccess={() => {
                  setEditQuestion(undefined);
                  fetchQuestions();
                }}
                onCancel={() => setEditQuestion(undefined)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewQuestion} onOpenChange={(open) => !open && setPreviewQuestion(undefined)}>
        <DialogContent className="max-w-xl bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto text-neutral-600 dark:text-neutral-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <span>{previewQuestion?.title}</span>
              <Badge variant="outline" className="rounded-full font-bold border-indigo-200 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50">
                {previewQuestion?.difficulty}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewQuestion?.topic} {previewQuestion?.source ? `• Source: ${previewQuestion?.source}` : ''}
            </DialogDescription>
          </DialogHeader>
          {previewQuestion && (
            <div className="mt-4 space-y-4 text-sm font-medium">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 space-y-3">
                <p className="whitespace-pre-wrap leading-relaxed">{previewQuestion.body}</p>
                {previewQuestion.imageUrl && (
                  <img src={previewQuestion.imageUrl} alt="illustration" className="max-h-48 rounded-lg mx-auto border border-neutral-200 dark:border-neutral-800" />
                )}
              </div>

              {previewQuestion.type === 'MULTIPLE_CHOICE' && previewQuestion.options?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Choices</span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {previewQuestion.options.map((opt, idx) => (
                      <div key={idx} className={`p-3 border rounded-xl flex items-center justify-between ${
                        previewQuestion.correctAnswer === opt
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}>
                        <span>{opt}</span>
                        {previewQuestion.correctAnswer === opt && <Check className="h-4 w-4 text-emerald-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(previewQuestion.type === 'SHORT_ANSWER' || !previewQuestion.type) && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Correct Value</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-base bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 inline-block">
                    {previewQuestion.correctAnswer}
                  </span>
                </div>
              )}

              {previewQuestion.hint && (
                <div className="space-y-1 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 p-3 rounded-2xl">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Socratic Hint</span>
                  <p className="text-amber-800 dark:text-amber-400 text-xs italic">{previewQuestion.hint}</p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Solution Explanation</span>
                <p className="whitespace-pre-wrap leading-relaxed bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-xs">
                  {previewQuestion.explanation}
                </p>
              </div>

              {previewQuestion.tags && previewQuestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {previewQuestion.tags.map((tag, idx) => (
                    <Badge key={idx} className="bg-neutral-100 hover:bg-neutral-100 text-neutral-700 rounded-full font-bold dark:bg-neutral-800 dark:text-neutral-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
