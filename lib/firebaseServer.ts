import { createSign, randomUUID } from 'crypto';

type FirestoreValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  stringValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

type ServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

export type FirestoreFilter = {
  field: string;
  value: unknown;
  op?: 'EQUAL';
};

const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DATASTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';

let cachedToken: TokenCache | null = null;
let cachedServiceAccount: (Required<Pick<ServiceAccount, 'client_email' | 'private_key'>> & { project_id: string }) | null = null;

function parseServiceAccount() {
  if (cachedServiceAccount) return cachedServiceAccount;

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let parsed: ServiceAccount = {};

  if (rawJson) {
    try {
      const json = rawJson.trim().startsWith('{')
        ? rawJson
        : Buffer.from(rawJson, 'base64').toString('utf8');
      parsed = JSON.parse(json) as ServiceAccount;
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must be valid service account JSON or base64 JSON');
    }
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    parsed.project_id;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || parsed.client_email;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || parsed.private_key || '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase server credentials are required. Set FIREBASE_SERVICE_ACCOUNT_JSON, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  cachedServiceAccount = {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };

  return cachedServiceAccount;
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function createServiceAccountJwt() {
  const account = parseServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: account.client_email,
    scope: DATASTORE_SCOPE,
    aud: OAUTH_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(account.private_key);
  return `${unsigned}.${base64Url(signature)}`;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createServiceAccountJwt(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Firebase auth failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(1, data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

function firestoreBaseUrl() {
  const { project_id: projectId } = parseServiceAccount();
  const databaseId = process.env.FIREBASE_DATABASE_ID || '(default)';
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(databaseId)}/documents`;
}

async function firestoreFetch<T>(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${firestoreBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Firestore request failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function isDateField(key?: string) {
  return Boolean(key && (key === 'date' || key === 'engagementDate' || key.endsWith('At')));
}

function toFirestoreValue(value: unknown, key?: string): FirestoreValue | undefined {
  if (value === undefined) return undefined;
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };

  if (typeof value === 'string') {
    if (isDateField(key)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return { timestampValue: date.toISOString() };
    }
    return { stringValue: value };
  }

  if (typeof value === 'boolean') return { booleanValue: value };

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }

  if (Array.isArray(value)) {
    const values = value
      .map((item) => toFirestoreValue(item))
      .filter((item): item is FirestoreValue => Boolean(item));
    return values.length > 0 ? { arrayValue: { values } } : { arrayValue: {} };
  }

  if (typeof value === 'object') {
    return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } };
  }

  return { stringValue: String(value) };
}

function toFirestoreFields(data: Record<string, unknown>) {
  const fields: Record<string, FirestoreValue> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'id') return;
    const field = toFirestoreValue(value, key);
    if (field) fields[key] = field;
  });

  return fields;
}

function fromFirestoreValue(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('stringValue' in value) return value.stringValue;
  if ('arrayValue' in value) return (value.arrayValue?.values || []).map(fromFirestoreValue);
  if ('mapValue' in value) return fromFirestoreFields(value.mapValue?.fields || {});
  return undefined;
}

function fromFirestoreFields(fields: Record<string, FirestoreValue>) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)])
  );
}

function documentIdFromName(name: string) {
  return name.split('/').pop() || '';
}

function fromFirestoreDocument<T>(document: FirestoreDocument) {
  return {
    ...fromFirestoreFields(document.fields || {}),
    id: documentIdFromName(document.name),
  } as T;
}

function documentPath(collectionId: string, documentId?: string) {
  const collectionPath = `/${encodeURIComponent(collectionId)}`;
  return documentId ? `${collectionPath}/${encodeURIComponent(documentId)}` : collectionPath;
}

function fieldFilter(filter: FirestoreFilter) {
  const value = toFirestoreValue(filter.value, filter.field);
  if (!value) throw new Error(`Invalid Firestore query value for ${filter.field}`);

  return {
    fieldFilter: {
      field: { fieldPath: filter.field },
      op: filter.op || 'EQUAL',
      value,
    },
  };
}

function whereClause(filters: FirestoreFilter[]) {
  if (filters.length === 1) return fieldFilter(filters[0]);

  return {
    compositeFilter: {
      op: 'AND',
      filters: filters.map(fieldFilter),
    },
  };
}

export function createInvitationToken() {
  return randomUUID();
}

export async function listCollection<T>(collectionId: string) {
  const documents: T[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: '1000' });
    if (pageToken) params.set('pageToken', pageToken);

    const data = await firestoreFetch<{ documents?: FirestoreDocument[]; nextPageToken?: string }>(
      `${documentPath(collectionId)}?${params.toString()}`
    );

    documents.push(...(data.documents || []).map(fromFirestoreDocument<T>));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return documents;
}

export async function queryCollection<T>(collectionId: string, filters: FirestoreFilter[], limit = 10) {
  const data = await firestoreFetch<Array<{ document?: FirestoreDocument }>>(':runQuery', {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: whereClause(filters),
        limit,
      },
    }),
  });

  return data
    .filter((row) => row.document)
    .map((row) => fromFirestoreDocument<T>(row.document as FirestoreDocument));
}

export async function createDocument<T>(collectionId: string, data: Record<string, unknown>) {
  const result = await firestoreFetch<FirestoreDocument>(documentPath(collectionId), {
    method: 'POST',
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  return fromFirestoreDocument<T>(result);
}

export async function setDocument<T>(collectionId: string, documentId: string, data: Record<string, unknown>) {
  const result = await firestoreFetch<FirestoreDocument>(documentPath(collectionId, documentId), {
    method: 'PATCH',
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  return fromFirestoreDocument<T>(result);
}

export async function updateDocument<T>(collectionId: string, documentId: string, data: Record<string, unknown>) {
  const fields = toFirestoreFields(data);
  const params = new URLSearchParams();
  Object.keys(fields).forEach((fieldPath) => params.append('updateMask.fieldPaths', fieldPath));

  const result = await firestoreFetch<FirestoreDocument>(`${documentPath(collectionId, documentId)}?${params.toString()}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });

  return fromFirestoreDocument<T>(result);
}

export async function deleteDocument(collectionId: string, documentId: string) {
  await firestoreFetch<void>(documentPath(collectionId, documentId), { method: 'DELETE' });
}
