import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, Brain, Award, ShieldAlert, BookOpen, Compass, LineChart, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80 transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Brain className="h-6 w-6" />
            </div>
            <span className="text-xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              MathOSN Coach
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <Link href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">What is it</Link>
            <Link href="#benefits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Benefits</Link>
            <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button className="rounded-full font-medium shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 mb-6">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Not a question bank. An AI Personal Mentor.
            </div>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] mb-6">
              Unlock Your Child's Math potential with a{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Socratic AI Coach
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Preparing for the Math Olympiad (OSN) doesn't have to be stressful. MathOSN Coach uses child-friendly Socratic dialogue to guide students to answers, building genuine mathematical curiosity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto rounded-full font-bold px-8 shadow-lg shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:translate-y-[-1px]">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="#about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-bold px-8 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      </section>

      {/* What is MathOSN Coach */}
      <section id="about" className="py-20 border-t border-neutral-200/50 bg-white dark:border-neutral-800/50 dark:bg-neutral-950 transition-colors">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading mb-6">
                Think Duolingo meets Khan Academy and ChatGPT.
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Traditional exam websites focus on scores, grades, and punishment for wrong answers. We believe in <strong>encouraging mathematical curiosity</strong>.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                When a student gets stuck on a complex OSN Olympiad problem, our AI Coach doesn't just hand over the solution. It asks guidance questions (the Socratic method) to nudge them in the right direction. It's like having a top-tier math mentor sitting next to them, 24/7.
              </p>
              <div className="flex gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Gamified Streaks</h4>
                    <p className="text-sm text-neutral-500">Keep daily engagement fun and rewarding.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Active Discovery</h4>
                    <p className="text-sm text-neutral-500">Learn concepts by solving, not just memorizing.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Socratic chat visual mockup */}
              <Card className="border-2 border-indigo-100 dark:border-indigo-950 shadow-xl rounded-3xl overflow-hidden">
                <div className="bg-indigo-600 text-white px-6 py-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">OSN AI Coach</p>
                    <p className="text-[10px] text-indigo-200">Active Math Mentor</p>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4 bg-neutral-50/50 dark:bg-neutral-900/50 text-sm">
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 max-w-[85%]">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Coach Avatar</span>
                    There are 5 red apples and 3 green apples. If we pick 2 apples at random, what is the probability that both are red?
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl rounded-tr-none border border-indigo-100/50 dark:border-indigo-900/30 max-w-[80%] ml-auto text-right">
                    <span className="font-bold text-neutral-500 block mb-1">Student</span>
                    Is it 5/8?
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 max-w-[85%]">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Coach Avatar</span>
                    Good try! 5/8 is the probability of picking <em>one</em> red apple first. When we pick the second one, how many red apples are left in the basket? And what is the total number of apples remaining?
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-neutral-100/50 dark:bg-neutral-900/30 transition-colors">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading mb-4">Why MathOSN Coach?</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Designed specifically for young minds to absorb complex Olympiad concepts through play and inquiry.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6 bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Comprehensive OSN Syllabus</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Tailored for elementary school OSN. Covers Number Theory, Geometry, Combinatorics, and Algebra with progressive modules suited for children.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6 bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">No Stress, Just Growth</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Incorrect answers trigger supportive Socratic loops, encouraging children to think again instead of feeling discouraged or "failed."
                </p>
              </CardContent>
            </Card>
            <Card className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6 bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Parent Portal Insights</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  No guesswork. Parents gain immediate visibility into concept weaknesses, streaks, and progress metrics with a dedicated admin portal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-neutral-200/50 bg-white dark:border-neutral-800/50 dark:bg-neutral-950 transition-colors">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading mb-4">Features Tailored For Success</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Everything needed to transition students from standard math to Olympiad championship levels.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20">
              <Cpu className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h4 className="font-bold mb-2">Decoupled OCR Engine</h4>
              <p className="text-xs text-neutral-500">Scan exam PDFs. Extract texts and complex math equations to load them into the coach system instantly.</p>
            </div>
            <div className="p-6 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20">
              <Compass className="h-8 w-8 text-amber-500 mb-4" />
              <h4 className="font-bold mb-2">Concept Mapping</h4>
              <p className="text-xs text-neutral-500">Interactive student dashboards representing key milestones, letting children track their progress routes visually.</p>
            </div>
            <div className="p-6 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20">
              <Sparkles className="h-8 w-8 text-indigo-500 mb-4" />
              <h4 className="font-bold mb-2">OpenAI-Powered Tutor</h4>
              <p className="text-xs text-neutral-500">Tailored system instructions focused strictly on primary-school pedagogy and encouraging responses.</p>
            </div>
            <div className="p-6 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20">
              <LineChart className="h-8 w-8 text-emerald-500 mb-4" />
              <h4 className="font-bold mb-2">Performance Analytics</h4>
              <p className="text-xs text-neutral-500">Understand exactly where your student stands in Number Theory vs. Combinatorics with detailed charts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-heading mb-6 max-w-2xl mx-auto">Ready to turn math struggles into math strengths?</h2>
          <p className="text-indigo-100 text-base sm:text-lg mb-10 max-w-xl mx-auto">
            Give your student the AI coach that makes solving Olympiad questions fun, intuitive, and highly encouraging.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 shadow-xl">
              Get Started Now
            </Button>
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/25 rounded-full blur-[80px] pointer-events-none -z-1" />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm text-neutral-500 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p>&copy; {new Date().getFullYear()} MathOSN Coach. Built with love for future Olympiad Champions.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
