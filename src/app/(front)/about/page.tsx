import Link from "next/link";
import AppLoading from "../components/app-loading";
import { Suspense } from "react";
import { getVersion } from "@/services/version-service";

async function ApiVersion() {
  const version = await getVersion();

  return <p>API Version: {version.version}</p>;
}

// http://localhost:3000/about
export default function AboutPage() {
  return (
    <main>
      <Suspense fallback={ <AppLoading /> }>
        <ApiVersion />
      </Suspense>     
      <hr />
      <Link href="/" className="underline">
        Home Page
      </Link>
    </main>
  );
}