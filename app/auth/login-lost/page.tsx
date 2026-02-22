import { LoginForm } from '@/components/auth/LoginForm';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function LoginLostPage() {
  return (
    <AnimationWrapper type="slideUp">
      <div className="flex justify-center">
        <LoginForm title="Login - Lost Item Reporter" />
      </div>
    </AnimationWrapper>
  );
}
