type FineInput = {
  baseFine: number;
  watts: number;
  repeatedOffenseCount: number;
};

export default function calculateFine({
  baseFine,
  watts,
  repeatedOffenseCount,
}: FineInput): number {
  const powerPenalty = Math.ceil(watts / 250) * 5;
  const repeatPenalty = repeatedOffenseCount * 15;
  return baseFine + powerPenalty + repeatPenalty;
}
