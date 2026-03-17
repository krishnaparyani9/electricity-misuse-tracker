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
  void watts;
  const escalationSteps = Math.floor(repeatedOffenseCount / 10);
  return baseFine + escalationSteps * 5;
}
