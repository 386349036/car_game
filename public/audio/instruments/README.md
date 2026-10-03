# 音乐派对乐器演奏

十关使用同名本地 WAV，每段6.4秒、单声道22,050 Hz、16位 PCM，由 `scripts/generate-instrument-music.py` 离线创作，不访问网络。采用乐器特征合成音色，并非真人乐器录音。

| 场景 | 创作音色 |
| --- | --- |
| music-soft-drum | 降调低鼓与短敲击噪声，轻缓节拍 |
| music-bell-ring | 非整数泛音、缓慢衰减的手铃 |
| music-shaker | 带轻摇包络的噪声沙锤 |
| music-xylophone | 木琴敲击泛音与快速衰减 |
| music-pluck-string | Karplus–Strong 弦振动与阻尼，拨弦小琴 |
| music-trumpet | 铜管谐波、吹奏包络和轻微颤音 |
| music-accordion | 双簧片拍频与低声部伴奏 |
| music-bear-dance | 古筝：阻尼拨弦、明亮泛音、五声音阶及短扫弦 |
| music-note-score | 二胡：连续弓弦谐波、缓起音、轻微揉弦 |
| music-box-goodnight | 八音盒：细小金属梳齿泛音的摇篮曲 |

`useInstrumentPerformance.ts` 预加载并解码文件，通过已解锁的 Web Audio 上下文播放；成功后禁用重复触发，正常等待完整6.4秒音轨的 ended 事件再推进。降低动态效果不缩短演奏。演奏期间抑制背景音符和提示语音，音量保持柔和，遵循家长互动音效开关。

静音或加载失败时仍等待6.4秒；播放停滞设7.9秒可清理兜底，避免卡住。切换设置会停止音轨，离开场景会取消音轨、计时器和完成回调。生成命令：`python scripts/generate-instrument-music.py`。

最后三关现为古筝、二胡、八音盒；保留原内部ID兼容既有顺序和音频映射。可用 `--only music-bear-dance music-note-score` 定向重生成古筝与二胡，避免重写其他曲目。
