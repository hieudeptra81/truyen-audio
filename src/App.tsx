import { useState, useEffect, useRef } from "react";
import "./App.css";

interface Chapter {
  name: string;
  dur: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  emoji: string;
  color: string;
  desc: string;
  tags: string[];
  chapters: Chapter[];
}

const books: Book[] = [
  {
    id: 1,
    title: "Đấu Phá Thương Khung",
    author: "Thiên Tàm Thổ Đậu",
    genre: "tien-hiep",
    emoji: "🔥",
    color: "#3d1a00",
    desc: "Tài năng thiếu niên Tiêu Viêm, một lần thất bại trở thành phế nhân. Từ vực thẳm tối tăm, cậu bắt đầu hành trình thống trị đại lục tu luyện huyền bí.",
    tags: ["Tu tiên", "Dị giới", "Phế nhân phản công"],
    chapters: [
      { name: "Chương 1: Phế nhân", dur: 1245 },
      { name: "Chương 2: Nghiền nát hào quang", dur: 1380 },
      { name: "Chương 3: Dược Lão xuất hiện", dur: 1560 },
      { name: "Chương 4: Khai mở tiềm năng", dur: 1420 },
      { name: "Chương 5: Luyện đan sư", dur: 1680 },
    ],
  },
  {
    id: 2,
    title: "Cô Đơn Nửa Đời",
    author: "Thần Y Khất Thực",
    genre: "ngon-tinh",
    emoji: "🌸",
    color: "#1a0030",
    desc: "Câu chuyện tình yêu đầy nước mắt giữa cô gái bình thường và vị tổng tài lạnh lùng. Số phận đưa đẩy hai con người hoàn toàn trái ngược gặp nhau.",
    tags: ["Ngôn tình", "Hiện đại", "Tổng tài"],
    chapters: [
      { name: "Chương 1: Gặp gỡ định mệnh", dur: 980 },
      { name: "Chương 2: Hợp đồng hôn nhân", dur: 1100 },
      { name: "Chương 3: Nhà Lâm Thị", dur: 1230 },
      { name: "Chương 4: Ghen tuông", dur: 1050 },
    ],
  },
  {
    id: 3,
    title: "Thiên Long Bát Bộ",
    author: "Kim Dung",
    genre: "kiem-hiep",
    emoji: "⚔️",
    color: "#001a30",
    desc: "Tác phẩm kinh điển của Kim Dung với ba nhân vật chính Tiêu Phong, Đoàn Dự, Hư Trúc và những cuộc phiêu lưu kỳ diệu trên chốn giang hồ.",
    tags: ["Kiếm hiệp", "Kinh điển", "Kim Dung"],
    chapters: [
      { name: "Chương 1: Tiêu Phong", dur: 2100 },
      { name: "Chương 2: Đoàn Dự xuất thế", dur: 1950 },
      { name: "Chương 3: Lục Mạch Thần Kiếm", dur: 2250 },
      { name: "Chương 4: Thiên Sơn Đồng Lão", dur: 2080 },
      { name: "Chương 5: Hư Trúc nhập môn", dur: 1890 },
      { name: "Chương 6: Thiếu Lâm bí kíp", dur: 2150 },
    ],
  },
  {
    id: 4,
    title: "Thám Tử Lừng Danh",
    author: "Nguyễn Hữu Trí",
    genre: "tham-tu",
    emoji: "🔍",
    color: "#001500",
    desc: "Thám tử Minh Khang với trí tuệ siêu phàm phá giải những vụ án ly kỳ nhất thành phố. Mỗi vụ án đều ẩn chứa bí mật không ngờ.",
    tags: ["Trinh thám", "Hiện đại", "Ly kỳ"],
    chapters: [
      { name: "Vụ 1: Căn phòng khóa kín", dur: 1560 },
      { name: "Vụ 2: Tên giết người ẩn danh", dur: 1780 },
      { name: "Vụ 3: Kẻ thừa kế bí ẩn", dur: 1640 },
    ],
  },
  {
    id: 5,
    title: "Vạn Cổ Tối Cường Tông",
    author: "Lão Hổ",
    genre: "tien-hiep",
    emoji: "⚡",
    color: "#1a1a00",
    desc: "Tông chủ bị ám hại đầu thai trở lại. Lần này, hắn sẽ không tha thứ cho bất kỳ kẻ thù nào. Xây dựng tông môn cường đại từ tro tàn.",
    tags: ["Tông môn", "Xuyên không", "Tu tiên"],
    chapters: [
      { name: "Chương 1: Đầu thai", dur: 1320 },
      { name: "Chương 2: Bí mật nội tâm", dur: 1450 },
      { name: "Chương 3: Tuyển đệ tử", dur: 1600 },
      { name: "Chương 4: Đại chiến", dur: 1750 },
    ],
  },
  {
    id: 6,
    title: "Hoàng Hôn Tuyết",
    author: "Mộc Lam",
    genre: "ngon-tinh",
    emoji: "❄️",
    color: "#001530",
    desc: "Cuộc tình ngang trái giữa cô sinh viên nghèo và thiếu gia nhà tài phiệt. Hai thế giới khác biệt, hai số phận giao thoa trong buổi hoàng hôn tuyết rơi.",
    tags: ["Ngôn tình", "Học đường", "Cảm động"],
    chapters: [
      { name: "Chương 1: Lần đầu gặp mặt", dur: 870 },
      { name: "Chương 2: Ngộ nhận", dur: 950 },
      { name: "Chương 3: Tan chảy", dur: 1020 },
    ],
  },
];

const genres = [
  { key: "all", label: "Tất cả" },
  { key: "tien-hiep", label: "Tiên Hiệp" },
  { key: "kiem-hiep", label: "Kiếm Hiệp" },
  { key: "ngon-tinh", label: "Ngôn Tình" },
  { key: "tham-tu", label: "Thám Tử" },
];

