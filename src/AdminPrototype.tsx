import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  Gamepad2,
  Hand,
  Image,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import {
  AuditSettingsPage,
  ExplorationEditorialPage,
  IdentityAccessPage,
  IntentWorkbench,
  MobileExplorationReview,
} from "./AdminV22Modules";
import "./admin.css";

type AdminView =
  | "dashboard"
  | "courses"
  | "workspace"
  | "new-course"
  | "tasks"
  | "new-task"
  | "people"
  | "iam"
  | "checkin"
  | "media"
  | "works"
  | "explore"
  | "approvals"
  | "agents"
  | "audit";
type WorkspaceTab = "总览" | "任务" | "参与者" | "交付物" | "时间线";
type CourseDraft = { name: string; teacher: string; time: string };
type VolunteerTask = { title: string; owner: string; backup: string; status: string };

const activeCourse = {
  name: "用 vibe Coding 做一个互动小游戏",
  teacher: "林老师（合成示例）",
  time: "8月16日 周日 14:00–15:30",
  place: "xlab 创作教室（合成示例）",
  capacity: "24 人 · 已报名 18 人",
};

const people = [
  "顾小满（合成示例）",
  "陆星河（合成示例）",
  "宋可可（合成示例）",
  "周一诺（合成示例）",
];

const lifecycle = [
  ["课程事实", "已确认", "done"],
  ["老师与物料", "进行中", "active"],
  ["报名与任务", "18 / 24", "active"],
  ["现场执行", "待开始", "upcoming"],
  ["回顾与作品", "待开始", "upcoming"],
] as const;

const initialTasks: VolunteerTask[] = [
  { title: "确认学员设备与浏览器", owner: "蔡老师（合成示例）", backup: "周老师（合成示例）", status: "进行中" },
  { title: "布置签到与家长等候区", owner: "马老师（合成示例）", backup: "赵老师（合成示例）", status: "待开始" },
  { title: "核对作品拍摄授权", owner: "江（合成示例）", backup: "林老师（合成示例）", status: "待决定" },
];

const navItems = [
  ["运营看板", "dashboard", LayoutDashboard],
  ["课程", "courses", CalendarDays],
  ["任务", "tasks", ListChecks],
  ["参与者", "people", Users],
  ["人员与权限", "iam", UserCog],
  ["现场签到", "checkin", UserCheck],
  ["AI 传播", "media", Sparkles],
  ["作品审核", "works", Gamepad2],
  ["探索编辑部", "explore", Newspaper],
  ["待批准", "approvals", Inbox],
  ["Agent 协作", "agents", Bot],
  ["审计与设置", "audit", ShieldCheck],
] as const;

function DirectionContract() {
  useEffect(() => {
    const root = document.querySelector(".admin-app, .ops-mobile");
    if (!root || root.previousSibling?.nodeType === Node.COMMENT_NODE) return;
    root.parentNode?.insertBefore(document.createComment(
      "THESIS: 课程生命周期是运营主语，不以卡片数字墙代替工作。 OWN-WORLD: 冷光白底、实验室紫动作、粗实线和触感控件。 STORY: 先看缺口，再进入课程，最后留下人工决定与回执。 FIRST VIEWPORT: 左侧模块导航，中部课程生命周期，右侧待决定；手机为今日行动队列。 FORM: 课程指挥台为主，三栏协作空间为详情，来源为 OPS-0 approved composition C+B. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md",
    ), root);
  }, []);
  return null;
}

function StatusTag({ tone = "neutral", children }: { tone?: "purple" | "blue" | "yellow" | "green" | "coral" | "neutral"; children: React.ReactNode }) {
  return <span className={`ops-tag ${tone}`}>{children}</span>;
}

