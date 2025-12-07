import PeriodPainCalculatorClient from "./period-pain-calculator-client";

export default async function PeriodPainImpactCalculatorPageSimple() {
  return <PeriodPainCalculatorClient params={{ locale: "zh" }} />;
}
