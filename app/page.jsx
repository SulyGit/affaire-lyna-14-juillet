"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SITE_BASE = "/affaire-lyna-14-juillet";
const ARCHIVE_AT = new Date("2026-07-15T04:00:00+02:00").getTime();
const AFTER_MATCH_AT = new Date("2026-07-14T22:45:00+02:00").getTime();

const MISSIONS = [
  { id: 1, short: "Fleur", label: "Le premier rendez-vous", stamp: "13:15", icon: "✿" },
  { id: 2, short: "Passages", label: "Les passages secrets", stamp: "14:30", icon: "♜" },
  { id: 3, short: "Code", label: "L’heure du crime", stamp: "15:50", icon: "⌖" },
  { id: 4, short: "Crime", label: "La scène de crime", stamp: "17:45", icon: "⌕" },
  { id: 5, short: "Message", label: "Le mot vertical", stamp: "19:30", icon: "¶" },
  { id: 6, short: "Final", label: "Le dernier acte", stamp: "20:35", icon: "★" }
];

const schedule = [
  ["13:15", "Fleur de Pavé", "5 rue Paul-Lelong, Paris 2e — l’enquête commence à table"],
  ["14:30", "Galerie Vivienne → Palais-Royal", "Flânerie, puis café chez Kitsuné"],
  ["15:40", "Dix minutes de marche", "Petite transition digestive"],
  ["15:50", "Lock Academy", "Accueil, 25 rue Coquillière"],
  ["16:00", "Un Crime Presque Parfait", "Soixante-quinze minutes d’enquête"],
  ["17:15", "Direction l’Hôtel Balzac", "La ville change de décor"],
  ["17:45", "Le bar de l’Hôtel Balzac", "Cocktail confidentiel, 6 rue Balzac"],
  ["18:50", "Promenade vers Mac-Mahon", "À pied, tranquillement"],
  ["19:30", "Avenue Mac-Mahon", "Dîner — le nom reste dans le dossier secret"],
  ["20:35", "Le Royal Monceau", "Dernier acte avant France–Espagne à 21:00"]
];

const EVIDENCE = [
  ["✿", "Fleur & pavé"],
  ["♜", "Passage royal"],
  ["⌖", "Code horaire"],
  ["⌕", "Fil doré"],
  ["¶", "Mot vertical"],
  ["★", "Dernier billet"]
];

const TRANSITIONS = {
  2: ["Sentier", "Palais-Royal", "Les verrières se rapprochent…"],
  3: ["Palais-Royal", "Coquillière", "Dix minutes à travers Paris…"],
  4: ["Coquillière", "Champs-Élysées", "Le dossier change de rive…"],
  5: ["Balzac", "Mac-Mahon", "La nuit commence à tomber…"],
  6: ["Mac-Mahon", "Royal Monceau", "Dernière ligne droite…"],
  7: ["Paris", "Dossier final", "Toutes les preuves convergent…"]
};

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function TinyIcon({ children }) {
  return <span className="tiny-icon" aria-hidden="true">{children}</span>;
}