function AdminSidebar({ view, onNavigate }: { view: AdminView; onNavigate: (view: AdminView) => void }) {
  return (
    <aside className="admin-sidebar">
      <button className="admin-brand" type="button" onClick={() => onNavigate("dashboard")} aria-label="返回运营看板">
        <span className="brand-mark">x</span><span>xlab</span>
      </button>
      <div className="surface-label"><FlaskConical size={17} aria-hidden="true" /> 运营管理 Web</div>
      <nav className="admin-nav" aria-label="运营主导航">
        {navItems.map(([label, target, Icon]) => (
          <button key={target} type="button" aria-label={label} className={view === target || (target === "courses" && ["workspace", "new-course"].includes(view)) ? "active" : ""} onClick={() => onNavigate(target)}>
            <Icon size={20} aria-hidden="true" /><span className="nav-label">{label}</span>
            {target === "approvals" ? <span className="nav-count">4</span> : null}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <span className="avatar">江</span>
        <span><strong>江（合成身份）</strong><small>产品与运营负责人</small></span>
      </div>
    </aside>
  );
}

function AdminHeader({ title, onNewCourse }: { title: string; onNewCourse: () => void }) {
  return (
    <header className="admin-topbar">
      <div><strong>{title}</strong><span>所有内容均为合成测试数据</span></div>
      <div className="topbar-actions">
        <label className="search-box" title="原型暂未开放"><Search size={18} aria-hidden="true" /><span className="sr-only">搜索（原型暂未开放）</span><input disabled placeholder="搜索课程、任务、参与者（原型暂未开放）" /></label>
        <button className="icon-button" type="button" aria-label="打开消息，原型暂未开放" disabled title="原型暂未开放"><MessageSquareText size={20} /></button>
        <a className="ops-secondary compact ops-map-entry" href="/acceptance-map.html">验收地图</a>
        <button className="ops-primary compact" type="button" onClick={onNewCourse}><Plus size={18} /> 新建课程</button>
      </div>
    </header>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (view: AdminView) => void }) {
  return (
    <div className="admin-page dashboard-page">
      <section className="dashboard-heading" aria-labelledby="dashboard-title">
        <div>
          <h1 id="dashboard-title">今天先处理 4 件事</h1>
          <p>系统只把需要人判断、异常和到期事项放到这里；Agent 内部过程默认不打扰你。</p>
        </div>
        <div className="today-date"><CalendarDays size={20} /><span><strong>8月10日</strong><small>周一 · 合成日期</small></span></div>
      </section>

      <IntentWorkbench onOpenExplore={() => onNavigate("explore")} />

      <section className="priority-ribbon" aria-label="今日优先事项">
        <button type="button" onClick={() => onNavigate("checkin")}><span className="priority-number coral">1</span><span><strong>签到名单</strong><small>4 条信息待核对</small></span><ChevronRight size={18} /></button>
        <button type="button" onClick={() => onNavigate("media")}><span className="priority-number yellow">2</span><span><strong>传播草稿</strong><small>小红书文案待确认</small></span><ChevronRight size={18} /></button>
        <button type="button" onClick={() => onNavigate("works")}><span className="priority-number blue">3</span><span><strong>作品授权</strong><small>1 件待补充</small></span><ChevronRight size={18} /></button>
        <button type="button" onClick={() => onNavigate("approvals")}><span className="priority-number purple">4</span><span><strong>课程变更</strong><small>时间调整待决定</small></span><ChevronRight size={18} /></button>
      </section>

      <div className="dashboard-main-grid">
        <section className="course-command" aria-labelledby="active-course-title">
          <div className="course-command-head">
            <div className="course-symbol"><Gamepad2 size={32} /></div>
            <div><h2 id="active-course-title">{activeCourse.name}</h2><p>{activeCourse.time} · {activeCourse.place}</p></div>
            <StatusTag tone="purple">筹备中</StatusTag>
            <button className="ops-secondary" type="button" onClick={() => onNavigate("workspace")}>打开课程协作空间 <ArrowRight size={17} /></button>
          </div>
          <ol className="lifecycle" aria-label="课程生命周期">
            {lifecycle.map(([label, value, state], index) => (
              <li key={label} className={state}>
                <span className="stage-dot">{state === "done" ? <Check size={17} /> : index + 1}</span>
                <strong>{label}</strong><small>{value}</small>
              </li>
            ))}
          </ol>
          <div className="course-facts-strip">
            <span><strong>老师</strong>{activeCourse.teacher}</span>
            <span><strong>报名</strong>{activeCourse.capacity}</span>
            <span><strong>现场任务</strong>5 项 · 1 项缺备份</span>
            <span><strong>作品范围</strong>默认不公开</span>
          </div>
        </section>

        <aside className="decision-queue" aria-labelledby="decision-title">
          <div className="section-heading"><div><h2 id="decision-title">待人工决定</h2><p>高影响动作不会由 Agent 代替你完成</p></div><StatusTag tone="yellow">4 项</StatusTag></div>
          <button type="button" onClick={() => onNavigate("approvals")}><span className="decision-icon yellow"><CalendarDays size={20} /></span><span><strong>确认课程时间调整</strong><small>影响老师、18 个家庭和 3 位志愿者</small></span><ChevronRight size={18} /></button>
          <button type="button" onClick={() => onNavigate("media")}><span className="decision-icon purple"><FileText size={20} /></span><span><strong>审核小红书草稿</strong><small>AI 草稿 · 尚未公开</small></span><ChevronRight size={18} /></button>
          <button type="button" onClick={() => onNavigate("works")}><span className="decision-icon blue"><Image size={20} /></span><span><strong>补充作品公开授权</strong><small>太空接水果 · 1 件</small></span><ChevronRight size={18} /></button>
          <button type="button" onClick={() => onNavigate("tasks")}><span className="decision-icon coral"><Users size={20} /></span><span><strong>为现场任务指定备份</strong><small>开始前必须有人可接替</small></span><ChevronRight size={18} /></button>
        </aside>
      </div>

      <div className="dashboard-secondary-grid">
        <section className="readiness-list" aria-labelledby="readiness-title">
          <div className="section-heading"><div><h2 id="readiness-title">开课就绪检查</h2><p>只显示阻塞课程的事实缺口</p></div><button className="text-button" type="button" onClick={() => onNavigate("workspace")}>查看全部</button></div>
          <div><CheckCircle2 className="success" size={21} /><span><strong>课程内容与流程</strong><small>老师已确认 4 个课堂环节</small></span><StatusTag tone="green">完成</StatusTag></div>
          <div><AlertCircle className="warning" size={21} /><span><strong>志愿任务备份</strong><small>作品拍摄任务仍缺备份</small></span><StatusTag tone="yellow">需处理</StatusTag></div>
          <div><ShieldCheck className="info" size={21} /><span><strong>家长授权说明</strong><small>报名页已展示逐用途说明</small></span><StatusTag tone="blue">已检查</StatusTag></div>
        </section>
        <section className="agent-summary" aria-labelledby="agent-summary-title">
          <div className="section-heading"><div><h2 id="agent-summary-title">Agent 协作摘要</h2><p>4 个受控 Agent，仅汇报结果和阻塞</p></div><button className="text-button" type="button" onClick={() => onNavigate("agents")}>查看交接</button></div>
          <div className="agent-run"><span className="agent-badge purple"><Bot size={20} /></span><span><strong>课程运营 Agent</strong><small>完成 7 项事实检查，发现 1 个缺口</small></span><StatusTag tone="green">完成</StatusTag></div>
          <div className="agent-run"><span className="agent-badge blue"><Sparkles size={20} /></span><span><strong>AI 传播助手</strong><small>生成 3 个渠道草稿，等待人工审核</small></span><StatusTag tone="yellow">待确认</StatusTag></div>
        </section>
      </div>
    </div>
  );
}

function CourseWorkspace({ tab, onTab, onBack }: { tab: WorkspaceTab; onTab: (tab: WorkspaceTab) => void; onBack: () => void }) {
  const content = {
    总览: <WorkspaceOverview />,
    任务: <WorkspaceTasks />,
    参与者: <WorkspacePeople />,
    交付物: <WorkspaceDeliverables />,
    时间线: <WorkspaceTimeline />,
  }[tab];
  return (
    <div className="admin-page workspace-page">
      <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={18} /> 返回课程列表</button>
      <div className="workspace-title-row">
        <div><h1>课程协作空间</h1><p>{activeCourse.name} · {activeCourse.time}</p></div>
        <div><StatusTag tone="purple">筹备中</StatusTag><button className="ops-secondary" type="button" disabled title="正式产品接入文件服务后开放"><Download size={17} /> 导出课程包 · 原型暂未开放</button><button className="more-button" type="button" aria-label="更多课程操作，原型暂未开放" disabled title="原型暂未开放"><MoreHorizontal /></button></div>
      </div>
      <div className="workspace-shell">
        <aside className="course-switcher">
          <label title="当前原型只展示已选课程"><span className="sr-only">搜索课程（原型暂未开放）</span><Search size={17} /><input disabled placeholder="搜索课程（原型暂未开放）" /></label>
          <button type="button" className="active" disabled title="当前课程"><span className="course-dot purple" /><span><strong>{activeCourse.name}</strong><small>筹备中 · 8月16日</small></span><ChevronRight size={17} /></button>
          <button type="button" disabled title="该课程不在本轮交互范围"><span className="course-dot blue" /><span><strong>AI 动画故事工作坊</strong><small>报名中 · 合成示例 · 原型暂未开放</small></span><ChevronRight size={17} /></button>
          <button type="button" disabled title="该课程不在本轮交互范围"><span className="course-dot neutral" /><span><strong>AI 音乐创作体验</strong><small>草稿 · 合成示例 · 原型暂未开放</small></span><ChevronRight size={17} /></button>
        </aside>
        <section className="workspace-content">
          <div className="workspace-tabs" role="tablist" aria-label="课程协作内容">
            {(["总览", "任务", "参与者", "交付物", "时间线"] as WorkspaceTab[]).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => onTab(item)}>{item}</button>)}
          </div>
          {content}
        </section>
        <aside className="context-panel">
          <h2>课程事实</h2>
          <dl><div><dt>老师</dt><dd>{activeCourse.teacher}</dd></div><div><dt>时间</dt><dd>{activeCourse.time}</dd></div><div><dt>地点</dt><dd>{activeCourse.place}</dd></div><div><dt>容量</dt><dd>{activeCourse.capacity}</dd></div><div><dt>负责人</dt><dd>江（合成示例）</dd></div></dl>
          <div className="context-check"><ShieldCheck size={22} /><span><strong>发布前检查</strong><small>报名信息完整，作品默认不公开；1 项志愿任务缺备份。</small></span></div>
          <button className="ops-secondary full" type="button" disabled title="正式产品接入课程版本编辑后开放">编辑课程事实 · 原型暂未开放</button>
        </aside>
      </div>
    </div>
  );
}

function WorkspaceOverview() {
  return <div className="workspace-view"><section className="workspace-lead"><div><h2>本周要让这门课顺利发生</h2><p>老师教学包已确认，报名开放中。下一步补齐现场任务备份并核对签到名单。</p></div><StatusTag tone="yellow">1 个阻塞</StatusTag></section><div className="overview-columns"><section><h3>下一步</h3><ul className="task-lines"><li><span className="check-box" /><span><strong>补充作品拍摄任务备份</strong><small>今天 18:00 前 · 江</small></span><StatusTag tone="yellow">待决定</StatusTag></li><li><span className="check-box done"><Check size={14} /></span><span><strong>老师确认课堂流程</strong><small>昨天 16:20 · 林老师</small></span><StatusTag tone="green">完成</StatusTag></li><li><span className="check-box" /><span><strong>发送课前提醒</strong><small>8月15日 18:00 · 需人工确认</small></span><StatusTag tone="blue">已准备</StatusTag></li></ul></section><section><h3>最近回执</h3><div className="receipt-line"><span className="avatar small">林</span><span><strong>教学包已确认</strong><small>“流程与物料可以按当前版本执行。”</small></span><time>昨天</time></div><div className="receipt-line"><span className="avatar small blue">陈</span><span><strong>已领取现场任务</strong><small>预计用时 30 分钟</small></span><time>2小时前</time></div></section></div></div>;
}

function WorkspaceTasks() {
  return <div className="workspace-view"><div className="view-heading"><div><h2>课程任务</h2><p>每项任务都有主责、备份、截止时间和回执。</p></div><button className="ops-primary compact" type="button" disabled title="请从主任务模块新建"><Plus size={17} /> 新建任务 · 请前往任务模块</button></div><div className="data-table"><div className="table-head"><span>任务</span><span>负责人</span><span>截止</span><span>状态</span></div>{initialTasks.map((task) => <div className="table-row" key={task.title}><span><strong>{task.title}</strong><small>预估 20–30 分钟</small></span><span>{task.owner}</span><span>8月15日</span><span><StatusTag tone={task.status === "待决定" ? "yellow" : task.status === "进行中" ? "blue" : "neutral"}>{task.status}</StatusTag></span></div>)}</div></div>;
}

function WorkspacePeople() {
  return <div className="workspace-view"><div className="view-heading"><div><h2>参与者</h2><p>报名、老师和志愿者都围绕当前课程组织。</p></div><button className="ops-secondary" type="button" disabled title="正式产品接入导出后开放"><Download size={17} /> 导出名单 · 原型暂未开放</button></div><div className="people-summary"><span><strong>18</strong>已报名</span><span><strong>2</strong>候补</span><span><strong>1</strong>老师</span><span><strong>3</strong>志愿者</span></div><ul className="person-list">{people.map((name, index) => <li key={name}><span className={`avatar small ${index % 2 ? "blue" : ""}`}>{name.slice(0, 1)}</span><span><strong>{name}</strong><small>监护人已完成报名 · 作品默认不公开</small></span><StatusTag tone="green">已确认</StatusTag></li>)}</ul></div>;
}

function WorkspaceDeliverables() {
  return <div className="workspace-view"><div className="view-heading"><div><h2>交付物</h2><p>事实、草稿和人工确认版本分开标识。</p></div></div><div className="deliverable-list"><button type="button" disabled title="交付物详情原型暂未开放"><span className="deliverable-icon purple"><FileCheck2 /></span><span><strong>老师教学包 v3</strong><small>人工确认 · 8月9日 16:20 · 原型暂未开放</small></span><StatusTag tone="green">可执行</StatusTag><ChevronRight /></button><button type="button" disabled title="请从 AI 传播模块查看"><span className="deliverable-icon blue"><Sparkles /></span><span><strong>课前传播包 v2</strong><small>AI 草稿 · 请从 AI 传播模块查看</small></span><StatusTag tone="yellow">待审核</StatusTag><ChevronRight /></button><button type="button" disabled title="请从作品审核模块查看"><span className="deliverable-icon yellow"><Image /></span><span><strong>作品展示候选</strong><small>合成示例 · 请从作品审核模块查看</small></span><StatusTag tone="neutral">待课程后</StatusTag><ChevronRight /></button></div></div>;
}

function WorkspaceTimeline() {
  return <div className="workspace-view"><div className="view-heading"><div><h2>时间线</h2><p>只记录可追溯的业务动作和回执，不把 Agent 对话当作事实。</p></div></div><ol className="timeline"><li><span /><div><strong>老师确认教学包 v3</strong><p>林老师（合成示例）确认流程与物料可执行。</p><time>8月9日 16:20</time></div></li><li><span /><div><strong>AI 传播助手生成 3 个渠道草稿</strong><p>输入来自已确认课程事实；所有草稿等待人工审核。</p><time>8月9日 15:42</time></div></li><li><span /><div><strong>报名达到 18 人</strong><p>容量 24 人，尚未触发候补转换。</p><time>8月9日 11:08</time></div></li></ol></div>;
}

function CoursesPage({ courses, onNew, onWorkspace }: { courses: CourseDraft[]; onNew: () => void; onWorkspace: () => void }) {
  return <div className="admin-page"><div className="page-title-row"><div><h1>课程</h1><p>课程场次是老师、报名、任务、作品和传播内容的共同主线。</p></div><button className="ops-primary" type="button" onClick={onNew}><Plus size={18} /> 新建课程</button></div><div className="course-list"><button type="button" onClick={onWorkspace}><span className="course-symbol small"><Gamepad2 /></span><span><strong>{activeCourse.name}</strong><small>{activeCourse.time} · {activeCourse.teacher}</small></span><StatusTag tone="purple">筹备中</StatusTag><span className="course-progress">事实 100% · 报名 18 / 24</span><ChevronRight /></button>{courses.map((course) => <button type="button" key={course.name} disabled title="草稿详情原型暂未开放"><span className="course-symbol small blue"><Sparkles /></span><span><strong>{course.name}</strong><small>{course.time} · {course.teacher} · 原型暂未开放</small></span><StatusTag>草稿</StatusTag><span className="course-progress">需补齐流程与容量</span><ChevronRight /></button>)}<button type="button" disabled title="该课程不在本轮交互范围"><span className="course-symbol small yellow"><Image /></span><span><strong>AI 动画故事工作坊（合成示例）</strong><small>8月23日 14:00 · 赵老师（合成示例） · 原型暂未开放</small></span><StatusTag tone="blue">报名中</StatusTag><span className="course-progress">报名 12 / 20</span><ChevronRight /></button></div></div>;
}

function NewCoursePage({ onCancel, onSave }: { onCancel: () => void; onSave: (draft: CourseDraft) => void }) {
  const [values, setValues] = useState<CourseDraft>({ name: "", teacher: "", time: "" });
  const [error, setError] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!values.name.trim() || !values.teacher.trim() || !values.time.trim()) { setError("请补齐课程名称、授课老师和上课时间，然后再保存草稿。"); return; } onSave(values); }
  return <div className="admin-page narrow-page"><button className="back-link" type="button" onClick={onCancel}><ArrowLeft size={18} /> 返回课程</button><div className="page-title-row"><div><h1>新建课程</h1><p>先保存可追溯的课程事实，再交给 Agent 准备任务和内容草稿。</p></div><StatusTag>合成原型</StatusTag></div><form className="ops-form" onSubmit={submit} noValidate><section><h2>基本事实</h2><div className="form-grid"><label>课程名称<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="例如：AI 音乐创作实验室" /></label><label>授课老师<input value={values.teacher} onChange={(e) => setValues({ ...values, teacher: e.target.value })} placeholder="使用合成示例姓名" /></label><label>上课时间<input value={values.time} onChange={(e) => setValues({ ...values, time: e.target.value })} placeholder="例如：2026-08-22 14:00" /></label><label>预计容量<input defaultValue="20" inputMode="numeric" /></label><label className="span-two">课程目标<textarea defaultValue="让混龄小组完成一件可展示的 AI 创作作品。" /></label></div></section><section><h2>报名页必须说明</h2><div className="form-grid"><label className="span-two">课程内容、环节和进程<textarea defaultValue="认识任务 → 选择分工 → 一起创作 → 展示与反馈" /></label><label>课程评选<textarea defaultValue="不按年龄和速度排名；关注创意、协作与迭代。" /></label><label>奖品或奖金<textarea defaultValue="待课程负责人确认，发布前不得显示为事实。" /></label><label className="span-two">课后项目<textarea defaultValue="7 天内自愿完善作品；经老师反馈后成为展厅候选，不自动公开。" /></label></div></section>{error ? <p className="inline-error" role="alert">{error}</p> : null}<div className="form-actions"><button className="ops-secondary" type="button" onClick={onCancel}>取消</button><button className="ops-primary" type="submit">保存为草稿</button></div></form></div>;
}

