import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  ArchiveRestore,
  ArrowRight,
  BadgeCheck,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileSearch,
  Fingerprint,
  History,
  KeyRound,
  Link2,
  Newspaper,
  PauseCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  UserCog,
  Users,
  WandSparkles,
} from "lucide-react";

function Tag({ tone = "neutral", children }: { tone?: "purple" | "blue" | "yellow" | "green" | "coral" | "neutral"; children: React.ReactNode }) {
  return <span className={`ops-tag ${tone}`}>{children}</span>;
}

export function IntentWorkbench({ onOpenExplore }: { onOpenExplore: () => void }) {
  const [intent, setIntent] = useState("");
  const [planVisible, setPlanVisible] = useState(false);
  const [started, setStarted] = useState(false);

  function preparePlan(event: FormEvent) {
    event.preventDefault();
    if (!intent.trim()) return;
    setPlanVisible(true);
    setStarted(false);
  }

  return (
    <section className="intent-workbench" aria-label="AI 意图工作台">
      <div className="intent-copy">
        <span className="intent-icon"><WandSparkles size={22} aria-hidden="true" /></span>
        <div>
          <h2 id="intent-title">告诉 xlab 你想完成什么</h2>
          <p>用一句话加文件或链接发起工作。AI 先生成可检查计划，再在权限和人工门内执行。</p>
        </div>
      </div>
      <form className="intent-form" onSubmit={preparePlan}>
        <label htmlFor="global-intent" className="sr-only">告诉 xlab 你想完成什么</label>
        <textarea
          id="global-intent"
          value={intent}
          onChange={(event) => { setIntent(event.target.value); setPlanVisible(false); }}
          placeholder="例如：读取李老师的课件，按 90 分钟整理课程事实和运营包，只把缺失事实交给我确认。"
        />
        <div className="intent-actions">
          <button type="button" className="ops-secondary compact" disabled title="语音和文件上传仅保留交互位">附加文件或语音 · 原型位</button>
          <button type="submit" className="ops-primary compact" disabled={!intent.trim()}><Sparkles size={17} /> 生成执行计划</button>
        </div>
      </form>
      {planVisible ? (
        <div className="plan-preview" aria-live="polite">
          <div className="plan-head">
            <div><h3>计划预览</h3><p>已识别为“探索报组刊”，对象为第 32 期合成候选。</p></div>
            <Tag tone="blue">待人确认计划</Tag>
          </div>
          <ol className="plan-steps">
            <li><span>1</span><div><strong>读取 8 条合成候选</strong><small>只读，不改变业务状态</small></div><Tag tone="green">可自动</Tag></li>
            <li><span>2</span><div><strong>回查原始来源与权利范围</strong><small>缺证据、黄类或权利冲突转人工</small></div><Tag tone="yellow">2 项待决定</Tag></li>
            <li><span>3</span><div><strong>编辑 3 条儿童探索卡</strong><small>保留事实、风险、挑战和源引用</small></div><Tag tone="purple">可生成草稿</Tag></li>
            <li><span>4</span><div><strong>提交精确版本的发布决定</strong><small>不会执行公开发布</small></div><Tag tone="coral">必须人工</Tag></li>
          </ol>
          {started ? <p className="inline-success"><CheckCircle2 size={18} /> 合成演练已建立，等待异常和人工决定。</p> : (
            <div className="plan-actions">
              <button type="button" className="ops-secondary" onClick={onOpenExplore}>先在探索编辑部查看 <ArrowRight size={17} /></button>
              <button type="button" className="ops-primary compact" onClick={() => setStarted(true)}>确认计划并开始合成演练</button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export function IdentityAccessPage() {
  const [intent, setIntent] = useState("");
  const [preview, setPreview] = useState(false);
  const [created, setCreated] = useState(false);

  function buildPreview(event: FormEvent) {
    event.preventDefault();
    if (!intent.trim()) return;
    setPreview(true);
    setCreated(false);
  }

  return (
    <div className="admin-page iam-page">
      <div className="page-title-row">
        <div><h1>人员、邀请与权限</h1><p>一个人可以有多个限时角色，每次只在当前组织、课程或任务范围工作。</p></div>
        <Tag tone="green">最小权限策略开启</Tag>
      </div>

      <section className="scope-rail" aria-label="当前工作上下文">
        <span className="scope-avatar">江</span>
        <div><small>当前自然人</small><strong>江（合成身份）</strong></div>
        <ChevronRight size={17} />
        <div><small>当前角色</small><strong>家委运营 · COURSE_OPERATOR</strong></div>
        <ChevronRight size={17} />
        <div><small>当前范围</small><strong>当前课程 · 至归档</strong></div>
        <button type="button" className="ops-secondary compact" disabled title="角色切换合成位">切换工作身份 · 原型位</button>
      </section>

      <div className="iam-layout">
        <section className="iam-intent">
          <div className="section-heading"><div><h2>用一句话发起邀请</h2><p>Agent 只生成最小权限候选，不能自批或直接授权。</p></div><span className="section-icon"><UserCog size={22} /></span></div>
          <form onSubmit={buildPreview}>
            <label htmlFor="access-intent">邀请或权限意图</label>
            <textarea id="access-intent" value={intent} onChange={(event) => { setIntent(event.target.value); setPreview(false); }} placeholder="邀请李老师只管理这门课，课程归档后自动失效" />
            <button className="ops-primary compact" type="submit" disabled={!intent.trim()}><Sparkles size={17} /> 生成最小权限邀请</button>
          </form>
          {preview ? (
            <div className="access-preview">
              <div className="access-preview-head"><span><KeyRound size={20} /></span><div><small>候选角色绑定</small><strong>TEACHER · 单课程范围</strong></div><Tag tone="yellow">待具名创建</Tag></div>
              <dl>
                <div><dt>对象</dt><dd>李老师（合成联系人）</dd></div>
                <div><dt>能力</dt><dd>确认教学事实、查看教学包、提交课后反馈</dd></div>
                <div><dt>不可见</dt><dd>其他课程、家长联系方式、授权和角色分配</dd></div>
                <div><dt>期限</dt><dd>本人接受起 → 课程归档自动失效</dd></div>
              </dl>
              <p className="access-boundary"><ShieldCheck size={17} /> 当前只是候选预览，未授予任何角色。</p>
              {created ? <p className="inline-success"><CheckCircle2 size={18} /> 邀请已创建，需本人接受后才可生效。</p> : <button type="button" className="ops-primary compact" onClick={() => setCreated(true)}>创建邀请并留回执</button>}
            </div>
          ) : null}
        </section>

        <aside className="binding-panel">
          <div className="section-heading"><div><h2>有效角色绑定</h2><p>服务端同时校验角色、范围、关系、期限和状态。</p></div></div>
          {[
            ["江（合成身份）", "COURSE_OPERATOR", "当前课程", "至归档"],
            ["林老师（合成身份）", "TEACHER", "当前课程", "6 天后到期"],
            ["陈老师（合成身份）", "VOLUNTEER", "设备任务", "任务完成失效"],
          ].map(([name, role, scope, expiry]) => <article key={`${name}-${role}`}><span className="binding-avatar"><UserCheck size={19} /></span><div><strong>{name}</strong><small>{role} · {scope}</small></div><Tag tone={role === "VOLUNTEER" ? "yellow" : "green"}>{expiry}</Tag></article>)}
          <button type="button" className="ops-secondary full" disabled title="角色矩阵详情合成位">查看字段与越权矩阵 · 原型位</button>
        </aside>
      </div>

      <section className="registration-flow">
        <div><span><Fingerprint size={22} /></span><strong>新用户注册</strong><small>验证手机/邮箱 → 建立唯一 User → 受邀或申请角色</small></div>
        <ArrowRight size={18} />
        <div><span><Users size={22} /></span><strong>关系与范围</strong><small>监护关系、课程名册、任务所属各自核验</small></div>
        <ArrowRight size={18} />
        <div><span><ShieldCheck size={22} /></span><strong>到期与撤销</strong><small>邀请单次可撤销，角色到期后新请求立即失效</small></div>
      </section>
    </div>
  );
}

type ExploreTab = "本周组刊" | "候选与证据" | "有效探索" | "团队与荣誉" | "纠错与撤回";

export function ExplorationEditorialPage() {
  const [tab, setTab] = useState<ExploreTab>("本周组刊");
  const [checking, setChecking] = useState(false);
  const [decisionReason, setDecisionReason] = useState("");
  const [approved, setApproved] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawn, setWithdrawn] = useState(false);

  const tabs: ExploreTab[] = ["本周组刊", "候选与证据", "有效探索", "团队与荣誉", "纠错与撤回"];

  function withdraw() {
    if (!withdrawReason.trim()) {
      setWithdrawError("请填写撤回原因，以便生成可追溯纠错回执。");
      return;
    }
    setWithdrawError("");
    setWithdrawn(true);
  }

  return (
    <div className="admin-page explore-page">
      <div className="page-title-row">
        <div><h1>xlab AI 探索报</h1><p>每周把可回查的 AI 发现变成可读、可讨论、可实践、可纠错的混龄探索周刊。</p></div>
        <div className="explore-header-status"><Tag tone="purple">第 32 期 · 版本 v4</Tag><Tag tone="yellow">合成编辑中</Tag></div>
      </div>
      <div className="explore-command-bar">
        <div><Newspaper size={24} /><span><strong>本周目标：从 8 条候选中组成 3–5 条有证据的探索卡</strong><small>无限信息流、儿童端发布、个人能力榜均不在范围内</small></span></div>
        <button type="button" className="ops-secondary compact" disabled title="外部候选接入未授权">外部候选关闭 · 只用合成夹具</button>
      </div>
      <div className="explore-tabs" role="tablist" aria-label="探索编辑部工作区">
        {tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}
      </div>

      {tab === "本周组刊" ? (
        <div className="issue-layout">
          <section className="issue-board">
            <div className="section-heading"><div><h2>第 32 期组刊画布</h2><p>4 条儿童卡，同一主题不按年龄切换界面。</p></div><Tag tone="green">4 / 5</Tag></div>
            <div className="issue-items">
              {[
                ["AI 如何认出你的手势？", "观察者 · 验证者", "黄类二人复核", "yellow"],
                ["让 AI 为一段哼唱画出旋律", "创作者 · 讲解者", "绿类已核验", "green"],
                ["用一句话做个会躲避的小球", "提问者 · 测试者", "绿类已核验", "green"],
                ["AI 硬件怎样听懂一声拍手？", "协作者 · 验证者", "绿类已核验", "green"],
              ].map(([title, roles, state, tone], index) => <article key={title}><span className="issue-order">{index + 1}</span><div><strong>{title}</strong><small>{roles}</small></div><Tag tone={tone as "yellow" | "green"}>{state}</Tag><button type="button" aria-label={`打开《${title}》证据`} disabled title="证据抽屉原型位"><ChevronRight size={18} /></button></article>)}
            </div>
            <button type="button" className="add-issue" disabled title="已达本期合成范围">+ 添加第 5 条候选 · 本期可选</button>
          </section>
          <aside className="issue-gate">
            <div className="gate-mark"><ShieldCheck size={26} /></div>
            <h2>发布前人工门</h2>
            <p>批准绑定第 32 期版本 v4，内容改动后旧批准立即失效。</p>
            <ul>
              <li><Check /> 4 条均有原始来源与事实证据</li>
              <li><Check /> 红类内容 0 条</li>
              <li><AlertTriangle /> 1 条黄类需二人分离复核</li>
              <li><Check /> 无儿童身份、联系方式或未授权素材</li>
            </ul>
            {!checking ? <button type="button" className="ops-primary full" onClick={() => setChecking(true)}>查看发布检查</button> : (
              <div className="publish-decision">
                <label htmlFor="publish-reason">发布决定理由</label>
                <textarea id="publish-reason" value={decisionReason} onChange={(event) => { setDecisionReason(event.target.value); setApproved(false); }} placeholder="写明复核的版本、来源、风险与权利结论" />
                {approved ? <p className="inline-success"><BadgeCheck size={18} /> 已记录具名批准；原型不会公开发布。</p> : <button type="button" className="ops-primary full" disabled={!decisionReason.trim()} onClick={() => setApproved(true)}>批准第32期版本 v4</button>}
              </div>
            )}
          </aside>
        </div>
      ) : null}

      {tab === "候选与证据" ? <ExploreEvidence /> : null}
      {tab === "有效探索" ? <ExploreActivity /> : null}
      {tab === "团队与荣誉" ? <ExploreTeams /> : null}
      {tab === "纠错与撤回" ? (
        <div className="correction-layout">
          <section className="correction-queue">
            <div className="section-heading"><div><h2>纠错与撤回队列</h2><p>来源变化、投诉或权利风险都不允许静默覆盖。</p></div><Tag tone="yellow">1 项演练</Tag></div>
            <article className="correction-item"><span><ShieldAlert size={23} /></span><div><strong>《AI 如何认出你的手势？》</strong><small>来源刷新失败 · 状态 STALE_REVIEW · 不允许新活动</small></div><Tag tone="coral">待处置</Tag></article>
            <div className="impact-map"><h3>影响图</h3><div><span>探索卡 v4</span><ArrowRight /><span>家庭 H5 第32期</span><ArrowRight /><span>7 条善意活动回执</span></div><p>撤回内容会停止新活动并隐藏问题证据；不会因平台或来源错误惩罚儿童。</p></div>
          </section>
          <aside className="withdraw-panel">
            <h2>紧急撤回演练</h2>
            <p>目标在 15 分钟内阻断新曝光，保留最小审计、旧/新版本与通知回执。</p>
            <label htmlFor="withdraw-reason">撤回原因</label>
            <textarea id="withdraw-reason" value={withdrawReason} onChange={(event) => { setWithdrawReason(event.target.value); setWithdrawError(""); setWithdrawn(false); }} />
            {withdrawError ? <p className="inline-error" role="alert">{withdrawError}</p> : null}
            {withdrawn ? <p className="inline-success"><ArchiveRestore size={18} /> 撤回演练已记录：新活动已阻断，儿童善意贡献默认保留。</p> : <button type="button" className="ops-primary full danger-action" onClick={withdraw}>发起紧急撤回</button>}
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function ExploreEvidence() {
  return <section className="explore-data-surface"><div className="section-heading"><div><h2>候选、原始来源与证据</h2><p>聚合摘要不是原始来源；无权归档时只保留引用、哈希与必要短证据。</p></div><button className="ops-secondary compact" type="button" disabled title="候选链接导入合成位"><Link2 size={17} /> 粘贴候选链接 · 原型位</button></div><div className="evidence-table"><div className="table-head"><span>候选</span><span>原始来源</span><span>证据 / 权利</span><span>风险</span><span>决定</span></div>{[
    ["AI 手势识别", "大学实验室官方演示", "4 事实 · 引用允许", "黄类", "二人复核"],
    ["AI 旋律绘图", "开源项目文档", "3 事实 · MIT", "绿类", "可入刊"],
    ["自动化安全演示", "聚合摘要（非原始源）", "原始源缺失", "红类", "自动阻断"],
  ].map(([candidate, source, evidence, risk, decision]) => <div className="table-row" key={candidate}><span><strong>{candidate}</strong><small>合成候选</small></span><span>{source}</span><span>{evidence}</span><span><Tag tone={risk === "绿类" ? "green" : risk === "黄类" ? "yellow" : "coral"}>{risk}</Tag></span><span>{decision}</span></div>)}</div></section>;
}

function ExploreActivity() {
  return <div className="explore-activity-grid"><section><div className="section-heading"><div><h2>本周有效探索</h2><p>打开不计数；提问、实验、作品或讲解经成人确认后才点亮一周。</p></div><Tag tone="green">12 个合成回执</Tag></div><div className="activity-stream">{[["陆星河家庭", "提了“背景太乱会不会认错？”", "提问 · 成人已确认"],["迭代小队", "做了两组光线对比实验", "团队实验 · TEAM_ONLY"],["顾小满家庭", "上传一段 20 秒手势测试录屏", "作品 · 默认不公开"]].map(([who,action,state]) => <article key={who}><span><CircleDot size={18} /></span><div><strong>{who}</strong><p>{action}</p><small>{state}</small></div></article>)}</div></section><aside><h2>连续探索周</h2><div className="streak-line">{["29","30","31","32"].map((week) => <span key={week}><Check /><small>{week}期</small></span>)}</div><p>每自然月一次“休息卡”或“7 日内有证据补记”二选一；休息卡不加分。</p><button className="ops-secondary full" type="button" disabled title="休息卡演练原型位"><PauseCircle size={17} /> 查看本月额度 · 原型位</button></aside></div>;
}

function ExploreTeams() {
  return <div className="team-surface"><section><div className="section-heading"><div><h2>团队贡献与多维荣誉</h2><p>只在已认证组织/课堂/监护范围展示，不做儿童个人能力总榜。</p></div><Tag tone="blue">4 周合成赛季</Tag></div><div className="team-list">{[["迭代小队", "共享目标 86%", "最会验证"],["好奇心小队", "共享目标 74%", "最会提问"],["创造者小队", "共享目标 68%", "最会讲解"]].map(([team,progress,honor]) => <article key={team}><span><Trophy size={21} /></span><div><strong>{team}</strong><small>{progress}</small></div><Tag tone="purple">{honor}</Tag></article>)}</div></section><aside><h2>隐私与公平检查</h2><ul><li><ShieldCheck /> 匿名聚合仍按 D3 儿童贡献处理</li><li><ShieldCheck /> 小样本和换队时序反推转人工</li><li><ShieldCheck /> 重复、伪造或人工裁定无效才冲正</li></ul><button className="ops-secondary full" type="button" disabled title="规则版本演练原型位">规则集 v2 · 原型位</button></aside></div>;
}

export function AuditSettingsPage() {
  const [filter, setFilter] = useState("全部事件");
  return <div className="admin-page audit-page"><div className="page-title-row"><div><h1>审计、开关与恢复</h1><p>从意图、身份、业务对象和 Agent 工具决定追溯到最终回执。</p></div><Tag tone="green">合成运行正常</Tag></div><div className="audit-layout"><section><div className="audit-toolbar"><label>事件类型<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>全部事件</option><option>人工决定</option><option>权限与身份</option><option>Agent 与工具</option></select></label><label>追踪标识<input defaultValue="corr-synthetic-2032" /></label><button className="ops-secondary compact" type="button"><FileSearch size={17} /> 筛选合成记录</button></div><div className="audit-timeline">{[["刚刚","发布决定候选已建立","第32期 v4 · 待具名人工决定","yellow"],["2 分钟前","授权安全 Agent 阻断工具调用","原因：试图跳过原始来源核验","coral"],["8 分钟前","课程事实包 v3 已确认","林老师（合成身份）· 仅当前课程","green"],["20 分钟前","志愿者角色绑定已到期","陈老师 · 设备任务 · 新请求已拒绝","blue"]].map(([time,title,detail,tone]) => <article key={title}><time>{time}</time><span className={`audit-dot ${tone}`} /><div><strong>{title}</strong><small>{detail}</small></div><button type="button" disabled title="审计详情原型位"><ChevronRight size={18} /></button></article>)}</div></section><aside className="feature-switches"><h2>分级功能开关</h2><p>关闭上层时下层 fail-closed，课程、作品和历史审计不受影响。</p>{[["外部候选接入",false],["探索内容入口",true],["活动 / 连续周",true],["积分 / 榜单",false]].map(([name,enabled]) => <div className="switch-row" key={String(name)}><span><strong>{String(name)}</strong><small>{enabled ? "合成演练开启" : "默认关闭"}</small></span><button type="button" role="switch" aria-checked={Boolean(enabled)} disabled title="只展示冻结的合成状态" className={enabled ? "on" : ""}><span /></button></div>)}<div className="kill-switch"><ShieldAlert size={23} /><span><strong>Agent 紧急停止</strong><small>停止新工具调用，保留状态和人工接管入口</small></span><button type="button" disabled title="破坏性操作不在交互原型执行">需双人确认</button></div></aside></div></div>;
}

export function MobileExplorationReview({ onBack }: { onBack: () => void }) {
  const [decision, setDecision] = useState<"" | "confirmed" | "returned">("");
  return <><header className="mobile-header"><button type="button" onClick={onBack} aria-label="返回今日行动"><ArrowRight className="mobile-back-icon" /></button><strong>探索报快速审核</strong><button type="button" disabled aria-label="更多操作，原型暂未开放"><CircleDot /></button></header><main id="main-content" className="mobile-main mobile-detail exploration-mobile"><Tag tone="yellow">黄类 · 需二人分离复核</Tag><h1>AI 如何认出你的手势？</h1><p className="mobile-lead">第 32 期 · 候选版本 v4 · 合成数据</p><section className="mobile-explore-card"><div><small>一句话故事</small><p>摄像头看到的不是“挥手”，而是一幅由像素组成的画；模型用很多例子学习哪些变化仍然是同一个动作。</p></div><div><small>这周的挑战</small><p>在家长协助下比较两种背景，记录识别结果有什么变化。</p></div></section><section className="mobile-evidence-check"><h2>只复核 3 个问题</h2><ul><li><CheckCircle2 /> 已回查大学实验室原始演示</li><li><CheckCircle2 /> 不含人脸、联系方式或未授权素材</li><li><AlertTriangle /> 风险说明由第二位具名审核者确认</li></ul></section>{decision === "confirmed" ? <p className="mobile-success"><CheckCircle2 /> 已记录第二人复核，还需期刊精确版本发布决定。</p> : decision === "returned" ? <p className="mobile-note"><RefreshCw /> 已退回补充风险解释，不会发布。</p> : <><button type="button" className="mobile-primary full" onClick={() => setDecision("confirmed")}>确认黄类复核</button><button type="button" className="mobile-secondary full" onClick={() => setDecision("returned")}>退回补充证据</button></>}</main></>;
}