const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function App() {
  const [currentBook, setCurrentBook] = useState<Book>(books[0]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [activeGenre, setActiveGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const chapterRef = useRef(currentChapter);
  const bookRef = useRef(currentBook);
  const playingRef = useRef(isPlaying);

  useEffect(() => { chapterRef.current = currentChapter; }, [currentChapter]);
  useEffect(() => { bookRef.current = currentBook; }, [currentBook]);
  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const dur = bookRef.current.chapters[chapterRef.current].dur;
      progressRef.current += 1 / dur * 100;
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        if (chapterRef.current < bookRef.current.chapters.length - 1) {
          const next = chapterRef.current + 1;
          chapterRef.current = next;
          setCurrentChapter(next);
        } else {
          setIsPlaying(false);
          stopTimer();
        }
      }
      setProgress(progressRef.current);
    }, 100);
  };

  const selectBook = (book: Book) => {
    stopTimer();
    progressRef.current = 0;
    setProgress(0);
    setCurrentBook(book);
    setCurrentChapter(0);
    setIsPlaying(false);
  };

  const playChapter = (idx: number) => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentChapter(idx);
    chapterRef.current = idx;
    setIsPlaying(true);
    startTimer();
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTimer();
    } else {
      setIsPlaying(false);
      stopTimer();
    }
  };

  const seekRel = (secs: number) => {
    const dur = currentBook.chapters[currentChapter].dur;
    progressRef.current = Math.max(0, Math.min(100, progressRef.current + (secs / dur) * 100));
    setProgress(progressRef.current);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    progressRef.current = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setProgress(progressRef.current);
  };

  const prevChapter = () => { if (currentChapter > 0) playChapter(currentChapter - 1); };
  const nextChapter = () => { if (currentChapter < currentBook.chapters.length - 1) playChapter(currentChapter + 1); };
  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % speeds.length);

  const filteredBooks = books.filter((b) => {
    const matchGenre = activeGenre === "all" || b.genre === activeGenre;
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGenre && matchSearch;
  });

  const dur = currentBook.chapters[currentChapter].dur;
  const curSec = Math.floor((progress / 100) * dur);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            Truyện Audio
            <span>Thư viện nghe truyện</span>
          </div>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm truyện, tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="genre-tabs">
          {genres.map((g) => (
            <button
              key={g.key}
              className={`genre-tab${activeGenre === g.key ? " active" : ""}`}
              onClick={() => setActiveGenre(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="book-list">
          {filteredBooks.map((b) => (
            <div
              key={b.id}
              className={`book-item${b.id === currentBook.id ? " active" : ""}`}
              onClick={() => selectBook(b)}
            >
              <div className="book-thumb" style={{ background: b.color }}>{b.emoji}</div>
              <div className="book-meta">
                <div className="book-title">{b.title}</div>
                <div className="book-author">{b.author}</div>
                <div className="book-chapters">{b.chapters.length} chương</div>
              </div>
              {b.id === currentBook.id && isPlaying && <div className="book-playing" />}
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="main-content">
          <div className="hero-section">
            <div className="now-reading">Đang hiển thị</div>
            <div className="hero-card">
              <div className="hero-cover" style={{ background: currentBook.color }}>
                {currentBook.emoji}
              </div>
              <div className="hero-info">
                <div className="hero-title">{currentBook.title}</div>
                <div className="hero-author">✍ {currentBook.author}</div>
                <div className="hero-desc">{currentBook.desc}</div>
                <div className="hero-tags">
                  {currentBook.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <button className="btn-play" onClick={() => playChapter(0)}>
                  <span className="play-icon" />
                  Nghe từ đầu
                </button>
              </div>
            </div>
          </div>

          <div className="section-title">Danh sách chương</div>
          <div className="chapter-list">
            {currentBook.chapters.map((ch, i) => (
              <div
                key={i}
                className={`chapter-item${i === currentChapter ? " active" : ""}`}
                onClick={() => playChapter(i)}
              >
                <div className="ch-num">{i + 1}</div>
                <div className="ch-info">
                  <div className="ch-name">{ch.name}</div>
                  <div className="ch-duration">{formatTime(ch.dur)}</div>
                </div>
                {i === currentChapter && isPlaying && <div className="ch-status">▶ Đang phát</div>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Player */}
      <footer className="player">
        <div className="player-book">
          <div className="player-thumb" style={{ background: currentBook.color }}>
            {currentBook.emoji}
          </div>
          <div className="player-info">
            <div className="p-title">{currentBook.title}</div>
            <div className="p-chapter">{currentBook.chapters[currentChapter].name}</div>
          </div>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => seekRel(-15)} title="Lùi 15s">⏮</button>
            <button className="ctrl-btn" onClick={prevChapter} title="Chương trước">◀◀</button>
            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="#000" width="16" height="16"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="#000" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button className="ctrl-btn" onClick={nextChapter} title="Chương sau">▶▶</button>
            <button className="ctrl-btn" onClick={() => seekRel(15)} title="Tua 15s">⏭</button>
          </div>
          <div className="progress-bar">
            <span className="time">{formatTime(curSec)}</span>
            <div className="progress-track" onClick={seekTo}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="time">{formatTime(dur)}</span>
          </div>
        </div>

        <div className="player-right">
          <button className="speed-btn" onClick={cycleSpeed}>
            {speeds[speedIdx].toFixed(2).replace(/\.?0+$/, "")}x
          </button>
          <div className="vol-row">
            <span className="vol-icon">🔊</span>
            <input type="range" className="vol-slider" min="0" max="100" defaultValue="80" />
          </div>
        </div>
      </footer>
    </div>
  );
}
