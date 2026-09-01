import type { RequestSummary } from "./types";

/**
 * The bank cell of a request row. Names come from the request's bank feedback,
 * or from its detail record while it is still a draft; either can be empty
 * while loading, in which case the cell reads as unknown rather than "none".
 */
export default function BankNames({
  request,
  banksUnit,
}: {
  request: RequestSummary;
  banksUnit: string;
}) {
  const [first, ...rest] = request.bankNames;

  if (!first) return <>—</>;
  if (rest.length === 0) return <>{first}</>;

  return (
    <span title={request.bankNames.join("، ")}>
      {first} +{rest.length} {banksUnit}
    </span>
  );
}
