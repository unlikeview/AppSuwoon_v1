import GUI from 'lil-gui'


let touchStart = {x:0, y:0};
let touchMove = { x:0, y:0};
let isDragging = false; 
export let momentum = 0;
let dampingFactor = 0.9; 
let inertiaDebug = {
    value : 0.01,
}

export let val = 0;





function detectMobileDevice(agent) {
    const mobileRegex = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]
  
    return mobileRegex.some(mobile => agent.match(mobile))
  }

    function init() {

        const isMobile = detectMobileDevice(window.navigator.userAgent)
        // 모바일 장치인 경우
        if (isMobile) {
            console.log('current device is mobile')

            const gui = new GUI();
            gui.add(inertiaDebug,'value',0,1,0.01);


            document.addEventListener('touchstart', onTouchStart, false);
            document.addEventListener('touchmove', onTouchMove, false);
            document.addEventListener('touchend', onTouchEnd, false);
        } 
        else { //데스크탑인 경우 
            console.log('current device is not mobile')

            const gui = new GUI();
            gui.add(inertiaDebug,'value',0,1,0.01);

            // document.addEventListener('mousedown', onMouseDown, false);
            // document.addEventListener('mousemove', onMouseMove, false);
            // document.addEventListener('mouseup', onMouseUp, false);
            window.addEventListener('wheel',onScroll,false);

        }
    }
    function onScroll(event){
        console.log('스크롤중');
       const valval = event.deltaY* inertiaDebug.value;
       momentum = valval; 
       applyMomentum();
       // console.log(getDeltaY(valval));
    }

    function onTouchStart(event) {
        isDragging = true;
        touchStart.x = event.touches[0].clientX;
        touchStart.y = event.touches[0].clientY;
        momentum = 0; // 관성 초기화
    }
    function onTouchMove(event) {
        if (!isDragging) return;
    
        touchMove.x = event.touches[0].clientX;
        touchMove.y = event.touches[0].clientY;
    
        const deltaY = (touchMove.y - touchStart.y) * inertiaDebug.value
        //camera.position.z -= deltaY;
    
        momentum = deltaY; // 관성 업데이트
    
        touchStart.x = touchMove.x;
        touchStart.y = touchMove.y;
    }
    function onTouchEnd() {
        isDragging = false;
        applyMomentum();
    }
    
    function applyMomentum() {
        if (Math.abs(momentum) > 0.01) {
           // camera.position.z -= momentum;
            momentum *= dampingFactor; // 관성을 감소시킴
            requestAnimationFrame(applyMomentum);
        }
    }

export default () =>{
    init();
}

export function getDeltaY(value)
{
    momentum += value;
    return momentum;
}



