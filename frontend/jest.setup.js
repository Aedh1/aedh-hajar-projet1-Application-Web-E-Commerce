import '@testing-library/jest-dom/extend-expect';

// optional: provide a global fetch mock placeholder; tests may override this.
if (!global.fetch) {
  global.fetch = () => Promise.resolve({ ok: false });
}
