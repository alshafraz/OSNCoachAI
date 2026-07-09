'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { submitAnswerAction, getNextQuestionAction } from '../../actions/questionActions';
import { Brain, Sparkles, Flame, CheckCircle, Loader2, ArrowLeft, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface QuestionData {
  id: string;
  title: string;
  body: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  explanation: string;
}

export function PracticeWorkspace() {
  const [question, setQuestion] = React.useState<QuestionData | null>(null);
  const [answer, setAnswer] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  
  // Coach states
  const [coachMood, setCoachMood] = React.useState<'welcome' | 'thinking' | 'hinting' | 'happy'>('welcome');
  const [coachSpeech, setCoachSpeech] = React.useState(
    "Hello! I am your MathOSN Coach. Let's tackle this mathematical puzzle together. Read the problem on the left and type your answer in the box below!"
  );
  
  const [solved, setSolved] = React.useState(false);
  const [showExpl, setShowExpl] = React.useState(false);

  // Load initial question
  React.useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    setLoading(true);
    setAnswer('');
    setSolved(false);
    setShowExpl(false);
    setCoachMood('welcome');
    
    const res = await getNextQuestionAction();
    if (res.success && res.data) {
      setQuestion(res.data);
      setCoachSpeech(`Ready for a new puzzle? Let's check out "${res.data.title}". What concepts do you think we need here?`);
    } else {
      setCoachSpeech("Oh dear, I couldn't load a question. Please make sure the server is running!");
    }
    setLoading(false);
  };

  const handleSubmitting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer.trim()) return;

    setSubmitting(true);
    setCoachMood('thinking');
    setCoachSpeech("Hmm, let me look at your calculation...");

    const res = await submitAnswerAction(question.id, answer);

    if (res.success && res.data) {
      const { isCorrect, hint } = res.data;
      if (isCorrect) {
        setSolved(true);
        setCoachMood('happy');
        setCoachSpeech("Amazing work! That is absolutely correct! You've earned 10 XP points. Keep it up!");
        // Sparkle Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setCoachMood('hinting');
        setCoachSpeech(hint || "Nice attempt, but that's not quite correct. Let's double check your steps!");
      }
    } else {
      setCoachSpeech("Oops, something went wrong when checking your answer. Let's try again.");
      setCoachMood('welcome');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-neutral-500 font-medium text-sm">Preparing your Math OSN Coach workspace...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Brain className="h-10 w-10 text-red-500" />
        <p className="text-neutral-500">Failed to load math workspace.</p>
        <Button onClick={loadQuestion}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Workspace Header */}
      <div className="flex justify-between items-center">
        <Link href="/student">
          <Button variant="ghost" className="rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-none font-bold">
            {question.topic}
          </Badge>
          <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-none font-bold">
            {question.difficulty}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Panel: Question Box */}
        <div className="md:col-span-3">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm h-full flex flex-col justify-between overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Olympiad Question</span>
              <CardTitle className="text-xl font-bold font-heading mt-1">{question.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed font-medium">
                {question.body}
              </p>
            </CardContent>
            <CardFooter className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-6">
              <form onSubmit={handleSubmitting} className="w-full flex gap-3">
                <Input
                  placeholder="Enter your final answer here"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={submitting || solved}
                  required
                  className="rounded-xl flex-1 bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 focus-visible:ring-indigo-600"
                />
                <Button
                  type="submit"
                  disabled={submitting || solved}
                  className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer shrink-0"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Answer"}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel: Coach Panel */}
        <div className="md:col-span-2">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              {/* Coach Header / Avatar */}
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                  coachMood === 'happy' ? 'bg-emerald-500 scale-105' :
                  coachMood === 'hinting' ? 'bg-amber-500 scale-100' :
                  coachMood === 'thinking' ? 'bg-indigo-500 animate-pulse' :
                  'bg-indigo-600'
                }`}>
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm font-heading">AI Socratic Coach</h4>
                  <p className="text-[10px] text-neutral-400">Pedagogical Mentor</p>
                </div>
              </div>

              {/* Coach Dialogue bubble */}
              <div className="relative p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                {coachSpeech}
              </div>
            </div>

            {/* Coach Actions */}
            <div className="space-y-2 pt-4">
              {solved && (
                <Dialog open={showExpl} onOpenChange={setShowExpl}>
                  <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold border border-indigo-200 text-indigo-700 bg-transparent shadow-sm hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950/40 h-9 px-4 py-2 w-full cursor-pointer">
                    <BookOpen className="h-4 w-4 mr-2" /> View Explanation
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-lg bg-white dark:bg-neutral-950 p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-heading text-indigo-600 dark:text-indigo-400">
                        Step-by-step Solution
                      </DialogTitle>
                      <DialogDescription className="text-xs text-neutral-400">
                        Study the mathematical reasoning behind the answer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {question.explanation}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {solved && (
                <Button onClick={loadQuestion} className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                  Next Question <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {!solved && coachMood === 'hinting' && (
                <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 text-[11px] font-semibold text-amber-700 dark:text-amber-400 rounded-xl">
                  <Lightbulb className="h-4 w-4 shrink-0" />
                  <span>Try rewriting your equation or drawing a picture!</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
