import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("xlab UX-0 mixed-age course flow", () => {
  it("presents one mixed-age featured course without dividing children by age", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "用 vibe Coding 做一个互动小游戏",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("7–15岁混龄")).toBeInTheDocument();
    expect(screen.getByText("同一个任务，每个人都能找到自己的分工")).toBeInTheDocument();
    expect(screen.queryByText("7–9岁")).not.toBeInTheDocument();
    expect(screen.queryByText("13–15岁")).not.toBeInTheDocument();
  });

  it("moves from the featured course into the course creation path", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "看看这门课" }));

    expect(screen.getByRole("heading", { name: "一起做出能玩的小游戏" })).toBeInTheDocument();
    expect(screen.getByText("认识任务")).toBeInTheDocument();
    expect(screen.getByText("选择分工")).toBeInTheDocument();
    expect(screen.getByText("一起创作")).toBeInTheDocument();
    expect(screen.getByText("展示作品")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "开始报名" })).toBeInTheDocument();
  });

  it("shows every decision-critical course element before registration", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "看看这门课" }));

    expect(screen.getByRole("heading", { name: "授课老师" })).toBeInTheDocument();
    expect(screen.getByText("林老师（合成示例）")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "这节课会做什么" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "课程评选与奖励" })).toBeInTheDocument();
    expect(screen.getByText("100元团队项目基金（合成示例）")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "课后项目" })).toBeInTheDocument();
  });

  it("labels the prototype as the family H5 and does not expose operator tasks", () => {
    render(<App />);

    expect(screen.getByText("家庭参与端 H5")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "任务" })).not.toBeInTheDocument();
  });

  it("keeps bottom navigation on top-level H5 screens and removes it from the registration flow", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("navigation", { name: "原型主导航" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "看看这门课" }));
    expect(screen.queryByRole("navigation", { name: "原型主导航" })).not.toBeInTheDocument();
  });

  it("requires a guardian to confirm the visibility choice before registration succeeds", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "看看这门课" }));
    await user.click(screen.getByRole("button", { name: "开始报名" }));
    await user.type(screen.getByLabelText("监护人称呼"), "江妈妈");
    await user.type(screen.getByLabelText("联系手机号"), "13800000000");
    await user.click(screen.getByRole("button", { name: "确认报名" }));

    expect(screen.getByRole("alert")).toHaveTextContent("请选择作品展示范围");

    await user.click(screen.getByLabelText("仅课程成员可见"));
    await user.click(screen.getByRole("button", { name: "确认报名" }));

    expect(screen.getByRole("heading", { name: "报名已记录" })).toBeInTheDocument();
    expect(screen.getByText("仅课程成员可见")).toBeInTheDocument();
    expect(screen.getByText("这是测试原型，没有发送通知或保存真实数据。"))
      .toBeInTheDocument();
  });

  it("does not create a success receipt when guardian contact fields are empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "看看这门课" }));
    await user.click(screen.getByRole("button", { name: "开始报名" }));
    await user.click(screen.getByLabelText("仅家庭和老师可见"));
    await user.click(screen.getByRole("button", { name: "确认报名" }));

    expect(screen.getByRole("alert")).toHaveTextContent("请填写监护人称呼和联系手机号");
    expect(screen.queryByRole("heading", { name: "报名已记录" })).not.toBeInTheDocument();
  });
});
