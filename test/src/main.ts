import setScrollMaxSpeed from "../../src/index";

(window as any).scrollSpeedLimit = setScrollMaxSpeed;
setScrollMaxSpeed(0.5);

// const el = document.body.firstElementChild!;
// let lastOffsetTop = el.getBoundingClientRect().top;
// let startTransition: number = 0;
// let startTransitionOffset: number | null = null;
// let lastEqual = true;
// let deltasY: number[] = [];
// requestAnimationFrame(function test() {
//     const offsetTop = el.getBoundingClientRect().top;
//     if (lastOffsetTop === offsetTop) {
//         if (!lastEqual) {
//             const data = {
//                 start: {
//                     offsetTop: startTransitionOffset!,
//                     time: startTransition
//                 },
//                 end: {
//                     offsetTop,
//                     time: Date.now()
//                 }
//             };
//             console.log(
//                 data.end.offsetTop - data.start.offsetTop,
//                 data.end.time - data.start.time,
//                 `${
//                     (data.end.offsetTop - data.start.offsetTop) /
//                     ((data.end.time - data.start.time) * 0.001)
//                 }px/s`,
//                 deltasY
//                 // deltasY.reduce((prev, current) => current + prev, 0) / deltasY.length
//             );
//             startTransitionOffset = null;
//         }
//         lastEqual = true;
//     } else {
//         if (startTransitionOffset == null) {
//             console.log("starting transition");
//             startTransitionOffset = lastOffsetTop;
//             startTransition = Date.now();
//             deltasY = [ (window as any).lastDeltaY ];
//         } else {
//             if ((window as any).lastDeltaY != null) {
//                 deltasY.push((window as any).lastDeltaY);
//             }
//         }
//         lastEqual = false;
//     }
//     lastOffsetTop = offsetTop;
//     requestAnimationFrame(test);
// });