function TasksPage({ tasks, onNew }: { tasks: VolunteerTask[]; onNew: () => void }) {
  const filters = ["全部", "待决定", "进行中", "已完成"];
  const [filter, setFilter] = useState("全部");
  const visibleTasks = filter === "全部" ? tasks : tasks.filter((task) => task.status === filter);
  return <div className="admin-page"><div className="page-title-row"><div><h1>志愿任务</h1><p>把模糊的“帮一下忙”变成有边界、有时限、有备份的微任务。</p></div><button className="ops-primary" type="button" onClick={onNew}><Plus size={18} /> 新建志愿任务</button></div><div className="task-toolbar"><div className="segmented" aria-label="任务筛选">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>{item} {item === "全部" ? tasks.length : tasks.filter((task) => task.status === item).length}</button>)}</div><button className="ops-secondary compact" type="button" disabled title="正式产品接入导出后开放"><Download size={17} /> 导出任务表 · 原型暂未开放</button></div>{visibleTasks.length ? <div className="task-board">{visibleTasks.map((task, index) => <article key={`${task.title}-${index}`}><div className="task-card-head"><StatusTag tone={task.status === "待决定" ? "yellow" : task.status === "进行中" ? "blue" : "neutral"}>{task.status}</StatusTag><button className="more-button" type="button" aria-label={`更多：${task.title}，原型暂未开放`} disabled title="原型暂未开放"><MoreHorizontal /></button></div><h2>{task.title}</h2><p>目标：让课程现场按清单就绪；预计用时 30 分钟，8月16日 13:30 前完成。</p><dl><div><dt className="sr-only">主责</dt><dd>主责：{task.owner}</dd></div><div><dt className="sr-only">备份</dt><dd>备份：{task.backup}</dd></div></dl><button className="ops-secondary full" type="button" disabled title="任务详情原型暂未开放">查看清单与回执 · 原型暂未开放</button></article>)}</div> : <div className="empty-state"><ClipboardCheck size={40} /><h2>当前筛选没有任务</h2><p>这是可验证的空状态；切换筛选可返回其他任务。</p></div>}</div>;
}

