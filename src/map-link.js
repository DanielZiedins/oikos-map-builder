// Maps travel inside links: the whole map is JSON, base64url-encoded into the
// URL hash, so nothing is ever uploaded. Shared by the builder (share links,
// `#map=` — replaces the saved map after a confirm) and the journal's quick
// start (`#add=` — adds names to whatever map is saved on this device).

export function encodeMapToHash(mapData) {
  const bytes = new TextEncoder().encode(JSON.stringify(mapData));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeHashPayload(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

// The quick start's five prompts, each landing in a sensible circle.
export const QUICK_START_PROMPTS = [
  { group: 'family', placeholder: 'Someone in your family' },
  { group: 'friends', placeholder: 'A friend' },
  { group: 'work', placeholder: 'A coworker or classmate' },
  { group: 'neighbors', placeholder: 'A neighbour' },
  { group: 'friends', placeholder: 'Anyone else' },
];

export function quickStartLink(names) {
  const people = names
    .map((name, index) => ({ name: String(name || '').trim().slice(0, 80), group: QUICK_START_PROMPTS[index]?.group || 'friends' }))
    .filter((person) => person.name);
  return people.length ? `/#add=${encodeMapToHash({ people })}` : '/#builder';
}
