import { LoginForm } from '@/components/auth/LoginForm';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function LoginFoundPage() {
  return (
    <AnimationWrapper type="slideUp">
      <div className="flex justify-center">
        <LoginForm title="Login - Found Item Reporter" />
      </div>
    </AnimationWrapper>
  );
}