function NewTaskPage({ onCancel, onSave }: { onCancel: () => void; onSave: (task: VolunteerTask) => void }) {
  const [title, setTitle] = useState(""); const [owner, setOwner] = useState(""); const [backup, setBackup] = useState(""); const [error, setError] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!title || !owner || !backup) { setError("请补齐任务名称、主责和备份对象。"); return; } onSave({ title, owner, backup, status: "待开始" }); }
  return <div className="admin-page narrow-page"><button className="back-link" type="button" onClick={onCancel}><ArrowLeft size={18} /> 返回任务</button><div className="page-title-row"><div><h1>新建志愿任务</h1><p>任务必须有明确边界和求助路径，避免无边界承诺。</p></div></div><form className="ops-form" onSubmit={submit}><section><div className="form-grid"><label className="span-two">任务名称<input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>主责志愿者<select value={owner} onChange={(e) => setOwner(e.target.value)}><option value="">请选择</option><option>陈老师（合成示例）</option><option>江（合成示例）</option></select></label><label>备份与求助对象<select value={backup} onChange={(e) => setBackup(e.target.value)}><option value="">请选择</option><option>江（合成示例）</option><option>林老师（合成示例）</option></select></label><label>预计用时<input defaultValue="30 分钟" /></label><label>截止时间<input defaultValue="8月16日 13:30" /></label><label className="span-two">完成清单<textarea defaultValue={"确认场地范围\n按清单摆放物料\n拍摄不含人脸的完成证据"} /></label></div></section>{error ? <p className="inline-error" role="alert">{error}</p> : null}<div className="form-actions"><button className="ops-secondary" type="button" onClick={onCancel}>取消</button><button className="ops-primary" type="submit">保存任务</button></div></form></div>;
}

function PeoplePage() {
  const [group, setGroup] = useState("家庭报名");
  const groups = ["家庭报名", "老师", "志愿者", "参与意向"];
  return <div className="admin-page"><div className="page-title-row"><div><h1>参与者与意向</h1><p>只收集完成课程协作与 48 小时跟进所必需的信息。</p></div><button className="ops-secondary" type="button" disabled title="正式产品接入导出后开放"><Download size={17} /> 导出当前列表 · 原型暂未开放</button></div><div className="people-tabs" role="tablist" aria-label="参与者类型">{groups.map((item) => <button key={item} type="button" role="tab" aria-selected={group === item} className={group === item ? "active" : ""} onClick={() => setGroup(item)}>{item}{item === "参与意向" ? " 3" : ""}</button>)}</div>{group === "家庭报名" ? <div className="people-table"><div className="table-head"><span>学员展示名</span><span>监护人</span><span>报名状态</span><span>作品范围</span><span>操作</span></div>{people.map((name, index) => <div className="table-row" key={name}><span><strong>{name}</strong><small>7–15 岁混龄 · 不设年龄等级</small></span><span>{["顾女士", "陆先生", "宋女士", "周先生"][index]}（合成）</span><span><StatusTag tone="green">已报名</StatusTag></span><span>{index === 0 ? "仅课程成员" : "仅家庭与老师"}</span><span><button className="text-button" type="button" disabled title="参与者详情原型暂未开放">查看 · 原型暂未开放</button></span></div>)}</div> : <EmptyGroup group={group} />}</div>;
}

function EmptyGroup({ group }: { group: string }) { return <div className="empty-state"><Users size={40} /><h2>{group}列表已准备</h2><p>原型保留筛选、导出和人工跟进结构，当前仅展示合成状态。</p><button className="ops-secondary" type="button" disabled title="该角色样例不在本轮交互范围">查看合成样例 · 原型暂未开放</button></div>; }

function CheckinPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pendingCorrection, setPendingCorrection] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionError, setCorrectionError] = useState("");

  function toggle(name: string) {
    if (checked.includes(name)) {
      setPendingCorrection(name);
      setCorrectionReason("");
      setCorrectionError("");
      return;
    }
    setChecked([...checked, name]);
    setMessage("签到状态已记录在当前页面；正式产品会保留服务端回执。");
  }

  function saveCorrection() {
    if (!correctionReason.trim()) {
      setCorrectionError("请填写修正原因，然后再保存。");
      return;
    }
    if (checked.includes(pendingCorrection)) {
      setChecked(checked.filter((item) => item !== pendingCorrection));
    }
    setPendingCorrection("");
    setCorrectionError("");
    setMessage("签到修正已记录，并生成可追溯回执。");
  }

  return (
    <div className="admin-page">
      <div className="page-title-row"><div><h1>现场签到</h1><p>{activeCourse.name} · 名单以报名状态为准，人工修正必须填写原因。</p></div><div className="checkin-count"><strong>{checked.length}</strong><span>/ {people.length} 已到场</span></div></div>
      <div className="checkin-layout">
        <section className="checkin-list">
          <div className="checkin-toolbar"><label><Search size={18} /><span className="sr-only">搜索名单</span><input placeholder="搜索展示名或监护人" /></label><StatusTag tone="blue">现场模式</StatusTag></div>
          {people.map((name, index) => <label key={name}><input type="checkbox" aria-label={name} checked={checked.includes(name)} onChange={() => toggle(name)} /><span className={`check-avatar ${checked.includes(name) ? "checked" : ""}`}>{checked.includes(name) ? <Check /> : name.slice(0, 1)}</span><span><strong>{name}</strong><small>监护人：{["顾女士", "陆先生", "宋女士", "周先生"][index]}（合成示例）</small></span><span className="check-status">{checked.includes(name) ? "已签到" : "待到场"}</span></label>)}
          {pendingCorrection ? <section className="correction-panel" aria-labelledby="correction-title"><h2 id="correction-title">签到修正原因</h2><p>{checked.includes(pendingCorrection) ? `将“${pendingCorrection}”从已签到改为未到场。` : "记录临时到场或弱网补录。"}</p><label>修正原因<textarea value={correctionReason} onChange={(event) => setCorrectionReason(event.target.value)} placeholder="说明谁确认了什么，以及为什么需要修正" /></label>{correctionError ? <p className="inline-error" role="alert">{correctionError}</p> : null}<div><button className="ops-secondary compact" type="button" onClick={() => setPendingCorrection("")}>取消</button><button className="ops-primary compact" type="button" onClick={saveCorrection}>保存签到修正</button></div></section> : null}
          {message ? <p className="inline-success" aria-live="polite">{message}</p> : null}
        </section>
        <aside className="onsite-checklist"><h2>现场清单</h2><label><input type="checkbox" defaultChecked /> 设备与网络已检查</label><label><input type="checkbox" defaultChecked /> 老师教学包可离线查看</label><label><input type="checkbox" /> 作品拍摄授权再次口头提醒</label><label><input type="checkbox" /> 异常联系人保持在线</label><div className="offline-note"><AlertCircle size={21} /><span><strong>弱网时怎么做</strong><small>导出当前名单并纸笔签到；恢复后逐条补录，禁止用本地伪成功覆盖服务端状态。</small></span></div><button className="ops-secondary full" type="button" onClick={() => { setPendingCorrection("临时到场或弱网补录"); setCorrectionReason(""); }}>记录临时到场或弱网补录</button><button className="ops-secondary full" type="button" disabled title="正式产品接入导出后开放"><Download size={17} /> 导出签到表 · 原型暂未开放</button></aside>
      </div>
    </div>
  );
}

