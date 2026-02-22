import { RegisterForm } from '@/components/auth/RegisterForm';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function RegisterPage() {
  return (
    <AnimationWrapper type="slideUp">
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </AnimationWrapper>
  );
}
