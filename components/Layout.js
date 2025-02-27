import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NextAuth Google Login</title>
        <meta name="description" content="NextAuth Google Login Example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
        {children}
      </main>
    </>
  );
}