function MediaPage() {
  const channels = ["小红书", "公众号", "视频号", "家长群"];
  const body = "这一次，我们不从“先学会多少代码”开始，而是从一个想玩的游戏点子开始。\n\n7–15 岁孩子完成同一个创造任务，可以选择故事、美术、玩法、逻辑或测试分工。老师会带大家拆解任务，并和 AI 一起完成可以在浏览器里运行的小游戏。\n\n【待确认】正式场地与设备清单将在报名开放前补充。";
  const [channel, setChannel] = useState("小红书");
  const [drafts, setDrafts] = useState<Record<string, { title: string; body: string }>>({
    小红书: { title: "孩子也能把一个点子做成可玩的小游戏", body },
    公众号: { title: "xlab 混龄创造课：一起完成互动小游戏", body },
    视频号: { title: "90 秒看见一个游戏点子怎样变成作品", body },
    家长群: { title: "本周 xlab 创造课报名提醒", body },
  });
  const [approved, setApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const draft = drafts[channel];
  function updateDraft(field: "title" | "body", value: string) { setDrafts({ ...drafts, [channel]: { ...draft, [field]: value } }); setApproved(false); }
  function switchChannel(next: string) { setChannel(next); setApproved(false); setCopied(false); }
  return <div className="admin-page media-page"><div className="page-title-row"><div><h1>AI 传播助手</h1><p>已确认事实一次录入，多渠道生成；事实、AI 表达和待确认项始终分开。</p></div><StatusTag tone="yellow">AI 草稿 · 尚未公开</StatusTag></div><div className="media-shell"><aside className="brief-panel"><h2>权威事实包</h2><p>以下内容由课程负责人确认，传播助手只读。</p><dl><div><dt>课程</dt><dd>{activeCourse.name}</dd></div><div><dt>老师</dt><dd>{activeCourse.teacher}</dd></div><div><dt>成果</dt><dd>混龄小组完成可玩的浏览器小游戏</dd></div><div><dt>报名截止</dt><dd>8月15日 18:00（合成）</dd></div></dl><h3>素材检查</h3><div className="asset-check"><CheckCircle2 /><span><strong>课程封面</strong><small>可用于课程招募 · 合成授权</small></span></div><div className="asset-check"><AlertCircle /><span><strong>学员作品截图</strong><small>课前草稿不得使用</small></span></div><div className="guardrail"><ShieldCheck /><span><strong>没有发布工具</strong><small>平台只提供预览、复制和导出，公开发布必须由具名人员在渠道侧完成。</small></span></div></aside><section className="draft-editor"><div className="channel-tabs" role="tablist" aria-label="传播渠道">{channels.map((item) => <button key={item} type="button" role="tab" aria-selected={channel === item} className={channel === item ? "active" : ""} onClick={() => switchChannel(item)}>{item}</button>)}</div><div className="draft-meta"><span><strong>{channel}课程介绍 v2</strong><small>由 AI 传播助手生成 · 基于 4 条已确认事实</small></span><StatusTag tone={approved ? "green" : "yellow"}>{approved ? "人工已确认" : "待人工确认"}</StatusTag></div><label className="draft-title">标题<input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} /></label><label className="draft-body">正文<textarea value={draft.body} onChange={(event) => updateDraft("body", event.target.value)} /></label><div className="draft-legend"><span><i className="fact" /> 已确认事实</span><span><i className="ai" /> AI 表达</span><span><i className="pending" /> 待确认</span></div>{approved ? <p className="inline-success" aria-live="polite">已人工确认，可复制或导出；平台不会替你发布。</p> : null}{copied ? <p className="inline-success" aria-live="polite">草稿已模拟复制，不会写入真实渠道。</p> : null}<div className="editor-actions"><button className="ops-secondary" type="button" onClick={() => updateDraft("body", `${draft.body}\n\n【合成重写】已保留原事实，仅调整当前渠道表达。`)}><RefreshCw size={17} /> 只重写当前渠道</button><button className="ops-secondary" type="button" onClick={() => setCopied(true)}><Copy size={17} /> 复制草稿</button><button className="ops-primary" type="button" onClick={() => setApproved(true)}><Check size={17} /> 确认草稿可供人工发布</button></div></section></div></div>;
}

