import LoginOTPWrapper from "./login-otp-wrapper";

export const metadata = {
  title: "Welcome to FarmStellar",
  description: "Gamified farming education app for beginners",
};

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col center-flex p-2 sm:p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/farm-landscape-background.jpg')" }}
      />

      <LoginOTPWrapper />
    </div>
  );
}
