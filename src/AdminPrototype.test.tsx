import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

function open(path: "/" | "/admin" | "/ops") {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

describe("xlab OPS-0 operations prototype", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("opens a desktop operations command center centered on the active course", () => {
    open("/admin");

    expect(screen.getByText("运营管理 Web")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "今天先处理 4 件事" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "用 vibe Coding 做一个互动小游戏" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "运营主导航" })).toBeInTheDocument();
    expect(screen.queryByText("家庭参与端 H5")).not.toBeInTheDocument();
  });

  it("keeps one acceptance-map link reachable from every product surface", () => {
    for (const path of ["/", "/admin", "/ops"] as const) {
      cleanup();
      open(path);
      expect(screen.getByRole("link", { name: "验收地图" })).toHaveAttribute("href", "/acceptance-map.html");
    }
  });

  it("enters the course workspace and exposes the five operational views", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "打开课程协作空间" }));

    expect(screen.getByRole("heading", { name: "课程协作空间" })).toBeInTheDocument();
    const tabs = screen.getByRole("tablist", { name: "课程协作内容" });
    for (const name of ["总览", "任务", "参与者", "交付物", "时间线"]) {
      expect(within(tabs).getByRole("tab", { name })).toBeInTheDocument();
    }
  });

  it("validates required course facts before adding a synthetic course", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "新建课程" }));
    await user.click(screen.getByRole("button", { name: "保存为草稿" }));
    expect(screen.getByRole("alert")).toHaveTextContent("请补齐课程名称、授课老师和上课时间");

    await user.type(screen.getByLabelText("课程名称"), "AI 音乐创作实验室");
    await user.type(screen.getByLabelText("授课老师"), "周老师（合成示例）");
    await user.type(screen.getByLabelText("上课时间"), "2026-08-22 14:00");
    await user.click(screen.getByRole("button", { name: "保存为草稿" }));

    expect(screen.getByText("课程草稿已保存，仅保存在当前测试浏览器中。")).toBeInTheDocument();
    expect(screen.getByText("AI 音乐创作实验室")).toBeInTheDocument();
  });

  it("creates and assigns a volunteer micro-task with a recovery contact", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "任务" }));
    await user.click(screen.getByRole("button", { name: "新建志愿任务" }));
    await user.type(screen.getByLabelText("任务名称"), "准备现场作品拍摄区");
    await user.selectOptions(screen.getByLabelText("主责志愿者"), "陈老师（合成示例）");
    await user.selectOptions(screen.getByLabelText("备份与求助对象"), "江（合成示例）");
    await user.click(screen.getByRole("button", { name: "保存任务" }));

    expect(screen.getByText("准备现场作品拍摄区")).toBeInTheDocument();
    expect(screen.getByText("主责：陈老师（合成示例）")).toBeInTheDocument();
    expect(screen.getByText("备份：江（合成示例）")).toBeInTheDocument();
  });

  it("reviews an AI channel draft without exposing an automatic publish action", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "AI 传播" }));
    expect(screen.getByText("AI 草稿 · 尚未公开")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /自动发布/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "确认草稿可供人工发布" }));

    expect(screen.getByText("已人工确认，可复制或导出；平台不会替你发布。")).toBeInTheDocument();
  });

  it("keeps separate editable drafts for each media channel", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "AI 传播" }));
    const title = screen.getByLabelText("标题");
    await user.clear(title);
    await user.type(title, "小红书专用标题");
    await user.click(screen.getByRole("tab", { name: "公众号" }));
    expect(screen.getByLabelText("标题")).toHaveValue("xlab 混龄创造课：一起完成互动小游戏");
    await user.click(screen.getByRole("tab", { name: "小红书" }));
    expect(screen.getByLabelText("标题")).toHaveValue("小红书专用标题");
  });

  it("requires authorization receipt, public visibility and a named reviewer for a public work candidate", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "作品审核" }));
    await user.click(screen.getByRole("button", { name: "太空接水果" }));
    expect(screen.getByText("未收到有效授权回执")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "记录为公开展厅候选" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "载入合成授权回执" }));
    await user.click(screen.getByLabelText("公开展厅（需有效授权）"));
    await user.selectOptions(screen.getByLabelText("具名审核人"), "江（合成示例）");

    expect(screen.getByRole("button", { name: "记录为公开展厅候选" })).toBeEnabled();
  });

  it("invalidates a public work decision when any approval condition changes or the detail is exited", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "作品审核" }));
    await user.click(screen.getByRole("button", { name: "太空接水果" }));
    await user.click(screen.getByRole("button", { name: "载入合成授权回执" }));
    await user.click(screen.getByLabelText("公开展厅（需有效授权）"));
    await user.selectOptions(screen.getByLabelText("具名审核人"), "江（合成示例）");
    await user.click(screen.getByRole("button", { name: "记录为公开展厅候选" }));
    expect(screen.getByText(/已记录为公开展厅候选/)).toBeInTheDocument();

    await user.click(screen.getByLabelText("仅课程成员"));
    expect(screen.queryByText(/已记录为公开展厅候选/)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("公开展厅（需有效授权）"));
    await user.selectOptions(screen.getByLabelText("具名审核人"), "江（合成示例）");
    await user.click(screen.getByRole("button", { name: "记录为公开展厅候选" }));
    await user.click(screen.getByRole("button", { name: "返回作品候选" }));
    await user.click(screen.getByRole("button", { name: "太空接水果" }));
    expect(screen.queryByText(/已记录为公开展厅候选/)).not.toBeInTheDocument();
  });

  it("requires a reason and creates a receipt when onsite check-in is corrected", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "现场签到" }));
    const attendee = screen.getByRole("checkbox", { name: "顾小满（合成示例）" });
    await user.click(attendee);
    await user.click(attendee);
    expect(screen.getByRole("heading", { name: "签到修正原因" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "保存签到修正" }));
    expect(screen.getByRole("alert")).toHaveTextContent("请填写修正原因");
    await user.type(screen.getByLabelText("修正原因"), "监护人确认临时离场（合成示例）");
    await user.click(screen.getByRole("button", { name: "保存签到修正" }));
    expect(screen.getByText("签到修正已记录，并生成可追溯回执。")).toBeInTheDocument();
  });

  it("requires evidence and a decision reason for a high-impact approval", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "待批准" }));
    await user.click(screen.getAllByRole("button", { name: "查看依据" })[0]);
    expect(screen.getByText("原值：8月16日 14:00")).toBeInTheDocument();
    expect(screen.getByText("新值：8月16日 14:30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "确认并记录决定" })).toBeDisabled();
    await user.type(screen.getByLabelText("决定理由"), "老师与场地已确认，通知范围已核对（合成示例）");
    expect(screen.getByRole("button", { name: "确认并记录决定" })).toBeEnabled();
  });

  it("binds each human decision to its own evidence instead of reusing course-time facts", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "待批准" }));
    const mediaDecision = screen.getByRole("heading", { name: "小红书课程介绍 v2" }).closest("article");
    expect(mediaDecision).not.toBeNull();
    await user.click(within(mediaDecision!).getByRole("button", { name: "查看依据" }));
    expect(screen.getByRole("heading", { name: "小红书课程介绍 v2 依据" })).toBeInTheDocument();
    expect(screen.getByText("原值：AI 生成草稿 v2，含 1 条待确认事实")).toBeInTheDocument();
    expect(screen.queryByText("原值：8月16日 14:00")).not.toBeInTheDocument();
  });

  it("marks unimplemented controls as disabled prototype boundaries", async () => {
    const user = userEvent.setup();
    open("/admin");

    expect(screen.getByRole("button", { name: "打开消息，原型暂未开放" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "打开课程协作空间" }));
    expect(screen.getByRole("button", { name: "导出课程包 · 原型暂未开放" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "编辑课程事实 · 原型暂未开放" })).toBeDisabled();

    cleanup();
    open("/ops");
    await user.click(screen.getByRole("button", { name: "查看志愿任务" }));
    expect(screen.getByRole("button", { name: "我需要求助 · 原型暂未开放" })).toBeDisabled();
  });

  it("uses a mobile action queue and records onsite check-in", async () => {
    const user = userEvent.setup();
    open("/ops");

    expect(screen.getByText("运营管理 H5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "今天先处理 5 件事" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "进入现场签到" }));
    await user.click(screen.getByRole("checkbox", { name: "顾小满（合成示例）" }));

    expect(screen.getByText("已签到 1 / 4")).toBeInTheDocument();
    expect(screen.getByText("签到状态已保存在当前测试浏览器中。")).toBeInTheDocument();
  });

  it("lets a mobile volunteer complete a task with evidence text", async () => {
    const user = userEvent.setup();
    open("/ops");

    await user.click(screen.getByRole("button", { name: "查看志愿任务" }));
    await user.type(screen.getByLabelText("完成说明"), "物料已按清单摆放，照片待课程结束后整理。");
    await user.click(screen.getByRole("button", { name: "完成并提交回执" }));

    expect(screen.getByRole("heading", { name: "任务已完成" })).toBeInTheDocument();
    expect(screen.getByText("回执仅保存在本地合成原型中。")).toBeInTheDocument();
  });

  it("connects the mobile bottom navigation to the task and approval flows", async () => {
    const user = userEvent.setup();
    open("/ops");

    await user.click(screen.getByRole("button", { name: "任务" }));
    expect(screen.getByRole("heading", { name: "摆放设备与创作物料" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回今日行动" }));
    await user.click(screen.getByRole("button", { name: "待决定" }));
    expect(screen.getByRole("heading", { name: "孩子也能把一个点子做成可玩的小游戏" })).toBeInTheDocument();
  });

  it("records a mobile rejection instead of leaving a dead approval control", async () => {
    const user = userEvent.setup();
    open("/ops");

    await user.click(screen.getByRole("button", { name: "审核传播草稿" }));
    await user.click(screen.getByRole("button", { name: "退回修改" }));
    expect(screen.getByText("已退回 AI 传播助手补充待确认事实，不会发布。"))
      .toBeInTheDocument();
  });

  it("turns one natural-language instruction into a bounded plan instead of a long form", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.type(
      screen.getByLabelText("告诉 xlab 你想完成什么"),
      "从这批候选中为本周准备3条探索报，只提交缺证据的问题给我决定，不发布",
    );
    await user.click(screen.getByRole("button", { name: "生成执行计划" }));

    expect(screen.getByRole("heading", { name: "计划预览" })).toBeInTheDocument();
    expect(screen.getByText("回查原始来源与权利范围")).toBeInTheDocument();
    expect(screen.getByText("不会执行公开发布")).toBeInTheDocument();
  });

  it("creates a scoped invitation preview without granting a role automatically", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "人员与权限" }));
    expect(screen.getByRole("heading", { name: "人员、邀请与权限" })).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("邀请或权限意图"),
      "邀请李老师只管理这门课，课程归档后自动失效",
    );
    await user.click(screen.getByRole("button", { name: "生成最小权限邀请" }));

    expect(screen.getByText("TEACHER · 单课程范围")).toBeInTheDocument();
    expect(screen.getByText("当前只是候选预览，未授予任何角色。")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "创建邀请并留回执" }));
    expect(screen.getByText("邀请已创建，需本人接受后才可生效。")).toBeInTheDocument();
  });

  it("reviews an exact exploration issue version through a human publication gate", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "探索编辑部" }));
    expect(screen.getByRole("heading", { name: "xlab AI 探索报" })).toBeInTheDocument();
    expect(screen.getByText("第 32 期 · 版本 v4")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /自动发布/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看发布检查" }));
    expect(screen.getByRole("button", { name: "批准第32期版本 v4" })).toBeDisabled();
    await user.type(screen.getByLabelText("发布决定理由"), "4 条内容的原始来源、儿童安全与权利结论已逐项复核。");
    await user.click(screen.getByRole("button", { name: "批准第32期版本 v4" }));
    expect(screen.getByText("已记录具名批准；原型不会公开发布。")).toBeInTheDocument();
  });

  it("requires a reason before an exploration item can be withdrawn", async () => {
    const user = userEvent.setup();
    open("/admin");

    await user.click(screen.getByRole("button", { name: "探索编辑部" }));
    await user.click(screen.getByRole("tab", { name: "纠错与撤回" }));
    await user.click(screen.getByRole("button", { name: "发起紧急撤回" }));
    expect(screen.getByRole("alert")).toHaveTextContent("请填写撤回原因");
    await user.type(screen.getByLabelText("撤回原因"), "原始来源已失效，需要停止新活动并保留最小审计。");
    await user.click(screen.getByRole("button", { name: "发起紧急撤回" }));
    expect(screen.getByText("撤回演练已记录：新活动已阻断，儿童善意贡献默认保留。")).toBeInTheDocument();
  });

  it("offers a bounded exploration review in operations H5", async () => {
    const user = userEvent.setup();
    open("/ops");

    await user.click(screen.getByRole("button", { name: "快速审核探索报" }));
    expect(screen.getByRole("heading", { name: "AI 如何认出你的手势？" })).toBeInTheDocument();
    expect(screen.getByText("黄类 · 需二人分离复核")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /自动发布/ })).not.toBeInTheDocument();
  });
});