function WorksPage() {
  const [selected, setSelected] = useState("");
  const [authorizationReceipt, setAuthorizationReceipt] = useState(false);
  const [visibility, setVisibility] = useState("course");
  const [reviewer, setReviewer] = useState("");
  const [approved, setApproved] = useState(false);
  if (!selected) return <div className="admin-page"><div className="page-title-row"><div><h1>作品审核</h1><p>统一作品容器根据类型选择展示方式；默认不公开，不安全的作品降级展示。</p></div><StatusTag tone="yellow">2 件待审核</StatusTag></div><div className="work-grid"><button type="button" aria-label="太空接水果" onClick={() => setSelected("太空接水果")}><div className="work-preview game"><Gamepad2 size={46} /><span>Web 游戏封面 · 合成</span></div><span><strong>太空接水果</strong><small>静态 Web App · 安全检查已通过</small></span><StatusTag tone="yellow">授权待补充</StatusTag></button><button type="button" aria-label="会讲故事的天气灯，原型暂未开放" disabled title="该作品不在本轮交互范围"><div className="work-preview video"><Image size={46} /><span>演示视频封面 · 合成</span></div><span><strong>会讲故事的天气灯</strong><small>AI 硬件 · 原型暂未开放</small></span><StatusTag tone="blue">待老师反馈</StatusTag></button><button type="button" aria-label="星球睡前音乐，原型暂未开放" disabled title="该作品不在本轮交互范围"><div className="work-preview audio"><Sparkles size={46} /><span>音频波形 · 合成</span></div><span><strong>星球睡前音乐</strong><small>AI 音乐 · 原型暂未开放</small></span><StatusTag tone="green">仅课程可见</StatusTag></button></div></div>;
  const canEnterPublicCandidate = authorizationReceipt && visibility === "public" && Boolean(reviewer);
  function exitDetail() { setSelected(""); setAuthorizationReceipt(false); setVisibility("course"); setReviewer(""); setApproved(false); }
  function changeVisibility(next: string) { setVisibility(next); setApproved(false); }
  return <div className="admin-page work-detail"><button className="back-link" type="button" onClick={exitDetail}><ArrowLeft size={18} /> 返回作品候选</button><div className="page-title-row"><div><h1>{selected}</h1><p>作品版本 v3 · 顾小满（合成展示名） · 静态 Web App</p></div><StatusTag tone={authorizationReceipt ? "blue" : "yellow"}>{authorizationReceipt ? "已收到合成授权回执" : "授权待补充"}</StatusTag></div><div className="work-review-layout"><section className="work-stage"><div className="browser-mock"><div><i /><i /><i /><span>安全预览未在本地原型中运行代码</span></div><main><Gamepad2 size={70} /><strong>太空接水果</strong><small>以封面和演示说明代替运行未知代码</small></main></div><h2>孩子的创作故事</h2><p>我想做一个在太空中接水果的游戏。AI 帮我生成了第一版代码，我负责设计规则、测试得分和调整难度。</p><dl className="story-grid"><div><dt>AI 帮助</dt><dd>代码起稿、错误解释</dd></div><div><dt>孩子完成</dt><dd>玩法、角色、测试与迭代</dd></div><div><dt>老师反馈</dt><dd>“规则表达很清楚，下一版可以增加合作模式。”（合成）</dd></div></dl></section><aside className="review-checklist"><h2>公开前检查</h2><div className="review-item checked"><CheckCircle2 /><span><strong>文件安全检查</strong><small>静态资源清单通过；原型不运行代码</small></span></div><div className="review-item checked"><CheckCircle2 /><span><strong>敏感信息检查</strong><small>使用展示名，无学校、班级和位置</small></span></div><div className={`review-item ${authorizationReceipt ? "checked" : "warning"}`}>{authorizationReceipt ? <CheckCircle2 /> : <AlertCircle />}<span><strong>{authorizationReceipt ? "有效授权回执已载入" : "未收到有效授权回执"}</strong><small>{authorizationReceipt ? "仅覆盖太空接水果 v3、本次公开展厅用途；可撤回。" : "运营者不能替监护人授权，未收到回执时保持非公开。"}</small></span></div>{!authorizationReceipt ? <div className="prototype-simulator"><small>原型情景控制：模拟从家庭 H5 收到授权回执，不代表运营者代替授权。</small><button className="ops-secondary full" type="button" onClick={() => { setAuthorizationReceipt(true); setApproved(false); }}>载入合成授权回执</button></div> : null}<div className="visibility-choice"><strong>目标范围</strong><label><input type="radio" name="work-visibility" aria-label="仅课程成员" checked={visibility === "course"} onChange={() => changeVisibility("course")} /> 仅课程成员</label><label><input type="radio" name="work-visibility" aria-label="公开展厅（需有效授权）" checked={visibility === "public"} onChange={() => changeVisibility("public")} /> 公开展厅（需有效授权）</label></div><label className="reviewer-field">具名审核人<select value={reviewer} onChange={(event) => { setReviewer(event.target.value); setApproved(false); }}><option value="">请选择最终审核人</option><option>江（合成示例）</option><option>林老师（合成示例）</option></select></label>{approved ? <p className="inline-success">已记录为公开展厅候选；未产生公开链接，仍可撤回。</p> : null}<button className="ops-primary full" type="button" disabled={!canEnterPublicCandidate} onClick={() => setApproved(true)}>记录为公开展厅候选</button><button className="ops-secondary full" type="button" onClick={() => { setVisibility("course"); setReviewer(""); setApproved(false); }}>退回补充资料</button></aside></div></div>;
}

function ApprovalsPage() {
  const [resolved, setResolved] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const items = [
    { title: "课程时间调整", detail: "8月16日 14:00 延后到 14:30", impact: "影响 18 个家庭、1 位老师、3 位志愿者", category: "高影响", original: "原值：8月16日 14:00", proposed: "新值：8月16日 14:30", scope: "1 位老师、18 个家庭、3 位志愿者", followup: "批准后只生成待发送名单和文案，仍需人工确认发送", recovery: "恢复原时间，并生成受影响对象差异清单" },
    { title: "小红书课程介绍 v2", detail: "AI 草稿等待人工事实与品牌确认", impact: "不会自动发布", category: "内容", original: "原值：AI 生成草稿 v2，含 1 条待确认事实", proposed: "新值：人工确认后标记为可复制草稿，不产生发布动作", scope: "课程事实、品牌表达和小红书渠道文案", followup: "确认后由具名运营者复制到渠道侧；待确认事实必须先补齐", recovery: "撤销人工确认并保留上一版草稿与差异" },
    { title: "太空接水果公开展示", detail: "授权待补充后才可进入公开展厅", impact: "默认保持非公开", category: "未成年人", original: "原值：仅课程成员可见，未收到有效授权回执", proposed: "新值：收到逐用途授权后进入公开展厅候选", scope: "作品 v3、展示名、封面与创作故事", followup: "还需具名审核人完成安全与范围检查；不会直接生成公开链接", recovery: "撤回候选并恢复仅课程成员可见" },
    { title: "作品拍摄任务备份", detail: "关键现场任务缺少可接替人员", impact: "开始前必须补齐", category: "现场", original: "原值：主责已指定，备份为空", proposed: "新值：江（合成示例）作为备份与求助对象", scope: "现场作品拍摄任务与课程负责人", followup: "记录备份意向，正式通知仍需人工发送并等待领取回执", recovery: "撤销备份并重新进入待决定队列" },
  ];
  const current = items.find((item) => item.title === selected);
  function recordDecision() { if (!selected || !reason.trim()) return; setResolved([...resolved, selected]); setSelected(""); setReason(""); }
  return <div className="admin-page"><div className="page-title-row"><div><h1>人类决策收件箱</h1><p>只显示必须由人判断的事项；批准前先看影响、来源和可恢复路径。</p></div><StatusTag tone="yellow">{items.length - resolved.length} 项待决定</StatusTag></div>{current ? <section className="approval-evidence" aria-labelledby="approval-evidence-title"><div className="section-heading"><div><h2 id="approval-evidence-title">{current.title} 依据</h2><p>决定前核对原值、新值、影响范围与恢复方式。</p></div><button className="icon-button" type="button" aria-label="关闭决定依据" onClick={() => { setSelected(""); setReason(""); }}><X /></button></div><dl><div><dt>原值</dt><dd>{current.original}</dd></div><div><dt>拟议结果</dt><dd>{current.proposed}</dd></div><div><dt>影响范围</dt><dd>{current.scope}</dd></div><div><dt>后续动作</dt><dd>{current.followup}</dd></div><div><dt>回滚方式</dt><dd>{current.recovery}</dd></div></dl><label>决定理由<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="说明核对过的依据与作出决定的理由" /></label><div className="form-actions"><button className="ops-secondary" type="button" onClick={() => { setSelected(""); setReason(""); }}>暂不决定</button><button className="ops-primary" type="button" disabled={!reason.trim()} onClick={recordDecision}>确认并记录决定</button></div></section> : null}<div className="approval-list">{items.map((item) => <article key={item.title} className={resolved.includes(item.title) ? "resolved" : ""}><span className="approval-symbol"><Hand size={22} /></span><div><div className="approval-title"><h2>{item.title}</h2><StatusTag tone={item.category === "高影响" || item.category === "未成年人" ? "yellow" : "blue"}>{item.category}</StatusTag></div><p>{item.detail}</p><small>{item.impact}</small></div><div className="approval-actions">{resolved.includes(item.title) ? <StatusTag tone="green">已记录决定</StatusTag> : <button className="ops-secondary compact" type="button" onClick={() => { setSelected(item.title); setReason(""); }}>查看依据</button>}</div></article>)}</div></div>;
}

