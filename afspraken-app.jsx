import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  card: "#21262d",
  accent: "#58a6ff",
  accentSoft: "#79c0ff",
  rob: "#58a6ff",        // blauw voor Rob
  robBg: "rgba(88,166,255,0.10)",
  robBorder: "rgba(88,166,255,0.45)",
  lizet: "#f778ba",     // roze voor Lizet
  lizetBg: "rgba(247,120,186,0.10)",
  lizetBorder: "rgba(247,120,186,0.45)",
  beide: "#a5d6a7",
  beideBg: "rgba(165,214,167,0.10)",
  beideBorder: "rgba(165,214,167,0.40)",
  text: "#e6edf3",
  muted: "#6e7681",
  border: "rgba(255,255,255,0.07)",
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    font-family: 'DM Sans', sans-serif;
    color: ${COLORS.text};
    min-height: 100vh;
  }

  .app {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 20px 60px;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    background: linear-gradient(135deg, ${COLORS.rob} 0%, ${COLORS.lizet} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .header-names {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 6px;
  }

  .name-pill {
    padding: 3px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .name-pill.rob {
    background: ${COLORS.robBg};
    border: 1px solid ${COLORS.robBorder};
    color: ${COLORS.rob};
  }

  .name-pill.lizet {
    background: ${COLORS.lizetBg};
    border: 1px solid ${COLORS.lizetBorder};
    color: ${COLORS.lizet};
  }

  .header p {
    color: ${COLORS.muted};
    font-size: 0.85rem;
    font-weight: 300;
    margin-top: 4px;
  }

  .mic-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
  }

  .mic-ring {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .mic-ring::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    background: conic-gradient(${COLORS.rob}, ${COLORS.lizet}, ${COLORS.rob});
    opacity: 0;
    transition: opacity 0.4s;
    animation: none;
  }

  .mic-ring.listening::before {
    opacity: 1;
    animation: ringRotate 2s linear infinite;
  }

  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .mic-ring::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: ${COLORS.bg};
    opacity: 0;
    transition: opacity 0.4s;
  }

  .mic-ring.listening::after { opacity: 1; }

  .mic-btn {
    position: relative;
    z-index: 1;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    transition: all 0.3s ease;
    background: ${COLORS.surface};
    border: 2px solid ${COLORS.border};
  }

  .mic-btn:hover { transform: scale(1.05); border-color: ${COLORS.rob}; }

  .mic-btn.listening {
    background: linear-gradient(135deg, rgba(88,166,255,0.15), rgba(247,120,186,0.15));
    border-color: transparent;
    box-shadow: 0 0 30px rgba(88,166,255,0.2);
  }

  .mic-btn.processing {
    background: rgba(165,214,167,0.1);
    border-color: ${COLORS.beide};
    animation: spin-glow 1.5s infinite;
  }

  @keyframes spin-glow {
    0%,100% { box-shadow: 0 0 20px rgba(165,214,167,0.3); }
    50% { box-shadow: 0 0 40px rgba(165,214,167,0.6); }
  }

  .status-text {
    font-size: 0.85rem;
    color: ${COLORS.muted};
    text-align: center;
    min-height: 20px;
    transition: color 0.3s;
  }

  .status-text.active { color: ${COLORS.rob}; }
  .status-text.processing { color: ${COLORS.beide}; }

  .tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 28px;
    background: ${COLORS.surface};
    border-radius: 14px;
    padding: 5px;
    border: 1px solid ${COLORS.border};
  }

  .tab {
    flex: 1;
    padding: 10px 8px;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.22s;
    background: transparent;
    color: ${COLORS.muted};
  }

  .tab:hover { color: ${COLORS.text}; }

  .tab.active-rob {
    background: ${COLORS.robBg};
    color: ${COLORS.rob};
    border-color: ${COLORS.robBorder};
  }

  .tab.active-lizet {
    background: ${COLORS.lizetBg};
    color: ${COLORS.lizet};
    border-color: ${COLORS.lizetBorder};
  }

  .tab.active-alle {
    background: rgba(230,237,243,0.05);
    color: ${COLORS.text};
    border-color: rgba(230,237,243,0.15);
  }

  .appointments {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .apt-card {
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: slideIn 0.3s ease;
    border: 1px solid;
  }

  .apt-card.rob {
    background: ${COLORS.robBg};
    border-color: ${COLORS.robBorder};
  }

  .apt-card.lizet {
    background: ${COLORS.lizetBg};
    border-color: ${COLORS.lizetBorder};
  }

  .apt-card.beide {
    background: ${COLORS.beideBg};
    border-color: ${COLORS.beideBorder};
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .apt-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }

  .apt-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .apt-body { flex: 1; min-width: 0; }

  .apt-who {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .apt-who.rob { color: ${COLORS.rob}; }
  .apt-who.lizet { color: ${COLORS.lizet}; }
  .apt-who.beide { color: ${COLORS.beide}; }

  .apt-desc {
    font-size: 0.975rem;
    font-weight: 400;
    margin-bottom: 6px;
    line-height: 1.4;
    color: ${COLORS.text};
  }

  .apt-meta {
    font-size: 0.78rem;
    color: ${COLORS.muted};
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .apt-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
    align-items: flex-start;
  }

  .apt-cal-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 4px 6px;
    border-radius: 6px;
    transition: all 0.2s;
    opacity: 0.5;
    color: ${COLORS.muted};
  }

  .apt-card:hover .apt-cal-btn { opacity: 1; }
  .apt-cal-btn:hover { background: rgba(88,166,255,0.12); color: ${COLORS.rob}; }
  .apt-cal-btn.exported { color: #3fb950; opacity: 1 !important; }

  .apt-delete {
    background: none;
    border: none;
    cursor: pointer;
    color: ${COLORS.muted};
    font-size: 0.95rem;
    padding: 4px 6px;
    border-radius: 6px;
    transition: all 0.2s;
    flex-shrink: 0;
    opacity: 0.5;
  }

  .apt-card:hover .apt-delete { opacity: 1; }
  .apt-delete:hover { color: #f85149; background: rgba(248,81,73,0.1); }

  .export-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 20px;
    gap: 12px;
  }

  .export-bar p {
    font-size: 0.82rem;
    color: ${COLORS.muted};
    line-height: 1.4;
  }

  .export-all-btn {
    background: rgba(88,166,255,0.12);
    border: 1px solid rgba(88,166,255,0.35);
    color: ${COLORS.rob};
    border-radius: 8px;
    padding: 8px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .export-all-btn:hover {
    background: rgba(88,166,255,0.22);
    transform: translateY(-1px);
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: ${COLORS.muted};
  }

  .empty-state .icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty-state p { font-size: 0.88rem; font-weight: 300; line-height: 1.6; }

  .error-toast {
    background: rgba(248,81,73,0.1);
    border: 1px solid rgba(248,81,73,0.25);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 0.85rem;
    color: #f85149;
    text-align: center;
  }

  .mic-tip {
    background: rgba(255,184,0,0.08);
    border: 1px solid rgba(255,184,0,0.25);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 0.82rem;
    color: #e3b341;
    text-align: left;
    line-height: 1.55;
    width: 100%;
  }

  .mic-tip strong { font-weight: 600; display: block; margin-bottom: 4px; }

  .text-fallback {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: slideIn 0.3s ease;
  }

  .text-fallback-label {
    font-size: 0.8rem;
    color: ${COLORS.muted};
    text-align: center;
  }

  .text-input-row {
    display: flex;
    gap: 8px;
  }

  .text-input {
    flex: 1;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: ${COLORS.text};
    outline: none;
    transition: border-color 0.2s;
  }

  .text-input::placeholder { color: ${COLORS.muted}; }
  .text-input:focus { border-color: rgba(88,166,255,0.5); }

  .text-submit-btn {
    background: rgba(88,166,255,0.15);
    border: 1px solid rgba(88,166,255,0.4);
    color: ${COLORS.rob};
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .text-submit-btn:hover { background: rgba(88,166,255,0.25); }
  .text-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .mode-toggle {
    font-size: 0.78rem;
    color: ${COLORS.muted};
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .mode-toggle:hover { color: ${COLORS.text}; }

  .section-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${COLORS.muted};
    margin: 24px 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${COLORS.border};
  }

  .count-badge {
    background: ${COLORS.card};
    border-radius: 20px;
    padding: 1px 9px;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${COLORS.muted};
  }

  .footer {
    text-align: center;
    margin-top: 56px;
    padding-top: 20px;
    border-top: 1px solid ${COLORS.border};
    font-size: 0.75rem;
    color: ${COLORS.muted};
    font-weight: 300;
    letter-spacing: 0.04em;
  }

  .footer span {
    background: linear-gradient(90deg, ${COLORS.rob}, ${COLORS.lizet});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 500;
  }
`;

function parseAppointmentFallback(text) {
  const lower = text.toLowerCase();
  const forLizet = lower.includes("lizet");
  const forRob = lower.includes("rob");
  let person = "beide";
  if (forLizet && !forRob) person = "lizet";
  else if (forRob && !forLizet) person = "rob";

  const dateMatch = lower.match(/(\d{1,2})\s*(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/);
  const timeMatch = lower.match(/(\d{1,2})[:.:](\d{2})/);
  
  const months = { januari:0,februari:1,maart:2,april:3,mei:4,juni:5,juni:5,juli:6,augustus:7,september:8,oktober:9,november:10,december:11 };
  
  let dateStr = null;
  let dateISO = null;
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const month = months[dateMatch[2]];
    const year = new Date().getFullYear();
    const d = new Date(year, month, day);
    dateStr = d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    dateISO = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  let timeStr = null;
  if (timeMatch) {
    timeStr = `${String(timeMatch[1]).padStart(2,"0")}:${timeMatch[2]}`;
  }

  return { person, description: text, date: dateStr, dateISO, time: timeStr, icon: "📅" };
}

async function parseWithClaude(transcript) {
  const today = new Date().toLocaleDateString("nl-NL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const todayISO = new Date().toISOString().slice(0, 10);
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `Je bent een assistent die gesproken tekst omzet naar afspraakgegevens. Vandaag is het ${today} (${todayISO}). 
De gebruikers heten Rob en Lizet. 
Geef altijd JSON terug (geen markdown), met deze velden:
- person: "rob", "lizet", of "beide"
- description: korte beschrijving van de afspraak (max 80 tekens)
- date: datum als "d MMMM yyyy" in het Nederlands, of null
- dateISO: datum als "YYYY-MM-DD", of null
- time: tijd als "HH:mm", of null
- icon: 1 passend emoji
Geef ALLEEN de JSON terug, niets anders.`,
      messages: [{ role: "user", content: `Zet deze gesproken tekst om: "${transcript}"` }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Geen response");
  
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── ICS helpers ──────────────────────────────────────────────────────────────

function toICSDate(dateISO, time) {
  // dateISO: "YYYY-MM-DD", time: "HH:mm" or null
  if (!dateISO) return null;
  const [y, m, d] = dateISO.split("-");
  if (time) {
    const [hh, mm] = time.split(":");
    return `${y}${m}${d}T${hh}${mm}00`;
  }
  return `${y}${m}${d}`;
}

function buildICS(apts) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rob Borghouts//Onze Agenda//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  apts.forEach((apt) => {
    const dtStart = toICSDate(apt.dateISO, apt.time);
    if (!dtStart) return; // skip if no date

    const isAllDay = !apt.time;
    const uid = `${apt.id}@onze-agenda`;
    const who = apt.person === "beide" ? "Rob & Lizet" : apt.person === "rob" ? "Rob" : "Lizet";

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`SUMMARY:${apt.icon || ""} ${apt.description}`);
    lines.push(`DESCRIPTION:Afspraak voor ${who}`);

    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      // end = next day for all-day events
      const next = new Date(apt.dateISO);
      next.setDate(next.getDate() + 1);
      const [ny, nm, nd] = next.toISOString().slice(0,10).split("-");
      lines.push(`DTEND;VALUE=DATE:${ny}${nm}${nd}`);
    } else {
      lines.push(`DTSTART:${dtStart}`);
      // default duration: 1 hour
      const [hh, mm] = apt.time.split(":").map(Number);
      const endH = String(hh + 1).padStart(2, "0");
      const [y, mo, d] = apt.dateISO.split("-");
      lines.push(`DTEND:${y}${mo}${d}T${endH}${String(mm).padStart(2,"0")}00`);
    }

    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(apts, filename = "afspraak.ics") {
  const content = buildICS(apts);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const STORAGE_KEY = "afspraken_v1";

export default function AfsprakenApp() {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("alle");
  const recognitionRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments)); } catch {}
  }, [appointments]);

  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");

  const processText = async (text) => {
    if (!text.trim()) return;
    setError("");
    setProcessing(true);
    try {
      let apt;
      try { apt = await parseWithClaude(text); }
      catch { apt = parseAppointmentFallback(text); }
      setAppointments(prev => [{ ...apt, id: Date.now(), createdAt: new Date().toISOString(), rawText: text }, ...prev]);
      setTextInput("");
    } catch {
      setError("Kon de afspraak niet verwerken. Probeer opnieuw.");
    } finally {
      setProcessing(false);
    }
  };

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Spraakherkenning wordt niet ondersteund in deze browser. Probeer Chrome.");
      return;
    }
    setError("");
    setTranscript("");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "nl-NL";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
    };

    recognition.onend = async () => {
      setListening(false);
      const finalTranscript = recognitionRef.current._finalTranscript;
      if (!finalTranscript?.trim()) return;

      setProcessing(true);
      try {
        let apt;
        try {
          apt = await parseWithClaude(finalTranscript);
        } catch {
          apt = parseAppointmentFallback(finalTranscript);
        }
        
        const newApt = {
          ...apt,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          rawText: finalTranscript,
        };
        
        setAppointments(prev => [newApt, ...prev]);
        setTranscript("");
      } catch (err) {
        setError("Kon de afspraak niet verwerken. Probeer opnieuw.");
      } finally {
        setProcessing(false);
      }
    };

    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") {
        setError("not-allowed");
      } else if (e.error !== "no-speech") {
        setError("Fout: " + e.error);
      }
    };

    // Store final transcript on each result
    recognition.addEventListener("result", (e) => {
      const isFinal = e.results[e.results.length - 1].isFinal;
      if (isFinal) {
        const t = Array.from(e.results).map(r => r[0].transcript).join("");
        recognitionRef.current._finalTranscript = t;
      }
    });

    recognition.start();
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const [exported, setExported] = useState({});

  const exportOne = (apt) => {
    if (!apt.dateISO) {
      alert("Geen datum bekend voor deze afspraak, kan niet exporteren.");
      return;
    }
    downloadICS([apt], `${apt.description.slice(0,30).replace(/\s/g,"-")}.ics`);
    setExported(prev => ({ ...prev, [apt.id]: true }));
  };

  const exportAll = () => {
    const withDate = appointments.filter(a => a.dateISO);
    if (!withDate.length) { alert("Geen afspraken met een datum om te exporteren."); return; }
    downloadICS(withDate, "onze-agenda.ics");
  };

  const deleteApt = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const filtered = activeTab === "alle" 
    ? appointments 
    : appointments.filter(a => a.person === activeTab);

  const grouped = filtered.reduce((acc, apt) => {
    const key = apt.date || "Geen datum";
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <div className="app">
        <div className="header">
          <h1>Onze Agenda</h1>
          <div className="header-names">
            <span className="name-pill rob">👤 Rob</span>
            <span className="name-pill lizet">👩 Lizet</span>
          </div>
          <p>Spreek je afspraken in voor Rob & Lizet</p>
        </div>

        <div className="mic-section">
          {!textMode ? (
            <>
              <div className={`mic-ring ${listening ? "listening" : ""}`}>
                <button
                  className={`mic-btn ${listening ? "listening" : ""} ${processing ? "processing" : ""}`}
                  onClick={listening ? stopListening : startListening}
                  disabled={processing}
                  title={listening ? "Stop opname" : "Start opname"}
                >
                  {processing ? "⚙️" : listening ? "⏹" : "🎙️"}
                </button>
              </div>

              <div className={`status-text ${listening ? "active" : ""} ${processing ? "processing" : ""}`}>
                {processing
                  ? "Afspraak wordt verwerkt..."
                  : listening
                  ? "Luisteren... Spreek uw afspraak in"
                  : "Tik de microfoon om een afspraak in te spreken"}
              </div>

              {transcript && (
                <div style={{
                  width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 14, padding: "16px 20px", fontSize: "0.95rem",
                  fontStyle: "italic", color: COLORS.text, lineHeight: 1.5,
                }}>
                  "{transcript}"
                </div>
              )}

              {error === "not-allowed" ? (
                <div className="mic-tip">
                  <strong>🔒 Microfoon geblokkeerd</strong>
                  iOS Safari staat microfoon niet toe in dit venster. Oplossing:<br/>
                  1. Ga naar <strong>Instellingen → Safari → Microfoon</strong> → Toestaan<br/>
                  2. Of gebruik de <strong>tekstinvoer</strong> hieronder ↓
                </div>
              ) : error ? (
                <div className="error-toast">{error}</div>
              ) : null}

              <button className="mode-toggle" onClick={() => { setError(""); setTextMode(true); }}>
                ⌨️ Liever typen? Gebruik tekstinvoer
              </button>
            </>
          ) : (
            <>
              <div className="text-fallback">
                <div className="text-fallback-label">Typ je afspraak — bv. "Vrijdag 14 maart om 10:00 tandarts voor Rob"</div>
                <div className="text-input-row">
                  <input
                    className="text-input"
                    type="text"
                    placeholder="Afspraak beschrijving..."
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && processText(textInput)}
                    disabled={processing}
                  />
                  <button
                    className="text-submit-btn"
                    onClick={() => processText(textInput)}
                    disabled={processing || !textInput.trim()}
                  >
                    {processing ? "⚙️" : "➕"}
                  </button>
                </div>
                {error && error !== "not-allowed" && <div className="error-toast">{error}</div>}
              </div>

              <button className="mode-toggle" onClick={() => { setError(""); setTextMode(false); }}>
                🎙️ Terug naar spraakopname
              </button>
            </>
          )}
        </div>

        <div className="tabs">
          {["alle", "rob", "lizet"].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? `active-${tab}` : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "alle" ? "🗓 Alle" : tab === "rob" ? "👤 Rob" : "👩 Lizet"}
              {" "}
              <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>
                ({(tab === "alle" ? appointments : appointments.filter(a => a.person === tab)).length})
              </span>
            </button>
          ))}
        </div>

        <div className="appointments">
          {appointments.length > 0 && (
            <div className="export-bar">
              <p>📅 Exporteer afspraken als .ics bestand en open in Apple Agenda, Google Agenda of Outlook.</p>
              <button className="export-all-btn" onClick={exportAll}>
                Alles exporteren
              </button>
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎙️</div>
              <p>Geen afspraken. Spreek een afspraak in!</p>
              <p style={{ marginTop: 8 }}>Zeg bv: "Woensdag 5 maart om 14:00 tandarts voor Lizet"</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, apts]) => (
              <div key={date}>
                <div className="section-title">
                  {date}
                  <span className="count-badge">{apts.length}</span>
                </div>
                {apts.map(apt => (
                  <div key={apt.id} className={`apt-card ${apt.person}`} style={{ marginBottom: 8 }}>
                    <div className="apt-icon">{apt.icon || "📅"}</div>
                    <div className="apt-body">
                      <div className={`apt-who ${apt.person}`}>
                        {apt.person === "beide" ? "Rob & Lizet" : apt.person === "rob" ? "Rob" : "Lizet"}
                      </div>
                      <div className="apt-desc">{apt.description}</div>
                      <div className="apt-meta">
                        {apt.time && <span>🕐 {apt.time}</span>}
                        <span>
                          Toegevoegd: {new Date(apt.createdAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="apt-actions">
                      {apt.dateISO && (
                        <button
                          className={`apt-cal-btn${exported[apt.id] ? " exported" : ""}`}
                          onClick={() => exportOne(apt)}
                          title="Exporteer naar agenda"
                        >
                          {exported[apt.id] ? "✓" : "📥"}
                        </button>
                      )}
                      <button className="apt-delete" onClick={() => deleteApt(apt.id)} title="Verwijder">
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="footer">
          <span>Made by Rob Borghouts</span> · 2026
        </div>
      </div>
    </>
  );
}
