import { Leaf, User, UserCog, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Welcome to FarmStellar",
  description: "Gamified farming education app for beginners",
};

export default function WelcomePage() {
  return (
    <>
      <div className="min-h-screen center-flex p-6 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/farm-landscape-background.jpg')" }}
        />
        <div className="absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center bg-white/40 p-8 rounded-3xl shadow-lg backdrop-blur-md max-w-lg w-full">
          <div className="flex items-center justify-center mb-12 space-x-6">
            <div className="center-flex w-20 h-20 bg-primary rounded-3xl  shadow-lg">
              <Leaf className="icon-2xl text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-display text-foreground mb-3 text-balance">
                FarmStellar
              </h1>
              <p className="text-body text-muted-foreground text-balance max-w-md mx-auto">
                Master sustainable farming through interactive quests and earn
                rewards
              </p>
            </div>
          </div>

          <div className="w-full max-w-md space-y-4">
            <Link
              href={"/login"}
              className="btn-primary w-full center-flex gap-3"
            >
              <User className="icon-sm" />
              Login as Farmer
            </Link>

            <Link
              href={"/admin-login"}
              className="btn-secondary w-full center-flex gap-3"
            >
              <UserCog className="icon-sm" />
              Login as Admin
            </Link>

            <Link
              href={"/login"}
              className="btn-accent w-full center-flex gap-3"
            >
              <UserPlus className="icon-sm" />
              Sign Up as Farmer
            </Link>
          </div>

          <p className="text-medium text-shadow-green-800 mt-8 text-center">
            Learn. Grow. Sustain.
          </p>
        </div>
      </div>
    </>
  );
}
