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
  void repeatedOffenseCount;
  return baseFine;
}
