import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  if (!isLocale(locale)) {
    return null;
  }

  const dict = await getDictionary(locale);

  return <LoginForm locale={locale} labels={dict.auth} showUnauthorized={error === "unauthorized"} />;
}
