import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { title: "Agenndar" };
  }
  const { data } = await supabase
    .from("users")
    .select("business_name, avatar_url")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) {
    return { title: "Não encontrado | Agenndar" };
  }
  const title = `${data.business_name} | Agenndar`;
  const description = `Agende online com ${data.business_name}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.avatar_url ? [data.avatar_url] : undefined,
    },
    robots: "index, follow",
  };
}

export default async function SlugLayout({ params, children }: Props) {
  const { slug } = await params;
  const supabase = getSupabaseClient();
  if (!supabase) {
    return <>{children}</>;
  }
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!user) {
    notFound();
  }
  return <>{children}</>;
}
