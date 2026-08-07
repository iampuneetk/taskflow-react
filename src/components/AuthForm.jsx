import { useState } from "react";
import { supabase } from "../lib/supabase.js";

function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setMessage(
            "Account created. Please check your email before logging in."
          );
        }
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode() {
    setMode((currentMode) =>
      currentMode === "login" ? "signup" : "login"
    );

    setMessage("");
    setPassword("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <h1>TaskFlow</h1>

          <p>
            {isLogin
              ? "Log in to access your tasks."
              : "Create an account to save tasks permanently."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="auth-email">Email address</label>

            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-password">Password</label>

            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete={
                isLogin
                  ? "current-password"
                  : "new-password"
              }
              minLength={6}
              required
            />
          </div>

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isLogin
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin
              ? "New to TaskFlow?"
              : "Already have an account?"}
          </span>

          <button type="button" onClick={changeMode}>
            {isLogin ? "Create account" : "Log in"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default AuthForm;