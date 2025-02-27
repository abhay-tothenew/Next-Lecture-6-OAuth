import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CSSProperties } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (session) {
      setRedirecting(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session, router]);

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.card}>
          {redirecting ? (
            <div>
              <h1 style={styles.heading}>You&lsquo;re already logged in</h1>
              <p style={styles.text}>
                Redirecting you in{" "}
                <span style={styles.highlight}>{countdown}</span> seconds...
              </p>
            </div>
          ) : (
            <div>
              <h1 style={styles.heading}>Sign In</h1>
              <button onClick={() => signIn("google")} style={styles.button}>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "1rem",
  },
  highlight: {
    fontWeight: "bold",
    color: "#007bff",
  },
};
