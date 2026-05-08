import { useRouter } from "next/router";
import { ConversationPage } from "@/components/pages/ConversationPage";

export default function Conversation() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  return <ConversationPage id={id} />;
}
