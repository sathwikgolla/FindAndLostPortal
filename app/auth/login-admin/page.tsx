import { LoginForm } from '@/components/auth/LoginForm';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function LoginAdminPage() {
  return (
    <AnimationWrapper type="slideUp">
      <div className="flex justify-center">
        <LoginForm title="Login - Administrator" />
      </div>
    </AnimationWrapper>
  );
}
