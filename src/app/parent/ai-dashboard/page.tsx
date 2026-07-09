'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentRegistry } from '@/infrastructure/services/ai/AgentRegistry';
import { PromptRegistry } from '@/infrastructure/services/ai/PromptRegistry';
import { WorkflowEngine } from '@/infrastructure/services/ai/WorkflowEngine';
import { getTokensUsageStatistics } from '@/infrastructure/services/ai/LlmProviderRegistry';
import { Cpu, Terminal, DollarSign, Activity, AlertCircle, Play, Layers } from 'lucide-react';

export default function AiDashboardPlayground() {
  const [selectedAgent, setSelectedAgent] = React.useState('QuestionExtractionAgent');
  const [promptInput, setPromptInput] = React.useState('Calculate: 12 + 18.');
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const agents = AgentRegistry.listAgents();
  const activeAgent = AgentRegistry.getAgent(selectedAgent);
  const activePrompt = PromptRegistry.getPrompt(activeAgent.promptId, activeAgent.promptVersion);

  const stats = getTokensUsageStatistics();

  const handleTestRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const vars: Record<string, string> = {};
      if (activePrompt.variables.includes('rawText')) {
        vars['rawText'] = promptInput;
      }
      if (activePrompt.variables.includes('questionBody')) {
        vars['questionBody'] = promptInput;
      }
      if (activePrompt.variables.includes('studentAnswer')) {
        vars['questionBody'] = promptInput;
        vars['studentAnswer'] = '10';
      }

      const res = await WorkflowEngine.runAgent(selectedAgent, vars);
      setResult(res);
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 text-xs sm:text-sm font-semibold animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">AI Control Center & Playground</h1>
        <p className="text-neutral-500 text-sm">Observe multi-agent topologies, cost metrics, and test prompt templates.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4">
          <CardContent className="p-0 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-600">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-bold">Agents Configured</p>
              <h4 className="text-sm font-extrabold font-heading text-neutral-800 dark:text-neutral-250">{agents.length} Agents</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4">
          <CardContent className="p-0 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-bold">Daily Cost Estimate</p>
              <h4 className="text-sm font-extrabold font-heading text-neutral-800 dark:text-neutral-250">${stats.totalCost.toFixed(5)}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4">
          <CardContent className="p-0 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-violet-500/10 text-violet-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-bold">Total Platform Calls</p>
              <h4 className="text-sm font-extrabold font-heading text-neutral-800 dark:text-neutral-250">{stats.totalCalls} Calls</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4">
          <CardContent className="p-0 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-bold">Avg Cost Per Call</p>
              <h4 className="text-sm font-extrabold font-heading text-neutral-800 dark:text-neutral-250">${stats.averageCostPerCall.toFixed(5)}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                Multi-Agent Systems
              </CardTitle>
              <CardDescription className="text-xs">Select agent node to audit properties.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2 max-h-[450px] overflow-y-auto">
              {agents.map((ag) => (
                <button
                  key={ag.name}
                  onClick={() => {
                    setSelectedAgent(ag.name);
                    setResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all text-xs font-semibold cursor-pointer ${
                    selectedAgent === ag.name
                      ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400 font-bold'
                      : 'border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-855'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{ag.name}</span>
                    <Badge className="bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-500 text-[8px] font-extrabold uppercase px-1.5 py-0.5">
                      {ag.preferredModel}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-neutral-450 line-clamp-1 leading-tight">{ag.description}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-600 animate-pulse" />
                Prompt Playground & Templates Check
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect agent role configurations, templates variables, and schema rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/40 dark:bg-neutral-950/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Prompt ID: {activeAgent.promptId}</span>
                  <Badge className="bg-indigo-100 text-indigo-700 font-bold border-none text-[9px]">
                    Version: {activeAgent.promptVersion}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">System Instructions</span>
                  <div className="text-xs text-neutral-600 dark:text-neutral-350 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 p-2.5 rounded-xl max-h-24 overflow-y-auto italic font-medium leading-relaxed">
                    {activePrompt.systemTemplate}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">User Prompt Template</span>
                  <div className="text-xs text-neutral-600 dark:text-neutral-350 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 p-2.5 rounded-xl max-h-24 overflow-y-auto italic font-medium leading-relaxed">
                    {activePrompt.userTemplate}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500">Test Input Variables (e.g. Worksheet Content / Question Text)</label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter custom input text to compile variables..."
                  className="w-full h-24 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-3.5 py-2.5 text-xs focus-visible:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleTestRun}
                  disabled={loading}
                  className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-5 h-10 transition-transform active:scale-95"
                >
                  {loading ? 'Running Agent...' : 'Execute Test Run'}
                </Button>
              </div>

              {result && (
                <div className="border border-border rounded-2xl overflow-hidden text-xs">
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-3 border-b border-border flex justify-between items-center font-bold">
                    <span>Execution Result</span>
                    <Badge className={result.success ? 'bg-emerald-100 text-emerald-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                      {result.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3 bg-neutral-50/20 dark:bg-neutral-900/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-bold text-neutral-450 uppercase">
                      <div>
                        <span>Latency</span>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">{result.latencyMs} ms</p>
                      </div>
                      <div>
                        <span>Tokens</span>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">
                          {result.tokensUsed?.total || 0} ({result.tokensUsed?.prompt} / {result.tokensUsed?.completion})
                        </p>
                      </div>
                      <div>
                        <span>Confidence</span>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">{result.confidenceScore * 100}%</p>
                      </div>
                      <div>
                        <span>Provider Node</span>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">{result.provider} ({result.model})</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Structured Output JSON</span>
                      <pre className="bg-neutral-950 text-emerald-400 p-3.5 rounded-xl overflow-x-auto max-h-60 text-[11px] leading-relaxed font-mono">
                        {JSON.stringify(result.data || result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
