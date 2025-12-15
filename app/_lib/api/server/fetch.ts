export const getServerFetch = async (url: string, token?: string) => {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "force-cache",
    next: { revalidate: 60 },
  });
  if (!resp.ok) {
    throw new Error(`${resp.status}`);
  }
  const data = await resp.json();
  return data;
};

export const postServerFetch = async <T>(
  url: string,
  body: T,
  token?: string
) => {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error(`(${resp.status}) ${resp.statusText}`);
  }
  const data = await resp.json();
  return data;
};
