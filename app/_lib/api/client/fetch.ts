export const getClientFetch = async (url: string, token?: string) => {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!resp.ok) {
    throw new Error(`(${resp.status}) ${resp.statusText}`);
  }
  const data = await resp.json();
  return data;
};

export const postClientFetch = async <T>(
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
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`(${resp.status}) ${resp.statusText}`);
  }
  const data = await resp.json();
  return data;
};
