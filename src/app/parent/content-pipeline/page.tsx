'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { pipeline } from '@/infrastructure/services/cip/PipelineOrchestrator';
import { ReviewWorkflowService } from '@/infrastructure/services/cip/ReviewWorkflowService';
import { contentRepository } from '@/infrastructure/services/cip/ContentRepository';
import {
  Upload, RefreshCw, CheckCircle2, XCircle, AlertCircle,
  Clock, ChevronRight, FileText, Eye, BarChart3, Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const reviewService = new ReviewWorkflowService();

const STATUS_CONFIG = {
  COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  RUNNING: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
  PARTIAL: { label: 'Partial', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
  QUEUED: { label: 'Queued', color: 'bg-neutral-100 text-neutral-600', icon: Clock },
  PAUSED: { label: 'Paused', color: 'bg-violet-100 text-violet-700', icon: Clock },
};

const QUALITY_GRADE_COLOR = { A: 'text-emerald-600', B: 'text-blue-600', C: 'text-amber-600', D: 'text-orange-600', F: 'text-red-600' };

const PIPELINE_STAGES = [
  'FILE_VALIDATION', 'OCR_EXTRACTION', 'QUESTION_SEGMENTATION', 'MATH_NORMALIZATION',
  'DIAGRAM_DETECTION', 'FORMULA_DETECTION', 'CONCEPT_MAPPING', 'SKILL_MAPPING',
  'DIFFICULTY_ANALYSIS', 'MISCONCEPTION_TAGGING', 'AI_VALIDATION',
  'CONFIDENCE_SCORING', 'QUALITY_SCORING', 'DUPLICATE_DETECTION', 'CONTENT_ENRICHMENT',
];

export default function ContentPipelinePage() {
  const [jobs, setJobs] = React.useState<Awaited<ReturnType<typeof pipeline.listJobs>>>([]);
  const [metrics, setMetrics] = React.useState(pipeline.getMetrics());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sampleText, setSampleText] = React.useState(
    '1. Berapa banyak faktor dari 360?\nA. 24\nB. 18\nC. 12\nJawaban: A\nPenjelasan: 360 = 2^3 × 3^2 × 5, jumlah faktor = (3+1)(2+1)(1+1) = 24.'
  );

  const refresh = React.useCallback(async () => {
    const data = await pipeline.listJobs({ limit: 20 });
    setJobs(data);
    setMetrics(pipeline.getMetrics());
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await pipeline.submit({
        id: `src_${Date.now()}`,
        type: 'MANUAL_INPUT',
        uploadedBy: 'admin',
        uploadedAt: new Date(),
        rawContent: sampleText,
        fileName: 'manual-input.txt',
        fileSizeBytes: sampleText.length,
      });
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    reviewService.approve(jobId, 'admin', 'Looks good!');
    await refresh();
  };

  const handleReject = async (jobId: string) => {
    reviewService.reject(jobId, 'admin', 'Content quality insufficient.');
    await refresh();
  };

  const pendingReviews = reviewService.listPendingReviews();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Content Intelligence Platform</h1>
          <p className="text-neutral-500 text-sm mt-1">Every question must pass through this pipeline before reaching students.</p>
        </div>
        <Button onClick={refresh} variant="outline" size="sm" className="gap-2 rounded-xl">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Layers, label: 'Total Jobs', value: metrics.totalJobs, color: 'text-indigo-600 bg-indigo-500/10' },
          { icon: CheckCircle2, label: 'Success Rate', value: `${Math.round(metrics.successRate * 100)}%`, color: 'text-emerald-600 bg-emerald-500/10' },
          { icon: Clock, label: 'Avg Latency', value: `${Math.round(metrics.avgLatencyMs)}ms`, color: 'text-amber-600 bg-amber-500/10' },
          { icon: Eye, label: 'Pending Review', value: pendingReviews.length, color: 'text-violet-600 bg-violet-500/10' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-bold">{label}</p>
                <h4 className="text-sm font-extrabold font-heading">{value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submit Panel */}
        <div className="lg:col-span-1">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden h-full">
            <CardHeader className="pb-4 border-b border-neutral-100 dark:border-neutral-850">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <Upload className="h-4 w-4 text-indigo-600" /> Submit Content
              </CardTitle>
              <CardDescription className="text-xs">Enter question text to run through the full pipeline.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                rows={8}
                className="w-full text-xs rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-3 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
                placeholder="Paste question text here..."
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !sampleText.trim()}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Run Pipeline</>
                )}
              </Button>

              {/* Pipeline stage legend */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Pipeline Stages</p>
                <div className="grid grid-cols-1 gap-1">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2 text-[10px] text-neutral-500">
                      <span className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-500 shrink-0">{i + 1}</span>
                      <span>{stage.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-neutral-100 dark:border-neutral-850">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" /> Pipeline Jobs
              </CardTitle>
              <CardDescription className="text-xs">{jobs.length} jobs processed. Completed jobs await admin review.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No pipeline jobs yet</p>
                  <p className="text-xs mt-1">Submit content using the form to get started.</p>
                </div>
              ) : (
                jobs.map((job) => {
                  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.QUEUED;
                  const StatusIcon = cfg.icon;
                  const completedStages = job.stages.filter((s) => s.status === 'COMPLETED').length;
                  const progress = Math.round((completedStages / PIPELINE_STAGES.length) * 100);
                  const review = contentRepository.getReviewRecord(job.id);
                  const quality = job.qualityScore;

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 space-y-3 bg-neutral-50/40 dark:bg-neutral-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${job.status === 'RUNNING' ? 'animate-spin' : ''} ${cfg.color.split(' ')[1]}`} />
                          <span className="text-xs font-mono text-neutral-400">{job.id.slice(0, 20)}...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {quality && (
                            <span className={`text-xs font-extrabold ${QUALITY_GRADE_COLOR[quality.grade]}`}>
                              Grade {quality.grade} ({quality.total}/100)
                            </span>
                          )}
                          <Badge className={`text-[9px] font-bold border-none px-2 py-0.5 ${cfg.color}`}>
                            {cfg.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Stage progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-400">
                          <span>{completedStages}/{PIPELINE_STAGES.length} stages</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Questions extracted */}
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500">
                        <span>{job.extractedQuestions.length} questions extracted</span>
                        {job.duplicateMatches && job.duplicateMatches.length > 0 && (
                          <span className="text-amber-500 font-bold">{job.duplicateMatches.length} duplicate(s)</span>
                        )}
                        {job.totalLatencyMs && <span>{job.totalLatencyMs}ms</span>}
                      </div>

                      {/* Review actions */}
                      {job.status === 'COMPLETED' && !review && (
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(job.id)}
                            className="h-7 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(job.id)}
                            className="h-7 text-[11px] rounded-lg border-red-200 text-red-600 hover:bg-red-50 font-bold gap-1"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      )}
                      {review && (
                        <div className={`text-[10px] font-bold px-2 py-1 rounded-lg inline-flex items-center gap-1 ${
                          review.decision === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {review.decision === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          Review: {review.decision}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
