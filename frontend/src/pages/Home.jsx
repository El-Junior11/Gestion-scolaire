import { Link } from "react-router-dom";

const fonctionnalites = [
  {
    titre: "Classes & effectifs",
    texte: "Organisez vos classes par niveau et année scolaire, avec les frais de scolarité associés.",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M12 3L21 7.5 12 12 3 7.5 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M3 15l9 4.5 9-4.5M3 11.2l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    titre: "Suivi des étudiants",
    texte: "Fiches complètes, matricule automatique, statut nouveau / passant / redoublant et passage de classe.",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2.7 20c.6-3.6 3.2-5.6 6.3-5.6s5.7 2 6.3 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17.3" cy="8.6" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.5 14.8c2.3.2 4.2 1.8 4.8 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    titre: "Paiements mensuels",
    texte: "Les 12 mensualités de l'année scolaire, échéance le 10 de chaque mois, retards signalés automatiquement.",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 14.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    titre: "Tableau de bord clair",
    texte: "Effectifs, montants encaissés, répartition par classe et alertes de retard en un coup d'œil.",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const etapes = [
  {
    numero: "01",
    titre: "Créez vos classes",
    texte: "Niveau, année scolaire et frais annuel — réparti automatiquement sur 12 mois.",
  },
  {
    numero: "02",
    titre: "Inscrivez vos étudiants",
    texte: "Matricule automatique, statut nouveau / passant / redoublant, fiche complète.",
  },
  {
    numero: "03",
    titre: "Suivez les paiements",
    texte: "Chaque mensualité enregistrée, échéance du 10 surveillée, retards signalés.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold font-display font-semibold text-ink">
              É
            </div>
            <span className="font-display text-lg text-white">Institut</span>
          </div>
          <nav className="hidden items-center gap-8 sm:flex">
            <a href="#fonctionnalites" className="text-sm text-white/70 transition-colors hover:text-white">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="text-sm text-white/70 transition-colors hover:text-white">Comment ça marche</a>
          </nav>
          <Link
            to="/connexion"
            className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #2F6B4F 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 sm:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex animate-fadeUp items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-wide text-gold-light"
            >
              Gestion scolaire tout-en-un
            </span>
            <h1
              className="mt-4 animate-fadeUp font-display text-3xl leading-[1.15] text-white sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              Toute la vie administrative de votre école,{" "}
              <span className="text-gold-light">au même endroit</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-lg animate-fadeUp text-sm leading-relaxed text-white/75 sm:text-base"
              style={{ animationDelay: "160ms" }}
            >
              Classes, étudiants et paiements de scolarité mensuels — suivis avec clarté,
              pour une administration sereine tout au long de l'année.
            </p>
            <div
              className="mt-6 flex animate-fadeUp flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                to="/connexion"
                className="w-full rounded-md bg-gold px-6 py-3 text-center text-sm font-medium text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] sm:w-auto"
              >
                Accéder à l'espace administration
              </Link>
              <a
                href="#fonctionnalites"
                className="w-full rounded-md border border-white/20 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/5 sm:w-auto"
              >
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>

          {/* Aperçu compact du tableau de bord */}
          <div
            className="relative mx-auto mt-12 max-w-4xl animate-fadeUp"
            style={{ animationDelay: "320ms" }}
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl backdrop-blur">
              <div className="rounded-lg bg-paper p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-base text-ink">Tableau de bord</p>
                    <p className="text-xs text-muted">Vue d'ensemble de l'année scolaire</p>
                  </div>
                  <div className="hidden gap-1.5 sm:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-brick/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gold/50" />
                    <span className="h-2.5 w-2.5 rounded-full bg-forest/50" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Étudiants actifs", accent: "text-ink" },
                    { label: "Classes", accent: "text-ink" },
                    { label: "Frais encaissés", accent: "text-forest" },
                    { label: "Retards", accent: "text-brick" },
                  ].map((k) => (
                    <div key={k.label} className="rounded-md border border-line bg-surface p-2.5">
                      <p className="text-[11px] text-muted">{k.label}</p>
                      <div className={`mt-1.5 h-2 w-3/4 rounded-full bg-current opacity-20 ${k.accent}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Fonctionnalités</p>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Pensé pour l'administration scolaire</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fonctionnalites.map((f) => (
              <div
                key={f.titre}
                className="card border border-line p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink/5 text-ink">
                  {f.icone}
                </div>
                <p className="mt-3 font-display text-base text-ink">{f.titre}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{f.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">En trois étapes</p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Comment ça marche</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {etapes.map((e, i) => (
            <div key={e.numero} className="relative">
              <span className="font-display text-4xl text-ink/10">{e.numero}</span>
              <p className="mt-2 font-display text-base text-ink">{e.titre}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{e.texte}</p>
              {i < etapes.length - 1 && (
                <div className="pointer-events-none absolute -right-4 top-3 hidden h-px w-8 bg-line sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-ink py-12">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Prêt à démarrer ?</h2>
          <p className="mt-2 text-xs text-white/70 sm:text-sm">Connectez-vous à votre espace administration pour commencer.</p>
          <Link
            to="/connexion"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02]"
          >
            Se connecter
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Institut — Gestion scolaire
      </footer>
    </div>
  );
}