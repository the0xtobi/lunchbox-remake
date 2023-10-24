// Section 2 gallery
const easeImages = document.querySelectorAll(".sec-2-img-div img");
const holdPhoneSvg = document.querySelector(".hold-phone-div");
let count = 0;
easeImages[count].style.opacity = 1;
count++;

function showImages() {
  easeImages.forEach((image) => {
    image.style.opacity = 0;
  });

  easeImages[count].style.opacity = 1;
  count++;

  if (count >= easeImages.length) {
    count = 0;
  }
}

setInterval(showImages, 6000);

gsap.fromTo(
  ".hold-phone-div",
  { yPercent: 0 },
  { yPercent: -12, yoyo: true, repeat: -1, duration: 1, ease: "power1.out" }
);

// // Nav Demo Animation
const demoBtn = document.querySelector(".demo-btn");
const demoSpanContainer = document.querySelector(".demo-span-container");
const smallDemo = gsap.timeline({ paused: true });
let demoBtnWidth = demoBtn.offsetWidth;
// 20 spans, 1 is in view so element width * 19. you get?
smallDemo.to(".demo-span-container", {
  x: -(demoBtnWidth * 19),
  duration: 100,
});

demoBtn.addEventListener("mouseenter", () => {
  smallDemo.play();
});

demoBtn.addEventListener("mouseleave", () => {
  smallDemo.progress(0);
  smallDemo.pause();
});

// // Section Demo Animation
const bookDemo = document.querySelector(".book-demo");
const bookDemoSpan = document.querySelector(".book-demo-span");
const bookDemoWidth = bookDemo.offsetWidth;
// const bookDemoSpanWidth = bookDemoSpan.offsetWidth;
const secDemo = gsap.timeline({ paused: true });
secDemo.to(".book-demo", {
  borderRadius: "3rem",
  duration: 0.3,
});
secDemo.to(".book-demo-span", { backgroundColor: "#feed01" }, "<");
secDemo.to(
  ".book-demo-span-container",
  {
    x: -(bookDemoWidth * 39),
    duration: 140,
    ease: "linear",
  },
  "<"
);

bookDemo.addEventListener("mouseenter", () => {
  secDemo.play();
});

bookDemo.addEventListener("mouseleave", () => {
  secDemo.progress(0);
  secDemo.pause();
});

// Logos marquee
console.clear();
const wrapper = document.querySelector(".marquee-logos");
const boxes = gsap.utils.toArray(".logos");

const loop = horizontalLoop(boxes, {
  paused: false,
  repeat: -1,
  speed: 0.5,
});

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}

// Showcase button animations
const firstShowcaseBtn = document.querySelector(".ordering-btn");
const fsContainer = document.querySelector(".ordering-span-container");
const fsSpan = document.querySelector(".ordering-span");
const fsSpanWidth = fsSpan.offsetWidth;
const fsContainerWidth = fsContainer.scrollWidth;
const fsWidthToScroll = fsContainerWidth - fsSpanWidth;
const fsTimeline = gsap.timeline({ paused: true });

fsTimeline.to(".ordering-btn", {
  borderRadius: "3rem",
  duration: 0.3,
});

fsTimeline.to(
  fsContainer,
  {
    x: -fsWidthToScroll,
    duration: 80,
    ease: "linear",
  },
  "<"
);

firstShowcaseBtn.addEventListener("mouseenter", () => {
  fsTimeline.play();
});

firstShowcaseBtn.addEventListener("mouseleave", () => {
  fsTimeline.progress(0);
  fsTimeline.pause();
});

// The second one
const secondShowcaseBtn = document.querySelector(".loyalty-btn");
const ssContainer = document.querySelector(".loyalty-span-container");
const ssSpan = document.querySelector(".loyalty-span");
const ssSpanWidth = ssSpan.offsetWidth;
const ssContainerWidth = ssContainer.scrollWidth;
const ssWidthToScroll = ssContainerWidth - ssSpanWidth;
const ssTimeline = gsap.timeline({ paused: true });

ssTimeline.to(".loyalty-btn", {
  borderRadius: "3rem",
  duration: 0.3,
});

ssTimeline.to(
  ssContainer,
  {
    x: -ssWidthToScroll,
    duration: 80,
    ease: "linear",
  },
  "<"
);

