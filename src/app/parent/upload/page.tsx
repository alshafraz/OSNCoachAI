'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileUp, FileText, ArrowLeft, Loader2, Sparkles, CheckCircle2, AlertTriangle, Trash2, Save, HelpCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { parsePdfWorksheetAction } from '../../../presentation/actions/ocrActions';
import { createQuestionAction } from '../../../presentation/actions/questionActions';
import { ParsedQuestionCandidate } from '../../../domain/services/OcrService';
import { QuestionDifficulty, QuestionType } from '../../../domain/entities/Question';

export default function OcrUploadPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progressVal, setProgressVal] = React.useState(0);
  const [progressStage, setProgressStage] = React.useState<string>('');

  const [candidates, setCandidates] = React.useState<ParsedQuestionCandidate[]>([]);
  const [savedCount, setSavedCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setUploading(true);
    setCandidates([]);
    setError(null);

    // Simulate progress ticks
    setProgressStage('Uploading worksheet PDF to storage...');
    setProgressVal(15);
    await new Promise(r => setTimeout(r, 600));

    setProgressStage('Running OCR layout analysis...');
    setProgressVal(45);
    await new Promise(r => setTimeout(r, 800));

    setProgressStage('Running AI parsing, detecting questions, answers, and choices...');
    setProgressVal(75);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await parsePdfWorksheetAction(formData);
      if (res.success && Array.isArray(res.data)) {
        setProgressVal(100);
        setProgressStage('Parsing completed!');
        await new Promise(r => setTimeout(r, 300));
        setCandidates(res.data);
      } else {
        setError(res.error?.message || 'Failed to parse worksheet PDF.');
      }
    } catch (err) {
      setError('An unexpected error occurred during processing.');
    } finally {
      setUploading(false);
      setFile(null);
      setProgressVal(0);
    }
  };

  const handleCandidateChange = (
    index: number,
    field: keyof ParsedQuestionCandidate,
    value: any
  ) => {
    const updated = [...candidates];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setCandidates(updated);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...candidates];
    const opts = [...updated[qIdx].options];
    opts[oIdx] = val;
    updated[qIdx] = {
      ...updated[qIdx],
      options: opts,
    };
    setCandidates(updated);
  };

  const handleAddOption = (qIdx: number) => {
    const updated = [...candidates];
    updated[qIdx] = {
      ...updated[qIdx],
      options: [...updated[qIdx].options, 'New Option'],
    };
    setCandidates(updated);
  };

  const handleRemoveOption = (qIdx: number, oIdx: number) => {
    const updated = [...candidates];
    const optValue = updated[qIdx].options[oIdx];
    const opts = updated[qIdx].options.filter((_, idx) => idx !== oIdx);
    let correct = updated[qIdx].correctAnswer;
    if (correct === optValue) {
      correct = '';
    }
    updated[qIdx] = {
      ...updated[qIdx],
      options: opts,
      correctAnswer: correct,
    };
    setCandidates(updated);
  };

  const handleApprove = async (index: number) => {
    const candidate = candidates[index];
    if (!candidate.correctAnswer) {
      alert('Please specify a correct answer before approving.');
      return;
    }

    try {
      const res = await createQuestionAction({
        title: candidate.title,
        body: candidate.body,
        type: candidate.type as QuestionType,
        options: candidate.options,
        difficulty: 'MEDIUM' as QuestionDifficulty,
        topic: candidate.tags[0] || 'Number Theory',
        correctAnswer: candidate.correctAnswer,
        explanation: candidate.explanation,
        hint: candidate.hint,
        source: candidate.source,
        tags: candidate.tags,
      });

      if (res.success) {
        setSavedCount(prev => prev + 1);
        setCandidates(prev => prev.filter((_, idx) => idx !== index));
      } else {
        alert(res.error?.message || 'Failed to save question.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    }
  };

  const handleDiscard = (index: number) => {
    setCandidates(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/parent">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">AI PDF Worksheet Import</h1>
          <p className="text-neutral-500 text-sm">Upload worksheets to parse questions, choices, answers, and tags using Socratic AI.</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-100 bg-red-50 dark:border-red-950/20 dark:bg-red-950/20 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-red-700 dark:text-red-400 font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </Card>
      )}

      {candidates.length === 0 && !uploading && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm cursor-pointer transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
            >
              <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="application/pdf"
                  className="hidden"
                />
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileUp className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-heading">
                    {file ? file.name : 'Select or drop your PDF worksheet'}
                  </h3>
                  <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                    Supports scanned worksheets and searchable PDFs. Max file size is 15MB.
                  </p>
                </div>
                {file && (
                  <Badge className="bg-indigo-100 text-indigo-700 font-bold border-none rounded-full">
                    PDF Loaded
                  </Badge>
                )}
              </CardContent>
            </Card>

            {file && (
              <div className="flex justify-end">
                <Button
                  onClick={handleUploadSubmit}
                  className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm px-6 h-10 transition-transform active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Start AI Parsing
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4 text-xs sm:text-sm">
              <h3 className="text-base font-bold font-heading flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-5 w-5 text-amber-500" />
                AI Import Pipeline
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Worksheets are parsed safely using structured AI completions before committing to your database.
              </p>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-neutral-700 dark:text-neutral-200">Scanned OCR Support</span>
                    <span className="text-neutral-400">Processes image layers dynamically for scanned math sheets.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-neutral-700 dark:text-neutral-200">Uncertainty Audits</span>
                    <span className="text-neutral-400">Detects uncertain answers or options, highlighting inputs for verification.</span>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {uploading && (
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-8 text-center max-w-xl mx-auto space-y-6">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-heading">Processing Worksheet</h3>
            <p className="text-xs text-neutral-400 font-semibold">{progressStage}</p>
          </div>
          <div className="space-y-1 w-full">
            <Progress value={progressVal} className="h-2" />
            <span className="text-[10px] font-bold text-neutral-400">{progressVal}%</span>
          </div>
        </Card>
      )}

      {candidates.length > 0 && (
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm">
            <div>
              <span className="font-bold text-indigo-950 dark:text-indigo-200 block">AI Worksheet Review Panel</span>
              <span className="text-neutral-500 text-xs font-medium">Verify extracted math candidate questions. Approved items are saved to database.</span>
            </div>
            <div className="shrink-0 bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1.5 rounded-xl font-bold text-xs">
              {candidates.length} Questions Remaining
            </div>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {candidates.map((c, qIdx) => {
              const confPct = Math.round(c.confidenceScore * 100);
              const isUncertainAnswer = c.uncertainFields?.includes('correctAnswer');
              const isUncertainOptions = c.uncertainFields?.includes('options');

              return (
                <Card key={qIdx} className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                  <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 pb-4 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-bold font-heading">Candidate Question #{qIdx + 1}</CardTitle>
                      <CardDescription className="text-xs">{c.source || 'Unknown Worksheet Source'}</CardDescription>
                    </div>
                    <Badge className={`border-none rounded-full font-bold text-xs ${
                      c.confidenceScore >= 0.85
                        ? 'bg-emerald-100 text-emerald-700'
                        : c.confidenceScore >= 0.60
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {confPct}% Confidence
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Question Title</label>
                        <Input
                          value={c.title}
                          onChange={(e) => handleCandidateChange(qIdx, 'title', e.target.value)}
                          className="rounded-xl border-neutral-300 dark:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Olympiad Topic / Tags</label>
                        <Input
                          value={c.tags?.join(', ')}
                          onChange={(e) => handleCandidateChange(qIdx, 'tags', e.target.value.split(',').map(t => t.trim()))}
                          placeholder="e.g. Number Theory, Geometry"
                          className="rounded-xl border-neutral-300 dark:border-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500">Problem Body</label>
                      <textarea
                        value={c.body}
                        onChange={(e) => handleCandidateChange(qIdx, 'body', e.target.value)}
                        rows={2}
                        className="flex min-h-[60px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus-visible:outline-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Question Type</label>
                        <select
                          value={c.type}
                          onChange={(e) => handleCandidateChange(qIdx, 'type', e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm focus-visible:outline-none"
                        >
                          <option value="SHORT_ANSWER">Short Answer</option>
                          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        </select>
                      </div>

                      {c.type === 'SHORT_ANSWER' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
                            Correct Answer
                            {isUncertainAnswer && (
                              <Badge className="bg-amber-100 text-amber-700 font-bold border-none text-[9px] scale-95">Uncertain Field</Badge>
                            )}
                          </label>
                          <Input
                            value={c.correctAnswer}
                            onChange={(e) => handleCandidateChange(qIdx, 'correctAnswer', e.target.value)}
                            className={`rounded-xl ${
                              isUncertainAnswer
                                ? 'border-amber-400 focus-visible:ring-amber-500 focus-visible:border-amber-500'
                                : 'border-neutral-300 dark:border-neutral-700'
                            }`}
                          />
                          {isUncertainAnswer && (
                            <span className="text-[10px] font-semibold text-amber-600 block">
                              ⚠️ Conflicted text blocks found. Please verify the answer value manually.
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {c.type === 'MULTIPLE_CHOICE' && (
                      <div className={`p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 border space-y-3 ${
                        isUncertainOptions ? 'border-amber-400' : 'border-neutral-200/55 dark:border-neutral-800'
                      }`}>
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
                            Multiple Choice Options
                            {isUncertainOptions && (
                              <Badge className="bg-amber-100 text-amber-700 font-bold border-none text-[9px]">Check Choices</Badge>
                            )}
                          </label>
                          <Button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            size="sm"
                            variant="outline"
                            className="rounded-xl font-bold border-indigo-200 text-indigo-700 h-8 cursor-pointer text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Option
                          </Button>
                        </div>

                        {c.options?.length > 0 ? (
                          <div className="grid sm:grid-cols-2 gap-2">
                            {c.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-2 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => handleCandidateChange(qIdx, 'correctAnswer', opt)}
                                  className={`h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-all ${
                                    c.correctAnswer === opt
                                      ? 'border-emerald-600 bg-emerald-600 text-white'
                                      : 'border-neutral-300 dark:border-neutral-700 hover:border-indigo-600'
                                  }`}
                                >
                                  {c.correctAnswer === opt && <CheckCircle2 className="h-3 w-3" />}
                                </button>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                  className="h-8 border-none bg-transparent focus-visible:ring-0 px-1 font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(qIdx, oIdx)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic font-medium block">No options parsed. Click Add Option to add choices.</span>
                        )}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Socratic Coach Hint</label>
                        <textarea
                          value={c.hint || ''}
                          onChange={(e) => handleCandidateChange(qIdx, 'hint', e.target.value)}
                          rows={2}
                          className="flex min-h-[50px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus-visible:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Solution Explanation</label>
                        <textarea
                          value={c.explanation}
                          onChange={(e) => handleCandidateChange(qIdx, 'explanation', e.target.value)}
                          rows={2}
                          className="flex min-h-[50px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus-visible:outline-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 flex justify-end gap-3">
                    <Button
                      onClick={() => handleDiscard(qIdx)}
                      variant="ghost"
                      className="rounded-xl font-bold text-red-500 hover:text-red-700 cursor-pointer text-xs"
                    >
                      Discard
                    </Button>
                    <Button
                      onClick={() => handleApprove(qIdx)}
                      className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer text-xs"
                    >
                      <Save className="h-4 w-4 mr-2" /> Approve & Save
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {savedCount > 0 && candidates.length === 0 && (
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-8 text-center max-w-md mx-auto space-y-6">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-extrabold">Import Completed!</h3>
            <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
              Successfully approved and imported <span className="font-bold text-indigo-600">{savedCount}</span> questions into the MathOSN Question Bank.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setSavedCount(0);
                setFile(null);
              }}
              variant="outline"
              className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-100 cursor-pointer text-xs"
            >
              Import More
            </Button>
            <Link href="/parent/questions">
              <Button className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer text-xs">
                View Question Bank
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
