import { Suspense } from "react";
import ResetPasswordForm from "../../components/resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