secondShowcaseBtn.addEventListener("mouseenter", () => {
  ssTimeline.play();
});

secondShowcaseBtn.addEventListener("mouseleave", () => {
  ssTimeline.progress(0);
  ssTimeline.pause();
});

// The third one
const thirdShowcaseBtn = document.querySelector(".catering-btn");
const tsContainer = document.querySelector(".catering-span-container");
const tsSpan = document.querySelector(".catering-span");
const tsSpanWidth = tsSpan.offsetWidth;
const tsContainerWidth = tsContainer.scrollWidth;
const tsWidthToScroll = tsContainerWidth - tsSpanWidth;
const tsTimeline = gsap.timeline({ paused: true });

tsTimeline.to(".catering-btn", {
  borderRadius: "3rem",
  duration: 0.3,
});

tsTimeline.to(
  tsContainer,
  {
    x: -tsWidthToScroll,
    duration: 80,
    ease: "linear",
  },
  "<"
);

thirdShowcaseBtn.addEventListener("mouseenter", () => {
  tsTimeline.play();
});

thirdShowcaseBtn.addEventListener("mouseleave", () => {
  tsTimeline.progress(0);
  tsTimeline.pause();
});

// The fourth one
const fourthShowcaseBtn = document.querySelector(".aggregation-btn");
const ftsContainer = document.querySelector(".aggregation-span-container");
const ftsSpan = document.querySelector(".aggregation-span");
const ftsSpanWidth = ftsSpan.offsetWidth;
const ftsContainerWidth = ftsContainer.scrollWidth;
const ftsWidthToScroll = ftsContainerWidth - ftsSpanWidth;
const ftsTimeline = gsap.timeline({ paused: true });

ftsTimeline.to(".aggregation-btn", {
  borderRadius: "3rem",
  duration: 0.3,
});

ftsTimeline.to(
  ftsContainer,
  {
    x: -ftsWidthToScroll,
    duration: 80,
    ease: "linear",
  },
  "<"
);

fourthShowcaseBtn.addEventListener("mouseenter", () => {
  ftsTimeline.play();
});

fourthShowcaseBtn.addEventListener("mouseleave", () => {
  ftsTimeline.progress(0);
  ftsTimeline.pause();
});

// The fifth one
const fifthShowcaseBtn = document.querySelector(".marketing-btn");
const fthsContainer = document.querySelector(".marketing-span-container");
const fthsSpan = document.querySelector(".marketing-span");
const fthsSpanWidth = fthsSpan.offsetWidth;
const fthsContainerWidth = fthsContainer.scrollWidth;
const fthsWidthToScroll = fthsContainerWidth - fthsSpanWidth;
const fthsTimeline = gsap.timeline({ paused: true });

fthsTimeline.to(".marketing-btn", {
  borderRadius: "3rem",
  duration: 0.3,
});

fthsTimeline.to(
  fthsContainer,
  {
    x: -fthsWidthToScroll,
    duration: 80,
    ease: "linear",
  },
  "<"
);

fifthShowcaseBtn.addEventListener("mouseenter", () => {
  fthsTimeline.play();
});

fifthShowcaseBtn.addEventListener("mouseleave", () => {
  fthsTimeline.progress(0);
  fthsTimeline.pause();
});

// Card stack animation
const sectionFive = document.querySelector(".sec-5");
const oneCard = document.querySelector(".showcase-1");
const ocHeight = oneCard.offsetHeight;
const allCard = document.querySelector(".showcase-container");
const heightAllCard = allCard.offsetHeight;

const cards = gsap.utils.toArray(".card");
cards.forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: "-12%",
    end: "bottom 112%",
    endTrigger: ".sec-5",
    pin: true,
    pinSpacing: false,
  });
});

// Streamline marquee
const secSixFirstMarquee = document.querySelector(".sec-6-m-div-1-container");
const secSixFirstMarqueeWidth = secSixFirstMarquee.scrollWidth;
const wWidth = window.innerWidth;
const widthToUse = secSixFirstMarqueeWidth - wWidth;

const secSixMarqueeOneTl = gsap.timeline();
secSixMarqueeOneTl.to(secSixFirstMarquee, {
  x: -widthToUse,
  duration: 140,
  ease: "linear",
  yoyo: true,
  repeat: -1,
});

