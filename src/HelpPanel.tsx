export type HelpScope = "family" | "admin" | "ops";

const entries = [
  { key: "family", name: "家庭端", who: "家长和小朋友", device: "手机或电脑都行", current: false },
  { key: "admin", name: "运营工作台（电脑版）", who: "家委成员、老师、核心运营人员", device: "电脑上打开，屏幕大一点更好用", current: false },
  { key: "ops", name: "运营工作台（手机版）", who: "老师、志愿者、现场工作人员", device: "手机上打开", current: false },
] as const;

function EntryTable({ scope }: { scope: HelpScope }) {
  return (
    <section className="help-section" aria-labelledby="help-entries-title">
      <h2 id="help-entries-title">三个入口，用不同的人</h2>
      <p>三个入口点开都是同一个 xlab，只是看到的界面和能做的事不一样——就像同一个学校的家长群、老师办公室和签到台，分工不同。</p>
      <div className="help-table" role="table" aria-label="三个入口">
        <div className="help-table-head" role="row"><span>入口</span><span>谁用</span><span>用什么打开</span></div>
        {entries.map((entry) => (
          <div className={`help-table-row${entry.key === scope ? " current" : ""}`} role="row" key={entry.key}>
            <span><strong>{entry.name}</strong>{entry.key === scope ? " · 当前页面" : null}</span>
            <span>{entry.who}</span>
            <span>{entry.device}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const faqs: Array<[string, string]> = [
    ["点了某个按钮没反应？", "原型里还没开放的功能会显示成灰色或标注“原型暂未开放”，这是正常的，不是坏了。"],
    ["点错了会怎样？会不会真的发出去？", "不会。这是测试原型，任何“批准”“确认”“发布”都只发生在当前这个页面上，关掉页面就消失，不会通知任何人、不会真的发布。"],
    ["页面里的孩子和课程是真的吗？", "全部是虚构的示例数据，用来演示流程长什么样。"],
    ["想回到一页概览（验收地图）？", "每个页面右上角都有“验收地图”入口，点它就能回到五步验收概览页。"],
    ["手机上的页面字太小、不好点？", "家庭端和运营手机版就是为手机设计的。如果用的是运营工作台电脑版，建议在电脑上打开。"],
  ];
  return (
    <section className="help-section" aria-labelledby="help-faq-title">
      <h2 id="help-faq-title">常见问题</h2>
      <ul className="help-faq">
        {faqs.map(([question, answer]) => (
          <li key={question}><strong>{question}</strong><span>{answer}</span></li>
        ))}
      </ul>
    </section>
  );
}

function Summary({ scope }: { scope: HelpScope }) {
  const line =
    scope === "family" ? "家长：看课 → 报名 → 选展示范围，就完成了。"
    : scope === "admin" ? "运营（电脑）：开课 → 派人 → 确认 AI 草稿 → 审核作品 → 看决定。"
    : "现场（手机）：今天处理 5 件事 → 签到 → 回执。";
  return (
    <section className="help-summary" aria-label="一句话总结">
      <h2>一句话总结</h2>
      <p>{line}</p>
      <p>xlab 的原则是：<strong>AI 帮忙干活，人来做决定。</strong>你在页面上看到的每一个“确认”，都是人在做决定。</p>
    </section>
  );
}

function FamilyGuide() {
  return (
    <section className="help-section" aria-labelledby="help-family-title">
      <h2 id="help-family-title">家长和小朋友（家庭端）</h2>
      <ol className="help-steps">
        <li><h3>看课程</h3><p>一打开就是“今天的创造任务”。点“看看这门课”，能看到学什么、做出什么作品、老师是谁、课程怎么安排。7–15 岁混龄小朋友都能参加，不做年龄分级，大家选不同分工。</p></li>
        <li><h3>报名</h3><p>觉得合适就点报名。报名时会有一步“作品展示范围”，让你决定小朋友的作品可以给谁看。这是最重要的一步：<strong>没经过你同意，作品不会公开</strong>。选好范围再确认。</p></li>
        <li><h3>看作品</h3><p>报名后小朋友的作品会出现在“作品展厅”里（当前为预览入口）。</p></li>
        <li><h3>我的</h3><p>点底部“我的”，能看到报名了哪些课程、授权记录；不想参加了也可以在这里取消。</p></li>
      </ol>
      <p className="help-takeaway"><strong>记住一句话：</strong>作为家长，你只需要做两件事——帮小朋友看懂课程，在报名时帮忙确认展示范围。</p>
    </section>
  );
}

function AdminGuide() {
  return (
    <section className="help-section" aria-labelledby="help-admin-title">
      <h2 id="help-admin-title">管理运营人员（运营工作台 · 电脑版）</h2>
      <p>左侧一排功能入口：运营看板、课程、任务、参与者、人员与权限、现场签到、AI 传播、作品审核、探索编辑部、待批准、Agent 协作、审计与设置。日常主要用这几件事：</p>
      <ol className="help-steps">
        <li><h3>开课（课程）</h3><p>点“新建课程”，填课程名称、老师、时间。少了名字、老师、时间，课程存不进去——这是故意的，防止漏填关键信息。开课后在“课程协作空间”里更新课程内容、环节和进程。</p></li>
        <li><h3>找人做事（任务）</h3><p>每个任务都要有“主责”（主要负责的人）和“备份”（他忙的时候顶上的人），缺一不可，这也是故意的。</p></li>
        <li><h3>看 AI 写的宣传文案（AI 传播）</h3><p>AI 会起草小红书、公众号、社群三个渠道的文案草稿。<strong>AI 只会写草稿，不会自己发出去</strong>。你只能做两件事：确认，或者退回修改。发不发由你人工决定。</p></li>
        <li><h3>看孩子的作品（作品审核）</h3><p>孩子提交作品后有“展示范围”和“授权回执”。没有监护人授权，作品不会出现在任何公开的地方。审核人需要具名。</p></li>
        <li><h3>现场签到（现场签到）</h3><p>活动当天在签到名单上快速签到。签到信息要修改，必须填写修改原因，每一步都有记录可查。</p></li>
        <li><h3>日常决定（运营看板 / 待批准）</h3><p>需要你拍板的事情会出现在“待批准”里，可以看到改前是什么、改后是什么、影响范围，由你决定同意还是退回，所有决定都有理由记录。</p></li>
      </ol>
      <p className="help-takeaway"><strong>如果拿不准：</strong>所有需要确认的地方，系统都会把选项摆清楚（原值/新值、影响范围、回滚方式），你只需要做选择题，不需要做技术操作。</p>
    </section>
  );
}

function OpsGuide() {
  return (
    <section className="help-section" aria-labelledby="help-ops-title">
      <h2 id="help-ops-title">现场运营人员（运营工作台 · 手机版）</h2>
      <p>一打开就是“今天先处理 5 件事”——系统把今天需要你现场处理的事情排好了，一次只看一件事，做完一件再下一件。</p>
      <ol className="help-steps">
        <li><h3>签到</h3><p>活动开始后给到场的小朋友/家庭签到。签到错了要改？必须填原因，改完有回执。</p></li>
        <li><h3>领任务</h3><p>今天分配给志愿者的事情会显示出来，做完可以标记完成并写完成说明。</p></li>
        <li><h3>待决定</h3><p>需要现场快速确认的事情（比如现场传播内容的确认）会在这里，只有人工确认才生效。</p></li>
        <li><h3>看教学包</h3><p>老师可以在这里查看本节课的教学包（当前为预览入口）。</p></li>
      </ol>
      <p className="help-takeaway"><strong>记住一句话：</strong>手机版只做“现场最短的动作”——签到、确认、回执，不会让你在手机上做复杂的后台操作。</p>
    </section>
  );
}

export function HelpPanel({ scope }: { scope: HelpScope }) {
  return (
    <div className="help-page">
      <p className="help-notice">这是测试原型，不是正式系统。页面里所有课程、小朋友、老师、报名和作品都是虚构示例——你怎么点都不会真的发消息、保存信息或公开任何东西。</p>
      <h1 className="help-title">使用说明</h1>
      <EntryTable scope={scope} />
      {scope === "family" ? <FamilyGuide /> : scope === "admin" ? <AdminGuide /> : <OpsGuide />}
      <Faq />
      <Summary scope={scope} />
    </div>
  );
}
