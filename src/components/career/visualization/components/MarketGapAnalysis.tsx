
interface MarketGapAnalysisProps {
  viewType: 'overview' | 'specific';
  marketCrossoverPoint: {
    months: number;
    achieved: boolean;
  } | null;
}

export function MarketGapAnalysis({ viewType, marketCrossoverPoint }: MarketGapAnalysisProps) {
  if (viewType !== 'specific' || !marketCrossoverPoint) {
    return null;
  }

  return (
    <div className="mt-4 pt-2 border-t">
      <p className="text-sm">
        <span className="font-medium">Market Gap Analysis:</span>{' '}
        {marketCrossoverPoint.achieved ? (
          <span className="text-green-500">
            You will reach market demand in approximately {marketCrossoverPoint.months} month{marketCrossoverPoint.months !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-amber-500">
            You need to accelerate your learning to reach market demand within 6 months
          </span>
        )}
      </p>
    </div>
  );
}