// // Second marquee
const secSixSecondMarquee = document.querySelector(".sec-6-m-div-2-container");
const secSixSecondMarqueeWidth = secSixSecondMarquee.scrollWidth;

const secSixMarqueeTwoTl = gsap.timeline();
secSixMarqueeTwoTl.fromTo(
  secSixSecondMarquee,
  {
    x: -widthToUse,
  },
  { x: 0, duration: 140, ease: "linear", delay: 1, yoyo: true, repeat: -1 }
);

// // Third marquee
const secSixThirdMarquee = document.querySelector(".sec-6-m-div-3-container");
const secSixThirdMarqueeWidth = secSixThirdMarquee.scrollWidth;

const secSixMarqueeThreeTl = gsap.timeline();
secSixMarqueeThreeTl.to(secSixThirdMarquee, {
  x: -widthToUse,
  duration: 140,
  ease: "linear",
  delay: 1.5,
  yoyo: true,
  repeat: -1,
});

// // Fourth marquee
const secSixFourthMarquee = document.querySelector(".sec-6-m-div-4-container");
const secSixFourthMarqueeWidth = secSixFourthMarquee.scrollWidth;

const secSixMarqueeFourTl = gsap.timeline();
secSixMarqueeFourTl.fromTo(
  secSixFourthMarquee,
  {
    x: -widthToUse,
  },
  { x: 0, duration: 140, ease: "linear", delay: 2, yoyo: true, repeat: -1 }
);

// Streamline Parallax
const secSixSlice = document.querySelector(".slice-div");
const sec6Parallax = gsap.timeline({
  scrollTrigger: {
    trigger: "#sec-6",
    start: "top bottom",
    end: "100%",
    scrub: 0.3,
  },
});

sec6Parallax.to(".slice-div", {
  yPercent: -120,
});

// // Section 7 button marquee
const secSevenBtn = document.querySelector(".sec-7-btn");
const allSecSevenSpan = document.querySelectorAll(".sec-7-btn-span");
const secSevenBtnContainer = document.querySelector(".sec-7-span-container");
const oneSecSevenSpan = document.querySelector(".one-sec-7-span");
const oneSecSevenSpanWidth = oneSecSevenSpan.offsetWidth;
const secSevenContainerWidth = secSevenBtnContainer.scrollWidth;
const secSevenWidthToScroll = secSevenContainerWidth - oneSecSevenSpanWidth;
const secSevenTl = gsap.timeline({ paused: true });

secSevenTl.to(".sec-7-btn", {
  borderRadius: "2.3rem",
  backgroundColor: "#ff65be",
  duration: 0.3,
});

secSevenTl.to(
  ".sec-7-btn-span",
  {
    backgroundColor: "#ff65be",
    duration: 0.1,
  },
  "<"
);

secSevenTl.to(
  ".sec-7-span-container",
  {
    x: -secSevenWidthToScroll,
    duration: 40,
    ease: "linear",
  },
  "<"
);

secSevenBtn.addEventListener("mouseenter", () => {
  secSevenTl.play();
});

secSevenBtn.addEventListener("mouseleave", () => {
  secSevenTl.progress(0);
  secSevenTl.pause();
});

// Shamanz animation
gsap.set(
  [
    "#head",
    "#leftHand",
    "#rightHand",
    "#leftFirst",
    "#leftSecond",
    "#rightFirst",
    "#rightSecond",
  ],
  {
    transformOrigin: "50% 50%",
  }
);

const shamanzTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sec-7",
    start: "-20%",
  },
});

shamanzTl.fromTo(
  "#head",
  { opacity: 0, scale: 0.6 },
  { opacity: 1, duration: 0.4, scale: 1, ease: "none" }
);

