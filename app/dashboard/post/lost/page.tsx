import { PostForm } from '@/components/post/PostForm';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function PostLostPage() {
  return (
    <AnimationWrapper type="slideUp">
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <PostForm postType="lost" />
      </div>
    </AnimationWrapper>
  );
}
