import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  text: {
    fontSize: "1.25rem",
  },
};

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <Layout>
      <div style={styles.container}>
        <p style={styles.text}>Redirecting...</p>
      </div>
    </Layout>
  );
}
