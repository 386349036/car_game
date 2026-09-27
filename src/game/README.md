# 共用场景接口

每个正式场景接收 SceneProps：当前 sceneId、完成回调、语义反馈回调、互动活动回调和 hintVisible。

- 只在本场景的成功动画完成后调用 onComplete()。宿主会确认当前场景与回调场景一致，并忽略重复完成。
- hintVisible 会在安静约 15 秒后变为 true；场景可用轻微发光或手势提示目标。孩子开始操作后提示隐藏，计时从本次操作结束后重新开始。
- onInteractionActivity('start') 和 onInteractionActivity('end') 包住持续操作；拖动期间调用 'activity'。点击组件会自动报告点击活动。
- 通过 onFeedback 发出 GameFeedbackCue，描述发生的动作，不直接播放声音。子任务 7 再把这些事件接到音效、语音和家长开关。

## 共用交互组件

TapTarget 渲染至少 104 × 104 CSS 像素的原生按钮。正确目标发出 target-tap 并执行 onActivate；非目标可设置 isCorrect=false，它只轻轻摇动并发出 gentle-nudge。

ForgivingDrag 使用 targetRef 绑定放置区域。默认在目标四周各扩展 72 像素判断命中；靠近时自动吸附，吸附动画结束后调用 onDrop。没有命中时，物件回到起点并发出 drag-return，不显示错误提示。按 Enter 或空格也可把物件放到唯一目标。

组件示例：

- 点击场景使用 TapTarget 包住挖掘机等主要目标。
- 桥梁场景给桥面缺口创建 ref，并把它传给 ForgivingDrag 的 targetRef。
- 场景自己管理成功后的视觉变化；触发一次成功后及时禁用目标，避免重复播放场景动画。