function IdentityGate({ onVerified }) {
  const [animal, setAnimal] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const verify = (event) => {
    event.preventDefault();
    if (animal === "loutre" && normalize(code) === "NOUX") {
      setConfirmed(true);
      navigator.vibrate?.([35, 25, 70]);
    } else {
      setError(true);
      setTimeout(() => setError(false), 900);
    }
  };

  return (
    <main className="identity-shell">
      <div className="grain" aria-hidden="true" />
      <section className="identity-card">
        <div className="identity-stamp">À AUTHENTIFIER</div>
        <p className="eyebrow">PROTOCOLE D’ACCÈS · 2 PREUVES</p>
        <h1>Contrôle de la<br/><em>destinataire</em></h1>
        <div className="identity-grid">
          <figure className="surveillance-photo">
            <img src={`${SITE_BASE}/lyna-restaurant.jpeg`} alt="Lyna au restaurant" />
            <figcaption><span>PIÈCE L-01</span><b>SUJET PRÉSUMÉ : LYNA</b></figcaption>
          </figure>
          {!confirmed ? (
            <form className={`identity-form ${error ? "shake" : ""}`} onSubmit={verify}>
              <fieldset>
                <legend>PREUVE 01 — Quel animal pourrait acheter le silence de ton complice ?</legend>
                <div className="animal-choices">
                  <button type="button" className={animal === "chat" ? "selected" : ""} onClick={() => setAnimal("chat")}><span>🐈</span><small>Le chat</small></button>
                  <button type="button" className={animal === "loutre" ? "selected" : ""} onClick={() => setAnimal("loutre")}><span>🦦</span><small>La loutre</small></button>
                  <button type="button" className={animal === "renard" ? "selected" : ""} onClick={() => setAnimal("renard")}><span>🦊</span><small>Le renard</small></button>
                </div>
              </fieldset>
              <label htmlFor="identity-code">PREUVE 02 — Ton nom de code</label>
              <input id="identity-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Quatre lettres…" autoComplete="off" />
              <button className="primary" type="submit">Vérifier mon identité <span>⌕</span></button>
              {error && <p className="error">Les archives ne reconnaissent pas cette combinaison.</p>}
              <p className="identity-hint">Indice : il commence comme « nous », mais n’appartient qu’à toi.</p>
            </form>
          ) : (
            <div className="identity-confirmed">
              <div className="verified-mark">✓</div>
              <p className="eyebrow">IDENTITÉ CONFIRMÉE</p>
              <h2>Agent Noux</h2>
              <p>Le complice amateur de loutres confirme : la photographie correspond bien à la destinataire du dossier.</p>
              <button className="primary" onClick={onVerified}>Accéder au dossier <span>→</span></button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SealIntro({ onOpen }) {
  const [hold, setHold] = useState(0);
  const timer = useRef(null);
  const start = useRef(0);

  const stop = () => {
    if (timer.current) cancelAnimationFrame(timer.current);
    timer.current = null;
    if (hold < 100) setHold(0);
  };

  const begin = () => {
    start.current = performance.now();
    const tick = (now) => {
      const next = Math.min(100, ((now - start.current) / 1150) * 100);
      setHold(next);
      if (next >= 100) {
        navigator.vibrate?.([35, 30, 70]);
        onOpen();
        return;
      }
      timer.current = requestAnimationFrame(tick);
    };
    timer.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => timer.current && cancelAnimationFrame(timer.current), []);

  return (
    <main className="intro-shell">
      <div className="intro-stars" aria-hidden="true"><i>✦</i><i>·</i><i>✧</i><i>·</i><i>✦</i></div>
      <section className="envelope" aria-label="Invitation confidentielle pour Lyna">
        <div className="envelope-topline"><span>AGENCE DES COÏNCIDENCES IMPOSSIBLES</span><span>PARIS · 14/07</span></div>
        <div className="postmark"><span>CONFIDENTIEL</span><small>DOUBLE<br/>ANNIVERSAIRE</small></div>
        <p className="for">Pour</p>
        <h1>Lyna</h1>
        <p className="intro-note">Une affaire singulière requiert ta présence.<br/>Elle implique Paris, deux dates identiques<br/>et une personne très suspecte.</p>
        <button
          className="wax-seal"
          style={{ "--hold": `${hold * 3.6}deg` }}
          onPointerDown={begin}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
          aria-label="Maintenir le sceau pour ouvrir"
        >
          <span>L</span>
        </button>
        <p className="hold-copy">Maintiens le sceau pour ouvrir</p>
        <div className="envelope-fold" aria-hidden="true" />
      </section>
      <p className="microcopy">Dossier nº 1407 · réservé à sa destinataire</p>
    </main>
  );
}

function CaseHeader({ solved, soundOn, setSoundOn }) {
  return (
    <header className="case-header">
      <div>
        <p className="eyebrow">DOSSIER Nº 1407 · PARIS</p>
        <h1>L’Affaire du<br/><em>Double Anniversaire</em></h1>
      </div>
      <button className="sound" onClick={() => setSoundOn(v => !v)} aria-label={soundOn ? "Couper le son" : "Activer le son"}>
        {soundOn ? "♫" : "♪̸"}
      </button>
      <div className="case-meta">
        <span>SUJETS</span><b>LYNA + UN COMPLICE</b>
        <span>INDICES</span><b>{solved}/6 ÉLUCIDÉS</b>
      </div>
    </header>
  );
}

function Progress({ solved, current, setCurrent }) {
  return (
    <nav className="progress-rail" aria-label="Progression de l’enquête">
      <div className="progress-line"><span style={{ width: `${(solved / 6) * 100}%` }} /></div>
      {MISSIONS.map(m => {
        const done = m.id <= solved;
        const available = m.id <= solved + 1;
        return (
          <button key={m.id} disabled={!available} onClick={() => setCurrent(m.id)} className={`${done ? "done" : ""} ${current === m.id ? "active" : ""}`} aria-label={`${m.label}${done ? ", résolue" : ""}`}>
            <span>{done ? "✓" : m.id}</span><small>{m.short}</small>
          </button>
        );
      })}
    </nav>
  );
}

function HintSystem({ missionId, hints }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const saved = Number(localStorage.getItem(`lyna-hints-${missionId}`) || 0);
    if (Number.isInteger(saved)) setShown(Math.min(saved, hints.length));
  }, [missionId, hints.length]);
  const reveal = () => {
    const next = Math.min(shown + 1, hints.length);
    setShown(next);
    localStorage.setItem(`lyna-hints-${missionId}`, String(next));
  };
  return (
    <aside className="hint-system">
      {shown > 0 && <div className="hint-stack">{hints.slice(0, shown).map((hint, i) => <p key={i}><span>INDICE {i + 1}</span>{hint}</p>)}</div>}
      {shown < hints.length && <button onClick={reveal}>⊕ {shown ? "Débloquer un indice plus précis" : "Besoin d’un indice ?"}</button>}
      {shown === hints.length && <small>Tous les indices disponibles ont été déclassifiés.</small>}
    </aside>
  );
}

function EvidenceInventory({ solved, foxCount }) {
  return (
    <section className="evidence-inventory" aria-label="Inventaire des preuves">
      <div className="inventory-title"><span>INVENTAIRE</span><b>{solved}/6 preuves</b></div>
      <div className="evidence-items">
        {EVIDENCE.map(([icon, label], i) => <div key={label} className={i < solved ? "collected" : ""}><span>{i < solved ? icon : "?"}</span><small>{i < solved ? label : "Sous scellés"}</small></div>)}
        <div className={`fox-medal ${foxCount === 3 ? "collected" : ""}`}><span>{foxCount === 3 ? "🦊" : `${foxCount}/3`}</span><small>{foxCount === 3 ? "Triple Renard" : "Renards cachés"}</small></div>
      </div>
    </section>
  );
}

function ParisRouteMap({ solved }) {
  const progress = Math.min(1, solved / 6);
  const stops = [
    [43, 158, "Fleur"], [112, 117, "Palais-Royal"], [177, 142, "Lock"],
    [255, 73, "Balzac"], [318, 100, "Mac-Mahon"], [378, 52, "Monceau"]
  ];
  return (
    <details className="paris-map">
      <summary><span>⌁ CARTE DU DOSSIER</span><small>Le trajet se dessine avec les preuves</small></summary>
      <div className="map-paper">
        <svg viewBox="0 0 420 205" role="img" aria-label="Carte stylisée du parcours parisien">
          <path className="seine" d="M-10 163 C75 132 93 184 167 159 S277 115 440 143" />
          <path className="map-streets" d="M23 28L386 179M75 9L132 201M196 0L227 205M337 9L299 198M0 94L420 88" />
          <path className="map-route-bg" d="M43 158 C70 133 91 119 112 117 S152 139 177 142 C215 146 228 91 255 73 S295 86 318 100 C345 115 360 72 378 52" />
          <path className="map-route-live" style={{ strokeDashoffset: 620 - 620 * progress }} d="M43 158 C70 133 91 119 112 117 S152 139 177 142 C215 146 228 91 255 73 S295 86 318 100 C345 115 360 72 378 52" />
          {stops.map(([x,y,label], i) => <g key={label} className={i < solved ? "map-stop reached" : "map-stop"}><circle cx={x} cy={y} r="6"/><text x={x} y={y - 11}>{label}</text></g>)}
          <text className="river-label" x="18" y="186">LA SEINE</text><text className="paris-label" x="284" y="184">PARIS · DOSSIER 1407</text>
        </svg>
      </div>
    </details>
  );
}

function DistrictTransition({ data }) {
  if (!data) return null;
  return (
    <div className="district-transition" aria-live="polite">
      <div className="transition-city">PARIS</div>
      <div className="transition-line"><i/><span/></div>
      <div className="transition-places"><b>{data[0]}</b><span>→</span><b>{data[1]}</b></div>
      <p>{data[2]}</p>
    </div>
  );
}

function HiddenFox({ current, found, onFind }) {
  if (![1, 3, 5].includes(current) || found.includes(current)) return null;
  return <button className={`hidden-fox fox-pos-${current}`} onClick={() => onFind(current)} aria-label="Renard caché">🦊</button>;
}

function MissionFrame({ mission, children, solved, reveal, onNext }) {
  return (
    <section className="mission-card">
      <div className="paperclip" aria-hidden="true" />
      <div className="mission-kicker"><span>PIÈCE À CONVICTION {String(mission.id).padStart(2, "0")}</span><span>{mission.icon}</span></div>
      <h2>{mission.label}</h2>
      {children}
      {solved && (
        <div className="reveal-card">
          <div className="approved">ÉLUCIDÉ</div>
          {reveal}
          {onNext && <button className="primary" onClick={onNext}>Ouvrir la pièce suivante <span>→</span></button>}
        </div>
      )}
    </section>
  );
}

function MissionOne({ solved, complete, next, archived }) {
  const [flower, setFlower] = useState(false);
  const [wrong, setWrong] = useState(false);
  const choose = (value) => {
    if (!flower) return;
    if (value === "pave") complete();
    else { setWrong(true); setTimeout(() => setWrong(false), 700); }
  };
  return (
    <MissionFrame mission={MISSIONS[0]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">Réservation · 13:15</p>}<h3>Fleur de Pavé</h3><p>{!archived && <><strong>5 rue Paul-Lelong, 75002 Paris.</strong><br/></>}Le premier interrogatoire se fera à table. Arrive avec de l’appétit et un air innocent.</p></>}>
      <p className="lead">Le premier lieu se cache dans un rébus. Saisis la fleur, puis dépose-la sur le bon terrain.</p>
      <button className={`flower-token ${flower ? "picked" : ""}`} onClick={() => setFlower(true)}><span>✿</span> LA FLEUR <small>{flower ? "preuve saisie ✓" : "toucher pour saisir"}</small></button>
      <div className={`terrain-grid ${wrong ? "shake" : ""}`}>
        <button onClick={() => choose("sable")}><span className="terrain sand">···</span><b>Le sable</b></button>
        <button onClick={() => choose("pave")}><span className="terrain pave">▦</span><b>Le pavé</b></button>
        <button onClick={() => choose("eau")}><span className="terrain water">≈</span><b>L’eau</b></button>
      </div>
      {!flower && <p className="hint">Indice : toute bonne enquête commence par saisir une preuve.</p>}
      <HintSystem missionId={1} hints={["Le nom du lieu est composé de deux objets visibles dans l’énigme.", "Commence par saisir la fleur, puis cherche ce que l’on trouve sous les pas dans Paris."]}/>
    </MissionFrame>
  );
}

function MissionTwo({ solved, complete, next, archived }) {
  const order = ["gallery", "crown", "fox"];
  const [sequence, setSequence] = useState([]);
  const pick = (id) => {
    const expected = order[sequence.length];
    if (id === expected) {
      const s = [...sequence, id]; setSequence(s);
      if (s.length === 3) complete();
    } else {
      setSequence([]);
    }
  };
  const items = [
    ["fox", "♢", "Le renard", "il garde le café"],
    ["gallery", "▥", "La galerie", "elle ouvre le passage"],
    ["crown", "♛", "La couronne", "elle règne sur les jardins"]
  ];
  return (
    <MissionFrame mission={MISSIONS[1]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">14:30 — 15:40</p>}<h3>Galerie Vivienne → Palais-Royal</h3><p>Et, caché près des arcades, un café chez <strong>Kitsuné</strong>. Le renard avait donc raison.</p></>}>
      <p className="lead">Lis la note du messager puis touche les symboles dans l’ordre du parcours.</p>
      <blockquote>« Entre par les verrières, cherche ensuite le domaine du roi, et laisse le renard servir la dernière piste. »</blockquote>
      <div className="symbol-grid">
        {items.map(([id, icon, name, sub]) => <button key={id} className={sequence.includes(id) ? "selected" : ""} onClick={() => pick(id)} disabled={solved}><span>{icon}</span><b>{name}</b><small>{sub}</small></button>)}
      </div>
      <div className="sequence-dots">{[0,1,2].map(i => <i key={i} className={i < sequence.length ? "filled" : ""} />)}</div>
      <p className="hint">Une erreur efface la piste. Les mots comptent plus que les symboles.</p>
      <HintSystem missionId={2} hints={["Les verrières désignent la galerie ; le domaine du roi désigne la couronne.", "L’ordre exact est : galerie, couronne, renard."]}/>
    </MissionFrame>
  );
}

function MissionThree({ solved, complete, next, archived }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (code === "1600") complete();
    else { setError(true); setTimeout(() => setError(false), 900); }
  };
  return (
    <MissionFrame mission={MISSIONS[2]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">15:50 accueil · 16:00 mission</p>}<h3>Lock Academy</h3><p>{!archived && <>25 rue Coquillière. </>}Dossier confié : <strong>Un Crime Presque Parfait</strong>. Briefing et débriefing compris.</p>{!archived && <div className="walk-note">15:40 — dix minutes de marche digestive</div>}</>}>
      <p className="lead">Le professeur a verrouillé l’adresse. Quatre chiffres suffisent.</p>
      <div className="evidence-note"><span>NOTE 03/B</span><p>« Quand la petite aiguille désigne quatre et que Paris compte l’après-midi, l’académie ouvre son dossier. Écris l’heure comme la police : sans deux-points. »</p></div>
      <form className={`code-form ${error ? "shake" : ""}`} onSubmit={submit}>
        <label htmlFor="code">CODE HORAIRE</label>
        <input id="code" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••" disabled={solved}/>
        <button type="submit" disabled={code.length !== 4 || solved}>Déverrouiller</button>
      </form>
      {error && <p className="error">Ce n’est pas l’heure exacte. Pense en format 24 h.</p>}
      <HintSystem missionId={3} hints={["La police écrit les heures sur vingt-quatre heures.", "Quatre heures de l’après-midi devient 16:00 ; retire simplement les deux-points."]}/>
    </MissionFrame>
  );
}

const clues = [
  ["cup", "☕", "Une tasse encore tiède", "Thé à la rose. Une trace de rouge framboise sur le bord."],
  ["clock", "◷", "Une montre arrêtée", "Le choc l’a figée exactement à 17:15."],
  ["thread", "⌁", "Un fil doré", "Accroché au fauteuil. Il vient d’une broderie très fine."],
  ["door", "⌑", "La porte du salon", "Fermée de l’intérieur : le coupable n’est jamais vraiment parti."]
];

function MissionFour({ solved, complete, next, archived }) {
  const [found, setFound] = useState([]);
  const [culprit, setCulprit] = useState("");
  const [wrong, setWrong] = useState(false);
  const inspect = id => setFound(v => v.includes(id) ? v : [...v, id]);
  const accuse = id => {
    setCulprit(id);
    if (id === "minuit") complete();
    else { setWrong(true); setTimeout(() => setWrong(false), 900); }
  };
  return (
    <MissionFrame mission={MISSIONS[3]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">17:15 départ · 17:45 cocktail</p>}<h3>Le bar de l’Hôtel Balzac</h3><p>{!archived && <>6 rue Balzac. </>}Une alcôve intime, un parfum littéraire, et le calme parfait avant le prochain chapitre.</p></>}>
      <p className="lead">Un bijou a disparu du salon. Inspecte les quatre zones marquées, puis accuse le bon suspect.</p>
      <div className="crime-scene" aria-label="Scène de crime interactive">
        <div className="window"><i/><i/><i/><i/></div><div className="curtain left"/><div className="curtain right"/>
        <div className="table"><span/><b/></div><div className="chair"/><div className="rug"/>
        {clues.map(([id, icon, title]) => <button key={id} className={`hotspot ${id} ${found.includes(id) ? "found" : ""}`} onClick={() => inspect(id)} aria-label={`Inspecter : ${title}`}>{found.includes(id) ? "✓" : "+"}</button>)}
        <div className="scene-label">SALON 17 · 17:15</div>
      </div>
      <div className="clue-list">
        {clues.map(([id, icon, title, detail]) => <article key={id} className={found.includes(id) ? "visible" : ""}><span>{found.includes(id) ? icon : "?"}</span><div><b>{found.includes(id) ? title : "Indice non inspecté"}</b>{found.includes(id) && <small>{detail}</small>}</div></article>)}
      </div>
      <h3 className="accuse-title">Qui ment ? <small>{found.length}/4 indices trouvés</small></h3>
      <div className={`suspects ${wrong ? "shake" : ""}`}>
        <button disabled={found.length < 4 || solved} onClick={() => accuse("biscuit")}><span>♙</span><b>Baron Biscuit</b><small>Boutons argentés. Ne boit jamais de thé.</small></button>
        <button disabled={found.length < 4 || solved} onClick={() => accuse("minuit")}><span>♕</span><b>Mlle Minuit</b><small>Rouge framboise. Cape brodée d’or. Dit être partie à 17:00.</small></button>
        <button disabled={found.length < 4 || solved} onClick={() => accuse("renard")}><span>♘</span><b>Dr Renard</b><small>Écharpe orange. Était encore dans le jardin.</small></button>
      </div>
      {wrong && <p className="error">Alibi plausible. Relis les quatre indices.</p>}
      {culprit === "minuit" && solved && <p className="deduction">La tasse et le fil la trahissent ; la porte prouve qu’elle n’était pas partie. Affaire classée.</p>}
      <HintSystem missionId={4} hints={["Inspecte tous les boutons cerclés avant d’accuser qui que ce soit.", "Cherche une personne liée à la fois au rouge framboise, au fil doré et à un faux départ.", "Mlle Minuit est la seule que la tasse, le fil et la porte contredisent ensemble."]}/>
    </MissionFrame>
  );
}

function MissionFive({ solved, complete, next, archived }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const lines = [
    ["M", "inuit n’efface pas les pas sur les boulevards."],
    ["A", "u coin d’une avenue, une table attend deux suspects."],
    ["C", "haque indice descend d’une ligne."],
    ["M", "ais le message, lui, se lit autrement."],
    ["A", "lors oublie le sens des phrases."],
    ["H", "isse seulement les premières lettres."],
    ["O", "bserve-les de haut en bas."],
    ["N", "omme enfin le lieu du prochain rendez-vous."]
  ];
  const submit = e => {
    e.preventDefault();
    if (normalize(answer) === "MACMAHON") complete();
    else { setError(true); setTimeout(() => setError(false), 900); }
  };
  return (
    <MissionFrame mission={MISSIONS[4]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">18:50 promenade · 19:30 dîner</p>}<h3>Avenue Mac-Mahon</h3><p>Le restaurant demeure sous scellés. Il sera révélé à l’arrivée — les meilleurs dossiers gardent un dernier secret.</p></>}>
      <p className="lead">Un auteur soigneusement non identifié a laissé ce billet. Le nom de l’avenue y est caché.</p>
      <div className="acrostic">{lines.map(([first, rest], i) => <p key={i}><b>{first}</b>{rest}</p>)}</div>
      <form className={`answer-form ${error ? "shake" : ""}`} onSubmit={submit}>
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Le nom de l’avenue…" disabled={solved}/>
        <button disabled={!answer.trim() || solved}>Vérifier</button>
      </form>
      {error && <p className="error">Tu lis encore comme une lectrice. Lis comme une détective.</p>}
      <HintSystem missionId={5} hints={["Le sens des phrases est une diversion : observe leur construction.", "Lis uniquement la première lettre de chaque ligne, de haut en bas."]}/>
    </MissionFrame>
  );
}

function MissionSix({ solved, complete, next, archived }) {
  const [sequence, setSequence] = useState([]);
  const order = ["france", "spain", "ball"];
  const tap = id => {
    if (id === order[sequence.length]) {
      const s = [...sequence, id]; setSequence(s);
      if (s.length === 3) complete();
    } else setSequence([]);
  };
  return (
    <MissionFrame mission={MISSIONS[5]} solved={solved} onNext={next} reveal={<>{!archived && <p className="reveal-time">20:35 départ · 21:00 coup d’envoi</p>}<h3>Le Royal Monceau</h3><p>Dernier acte : France–Espagne, dans un décor qui ne ressemble surtout pas à un pub.</p></>}>
      <p className="lead">Le dernier message a été intercepté : « Bleu d’abord, rouge ensuite, puis le coup d’envoi. »</p>
      <div className="final-puzzle">
        <button className={sequence.includes("france") ? "selected" : ""} onClick={() => tap("france")}><span className="flag fr"><i/><i/><i/></span><b>Bleu</b></button>
        <div className="pitch"><span className="route" style={{ "--route": sequence.length }} /><button className={sequence.includes("ball") ? "selected ball" : "ball"} onClick={() => tap("ball")}>◆</button></div>
        <button className={sequence.includes("spain") ? "selected" : ""} onClick={() => tap("spain")}><span className="flag es"><i/><i/><i/></span><b>Rouge</b></button>
      </div>
      <div className="sequence-dots">{[0,1,2].map(i => <i key={i} className={i < sequence.length ? "filled" : ""}/>)}</div>
      <p className="hint">Suis exactement l’ordre du billet.</p>
      <HintSystem missionId={6} hints={["Chaque mot désigne un bouton, et leur ordre ne doit pas changer.", "Touche Bleu, puis Rouge, puis le ballon au centre."]}/>
    </MissionFrame>
  );
}

function MemoryPolaroid() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button className={`memory-polaroid ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(v => !v)} aria-label="Retourner le souvenir de Majorque">
      <span className="memory-inner">
        <span className="memory-front">
          <img src={`${SITE_BASE}/majorque-lune.jpeg`} alt="La lune au-dessus de la mer à Majorque" />
          <span className="memory-caption"><b>PIÈCE M-01 · MAJORQUE</b><small>Touche la photo pour la retourner</small></span>
        </span>
        <span className="memory-back">
          <span className="moon-mark">☾</span>
          <b>La lune avait tout vu.</b>
          <p>Elle n’a rien dit. Elle savait déjà que nous continuerions à choisir les mêmes horizons.</p>
          <small>Souvenir classé — à ne jamais archiver</small>
        </span>
      </span>
    </button>
  );
}

function GrandFinale() {
  const [now, setNow] = useState(null);
  const [opened, setOpened] = useState(false);
  const available = now !== null && now >= AFTER_MATCH_AT;
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const remaining = now === null ? 0 : Math.max(0, AFTER_MATCH_AT - now);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.ceil((remaining % 3600000) / 60000);

  if (opened) return (
    <section className="after-match-letter">
      <div className="letter-postmark">APRÈS<br/>LE MATCH</div>
      <p className="eyebrow">ULTIME PIÈCE À CONVICTION</p>
      <h3>Noux,</h3>
      <p>Ce soir, Paris aura été une table, une galerie, une scène de crime, quelques verres, beaucoup de détours, beaucoup de rires et de sourires, et ces étoiles dans tes yeux. Une journée entière choisie pour toi.</p>
      <p>Majorque nous a laissé une lune. Paris nous laissera cette enquête. Je ne connais pas encore la prochaine ville, la prochaine mer ou la prochaine page, mais je sais avec qui je veux les découvrir.</p>
      <p>Cette personne, c’est toi. Toi, la femme que j’aime et avec qui je veux partager notre vie, les bons moments comme ceux qui le seront moins. Notre vie, si tu le veux, sera magnifique et belle, simplement parce qu’elle sera la nôtre.</p>
      <p>Merci pour cette superbe journée à tes côtés. Elle restera l’une des plus belles que j’aie vécues, et je suis persuadé qu’il y en aura encore beaucoup d’autres.</p>
      <p>Je ne te promets pas que chaque page sera toujours facile. Je te promets seulement de vouloir continuer à les écrire avec toi.</p>
      <p>Le dossier peut se refermer. Notre histoire, elle, reste grande ouverte.</p>
      <MemoryPolaroid />
      <div className="next-chapter"><span>PROCHAIN CHAPITRE</span><b>Destination inconnue</b><small>Équipage confirmé : Noux + son complice</small></div>
      <p className="only-beginning">Ce n’est que le début.</p>
    </section>
  );

  return (
    <section className={`after-match-envelope ${available ? "available" : "locked"}`}>
      <div className="mini-envelope">
        <span className="mini-flap"/><span className="mini-seal">N</span>
      </div>
      <p className="eyebrow">COURRIER TEMPORISÉ</p>
      <h3>À ouvrir après le match</h3>
      <p>{now === null ? "Synchronisation de l’horloge de l’agence…" : available ? "Le coup de sifflet a levé les scellés." : `Encore ${hours ? `${hours} h ` : ""}${minutes} min avant la déclassification.`}</p>
      <button className="primary" disabled={!available} onClick={() => setOpened(true)}>{available ? "Briser le dernier sceau" : "Enveloppe sous scellés"}<span>{available ? "♡" : "⌛"}</span></button>
    </section>
  );
}

function FinalDossier({ onReset, archived, foxCount }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const data = { title: "L’Affaire du Double Anniversaire", text: "Lyna, un dossier confidentiel t’attend…", url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => {});
    else { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600); }
  };
  return (
    <section className="final-dossier">
      <div className="final-burst">✦</div>
      <p className="eyebrow">AFFAIRE CLASSÉE</p>
      <h2>Le hasard a bon dos, Noux.</h2>
      <p className="love-note">Lyna, il existe des coïncidences que le hasard ne suffit pas à expliquer. Être nés le même jour en est une. Continuer à choisir la même journée, année après année, en est une autre.</p>
      <p className="big-wish">Joyeux anniversaire à nous deux.</p>
      <p className="signature">Aujourd’hui, je t’enlève pour une enquête<br/>dont tu es mon plus beau mystère. ♡</p>
      {foxCount === 3 && <div className="final-achievement"><span>🦊</span><div><b>SUCCÈS SECRET — TRIPLE RENARD</b><small>Trois témoins roux ont été retrouvés dans le dossier.</small></div></div>}
      <div className="full-plan">
        <div className="plan-title"><span>{archived ? "CARNET-SOUVENIR ARCHIVÉ" : "ITINÉRAIRE DÉCLASSIFIÉ"}</span><b>14 JUILLET</b></div>
        {schedule.map(([time, place, detail], i) => <div className="plan-row" key={i}><time>{archived ? "♡" : time}</time><div><b>{place}</b><small>{archived ? "Les détails logistiques ont été retirés ; le souvenir reste." : detail}</small></div></div>)}
      </div>
      {archived && <p className="archive-note">Protection automatique activée : horaires et adresses ont disparu de l’affichage après l’anniversaire.</p>}
      <GrandFinale />
      <div className="final-actions"><button className="primary" onClick={share}>{copied ? "Lien copié ✓" : "Partager le dossier"} <span>↗</span></button><button className="text-button" onClick={onReset}>Rejouer l’enquête</button></div>
    </section>
  );
}

function Confetti({ burst }) {
  if (!burst) return null;
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ "--i": i, "--x": `${(i * 47) % 100}vw`, "--d": `${(i % 7) * .08}s` }} />)}</div>;
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [verified, setVerified] = useState(false);
  const [solved, setSolved] = useState(0);
  const [current, setCurrent] = useState(1);
  const [soundOn, setSoundOn] = useState(false);
  const [burst, setBurst] = useState(false);
  const [foxes, setFoxes] = useState([]);
  const [transition, setTransition] = useState(null);
  const [achievement, setAchievement] = useState(false);
  const [resumeToast, setResumeToast] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [archived, setArchived] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("lyna-case") || "{}");
      if (saved.opened) setOpened(true);
      if (saved.verified) setVerified(true);
      if (Number.isInteger(saved.solved)) setSolved(saved.solved);
      if (Number.isInteger(saved.current)) setCurrent(Math.max(1, Math.min(saved.current, 7)));
      else if (Number.isInteger(saved.solved)) setCurrent(Math.min(saved.solved + 1, 7));
      if (Array.isArray(saved.foxes)) setFoxes(saved.foxes.filter(x => [1,3,5].includes(x)));
      if (saved.opened || saved.verified || saved.solved) { setResumeToast(true); setTimeout(() => setResumeToast(false), 2600); }
    } catch {}
    setArchived(Date.now() >= ARCHIVE_AT);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${SITE_BASE}/sw.js`).then(() => setOfflineReady(true)).catch(() => {});
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("lyna-case", JSON.stringify({ opened, verified, solved, current, foxes, savedAt: Date.now() })); } catch {}
  }, [opened, verified, solved, current, foxes, hydrated]);

  const chime = () => {
    if (!soundOn) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audio.current ||= new Ctx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = audio.current.createOscillator(); const gain = audio.current.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, audio.current.currentTime + i * .08);
      gain.gain.linearRampToValueAtTime(.07, audio.current.currentTime + i * .08 + .02);
      gain.gain.exponentialRampToValueAtTime(.001, audio.current.currentTime + i * .08 + .5);
      osc.connect(gain).connect(audio.current.destination); osc.start(audio.current.currentTime + i * .08); osc.stop(audio.current.currentTime + i * .08 + .55);
    });
  };

  const complete = id => {
    if (solved >= id) return;
    setSolved(id); setBurst(true); chime(); navigator.vibrate?.(45);
    setTimeout(() => setBurst(false), 1600);
  };
  const next = id => {
    setTransition(TRANSITIONS[id]);
    setTimeout(() => { setCurrent(id); window.scrollTo({ top: 0, behavior: "smooth" }); }, 480);
    setTimeout(() => setTransition(null), 1450);
  };
  const findFox = id => {
    setFoxes(previous => {
      const updated = previous.includes(id) ? previous : [...previous, id];
      if (updated.length === 3) { setAchievement(true); setBurst(true); setTimeout(() => { setAchievement(false); setBurst(false); }, 2600); }
      return updated;
    });
    navigator.vibrate?.([25, 20, 25]);
  };
  const reset = () => {
    localStorage.removeItem("lyna-case");
    for (let i = 1; i <= 6; i++) localStorage.removeItem(`lyna-hints-${i}`);
    setOpened(false); setVerified(false); setSolved(0); setCurrent(1); setFoxes([]); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mission = useMemo(() => {
    const props = { solved: solved >= current, complete: () => complete(current), next: current < 6 ? () => next(current + 1) : () => next(7), archived };
    if (current === 1) return <MissionOne {...props}/>;
    if (current === 2) return <MissionTwo {...props}/>;
    if (current === 3) return <MissionThree {...props}/>;
    if (current === 4) return <MissionFour {...props}/>;
    if (current === 5) return <MissionFive {...props}/>;
    if (current === 6) return <MissionSix {...props}/>;
    return <FinalDossier onReset={reset} archived={archived} foxCount={foxes.length}/>;
  }, [current, solved, soundOn, archived, foxes.length]);

  if (!opened) return <SealIntro onOpen={() => { setOpened(true); setTimeout(() => window.scrollTo(0,0), 50); }}/>
  if (!verified) return <IdentityGate onVerified={() => { setVerified(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}/>

  return (
    <main className={`case-shell ${archived ? "archived" : ""}`}>
      <Confetti burst={burst}/>
      <DistrictTransition data={transition}/>
      {resumeToast && <div className="resume-toast">✓ Dossier repris exactement où tu l’avais laissé</div>}
      {achievement && <div className="achievement-toast"><span>🦊</span><div><b>SUCCÈS CACHÉ</b><small>Triple Renard découvert</small></div></div>}
      <div className="grain" aria-hidden="true" />
      <CaseHeader solved={solved} soundOn={soundOn} setSoundOn={setSoundOn}/>
      <Progress solved={solved} current={current} setCurrent={setCurrent}/>
      <div className="status-strip"><span>{offlineReady ? "◉ Disponible hors ligne" : "○ Préparation du mode métro"}</span>{archived && <span>⌁ Logistique archivée</span>}</div>
      <EvidenceInventory solved={solved} foxCount={foxes.length}/>
      <ParisRouteMap solved={solved}/>
      <div className="case-content">{mission}<HiddenFox current={current} found={foxes} onFind={findFox}/></div>
      <footer><span>AGENCE DES COÏNCIDENCES IMPOSSIBLES</span><span>FAIT À PARIS AVEC ♡</span></footer>
    </main>
  );
}
