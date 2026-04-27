import StoreMonitorClient from "./StoreMonitorClient";

export function generateStaticParams() {
  return [{ storeId: "_" }];
}

export const dynamicParams = false;

export default function Page() {
  return <StoreMonitorClient />;
}
