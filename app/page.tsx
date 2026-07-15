import OnePageInvitation from '@/components/OnePageInvitation';

type HomePageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return <OnePageInvitation initialToken={token || null} />;
}
