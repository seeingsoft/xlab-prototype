import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  FlaskConical,
  Gamepad2,
  Gift,
  Image,
  Info,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { AdminPrototype, OperationsMobilePrototype } from "./AdminPrototype";
import { HelpPanel } from "./HelpPanel";
import "./styles.css";

type Screen = "discover" | "detail" | "register" | "success" | "showcase" | "profile" | "help";

const creationSteps = [
  { title: "认识任务", detail: "看懂小游戏目标和示例", icon: Lightbulb },
  { title: "选择分工", detail: "美术、逻辑、测试都重要", icon: Users },
  { title: "一起创作", detail: "用提示词和代码实现玩法", icon: Code2 },
  { title: "展示作品", detail: "讲讲创意、过程和收获", icon: Rocket },
];

const roles = [
  ["故事与美术", "设计角色、场景和故事", Image],
  ["玩法与逻辑", "描述规则，和 AI 一起实现", Code2],
  ["体验与测试", "试玩、找问题、提出改进", Gamepad2],
] as const;

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="site-header">
      <button className="wordmark" type="button" onClick={onHome} aria-label="返回课程首页">
        xlab
      </button>
      <div className="header-actions">
        <a className="family-map-entry" href={`${import.meta.env.BASE_URL}acceptance-map.html`}>验收地图</a>
        <div className="mode-chip"><Users size={18} aria-hidden="true" /> 家庭参与端 H5</div>
      </div>
    </header>
  );
}

function GamePreview() {
  return (
    <div className="game-preview" aria-label="合成小游戏成果预览">
      <div className="browser-bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="game-sky">
        <Rocket className="game-rocket" size={38} aria-hidden="true" />
        <Sparkles className="game-star" size={28} aria-hidden="true" />
        <span className="platform platform-one" />
        <span className="platform platform-two" />
        <span className="platform platform-three" />
      </div>
      <div className="game-caption"><Gamepad2 size={18} aria-hidden="true" /> 浏览器里直接玩</div>
    </div>
  );
}

