"use client";

import { useActionState } from "react";
import { loginWithPassword, sendMagicLink } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/admin/submit-button";

const initialState = { error: "", success: "" };

export function LoginForm() {
  const [passwordState, passwordAction] = useActionState(loginWithPassword, initialState);
  const [magicState, magicAction] = useActionState(sendMagicLink, initialState);

  return (
    <div className="admin-login__forms">
      <form action={passwordAction} className="card admin-form stack-md">
        <div>
          <p className="eyebrow">Password login</p>
          <h2>Email and password</h2>
        </div>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" required autoComplete="current-password" />
        </label>

        {passwordState.error ? <p className="form-message form-message--error">{passwordState.error}</p> : null}
        <SubmitButton label="Sign in" pendingLabel="Signing in..." />
      </form>

      <form action={magicAction} className="card admin-form stack-md">
        <div>
          <p className="eyebrow">Magic link</p>
          <h2>Email sign-in link</h2>
        </div>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>

        {magicState.error ? <p className="form-message form-message--error">{magicState.error}</p> : null}
        {magicState.success ? <p className="form-message form-message--success">{magicState.success}</p> : null}
        <SubmitButton label="Send magic link" pendingLabel="Sending..." />
      </form>
    </div>
  );
}