shamanzTl.fromTo(
  "#leftHand",
  { yPercent: -90, xPercent: 210, opacity: 0, rotation: 60, scale: 1.2 },
  { yPercent: 0, xPercent: 0, opacity: 1, rotation: 0, scale: 1 }
);
shamanzTl.fromTo(
  "#rightHand",
  { yPercent: -90, xPercent: -210, opacity: 0, rotation: -60, scale: 1.2 },
  { yPercent: 0, xPercent: 0, opacity: 1, rotation: 0, scale: 1 },
  "<"
);
shamanzTl.fromTo(
  "#leftFirst",
  { opacity: 0, xPercent: 110 },
  { opacity: 1, xPercent: 0 }
);
shamanzTl.fromTo(
  "#rightFirst",
  { opacity: 0, xPercent: -110 },
  { opacity: 1, xPercent: 0 },
  "<"
);
shamanzTl.fromTo(
  "#leftSecond",
  { yPercent: -60, xPercent: 220, opacity: 0, rotation: 10, scale: 0.8 },
  { yPercent: 0, xPercent: 0, opacity: 1, rotation: 0, scale: 1 },
  "<"
);
shamanzTl.fromTo(
  "#rightSecond",
  { yPercent: -60, xPercent: -220, opacity: 0, rotation: -10, scale: 0.8 },
  { yPercent: 0, xPercent: 0, opacity: 1, rotation: 0, scale: 1 },
  "<"
);

// Section 8: OnClick slider
const sec8QuoteBtnLeft = document.querySelector(".sec-8-left-arrow-btn");
const sec8QuoteBtnRight = document.querySelector(".sec-8-right-arrow-btn");
const sec8ChangeNum = document.querySelector(".sec-8-change-num");
const sec8SliderCont = document.querySelector(".sec-8-txt-container");
const sec8SliderContWidth = sec8SliderCont.scrollWidth;
const sec8ParentDiv = document.querySelector(".sec-8-txt-div");
const sec8ParentDivWidth = sec8ParentDiv.offsetWidth;
const sec8SliderWidthToScroll = sec8SliderContWidth - sec8ParentDivWidth;

sec8QuoteBtnRight.addEventListener("click", () => {
  gsap.set(sec8QuoteBtnRight, { opacity: 0.3 });
  gsap.set(sec8QuoteBtnLeft, { opacity: 1 });
  sec8ChangeNum.textContent = "2";

  gsap.to(sec8SliderCont, {
    x: -sec8SliderWidthToScroll,
    duration: 1,
  });
});

sec8QuoteBtnLeft.addEventListener("click", () => {
  gsap.set(sec8QuoteBtnLeft, { opacity: 0.3 });
  gsap.set(sec8QuoteBtnRight, { opacity: 1 });
  sec8ChangeNum.textContent = "1";

  gsap.to(sec8SliderCont, {
    x: 0,
    duration: 1,
  });
});

// Section 8: Parallax
const secEightEye = document.querySelector(".flasheye-div");
const sec8Parallax = gsap.timeline({
  scrollTrigger: {
    trigger: "#sec-8",
    start: "-50%",
    end: "100%",
    scrub: 0.3,
  },
});

sec8Parallax.to(".flasheye-div", {
  yPercent: -150,
});

// Section 9: Showcase and Slider
const secNineShowcase = document.querySelector(".sec-9-showcase");
const secNineCounter = document.querySelector(".sec-9-change-num");

function amIInViewport() {
  const secNineLastCard = document.querySelector(".sec-9-showcase-4");
  const secNineWw = window.innerWidth;
  const lastCardRect = secNineLastCard.getBoundingClientRect();
  if (lastCardRect.right < secNineWw) {
    secNineCounter.textContent = "4";
  } else {
    secNineCounter.textContent = "1";
  }
}

secNineShowcase.addEventListener("scroll", amIInViewport);

// Slider cards animate on hover
gsap.utils.toArray(".sNineShcCard").forEach((card) => {
  const cardBtn = card.querySelector("button");
  const cardBtnSpan = cardBtn.querySelectorAll("span");
  const singleSpan = cardBtnSpan[0];
  const singleSpanWidth = singleSpan.offsetWidth;
  const spanContainer = cardBtn.querySelector(".s9sc");
  const spanContainerWidth = spanContainer.scrollWidth;
  const widthDiff = spanContainerWidth - singleSpanWidth;

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.75, ease: "power3.out" },
  });

  tl.to(card, {
    borderRadius: "2.5rem",
  });

  tl.to(
    cardBtn,
    {
      borderRadius: "2.2rem",
      backgroundColor: "black",
    },
    "<"
  );

  tl.to(
    spanContainer,
    {
      x: -widthDiff,
      duration: 80,
      yoyo: true,
      repeat: -1,
      ease: "linear",
    },
    "<"
  );

  tl.to(
    cardBtnSpan,
    {
      backgroundColor: "black",
      color: "yellow",
    },
    "<"
  );

  card.addEventListener("mouseenter", () => {
    tl.play();
  });
  card.addEventListener("mouseleave", () => {
    tl.progress(0);
    tl.pause();
  });
});

