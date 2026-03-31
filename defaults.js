const DEFAULT_SELECTORS = ["figure", "aside", "nav", "video", "iframe", ".sticky", "header", "footer"];

const DEFAULT_STYLES = {
  "body": {
    "font-family": "Georgia, 'Times New Roman', serif",
    "font-size": "15px",
    "line-height": "1.2",
    "color": "#000",
    "background": "#fff"
  },
  "a": {
    "color": "#000",
    "text-decoration": "underline"
  },
  "*": {
    "background": "transparent !important",
    "box-shadow": "none !important",
    "text-shadow": "none !important"
  }
};

const DEFAULT_RULES = {
  "www.nownews.com": {
    selectors: ["div#header", "figure.image", "aside.rightCol", "div.ad-head", "div.adBlk", "div.more-news", "div.ad-blk1"]
  },
  "tw.news.yahoo.com": {
    selectors: [".sticky", "figure", "aside", "video", "iframe", ".fixed.w-screen", "nav", ".bg-toast-background"],
    remove: ["#cto_banner_content", "#sda-top-right-iframe"]
  },
  "www.ettoday.net": {
    selectors: [
      // header & nav
      ".topbar_box", ".header_box",
      // sticky social sidebar
      "#et_sticky_pc",
      // ads
      ".top-sky", ".twin-curtain", ".ad_txt_1", ".ad_txt_2", ".ad_txt_3", ".ad_txt_4",
      ".ad_970", ".ad_300", ".text_ad_top",
      "#oneadICIPTag", "#all_inread", "#all_crazygif",
      ".recirculation", "ins.rmax",
      // right sidebar
      ".c2",
      // images & video
      "figure", ".video_frame", "#ettoday_channel_frame",
      // social & widgets
      ".et_social_1", ".et_social_2", ".et_social_3",
      ".et_epaper_box_pc", ".et_165dashboard", ".text_ticker_1",
      // related content & tabs
      "#hot_area", ".block.block_1", ".recom-events",
      // comments
      "#et_comments", ".fb-comments",
      // footer & misc
      ".footer", ".gototop", ".partner",
      ".fb-quote",
      ".story > p > img"
    ]
  },
  "udn.com": {
    selectors: [
      "figure",
      "aside", "footer", "#gotop", ".udn-idle", ".udn-overlay", "header", ".article-content__plugins", ".footer", ".aside-btn-wrapper"
    ],
    remove: [".inline-ads", "div.udn-ads", ".udn-idle", ".coverstoryad", ".edn-ads--inlineAds", ".coverad"]
  },
  "www.chinatimes.com": {
    selectors: [
      "figure",
      "aside", "footer", ".social-share", "#recommended-article"
    ],
    remove: [".ad"]
  },
  "x.com": {
    selectors: [
        "header[role=banner]", '[data-testid="sidebarColumn"]'
    ]
  },
  "storm.mg": {
    selectors: [ "header", "footer", "figure", ".coverImg"],
    remove: [".adGeneral"]
  }
};