function AgentsPage() {
  return <div className="admin-page"><div className="page-title-row"><div><h1>Agent 协作</h1><p>四个共享 Agent 通过结构化交接协作，人只处理异常、判断和批准。</p></div><StatusTag tone="green">治理开关正常</StatusTag></div><div className="agent-policy"><ShieldCheck size={24} /><span><strong>当前安全边界</strong><small>最大委派深度 2 · 无公开发布工具 · 外部通知只准备 · 超预算转人工 · 所有数据均为合成示例</small></span><button className="ops-secondary compact" type="button" disabled title="策略详情原型暂未开放">查看策略 · 原型暂未开放</button></div><div className="agent-grid">{[["课程运营 Agent","检查事实、生成内部任务","purple","7 项检查完成"],["AI 传播助手","生成多渠道草稿与素材清单","blue","3 个草稿待确认"],["作品展厅 Agent","生成封面、摘要与展示候选","yellow","2 件作品待审核"],["授权与安全检查 Agent","检查授权、敏感信息和展示范围","green","阻断 1 件未授权作品"]].map(([name, detail, tone, result]) => <article key={name}><span className={`agent-badge ${tone}`}><Bot size={22} /></span><h2>{name}</h2><p>{detail}</p><div><small>最近结果</small><strong>{result}</strong></div><button className="ops-secondary full" type="button" disabled title="Agent 审计详情原型暂未开放">查看任务与审计 · 原型暂未开放</button></article>)}</div><section className="handoff-table"><div className="section-heading"><div><h2>最近结构化交接</h2><p>目标、对象、允许动作、输出、截止与回执缺一不可</p></div></div><div className="table-head"><span>交接</span><span>从 / 到</span><span>业务对象</span><span>状态</span></div><div className="table-row"><span><strong>生成课前传播包</strong><small>只使用已确认课程事实</small></span><span>课程运营 → AI 传播</span><span>当前课程</span><span><StatusTag tone="yellow">待人工确认</StatusTag></span></div><div className="table-row"><span><strong>检查作品展示范围</strong><small>不修改监护人授权</small></span><span>作品展厅 → 授权安全</span><span>太空接水果 v3</span><span><StatusTag tone="blue">需补充</StatusTag></span></div></section></div>;
}

export function AdminPrototype() {
  const [view, setView] = useState<AdminView>("dashboard"); const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("总览"); const [courses, setCourses] = useState<CourseDraft[]>([]); const [tasks, setTasks] = useState<VolunteerTask[]>(initialTasks); const [toast, setToast] = useState("");
  const title = useMemo(() => ({ dashboard: "运营看板", courses: "课程管理", workspace: "课程管理", "new-course": "课程管理", tasks: "志愿协作", "new-task": "志愿协作", people: "参与者", iam: "人员与权限", checkin: "现场执行", media: "内容运营", works: "作品展厅", explore: "探索编辑部", approvals: "待批准", agents: "Agent 协作", audit: "审计与设置" }[view]), [view]);
  function navigate(next: AdminView) { setView(next); setToast(""); window.scrollTo({ top: 0, behavior: "auto" }); }
  let content: React.ReactNode;
  if (view === "dashboard") content = <Dashboard onNavigate={navigate} />;
  else if (view === "courses") content = <CoursesPage courses={courses} onNew={() => navigate("new-course")} onWorkspace={() => navigate("workspace")} />;
  else if (view === "workspace") content = <CourseWorkspace tab={workspaceTab} onTab={setWorkspaceTab} onBack={() => navigate("courses")} />;
  else if (view === "new-course") content = <NewCoursePage onCancel={() => navigate("courses")} onSave={(draft) => { setCourses([...courses, draft]); setView("courses"); setToast("课程草稿已保存，仅保存在当前测试浏览器中。"); }} />;
  else if (view === "tasks") content = <TasksPage tasks={tasks} onNew={() => navigate("new-task")} />;
  else if (view === "new-task") content = <NewTaskPage onCancel={() => navigate("tasks")} onSave={(task) => { setTasks([...tasks, task]); setView("tasks"); setToast("志愿任务已保存，尚未发送通知。"); }} />;
  else if (view === "people") content = <PeoplePage />;
  else if (view === "iam") content = <IdentityAccessPage />;
  else if (view === "checkin") content = <CheckinPage />;
  else if (view === "media") content = <MediaPage />;
  else if (view === "works") content = <WorksPage />;
  else if (view === "explore") content = <ExplorationEditorialPage />;
  else if (view === "approvals") content = <ApprovalsPage />;
  else if (view === "agents") content = <AgentsPage />;
  else content = <AuditSettingsPage />;
  return <div className="admin-app"><DirectionContract /><AdminSidebar view={view} onNavigate={navigate} /><div className="admin-main"><AdminHeader title={title} onNewCourse={() => navigate("new-course")} />{toast ? <div className="toast" role="status"><CheckCircle2 size={18} /> {toast}<button type="button" aria-label="关闭提示" onClick={() => setToast("")}><X size={17} /></button></div> : null}<main id="main-content">{content}</main></div></div>;
}

type MobileScreen = "home" | "checkin" | "task" | "receipt" | "approval" | "pack" | "explore";

function MobileHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return <header className="mobile-header">{onBack ? <button type="button" onClick={onBack} aria-label="返回今日行动"><ArrowLeft /></button> : <button type="button" aria-label="打开导航，原型暂未开放" disabled title="原型暂未开放"><Menu /></button>}<strong>{title}</strong><a className="mobile-map-entry" href="/acceptance-map.html">验收地图</a></header>;
}

function MobileHome({ onNavigate }: { onNavigate: (screen: MobileScreen) => void }) {
  return <><MobileHeader title="xlab 现场" /><main id="main-content" className="mobile-main"><div className="mobile-mode"><FlaskConical size={16} /><span>运营管理 H5</span><small>· 志愿者视图 · 合成数据</small></div><h1>今天先处理 5 件事</h1><p className="mobile-lead">一次只处理一个现场动作，需要判断的事项会保留给人。</p><section className="mobile-course-card"><div><StatusTag tone="purple">今天 14:00</StatusTag><h2>{activeCourse.name}</h2><p>林老师（合成示例） · 已报名 18 / 24</p></div><span className="course-symbol"><Gamepad2 /></span></section><section className="action-queue" aria-label="今日行动"><button type="button" aria-label="进入现场签到" onClick={() => onNavigate("checkin")}><span className="action-icon blue"><UserCheck /></span><span><strong>现场签到</strong><small>14:00 前 · 核对 4 条演示名单</small></span><StatusTag tone="blue">优先</StatusTag><ChevronRight /></button><button type="button" aria-label="查看志愿任务" onClick={() => onNavigate("task")}><span className="action-icon purple"><ClipboardCheck /></span><span><strong>摆放设备与创作物料</strong><small>预计 30 分钟 · 有备份与求助人</small></span><StatusTag tone="yellow">待完成</StatusTag><ChevronRight /></button><button type="button" aria-label="快速审核探索报" onClick={() => onNavigate("explore")}><span className="action-icon purple"><Newspaper /></span><span><strong>快速审核探索报</strong><small>黄类候选 · 只复核 3 个问题</small></span><StatusTag tone="yellow">待复核</StatusTag><ChevronRight /></button><button type="button" aria-label="审核传播草稿" onClick={() => onNavigate("approval")}><span className="action-icon yellow"><FileText /></span><span><strong>审核传播草稿</strong><small>AI 草稿 · 不会自动发布</small></span><StatusTag tone="yellow">待确认</StatusTag><ChevronRight /></button><button type="button" aria-label="查看老师教学包" onClick={() => onNavigate("pack")}><span className="action-icon green"><FileCheck2 /></span><span><strong>查看老师教学包</strong><small>流程、物料、安全与反馈模板</small></span><StatusTag tone="green">已就绪</StatusTag><ChevronRight /></button></section><aside className="mobile-safety"><ShieldCheck /><span><strong>原型不会产生真实外发</strong><small>签到、任务回执和审批只在当前页面模拟。</small></span></aside></main><MobileNav onNavigate={onNavigate} /></>;
}

function MobileNav({ onNavigate }: { onNavigate: (screen: MobileScreen) => void }) { return <nav className="mobile-bottom-nav" aria-label="运营 H5 主导航"><button className="active" type="button" onClick={() => onNavigate("home")}><LayoutDashboard /><span>行动</span></button><button type="button" onClick={() => onNavigate("pack")}><CalendarDays /><span>课程</span></button><button type="button" onClick={() => onNavigate("task")}><ListChecks /><span>任务</span></button><button type="button" onClick={() => onNavigate("approval")}><Inbox /><span>待决定</span></button></nav>; }

