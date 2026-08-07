import { useEffect, useState } from "react";
import App from "./App.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { supabase } from "./lib/supabase.js";

function AuthGate() {
  const [session, setSession] = useState(null);

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  const [sessionError, setSessionError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          setSessionError(error.message);
        }

        setSession(data.session);
        setIsCheckingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) {
          return;
        }

        setSession(nextSession);
        setIsCheckingSession(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setSessionError("");

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      setSessionError(error.message);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="auth-loading">
            Checking your session...
          </p>
        </section>
      </main>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <>
      <div className="account-bar">
        <span>
          Signed in as{" "}
          <strong>{session.user.email}</strong>
        </span>

        <button
          type="button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      {sessionError && (
        <p
          className="session-error"
          role="alert"
        >
          {sessionError}
        </p>
      )}

      <App user={session.user} />
    </>
  );
}

export default AuthGate;