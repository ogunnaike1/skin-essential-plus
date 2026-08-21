import type { Metadata } from "next";
import { UnsubscribeClient } from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Unsubscribe | Skin Essential Plus",
  description: "Manage your Skin Essential Plus newsletter subscription.",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string };
}): React.ReactElement {
  return <UnsubscribeClient token={searchParams.token ?? null} />;
}
