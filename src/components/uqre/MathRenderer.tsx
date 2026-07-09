'use client';

import * as React from 'react';

// ─── FRACTION RENDERER ────────────────────────────────────────────────────────
interface FractionProps {
  numerator: string;
  denominator: string;
}

export const Fraction: React.FC<FractionProps> = ({ numerator, denominator }) => {
  return (
    <span 
      className="inline-flex flex-col items-center justify-center align-middle mx-0.5 leading-none"
      style={{ fontSize: '0.9em' }}
      aria-label={`${numerator} over ${denominator}`}
    >
      <span className="pb-0.5 border-b border-neutral-700 dark:border-neutral-300 px-0.5 text-center">{numerator}</span>
      <span className="pt-0.5 text-center">{denominator}</span>
    </span>
  );
};

// ─── MATH SYMBOL RENDERER ────────────────────────────────────────────────────
interface MathSymbolProps {
  symbol: string;
}

const SYMBOL_MAP: Record<string, string> = {
  '\\times': '×',
  '\\div': '÷',
  '\\pm': '±',
  '\\le': '≤',
  '\\ge': '≥',
  '\\neq': '≠',
  '\\approx': '≈',
  '\\pi': 'π',
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\theta': 'θ',
  '\\sqrt': '√',
  '\\cdot': '·',
  '\\degree': '°',
};

export const MathSymbol: React.FC<MathSymbolProps> = ({ symbol }) => {
  const display = SYMBOL_MAP[symbol] || symbol.replace(/\\/g, '');
  return <span className="font-serif italic mx-0.5" aria-hidden="true">{display}</span>;
};

// ─── INLINE FORMULA ──────────────────────────────────────────────────────────
interface InlineFormulaProps {
  formula: string;
}

export const InlineFormula: React.FC<InlineFormulaProps> = ({ formula }) => {
  // Simple LaTeX parser for typical Elementary OSN formulas
  // e.g. \frac{a}{b}, x^2, x_n, \sqrt{y}, \times, \pi
  const parsedElements = React.useMemo(() => {
    const elements: React.ReactNode[] = [];
    let currentText = formula;
    let keyIndex = 0;

    while (currentText.length > 0) {
      // 1. Parse fraction: \frac{num}{den}
      const fracMatch = currentText.match(/^\\frac\{([^}]+)\}\{([^}]+)\}/);
      if (fracMatch) {
        elements.push(
          <Fraction 
            key={`frac-${keyIndex++}`} 
            numerator={fracMatch[1]} 
            denominator={fracMatch[2]} 
          />
        );
        currentText = currentText.slice(fracMatch[0].length);
        continue;
      }

      // 2. Parse square root: \sqrt{val}
      const rootMatch = currentText.match(/^\\sqrt\{([^}]+)\}/);
      if (rootMatch) {
        elements.push(
          <span key={`root-${keyIndex++}`} className="inline-flex items-center mx-0.5">
            <span className="font-serif leading-none mr-0.5" style={{ transform: 'scale(1.2, 1)' }}>√</span>
            <span className="border-t border-neutral-700 dark:border-neutral-300 pt-0.5 px-0.5 leading-none">
              {rootMatch[1]}
            </span>
          </span>
        );
        currentText = currentText.slice(rootMatch[0].length);
        continue;
      }

      // 3. Parse power index: a^b or a^{bc}
      const powMatch = currentText.match(/^([a-zA-Z0-9]+)\^\{([^}]+)\}/) || currentText.match(/^([a-zA-Z0-9]+)\^([a-zA-Z0-9])/);
      if (powMatch) {
        elements.push(
          <span key={`pow-${keyIndex++}`} className="inline-flex items-baseline">
            <span>{powMatch[1]}</span>
            <sup className="text-[0.7em] leading-none select-none align-super pl-0.5">{powMatch[2]}</sup>
          </span>
        );
        currentText = currentText.slice(powMatch[0].length);
        continue;
      }

      // 4. Parse subscript: a_b or a_{bc}
      const subMatch = currentText.match(/^([a-zA-Z0-9]+)_\{([^}]+)\}/) || currentText.match(/^([a-zA-Z0-9]+)_([a-zA-Z0-9])/);
      if (subMatch) {
        elements.push(
          <span key={`sub-${keyIndex++}`} className="inline-flex items-baseline">
            <span>{subMatch[1]}</span>
            <sub className="text-[0.7em] leading-none select-none align-sub pl-0.5">{subMatch[2]}</sub>
          </span>
        );
        currentText = currentText.slice(subMatch[0].length);
        continue;
      }

      // 5. Parse command symbols (e.g. \times, \pi)
      const symMatch = currentText.match(/^(\\[a-zA-Z]+)/);
      if (symMatch && SYMBOL_MAP[symMatch[1]]) {
        elements.push(<MathSymbol key={`sym-${keyIndex++}`} symbol={symMatch[1]} />);
        currentText = currentText.slice(symMatch[0].length);
        continue;
      }

      // 6. Default char-by-char collection
      const nextChar = currentText[0];
      elements.push(
        <span key={`char-${keyIndex++}`} className={/[a-zA-Z]/.test(nextChar) ? "font-serif italic" : ""}>
          {nextChar}
        </span>
      );
      currentText = currentText.slice(1);
    }

    return elements;
  }, [formula]);

  return (
    <code 
      className="bg-neutral-100/50 dark:bg-neutral-850 px-1 py-0.5 rounded font-mono text-[0.9em] leading-relaxed mx-0.5 align-middle select-all border border-neutral-200/35 dark:border-neutral-800/35"
      role="math"
      aria-label={`Mathematical expression: ${formula}`}
    >
      {parsedElements}
    </code>
  );
};

// ─── DISPLAY FORMULA ─────────────────────────────────────────────────────────
interface DisplayFormulaProps {
  formula: string;
}

export const DisplayFormula: React.FC<DisplayFormulaProps> = ({ formula }) => {
  return (
    <div 
      className="my-4 py-3 px-6 overflow-x-auto text-center border-y border-neutral-205 dark:border-neutral-805 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-2xl flex items-center justify-center"
      role="blockquote"
    >
      <InlineFormula formula={formula} />
    </div>
  );
};

// ─── MAIN MATHEMATICAL EXPRESSION ROUTER ─────────────────────────────────────
interface MathExpressionProps {
  text: string;
}

export const MathExpression: React.FC<MathExpressionProps> = ({ text }) => {
  // Parse content dynamically for LaTeX blocks $...$ or $$...$$
  const renderTextBlocks = React.useMemo(() => {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        return <DisplayFormula key={`block-${index}`} formula={formula} />;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1).trim();
        return <InlineFormula key={`inline-${index}`} formula={formula} />;
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  }, [text]);

  return <>{renderTextBlocks}</>;
};
