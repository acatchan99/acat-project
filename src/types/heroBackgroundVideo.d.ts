/** CMS 首页 Hero 背景视频配置字段 */
export interface HeroBackgroundVideoConfig {
  /** 手机端竖版视频 URL，建议 720×1280 */
  heroBackgroundVideoMobile: string;
  /** 桌面端横版视频 URL，建议 1280×720 */
  heroBackgroundVideoDesktop: string;
  /** 手机端 MP4（H.264）优先 */
  heroBackgroundVideoMobileMp4?: string;
  /** 手机端 WebM 补充 */
  heroBackgroundVideoMobileWebm?: string;
  /** 桌面端 MP4 优先 */
  heroBackgroundVideoDesktopMp4?: string;
  /** 桌面端 WebM 补充 */
  heroBackgroundVideoDesktopWebm?: string;
  /** 视频加载前封面图 URL */
  heroBackgroundVideoPoster: string;
  /** 是否启用首页背景视频 */
  heroBackgroundVideoEnabled: boolean;
  /** 视频上方暗色遮罩透明度，0–1 */
  heroBackgroundVideoOverlayOpacity: number;
  /** 是否启用 Hero 底部黑色渐变 */
  heroBottomGradientEnabled: boolean;
  /** 底部渐变高度，如 "20%" */
  heroBottomGradientHeight: string;
}