function MobileCheckin({ onBack }: { onBack: () => void }) {
  const [checked, setChecked] = useState<string[]>([]); const [message, setMessage] = useState(""); const [pendingCorrection, setPendingCorrection] = useState(""); const [reason, setReason] = useState(""); const [error, setError] = useState("");
  function toggle(name: string) { if (checked.includes(name)) { setPendingCorrection(name); setReason(""); setError(""); return; } setChecked([...checked, name]); setMessage("签到状态已保存在当前测试浏览器中。"); }
  function saveCorrection() { if (!reason.trim()) { setError("请填写修正原因，然后再保存。"); return; } if (checked.includes(pendingCorrection)) setChecked(checked.filter((item) => item !== pendingCorrection)); setPendingCorrection(""); setError(""); setMessage("签到修正已记录，并生成可追溯回执。"); }
  return <><MobileHeader title="现场签到" onBack={onBack} /><main id="main-content" className="mobile-main mobile-detail"><div className="mobile-section-title"><div><h1>报名名单</h1><p>{activeCourse.name}</p></div><StatusTag tone="blue">已签到 {checked.length} / {people.length}</StatusTag></div><label className="mobile-search"><Search /><span className="sr-only">搜索签到名单</span><input placeholder="搜索展示名" /></label><div className="mobile-check-list">{people.map((name) => <label key={name}><input type="checkbox" aria-label={name} checked={checked.includes(name)} onChange={() => toggle(name)} /><span className={`mobile-check ${checked.includes(name) ? "checked" : ""}`}>{checked.includes(name) ? <Check /> : null}</span><span><strong>{name}</strong><small>报名已确认 · 合成信息</small></span><span>{checked.includes(name) ? "已到" : "待到"}</span></label>)}</div>{pendingCorrection ? <section className="mobile-correction"><h2>签到修正原因</h2><p>修正会保留原值、原因和操作人。</p><label>修正原因<textarea value={reason} onChange={(event) => setReason(event.target.value)} /></label>{error ? <p className="mobile-error" role="alert">{error}</p> : null}<button className="mobile-primary full" type="button" onClick={saveCorrection}>保存签到修正</button><button className="mobile-secondary full" type="button" onClick={() => setPendingCorrection("")}>取消</button></section> : null}{message ? <p className="mobile-success" aria-live="polite"><CheckCircle2 /> {message}</p> : null}<button className="mobile-secondary full" type="button" onClick={() => { setPendingCorrection("临时到场或弱网补录"); setReason(""); }}><AlertCircle /> 记录临时到场或修正原因</button></main></>;
}

function MobileTask({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [evidence, setEvidence] = useState(""); const [error, setError] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!evidence.trim()) { setError("请写一句完成说明，或返回选择求助。"); return; } onDone(); }
  return <><MobileHeader title="志愿任务" onBack={onBack} /><main id="main-content" className="mobile-main mobile-detail"><StatusTag tone="yellow">今天 13:30 前</StatusTag><h1>摆放设备与创作物料</h1><p className="mobile-lead">目标是让孩子到场后可以直接开始创作。预计用时 30 分钟。</p><section className="mobile-task-facts"><div><span>主责</span><strong>陈老师（合成示例）</strong></div><div><span>备份</span><strong>江（合成示例）</strong></div><div><span>求助</span><strong>林老师（合成示例）</strong></div></section><ol className="mobile-task-list"><li><span><Check /></span><div><strong>检查 6 台演示设备</strong><small>浏览器与充电状态可用</small></div></li><li><span>2</span><div><strong>按小组摆放材料</strong><small>每桌一份，不按年龄分组</small></div></li><li><span>3</span><div><strong>拍摄不含人脸的完成证据</strong><small>课程结束后可删除</small></div></li></ol><form className="mobile-task-form" onSubmit={submit}><label>完成说明<textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="例如：设备与材料已按清单摆放" /></label>{error ? <p role="alert" className="mobile-error">{error}</p> : null}<button className="mobile-primary full" type="submit">完成并提交回执</button><button className="mobile-secondary full" type="button" disabled title="正式产品接入消息与通知后开放"><Hand /> 我需要求助 · 原型暂未开放</button></form></main></>;
}

function MobileReceipt({ onHome }: { onHome: () => void }) { return <><MobileHeader title="完成回执" /><main id="main-content" className="mobile-main mobile-receipt"><span className="mobile-success-mark"><Check /></span><h1>任务已完成</h1><p>现场负责人会在运营台看到你的完成说明，不需要再到群里重复汇报。</p><div><strong>摆放设备与创作物料</strong><span>完成时间</span><b>刚刚 · 合成状态</b><span>回执范围</span><b>课程运营人员可见</b></div><p className="mobile-note">回执仅保存在本地合成原型中。</p><button className="mobile-primary full" type="button" onClick={onHome}>返回今日行动</button></main></>;
}

function MobileApproval({ onBack }: { onBack: () => void }) { const [decision, setDecision] = useState<"" | "approved" | "returned">(""); return <><MobileHeader title="审核传播草稿" onBack={onBack} /><main id="main-content" className="mobile-main mobile-detail"><StatusTag tone="yellow">AI 草稿 · 尚未公开</StatusTag><h1>孩子也能把一个点子做成可玩的小游戏</h1><div className="mobile-draft"><p>这一次，我们不从“先学会多少代码”开始，而是从一个想玩的游戏点子开始。</p><p>7–15 岁孩子完成同一个创造任务，可以选择故事、美术、玩法、逻辑或测试分工。</p><mark>【待确认】正式场地与设备清单将在报名开放前补充。</mark></div><div className="mobile-fact-check"><ShieldCheck /><span><strong>事实与授权检查</strong><small>4 条事实已确认；待确认项 1 条；未使用学员素材。</small></span></div>{decision === "approved" ? <p className="mobile-success"><CheckCircle2 /> 已记录人工确认，仍需到渠道侧手动发布。</p> : decision === "returned" ? <p className="mobile-note"><AlertCircle /> 已退回 AI 传播助手补充待确认事实，不会发布。</p> : <><button className="mobile-primary full" type="button" onClick={() => setDecision("approved")}>确认草稿可供人工发布</button><button className="mobile-secondary full" type="button" onClick={() => setDecision("returned")}>退回修改</button></>}</main></>;
}

function MobilePack({ onBack }: { onBack: () => void }) { return <><MobileHeader title="老师教学包" onBack={onBack} /><main id="main-content" className="mobile-main mobile-detail"><StatusTag tone="green">老师已确认</StatusTag><h1>{activeCourse.name}</h1><p className="mobile-lead">一页看完授课对象、目标、流程、物料、安全与反馈。</p><div className="mobile-pack-list">{[["授课对象","7–15 岁混龄，同一任务、不同分工"],["课程目标","完成可玩的浏览器小游戏并讲述创作过程"],["课堂流程","认识任务 → 选择分工 → 一起创作 → 展示反馈"],["物料","演示设备、充电、投屏、分组卡、纸笔"],["安全","作品默认不公开；现场拍摄按逐用途授权"],["课后反馈","老师确认具体反馈，不自动评价或排名"]].map(([title, detail]) => <section key={title}><span><Check /></span><div><h2>{title}</h2><p>{detail}</p></div></section>)}</div><button className="mobile-secondary full" type="button" disabled title="正式产品接入文件服务后开放"><Download /> 下载离线教学包 · 原型暂未开放</button></main></>;
}

export function OperationsMobilePrototype() {
  const [screen, setScreen] = useState<MobileScreen>("home");
  let content: React.ReactNode;
  if (screen === "home") content = <MobileHome onNavigate={setScreen} />;
  else if (screen === "checkin") content = <MobileCheckin onBack={() => setScreen("home")} />;
  else if (screen === "task") content = <MobileTask onBack={() => setScreen("home")} onDone={() => setScreen("receipt")} />;
  else if (screen === "receipt") content = <MobileReceipt onHome={() => setScreen("home")} />;
  else if (screen === "approval") content = <MobileApproval onBack={() => setScreen("home")} />;
  else if (screen === "explore") content = <MobileExplorationReview onBack={() => setScreen("home")} />;
  else content = <MobilePack onBack={() => setScreen("home")} />;
  return <div className="ops-mobile"><DirectionContract />{content}</div>;
}
