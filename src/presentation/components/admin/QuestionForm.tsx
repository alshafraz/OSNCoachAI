'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createQuestionAction, updateQuestionAction } from '../../actions/questionActions';
import { ImageUploadZone } from './ImageUploadZone';
import { Loader2, Plus, Trash, Check } from 'lucide-react';
import { Question, QuestionDifficulty, QuestionType } from '@/domain/entities/Question';

interface QuestionFormProps {
  question?: Question;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QuestionForm({ question, onSuccess, onCancel }: QuestionFormProps) {
  const anonymityCheck = question?.id;
  const isEdit = !!anonymityCheck;

  const [title, setTitle] = React.useState(question?.title || '');
  const [body, setBody] = React.useState(question?.body || '');
  const [type, setType] = React.useState<QuestionType>(question?.type || 'SHORT_ANSWER');
  const [options, setOptions] = React.useState<string[]>(question?.options || []);
  const [correctAnswer, setCorrectAnswer] = React.useState(question?.correctAnswer || '');
  const [difficulty, setDifficulty] = React.useState<QuestionDifficulty>(question?.difficulty || 'MEDIUM');
  const [topic, setTopic] = React.useState(question?.topic || 'Number Theory');
  const [explanation, setExplanation] = React.useState(question?.explanation || '');
  const [hint, setHint] = React.useState(question?.hint || '');
  const [source, setSource] = React.useState(question?.source || '');
  const [tagsInput, setTagsInput] = React.useState(question?.tags?.join(', ') || '');
  const [imageUrl, setImageUrl] = React.useState(question?.imageUrl || '');

  const [newOption, setNewOption] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const optValue = options[index];
    setOptions(options.filter((_, idx) => idx !== index));
    if (correctAnswer === optValue) {
      setCorrectAnswer('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const data = {
      title,
      body,
      type,
      options,
      imageUrl: imageUrl || undefined,
      difficulty,
      topic,
      correctAnswer,
      explanation,
      hint: hint || undefined,
      source: source || undefined,
      tags,
    };

    try {
      const res = isEdit
        ? await updateQuestionAction(question!.id, data)
        : await createQuestionAction(data);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error?.message || 'Failed to save question.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {error && (
        <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-700 dark:border-red-950/20 dark:bg-red-950/20 dark:text-red-400 font-semibold text-xs">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Question Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Divisibility Secrets"
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Olympiad Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex h-9 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-sm focus-visible:outline-none"
          >
            <option value="Number Theory">Number Theory</option>
            <option value="Geometry">Geometry</option>
            <option value="Combinatorics">Combinatorics</option>
            <option value="Algebra">Algebra</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Question Content / Problem Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          placeholder="State the mathematical problem detail..."
          className="flex min-h-[80px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-2 text-sm focus-visible:outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
            className="flex h-9 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-sm focus-visible:outline-none"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as QuestionType);
              setCorrectAnswer('');
            }}
            className="flex h-9 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-sm focus-visible:outline-none"
          >
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Source Exam (Optional)</label>
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. OSN Elementary 2024"
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
          />
        </div>
      </div>

      {type === 'MULTIPLE_CHOICE' && (
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200/55 dark:border-neutral-800/80 space-y-3">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Multiple Choice Options</label>
          
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add choice option..."
              className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
            />
            <Button
              type="button"
              onClick={handleAddOption}
              className="rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer h-9 shrink-0 animate-in fade-in-20 duration-100"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {options.length > 0 ? (
            <div className="space-y-2 pt-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(opt)}
                      className={`h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-all ${
                        correctAnswer === opt
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-indigo-600'
                      }`}
                    >
                      {correctAnswer === opt && <Check className="h-3 w-3" />}
                    </button>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">{opt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer shrink-0"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <span className="text-[10px] text-neutral-400 font-bold block pt-1">
                * Click the circular radio buttons to select the correct choice option.
              </span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400 font-medium block italic pt-2">No options added yet. Add choices above.</span>
          )}
        </div>
      )}

      {type === 'SHORT_ANSWER' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Correct Value / Answer</label>
          <Input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            placeholder="e.g. 28, 110, or 6"
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
          />
        </div>
      )}

      <ImageUploadZone initialUrl={imageUrl} onUploadComplete={setImageUrl} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Socratic Coach Hint (Optional)</label>
          <textarea
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            rows={2}
            placeholder="Pedagogical hint guiding student reasoning..."
            className="flex min-h-[60px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-2 text-sm focus-visible:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Rich Text Solution Explanation</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
            rows={2}
            placeholder="Explain mathematical reasoning step-by-step..."
            className="flex min-h-[60px] w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-2 text-sm focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Tags (Comma-separated)</label>
        <Input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. divisibility, prime-factors, angles"
          className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 px-5 cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Save Question'
          )}
        </Button>
      </div>
    </form>
  );
}
