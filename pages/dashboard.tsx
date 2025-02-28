import { useSession, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Session } from 'next-auth';



interface ServerSideProps {
    session: Session | null;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<ServerSideProps>> {
    const session = await getSession(context);
    // console.log("session", session);
    
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    
    return {
        props: { session },
    };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6" }}>
          <p style={{ fontSize: "18px", color: "#555" }}>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Dashboard</h1>
              {session?.user && <p style={{ color: "#555" }}>Welcome, {session.user.name || session.user.email}</p>}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.background = styles.buttonHover.background)}
              onMouseOut={(e) => (e.currentTarget.style.background = styles.button.background)}
            >
              Logout
            </button>
          </div>
          
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#444", marginBottom: "16px" }}>User List</h2>
          <div>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#222" }}>{user.name}</h3>
                <p style={{ color: "#666", marginBottom: "4px" }}>@{user.username}</p>
                <div style={{ fontSize: "14px", color: "#444" }}>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Website:</strong> {user.website}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px",
    },
    card: {
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      padding: "20px",
      marginBottom: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #ddd",
      paddingBottom: "16px",
      marginBottom: "16px",
    },
    button: {
      background: "#e53e3e",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonHover: {
      background: "#c53030",
    },
    userCard: {
      background: "#f9f9f9",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
      marginBottom: "12px",
    },
  };
  