function BottomNav({ screen, onChange }: { screen: Screen; onChange: (next: Screen) => void }) {
  const items = [
    { label: "课程", target: "discover" as const, icon: BookOpen },
    { label: "作品", target: "showcase" as const, icon: Image },
    { label: "我的", target: "profile" as const, icon: UserRound },
    { label: "帮助", target: "help" as const, icon: Info },
  ];

  return (
    <nav className="bottom-nav" aria-label="原型主导航">
      {items.map(({ label, target, icon: Icon }) => {
        const active = screen === target || (target === "discover" && ["detail", "register", "success"].includes(screen));
        return (
          <button
            key={target}
            type="button"
            className={active ? "nav-item active" : "nav-item"}
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(target)}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Discover({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="page discover-page" aria-labelledby="discover-title">
      <div className="intro-copy">
        <p className="prototype-note"><FlaskConical size={16} aria-hidden="true" /> 测试原型 · 合成课程</p>
        <h1 id="discover-title">找到今天的创造任务</h1>
        <p>孩子负责大胆想象，家长只需要帮忙确认课程和授权。</p>
      </div>

      <article className="featured-course">
        <div className="course-copy">
          <div className="course-tags">
            <span><Users size={16} aria-hidden="true" /> 7–15岁混龄</span>
            <span><Clock3 size={16} aria-hidden="true" /> 90分钟</span>
          </div>
          <h2>用 vibe Coding 做一个互动小游戏</h2>
          <p className="course-promise">做出一个能玩的浏览器小游戏</p>
          <p className="mixed-age-copy">同一个任务，每个人都能找到自己的分工</p>
          <button className="primary-button" type="button" onClick={onOpen}>
            看看这门课 <ArrowRight size={21} aria-hidden="true" />
          </button>
        </div>

        <div className="course-stage" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}assets/xlab-companion.png`} alt="" className="companion" />
          <GamePreview />
        </div>
      </article>

      <section className="more-section" aria-labelledby="more-title">
        <div>
          <h2 id="more-title">还可以创造</h2>
          <p>课程不按年龄排等级，找到感兴趣的任务就可以开始。</p>
        </div>
        <div className="course-rows">
          <button type="button" className="course-row" aria-label="查看用 AI 创作一个会动的故事，尚未开放">
            <span className="row-icon blue"><Image size={24} aria-hidden="true" /></span>
            <span><strong>用 AI 创作一个会动的故事</strong><small>混龄协作 · 图片、配音、动画</small></span>
            <span className="soon">即将加入</span>
          </button>
          <button type="button" className="course-row" aria-label="查看设计并发布你的第一个 AI App，尚未开放">
            <span className="row-icon coral"><Rocket size={24} aria-hidden="true" /></span>
            <span><strong>设计并发布你的第一个 AI App</strong><small>混龄协作 · 创意、原型、演示</small></span>
            <span className="soon">即将加入</span>
          </button>
        </div>
      </section>
    </section>
  );
}

function CourseDetail({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
  return (
    <section className="page detail-page" aria-labelledby="detail-title">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={20} aria-hidden="true" /> 返回课程</button>
      <div className="detail-heading">
        <p className="prototype-note"><Users size={16} aria-hidden="true" /> 混龄协作</p>
        <h1 id="detail-title">一起做出能玩的小游戏</h1>
        <p>同一个创造任务，不按年龄排等级。孩子可以从喜欢的分工开始，也可以在现场更换。</p>
      </div>

      <section className="teacher-section" aria-labelledby="teacher-title">
        <div className="teacher-avatar" aria-hidden="true">林</div>
        <div>
          <h2 id="teacher-title">授课老师</h2>
          <strong>林老师（合成示例）</strong>
          <p>本原型使用虚构老师资料。示例专长为儿童 AI 创作引导、互动游戏设计和混龄小组协作。</p>
        </div>
      </section>

      <section className="course-overview" aria-labelledby="overview-title">
        <h2 id="overview-title">这节课会做什么</h2>
        <p>孩子会先拆解一个简单小游戏，再用自然语言和代码与 AI 协作，完成角色、规则、得分和试玩反馈。</p>
        <ul className="plain-list">
          <li><strong>课程内容</strong><span>玩法构思、提示词表达、代码生成、试玩与迭代</span></li>
          <li><strong>完成成果</strong><span>一个可以在浏览器中运行并分享链接的互动小游戏</span></li>
          <li><strong>准备事项</strong><span>带一个想实现的玩法点子；设备由课程组织方最终确认</span></li>
        </ul>
      </section>

      <section className="path-section" aria-labelledby="path-title">
        <h2 id="path-title">课堂环节与进程</h2>
        <p>90 分钟合成示例；真实课程发布时由老师确认各环节时长。</p>

        <ol className="creation-path" aria-label="课程创作路径">
          {creationSteps.map(({ title, detail, icon: Icon }, index) => (
            <li key={title} className={index === 0 ? "path-step current" : "path-step"}>
              <span className="step-marker">{index === 0 ? <Check size={20} aria-hidden="true" /> : index + 1}</span>
              <span className="step-icon"><Icon size={26} aria-hidden="true" /></span>
              <span><strong>{title}</strong><small>{detail}</small></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="role-section" aria-labelledby="roles-title">
        <h2 id="roles-title">可以从哪种分工开始？</h2>
        <p>这些是选择，不是年龄或能力等级。</p>
        <div className="role-grid">
          {roles.map(([title, detail, Icon]) => (
            <article key={title} className="role-item">
              <Icon size={26} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="award-section" aria-labelledby="award-title">
        <Award size={28} aria-hidden="true" />
        <div>
          <h2 id="award-title">课程评选与奖励</h2>
          <p>不按年龄和完成速度排名。孩子展示创意与迭代过程，由同伴、老师共同反馈。</p>
          <ul className="award-list">
            <li><span>创意火花、最佳协作、最会迭代</span><strong>创作材料包（合成示例）</strong></li>
            <li><span>继续完善并完成课后展示</span><strong>100元团队项目基金（合成示例）</strong></li>
          </ul>
          <small>正式奖项、奖品和奖金须由课程组织者发布前确认。</small>
        </div>
      </section>

      <section className="after-class-section" aria-labelledby="after-class-title">
        <CalendarClock size={28} aria-hidden="true" />
        <div>
          <h2 id="after-class-title">课后项目</h2>
          <p>课程结束后 7 天内，可自愿继续完善小游戏，补充一个新关卡，并提交试玩链接与一句创作复盘。</p>
          <div className="project-reward"><Gift size={20} aria-hidden="true" /><span>完成后获得老师一次文字反馈和作品展厅候选资格；不会自动公开。</span></div>
          <small>期限、反馈形式和展示资格均为合成示例。</small>
        </div>
      </section>

      <aside className="safety-note">
        <ShieldCheck size={25} aria-hidden="true" />
        <div><strong>作品默认不会公开</strong><p>报名时由监护人选择展示范围，之后仍然可以撤回。</p></div>
      </aside>

      <button className="primary-button detail-cta" type="button" onClick={onRegister}>开始报名 <ArrowRight size={21} aria-hidden="true" /></button>
    </section>
  );
}

type RegistrationValues = { guardian: string; phone: string; visibility: string };

function Registration({ onBack, onSuccess }: { onBack: () => void; onSuccess: (values: RegistrationValues) => void }) {
  const [guardian, setGuardian] = useState("");
  const [phone, setPhone] = useState("");
  const [visibility, setVisibility] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guardian.trim() || !phone.trim()) {
      setError("请填写监护人称呼和联系手机号，然后再确认报名。");
      return;
    }
    if (!visibility) {
      setError("请选择作品展示范围，然后再确认报名。");
      return;
    }
    setError("");
    onSuccess({ guardian, phone, visibility });
  }

  return (
    <section className="page form-page" aria-labelledby="register-title">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={20} aria-hidden="true" /> 返回课程介绍</button>
      <div className="form-heading">
        <p className="prototype-note"><ShieldCheck size={16} aria-hidden="true" /> 家长确认步骤</p>
        <h1 id="register-title">用最少信息完成报名</h1>
        <p>这是测试原型，输入内容只保存在当前页面状态，不会发送或写入数据库。</p>
      </div>

      <form className="registration-form" onSubmit={submit} noValidate>
        <label>监护人称呼<input value={guardian} onChange={(event) => setGuardian(event.target.value)} required autoComplete="name" placeholder="例如：江妈妈" /></label>
        <label>联系手机号<input value={phone} onChange={(event) => setPhone(event.target.value)} required inputMode="tel" autoComplete="tel" placeholder="仅用于本次原型测试" /></label>

        <fieldset aria-describedby={error ? "visibility-error" : "visibility-help"}>
          <legend>作品展示范围</legend>
          <p id="visibility-help">这只是本次课程作品的选择，不代表以后自动同意。</p>
          {["仅家庭和老师可见", "仅课程成员可见", "持链接可见"].map((option) => (
            <label className="radio-option" key={option}>
              <input aria-label={option} type="radio" name="visibility" value={option} checked={visibility === option} onChange={(event) => setVisibility(event.target.value)} />
              <span className="radio-visual" aria-hidden="true"><Circle size={20} /><CheckCircle2 size={20} /></span>
              <span><strong>{option}</strong><small>{option === "持链接可见" ? "知道链接的人可以查看，仍可撤回" : "不会进入公开作品展厅"}</small></span>
            </label>
          ))}
        </fieldset>

        {error ? <p id="visibility-error" className="form-error" role="alert">{error}</p> : null}
        <button className="primary-button" type="submit">确认报名 <ArrowRight size={21} aria-hidden="true" /></button>
      </form>
    </section>
  );
}

function Success({ values, onHome }: { values: RegistrationValues; onHome: () => void }) {
  return (
    <section className="page success-page" aria-labelledby="success-title">
      <div className="success-mark" aria-hidden="true"><Check size={48} /></div>
      <h1 id="success-title">报名已记录</h1>
      <p className="success-lead">接下来只要准备一个大胆的小游戏想法。</p>

      <dl className="receipt">
        <div><dt>课程</dt><dd>用 vibe Coding 做一个互动小游戏</dd></div>
        <div><dt>教学方式</dt><dd>混龄协作 · 同一任务，不同分工</dd></div>
        <div><dt>作品范围</dt><dd>{values.visibility}</dd></div>
      </dl>

      <div className="prototype-warning"><FlaskConical size={22} aria-hidden="true" /><p>这是测试原型，没有发送通知或保存真实数据。</p></div>

      <section className="next-step" aria-labelledby="next-title">
        <h2 id="next-title">下一步</h2>
        <p>正式产品会在这里显示时间、地点、准备清单和取消入口。</p>
      </section>

      <button className="primary-button" type="button" onClick={onHome}>返回课程首页 <ArrowRight size={21} aria-hidden="true" /></button>
    </section>
  );
}

function Showcase() {
  return (
    <section className="page simple-page" aria-labelledby="showcase-title">
      <p className="prototype-note"><Sparkles size={16} aria-hidden="true" /> 合成作品预览</p>
      <h1 id="showcase-title">看看大家创造了什么</h1>
      <p>作品展厅将在下一轮实现图片、视频、音频和可运行 Web 作品的完整交互。</p>
      <div className="placeholder-panel"><Image size={46} aria-hidden="true" /><strong>多形态作品展厅</strong><span>当前仅验证入口和信息层级</span></div>
    </section>
  );
}

function Profile() {
  return (
    <section className="page simple-page" aria-labelledby="profile-title">
      <p className="prototype-note"><UserRound size={16} aria-hidden="true" /> 家庭参与端</p>
      <h1 id="profile-title">我的课程</h1>
      <p>正式产品将在这里显示家庭已报名课程、授权记录、课后项目和取消入口。</p>
      <div className="placeholder-panel"><CalendarClock size={46} aria-hidden="true" /><strong>还没有真实报名</strong><span>当前只验证入口和信息边界</span></div>
    </section>
  );
}

function FamilyPrototype() {
  const [screen, setScreen] = useState<Screen>("discover");
  const [registration, setRegistration] = useState<RegistrationValues>({ guardian: "", phone: "", visibility: "" });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
  }, [screen]);

  function navigate(next: Screen) {
    setScreen(next);
  }

  return (
    <div className="app-shell">
      <Header onHome={() => navigate("discover")} />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {screen === "discover" ? <Discover onOpen={() => navigate("detail")} /> : null}
        {screen === "detail" ? <CourseDetail onBack={() => navigate("discover")} onRegister={() => navigate("register")} /> : null}
        {screen === "register" ? <Registration onBack={() => navigate("detail")} onSuccess={(values) => { setRegistration(values); navigate("success"); }} /> : null}
        {screen === "success" ? <Success values={registration} onHome={() => navigate("discover")} /> : null}
        {screen === "showcase" ? <Showcase /> : null}
        {screen === "profile" ? <Profile /> : null}
        {screen === "help" ? <HelpPanel scope="family" /> : null}
      </main>
      {["discover", "showcase", "profile", "help"].includes(screen) ? <BottomNav screen={screen} onChange={navigate} /> : null}
      <p className="live-message" aria-live="polite">当前页面：{screen}</p>
    </div>
  );
}

export default function App() {
  const segments = window.location.pathname.split("/");
  if (segments.includes("admin")) return <AdminPrototype />;
  if (segments.includes("ops")) return <OperationsMobilePrototype />;
  return <FamilyPrototype />;
}
