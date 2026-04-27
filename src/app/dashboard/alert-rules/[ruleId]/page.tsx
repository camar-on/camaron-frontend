import AlertRuleEditClient from "./AlertRuleEditClient";

export function generateStaticParams() {
  return [{ ruleId: "_" }];
}

export const dynamicParams = false;

export default function Page() {
  return <AlertRuleEditClient />;
}
