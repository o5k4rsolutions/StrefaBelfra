// Strefa Belfra – wspólny skrypt sesji dla stron publicznych
// 1) Wklej swoje dane z Supabase: Project Settings → API
const SUPABASE_URL = "https://zmnscevlotwpocpwzmjj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptbnNjZXZsb3R3cG9jcHd6bWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzcwMzAsImV4cCI6MjEwODUxMzAzMH0.qB4WcrlkDb75Buk0G2E1-jkun0VLWih7h1j9NEb2IXk"; // tylko klucz anon/public, NIGDY service_role!

const LOGIN_URL = "https://login-strefabelfra.pages.dev";
const APP_URL   = "https://moja-strefabelfra.pages.dev";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

function ready() { document.documentElement.classList.add("auth-ready"); }

function render(session) {
  const nav = document.querySelector("header nav");
  document.querySelectorAll('[data-auth="login"]').forEach((a) => {
    if (session) {
      a.href = APP_URL;
      a.textContent = a.closest("nav") ? "Moja Strefa Belfra" : "Przejdź do Mojej Strefy";
    } else {
      a.href = LOGIN_URL;
      a.textContent = a.dataset.label || a.textContent;
    }
  });

  // przycisk „Wyloguj” w nawigacji
  let out = document.getElementById("sb-logout");
  if (session && nav && !out) {
    out = document.createElement("a");
    out.id = "sb-logout";
    out.href = "#";
    out.textContent = "Wyloguj";
    out.addEventListener("click", async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      location.reload();
    });
    nav.appendChild(out);
  } else if (!session && out) {
    out.remove();
  }
  ready();
}

// zapamiętaj oryginalne etykiety
document.querySelectorAll('[data-auth="login"]').forEach((a) => (a.dataset.label = a.textContent));

setTimeout(ready, 1500); // zabezpieczenie, gdyby Supabase nie odpowiedział
supabase.auth.getSession().then(({ data }) => render(data.session)).catch(ready);
supabase.auth.onAuthStateChange((_e, session) => render(session));