// Pre-footer button marquee animation
const secTenBtn = document.querySelector(".sec-10-btn");
const allSecTenSpan = document.querySelectorAll(".sec-10-btn-span");
const secTenBtnContainer = document.querySelector(".sec-10-btn-span-container");
const oneSecTenSpan = allSecTenSpan[0];
const oneSecTenSpanWidth = oneSecTenSpan.offsetWidth;
const secTenContainerWidth = secTenBtnContainer.scrollWidth;
const secTenWidthToScroll = secTenContainerWidth - oneSecTenSpanWidth;
const secTenBtnTl = gsap.timeline({ paused: true });

secTenBtnTl.to(".sec-10-btn", {
  borderRadius: "2.3rem",
  backgroundColor: "#ff65be",
  duration: 0.3,
});

secTenBtnTl.to(
  ".sec-10-btn-span",
  {
    backgroundColor: "#ff65be",
    duration: 0.1,
  },
  "<"
);

secTenBtnTl.to(
  ".sec-10-btn-span-container",
  {
    x: -secTenWidthToScroll,
    duration: 40,
    ease: "linear",
  },
  "<"
);

secTenBtn.addEventListener("mouseenter", () => {
  secTenBtnTl.play();
});

secTenBtn.addEventListener("mouseleave", () => {
  secTenBtnTl.progress(0);
  secTenBtnTl.pause();
});

// Pre-footer animation: play on hover
const preFooterHoverDiv = document.querySelector(".sec-10-left-div");
const pfHover = document.querySelector(".sec-10-left-div-overlay");

const preFooterTl = gsap.timeline({
  paused: true,
  defaults: { ease: "linear", duration: 5 },
});

preFooterTl.fromTo(
  ".sec-10-left-div-overlay",
  {
    backgroundPosition: "0% 0%",
  },
  {
    backgroundPosition: "30% 0%",
  }
);

preFooterTl.fromTo(
  ".sec-10-left-div-overlay",
  {
    backgroundPosition: "80% 0%",
  },
  {
    backgroundPosition: "60% 60%",
  }
);

preFooterTl.fromTo(
  ".sec-10-left-div-overlay",
  {
    backgroundPosition: "100% 100%",
  },
  {
    backgroundPosition: "0% 100%",
    duration: 10,
  }
);

preFooterTl.repeat(-1);

preFooterHoverDiv.addEventListener("mouseenter", () => {
  gsap.to(".sec-10-left-div-overlay", { opacity: 0.4, duration: 0.3 });
  preFooterTl.play();
});

preFooterHoverDiv.addEventListener("mouseleave", () => {
  gsap.to(".sec-10-left-div-overlay", { opacity: 0, duration: 0.3 });
  preFooterTl.pause();
});

// Footer animation
const footerBtn = document.querySelector(".footer-btn");
const allFooterBtnSpan = document.querySelectorAll(".footer-btn-span");
const footerSpanContainer = document.querySelector(
  ".footer-btn-span-container"
);
const oneFooterBtnSpan = allFooterBtnSpan[0];
const oneFooterBtnSpanWidth = oneFooterBtnSpan.offsetWidth;
const footerSpanContainerWidth = footerSpanContainer.scrollWidth;
const footerWidthToScroll = footerSpanContainerWidth - oneFooterBtnSpanWidth;
const footerTl = gsap.timeline({ paused: true });

footerTl.to(".footer-btn", {
  borderRadius: "2.3rem",
  backgroundColor: "#feed01",
  duration: 0.3,
});

footerTl.to(
  ".footer-btn-span",
  {
    backgroundColor: "#feed01",
    duration: 0.1,
  },
  "<"
);

footerTl.to(
  ".footer-btn-span-container",
  {
    x: -footerWidthToScroll,
    duration: 150,
    ease: "linear",
    repeat: -1,
    yoyo: true,
  },
  "<"
);

footerBtn.addEventListener("mouseenter", () => {
  footerTl.play();
});

footerBtn.addEventListener("mouseleave", () => {
  footerTl.progress(0);
  footerTl.pause();
});

footerBtn.addEventListener("click", () => {
  console.log("i dont think its reading me");
});
