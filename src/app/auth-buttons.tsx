import { signIn, signOut } from "@/auth";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="auth-controls">
        <span className="auth-greeting">สวัสดี {userName ?? "ผู้ใช้งาน"}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="auth-button auth-button--quiet" type="submit">
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button className="auth-button" type="submit">
        Login with Google
      </button>
    </form>
  );
}
