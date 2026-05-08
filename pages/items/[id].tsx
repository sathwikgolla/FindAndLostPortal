import { useRouter } from "next/router";
import { ItemDetailsPage } from "@/components/pages/ItemDetailsPage";

export default function ItemDetails() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  return <ItemDetailsPage id={id} />;
}
