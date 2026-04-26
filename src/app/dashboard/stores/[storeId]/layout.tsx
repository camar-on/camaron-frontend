export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function StoreIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
