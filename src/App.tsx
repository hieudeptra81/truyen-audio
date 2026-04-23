import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

export default function App() {
  const [sentences, setSentences] = useState<string[]>([]);
  const [curIdx, setCurIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"paste" | "file">("paste");
  const [pasteText, setPasteText] = useState("");
  const [dragging, setDragging] = useState(false);

  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playingRef = useRef(false);
  const curIdxRef = useRef(0);
  const speedRef = useRef(1.0);
  const selectedVoiceRef = useRef("");
  const allVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { curIdxRef.current = curIdx; }, [curIdx]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { selectedVoiceRef.current = selectedVoice; }, [selectedVoice]);
  useEffect(() => { allVoicesRef.current = allVoices; }, [allVoices]);

  const loadVoices = useCallback(() => {
    const v = speechSynthesis.getVoices();
    if (!v.length) return;
    setAllVoices(v);
    allVoicesRef.current = v;
    const vi = v.filter(x => x.lang?.startsWith("vi"));
    const filtered = vi.length ? vi : v;
    setVoices(filtered);
    if (filtered.length) setSelectedVoice(filtered[0].name);
  }, []);

  useEffect(() => {
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { speechSynthesis.cancel(); };
  }, [loadVoices]);

  const filterVoices = useCallback((gender: string) => {
    setGenderFilter(gender);
    const src = allVoicesRef.current;
    let filtered = src;
    if (gender === "female") {
      const fem = src.filter(v => {
        const n = v.name.toLowerCase();
        return n.includes("female") || n.includes("woman") || n.includes("zira") ||
          n.includes("samantha") || n.includes("victoria") || n.includes("karen") ||
          n.includes("moira") || n.includes("fiona") || n.includes("tessa") || n.includes("nữ");
      });
      filtered = fem.length ? fem : src;
    } else if (gender === "male") {
      const mal = src.filter(v => {
        const n = v.name.toLowerCase();
        return n.includes("male") || n.includes("david") || n.includes("daniel") ||
          n.includes("alex") || n.includes("fred") || n.includes("jorge") || n.includes("nam");
      });
      filtered = mal.length ? mal : src;
    }
    setVoices(filtered);
    if (filtered.length) setSelectedVoice(filtered[0].name);
  }, []);

  const processText = (txt: string) => {
    speechSynthesis.cancel();
    setPlaying(false);
    playingRef.current = false;
    const raw = txt.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const sents = raw
      .split(/(?<=[.!?…])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 2);
    setSentences(sents);
    setCurIdx(0);
    curIdxRef.current = 0;
  };

  const readFrom = useCallback((idx: number, sents: string[]) => {
    if (!sents.length || idx >= sents.length) {
      setPlaying(false);
      playingRef.current = false;
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sents[idx]);
    u.rate = speedRef.current;
    const v = allVoicesRef.current.find(x => x.name === selectedVoiceRef.current);
    if (v) u.voice = v;
    u.onend = () => {
      const next = curIdxRef.current + 1;
      if (playingRef.current && next < sents.length) {
        curIdxRef.current = next;
        setCurIdx(next);
        readFrom(next, sents);
      } else if (next >= sents.length) {
        setPlaying(false);
        playingRef.current = false;
      }
    };
    uttRef.current = u;
    speechSynthesis.speak(u);
  }, []);

  const togglePlay = () => {
    if (!sentences.length) return;
    if (playing) {
      speechSynthesis.cancel();
      setPlaying(false);
      playingRef.current = false;
    } else {
      setPlaying(true);
      playingRef.current = true;
      readFrom(curIdxRef.current, sentences);
    }
  };

  const jumpTo = (idx: number) => {
    speechSynthesis.cancel();
    curIdxRef.current = idx;
    setCurIdx(idx);
    if (playingRef.current) readFrom(idx, sentences);
  };

  const skipSentence = (d: number) => {
    const ni = Math.max(0, Math.min(sentences.length - 1, curIdxRef.current + d));
    jumpTo(ni);
  };

  const seekProg = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sentences.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - r.left) / r.width;
    jumpTo(Math.floor(pct * sentences.length));
  };

  const changeSpeed = (v: number) => {
    const s = v / 10;
    setSpeed(s);
    speedRef.current = s;
    if (playingRef.current) {
      speechSynthesis.cancel();
      readFrom(curIdxRef.current, sentences);
    }
  };

  const changeVoice = (name: string) => {
    setSelectedVoice(name);
    selectedVoiceRef.current = name;
    if (playingRef.current) {
      speechSynthesis.cancel();
      readFrom(curIdxRef.current, sentences);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => processText(e.target?.result as string);
    reader.readAsText(file, "UTF-8");
  };

  const pct = sentences.length ? Math.round((curIdx / sentences.length) * 100) : 0;
  const wordCount = sentences.join(" ").split(/\s+/).filter(w => w).length;

  useEffect(() => {
    const el = document.getElementById("s" + curIdx);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [curIdx]);

  return (
    <div className="wrap">
      <div className="card">
        {/* Header */}
        <div className="top-bar">
          <h2>Trình đọc truyện</h2>
          <span className={`badge${sentences.length ? " on" : ""}`}>
            {sentences.length ? `Sẵn sàng – ${sentences.length} câu` : "Chưa có nội dung"}
          </span>
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-tabs">
            <button className={`tab-btn${activeTab === "paste" ? " active" : ""}`} onClick={() => setActiveTab("paste")}>Dán văn bản</button>
            <button className={`tab-btn${activeTab === "file" ? " active" : ""}`} onClick={() => setActiveTab("file")}>Tải file .txt</button>
          </div>

          {activeTab === "paste" ? (
            <div>
              <textarea
                className="paste-area"
                placeholder="Dán nội dung truyện vào đây..."
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
              />
              <button className="load-btn" onClick={() => pasteText.trim() && processText(pasteText)}>
                Tải nội dung
              </button>
            </div>
          ) : (
            <div
              className={`file-drop${dragging ? " drag" : ""}`}
              onClick={() => document.getElementById("fileInput")?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault(); setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f?.name.endsWith(".txt")) readFile(f);
              }}
            >
              <div className="drop-icon">📄</div>
              <p>Nhấn để chọn hoặc kéo thả file .txt vào đây</p>
              <input
                type="file" id="fileInput" accept=".txt" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="ctrl-row">
            <span className="ctrl-label">Giới tính</span>
            <select value={genderFilter} onChange={e => filterVoices(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="female">Nữ</option>
              <option value="male">Nam</option>
            </select>
          </div>
          <div className="ctrl-row">
            <span className="ctrl-label">Giọng đọc</span>
            <select value={selectedVoice} onChange={e => changeVoice(e.target.value)}>
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
          <div className="ctrl-row">
            <span className="ctrl-label">Tốc độ</span>
            <input type="range" min="5" max="20" step="1" value={Math.round(speed * 10)}
              onChange={e => changeSpeed(parseInt(e.target.value))} />
            <span className="speed-val">{speed.toFixed(1)}x</span>
          </div>
        </div>

        {/* Player bar */}
        <div className="player-bar">
          <button className="skip-btn" onClick={() => skipSentence(-1)}>&#9664;</button>
          <button className="play-btn" onClick={togglePlay}>
            {playing
              ? <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z" /></svg>
              : <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            }
          </button>
          <button className="skip-btn" onClick={() => skipSentence(1)}>&#9654;</button>
          <div className="prog-wrap">
            <div className="prog-track" onClick={seekProg}>
              <div className="prog-fill" style={{ width: pct + "%" }} />
            </div>
            <div className="prog-times">
              <span>{sentences.length ? `${curIdx + 1} / ${sentences.length} câu` : "0 / 0 câu"}</span>
              <span>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Reader */}
        <div className="reader-area" ref={readerRef}>
          {sentences.length === 0 ? (
            <div className="placeholder">Nội dung truyện sẽ hiển thị ở đây khi bạn tải lên.</div>
          ) : sentences.map((s, i) => (
            <span
              key={i}
              id={"s" + i}
              className={`sentence${i === curIdx ? " active" : i < curIdx ? " done" : ""}`}
              onClick={() => jumpTo(i)}
            >
              {s}{" "}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="stat-row">
          <div className="stat">Số câu: <span>{sentences.length}</span></div>
          <div className="stat">Số từ: <span>{wordCount.toLocaleString()}</span></div>
          <div className="stat">Giọng: <span>{selectedVoice ? selectedVoice.substring(0, 20) + "…" : "—"}</span></div>
        </div>
      </div>
    </div>
  );
}
